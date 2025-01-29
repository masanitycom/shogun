import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import { Button, TextField, Typography, Container, Box, Alert } from '@mui/material';

const Login = () => {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: e.target.email.value,
                password: e.target.password.value,
            });

            if (error) throw error;
            navigate('/');
        } catch (error) {
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
                    ログイン
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
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Link to="/register">
                            アカウントをお持ちでない方はこちら
                        </Link>
                        <Link to="/admin/login">
                            管理者ログイン
                        </Link>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
};

export default Login;
