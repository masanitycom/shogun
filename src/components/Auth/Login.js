// src/components/Auth/Login.js
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
    styled,
    Tabs,
    Tab,
    Link as MuiLink
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../utils/supabaseClient';

const StyledPaper = styled(Paper)(({ theme }) => ({
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 3px 6px rgba(0,0,0,0.1)'
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: '#e0e0e0',
        },
        '&:hover fieldset': {
            borderColor: theme.palette.primary.main,
        },
    },
}));

const StyledButton = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    padding: theme.spacing(1.5),
    backgroundColor: '#1a237e',
    '&:hover': {
        backgroundColor: '#000051',
    },
}));

export default function Login() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(0); // 0: ユーザー, 1: 管理者
    const [formData, setFormData] = useState({
        loginId: '', // IDまたはメールアドレス
        email: '',   // 管理者用
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
        setError('');
        setFormData({
            loginId: '',
            email: '',
            password: ''
        });
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleUserLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const loginIdentifier = formData.loginId;
            const isEmail = loginIdentifier.includes('@');

            let email;
            if (isEmail) {
                email = loginIdentifier;
            } else {
                const { data, error: fetchError } = await supabase
                    .from('profiles')
                    .select('email')
                    .eq('user_id', loginIdentifier)
                    .single();

                if (fetchError) throw new Error('ユーザーIDが見つかりません');
                email = data.email;
            }

            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: formData.password,
            });

            if (error) throw error;

            // ユーザー権限の確認
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', data.user.id)
                .single();

            // 管理者の場合は管理者ダッシュボードへ
            if (profileData && profileData.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/dashboard'); // 一般ユーザーの場合
            }

        } catch (error) {
            setError('ログインに失敗しました: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAdminLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password,
            });

            if (error) throw error;

            // 管理者権限の確認
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', data.user.id)
                .single();

            // プロフィールが見つからない場合は管理者として扱う（暫定的な処理）
            // 本番環境では適切な管理者判定ロジックを実装する必要があります
            if (profileData && profileData.role !== 'admin') {
                throw new Error('管理者権限がありません');
            }

            navigate('/admin/dashboard'); // パスを適切に修正
        } catch (error) {
            setError('ログインに失敗しました: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="sm">
            <StyledPaper elevation={0}>
                <Typography
                    component="h1"
                    variant="h4"
                    sx={{
                        mb: 3,
                        fontWeight: 'bold',
                        color: '#1a237e'
                    }}
                >
                    ログイン
                </Typography>

                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    variant="fullWidth"
                    sx={{ width: '100%', mb: 3 }}
                >
                    <Tab label="ユーザーログイン" />
                    <Tab label="管理者ログイン" />
                </Tabs>

                {error && (
                    <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {activeTab === 0 ? (
                    // ユーザーログインフォーム
                    <Box component="form" onSubmit={handleUserLogin} sx={{ width: '100%' }}>
                        <StyledTextField
                            required
                            fullWidth
                            label="ユーザーIDまたはメールアドレス"
                            name="loginId"
                            value={formData.loginId}
                            onChange={handleChange}
                        />

                        <StyledTextField
                            required
                            fullWidth
                            label="パスワード"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                        />

                        <StyledButton
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'ログイン'}
                        </StyledButton>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                            <Link
                                to="/reset-password"
                                style={{
                                    textDecoration: 'none',
                                    color: '#1a237e'
                                }}
                            >
                                パスワードを忘れた方はこちら
                            </Link>
                            <Link
                                to="/register"
                                style={{
                                    textDecoration: 'none',
                                    color: '#1a237e',
                                    fontSize: '0.875rem'
                                }}
                            >
                                新規登録はこちら
                            </Link>
                        </Box>
                    </Box>
                ) : (
                    // 管理者ログインフォーム
                    <Box component="form" onSubmit={handleAdminLogin} sx={{ width: '100%' }}>
                        <StyledTextField
                            required
                            fullWidth
                            label="メールアドレス"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                        />

                        <StyledTextField
                            required
                            fullWidth
                            label="パスワード"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                        />

                        <StyledButton
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : '管理者ログイン'}
                        </StyledButton>
                    </Box>
                )}
            </StyledPaper>
        </Container>
    );
}
