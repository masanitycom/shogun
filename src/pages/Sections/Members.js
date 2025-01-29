// src/pages/Dashboard/Sections/Members.js
import React, { useEffect, useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    CircularProgress,
    Alert,
    Grid,
    Card,
    CardContent
} from '@mui/material';
import MemberTree from '../../../components/Tree/MemberTree';
import { supabase } from '../../../utils/supabaseClient';

const Members = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [memberTree, setMemberTree] = useState(null);
    const [stats, setStats] = useState({
        totalMembers: 0,
        directReferrals: 0,
        indirectReferrals: 0
    });

    // メンバーツリーデータを取得する関数
    const fetchMemberTree = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            // ユーザーの直接の紹介者を取得
            const { data: directMembers, error: directError } = await supabase
                .from('profiles')
                .select('*')
                .eq('referral_id', session.user.id);

            if (directError) throw directError;

            // ツリー構造を構築
            const buildTree = async (userId) => {
                const { data: members, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('referral_id', userId);

                if (error) throw error;

                return {
                    ...(await getUserDetails(userId)),
                    children: await Promise.all(
                        members.map(member => buildTree(member.id))
                    )
                };
            };

            const tree = await buildTree(session.user.id);
            setMemberTree(tree);

            // 統計情報を更新
            setStats({
                totalMembers: calculateTotalMembers(tree),
                directReferrals: directMembers.length,
                indirectReferrals: calculateTotalMembers(tree) - directMembers.length
            });

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // ユーザー詳細を取得する補助関数
    const getUserDetails = async (userId) => {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) throw error;
        return data;
    };

    // メンバー総数を計算する補助関数
    const calculateTotalMembers = (node) => {
        if (!node) return 0;
        return 1 + (node.children || []).reduce(
            (sum, child) => sum + calculateTotalMembers(child),
            0
        );
    };

    useEffect(() => {
        fetchMemberTree();
    }, []);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    return (
        <Box>
            <Typography variant="h5" gutterBottom>メンバー管理</Typography>

            {/* 統計カード */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={4}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                総メンバー数
                            </Typography>
                            <Typography variant="h4">
                                {stats.totalMembers}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                直接紹介数
                            </Typography>
                            <Typography variant="h4">
                                {stats.directReferrals}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                間接紹介数
                            </Typography>
                            <Typography variant="h4">
                                {stats.indirectReferrals}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* メンバーツリー */}
            <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                    メンバーツリー
                </Typography>
                <Box sx={{ mt: 2 }}>
                    {memberTree ? (
                        <MemberTree data={memberTree} />
                    ) : (
                        <Typography color="text.secondary">
                            メンバーがいません
                        </Typography>
                    )}
                </Box>
            </Paper>
        </Box>
    );
};

export default Members;
