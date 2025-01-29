// src/components/Profile/UpdateProfile.js

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
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

const UpdateProfile = () => {
    const { currentUser, updateUserPassword, updateUserEmail } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();

        const email = e.target.email.value;
        const password = e.target.password.value;
        const passwordConfirm = e.target.passwordConfirm.value;

        if (password !== passwordConfirm) {
            return setError('パスワードが一致しません');
        }

        const promises = [];
        setLoading(true);
        setError('');

        if (email !== currentUser.email) {
            promises.push(updateUserEmail(email));
        }
        if (password) {
            promises.push(updateUserPassword(password));
        }

        Promise.all(promises)
            .then(() => {
                navigate('/');
            })
            .catch(() => {
                setError('プロフィールの更新に失敗しました');
            })
            .finally(() => {
                setLoading(false);
            });
    }

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
                <Typography component="h1" variant="h5" align="center">
                    プロフィール更新
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
                        defaultValue={currentUser.email}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        name="password"
                        label="パスワード"
                        type="password"
                        id="password"
                        autoComplete="new-password"
                        placeholder="変更しない場合は空白"
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        name="passwordConfirm"
                        label="パスワード（確認）"
                        type="password"
                        id="passwordConfirm"
                        autoComplete="new-password"
                        placeholder="変更しない場合は空白"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={loading}
                    >
                        更新
                    </Button>
                    <Box sx={{ textAlign: 'center' }}>
                        <MuiLink component={Link} to="/" variant="body2">
                            キャンセル
                        </MuiLink>
                    </Box>
                </form>
            </Paper>
        </Container>
    );
};

export default UpdateProfile;
