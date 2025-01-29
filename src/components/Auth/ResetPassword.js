// src/components/Auth/ResetPassword.js
import React, { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Container,
    Alert,
    Paper,
    CircularProgress,
    styled
} from '@mui/material';
import { Link } from 'react-router-dom';
import { supabase } from '../../utils/supabaseClient';

const StyledPaper = styled(Paper)(({ theme }) => ({
    marginTop: theme.spacing(4),
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
}));

export default function ResetPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password-confirm`,
            });

            if (error) throw error;

            setMessage('パスワードリセットのメールを送信しました。メールをご確認ください。');
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="sm">
            <StyledPaper elevation={3}>
                <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
                    パスワードをリセット
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {message && (
                    <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
                        {message}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="メールアドレス"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'リセットメールを送信'}
                    </Button>
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <Typography color="primary" align="center">
                            ログイン画面に戻る
                        </Typography>
                    </Link>
                </Box>
            </StyledPaper>
        </Container>
    );
}
