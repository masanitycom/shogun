import React, { useEffect, useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material';
import { supabase } from '../../utils/supabaseClient';

export default function AdminDashboard() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        getUsers();
        // リアルタイム更新のサブスクリプション設定
        const subscription = supabase
            .channel('public:profiles')
            .on('postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'profiles'
                },
                payload => {
                    getUsers(); // ユーザーリストを再取得
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    async function getUsers() {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }

    return (
        <Container>
            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    管理画面
                </Typography>
                <Paper sx={{ mt: 2 }}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ユーザーID</TableCell>
                                    <TableCell>メールアドレス</TableCell>
                                    <TableCell>権限</TableCell>
                                    <TableCell>登録日時</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>{user.user_id}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.role}</TableCell>
                                        <TableCell>
                                            {new Date(user.created_at).toLocaleString()}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Box>
        </Container>
    );
}
