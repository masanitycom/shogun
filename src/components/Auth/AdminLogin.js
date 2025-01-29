// src/components/Auth/AdminLogin.js
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase';
import { getFirestore, doc, getDoc } from '@firebase/firestore'
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

const AdminLogin = () => {
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

            // 管理者権限の確認
            if (userData.role !== 'admin') {
                setError('管理者権限がありません');
                await auth.signOut();
                setLoading(false);
                return;
            }

            navigate('/admin/dashboard');
        } catch (error) {
            setError('ログインに失敗しました: ' + error.message);
        }

        setLoading(false);
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
                <Typography component="h1" variant="h5" align="center">
                    管理者ログイン
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
                        <MuiLink component={Link} to="/login" variant="body2">
                            一般ユーザーログイン
                        </MuiLink>
                    </Box>
                </form>
            </Paper>
        </Container>
    );
};

export default AdminLogin;
