// src/components/Auth/Login.js

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Alert,
    Box,
    Link as MuiLink
} from '@mui/material';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const email = e.target.email.value;
        const password = e.target.password.value;

        try {
            const userCredential = await login(email, password);
            const user = userCredential.user;

            // Firestoreからユーザーデータを取得
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            const userData = userDoc.data();

            // 一般ユーザーページへのアクセスを制限
            if (userData.role === 'admin' && window.location.pathname === '/login') {
                setError('管理者アカウントでは一般ユーザーログインできません');
                await auth.signOut();
                setLoading(false);
                return;
            }

            // 管理者ページへのアクセスを制限
            if (userData.role !== 'admin' && window.location.pathname === '/admin/login') {
                setError('管理者権限がありません');
                await auth.signOut();
                setLoading(false);
                return;
            }

            // 適切なダッシュボードへリダイレクト
            if (userData.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/dashboard');
            }

        } catch (error) {
            setError('ログインに失敗しました: ' + error.message);
        }

        setLoading(false);
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
                <Typography component="h1" variant="h5" align="center">
                    ログイン
                </Typography>
                {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                <form onSubmit={handleSubmit}>
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
                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <MuiLink component={Link} to="/forgot-password" variant="body2">
                            パスワードを忘れた方はこちら
                        </MuiLink>
                    </Box>
                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                        アカウントをお持ちでない方は{' '}
                        <MuiLink component={Link} to="/register" variant="body2">
                            登録
                        </MuiLink>
                    </Box>
                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <MuiLink component={Link} to="/admin/login" variant="body2">
                            管理者ログイン
                        </MuiLink>
                    </Box>
                </form>
            </Paper>
        </Container>
    );
};

export default Login;
