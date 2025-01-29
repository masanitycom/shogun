import React, { useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    styled,
    Alert,
    CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../utils/supabaseClient';

const AdminLoginWrapper = styled(Box)({
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f8f9fa',
    padding: '20px',
});

const AdminLoginBox = styled(Paper)({
    width: '100%',
    maxWidth: '400px',
    padding: '40px',
    textAlign: 'center',
});

const StyledTextField = styled(TextField)({
    marginBottom: '16px',
    '& .MuiInputBase-input': {
        padding: '12px',
    },
    '& .MuiOutlinedInput-root': {
        backgroundColor: '#ffffff',
    },
});

const StyledButton = styled(Button)({
    padding: '12px 0',
    fontWeight: 500,
    '&.MuiButton-contained': {
        backgroundColor: '#0f172a',
        '&:hover': {
            backgroundColor: '#1e293b',
        },
    },
    '&.MuiButton-text': {
        color: '#6b7280',
        '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
        },
    },
});

export default function AdminLogin() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [credentials, setCredentials] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
                email: credentials.email,
                password: credentials.password,
            });

            if (signInError) throw signInError;

            // ユーザータイプの確認
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('user_type')
                .eq('id', user.id)
                .single();

            if (profileError) throw profileError;

            if (profileData.user_type !== 'admin') {
                throw new Error('管理者権限がありません');
            }

            navigate('/admin/dashboard');
        } catch (error) {
            setError('ログインに失敗しました：' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLoginWrapper>
            <AdminLoginBox>
                <Typography variant="h5" sx={{ mb: 4 }}>
                    管理者ログイン
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                    <StyledTextField
                        fullWidth
                        type="email"
                        placeholder="メールアドレス"
                        name="email"
                        value={credentials.email}
                        onChange={handleChange}
                        disabled={loading}
                    />

                    <StyledTextField
                        fullWidth
                        type="password"
                        placeholder="パスワード"
                        name="password"
                        value={credentials.password}
                        onChange={handleChange}
                        disabled={loading}
                    />

                    <StyledButton
                        fullWidth
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        sx={{ mb: 2 }}
                    >
                        {loading ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            'ログイン'
                        )}
                    </StyledButton>

                    <StyledButton
                        fullWidth
                        variant="text"
                        onClick={() => navigate('/')}
                        disabled={loading}
                    >
                        ユーザーログインへ戻る
                    </StyledButton>
                </Box>
            </AdminLoginBox>
        </AdminLoginWrapper>
    );
}
