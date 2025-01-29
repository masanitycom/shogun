import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../utils/supabaseClient';
import { Button, TextField, Typography, Container, Box, Alert, Link } from '@mui/material';

const AdminLogin = () => {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // まずは通常のログイン
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                email: e.target.email.value,
                password: e.target.password.value,
            });

            if (authError) throw authError;

            // プロフィールの確認
            const { data: profiles, error: profileError } = await supabase
                .from('profiles')
                .select('role')
                .eq('user_id', authData.user.id);

            if (profileError) throw profileError;

            // 結果の確認
            if (!profiles || profiles.length === 0) {
                throw new Error('ユーザープロフィールが見つかりません');
            }

            if (profiles[0].role !== 'admin') {
                throw new Error('管理者権限がありません');
            }

            // 管理者確認OK
            navigate('/admin/dashboard');

        } catch (error) {
            console.error('Error details:', error);
            setError('ログインに失敗しました: ' + error.message);
        }

        setLoading(false);
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5">
                    管理者ログイン
                </Typography>
                {error && <Alert severity="error">{error}</Alert>}
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="メールアドレス"
                        name="email"
                        autoComplete="email"
                        autoFocus
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="パスワード"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={loading}
                    >
                        ログイン
                    </Button>
                    <Link href="/login" variant="body2">
                        一般ユーザーログイン
                    </Link>
                </Box>
            </Box>
        </Container>
    );
};

export default AdminLogin;
