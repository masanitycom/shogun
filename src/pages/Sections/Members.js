// src/pages/Dashboard/Sections/Members.js
import React, { useEffect, useState, useMemo, useCallback } from 'react';
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

    const fetchMemberTree = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const { data: allProfiles, error } = await supabase
                .from('profiles')
                .select('*');

            if (error) throw error;

            const buildTreeFromData = (userId, profiles) => {
                const userProfile = profiles.find(p => p.id === userId);
                if (!userProfile) return null;

                const children = profiles
                    .filter(p => p.referral_id === userId)
                    .map(child => buildTreeFromData(child.id, profiles))
                    .filter(Boolean);

                return {
                    ...userProfile,
                    children
                };
            };

            const tree = buildTreeFromData(session.user.id, allProfiles);
            setMemberTree(tree);

            const directMembers = allProfiles.filter(p => p.referral_id === session.user.id);
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

    const calculateTotalMembers = useCallback((node) => {
        if (!node) return 0;
        return 1 + (node.children || []).reduce(
            (sum, child) => sum + calculateTotalMembers(child),
            0
        );
    }, []);

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
