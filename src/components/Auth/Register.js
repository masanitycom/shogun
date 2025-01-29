// src/components/Auth/Register.js

import React, { useState, useEffect } from 'react';
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
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import { Link } from 'react-router-dom';
import { supabase } from '../../utils/supabaseClient';

// スタイル定義
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

// 正規表現パターン
const kanaRegex = /^[ァ-ヶー0-9a-zA-Z]*$/;  // カタカナと半角英数を許可
const userIdRegex = /^[a-zA-Z0-9]{6,}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usdtAddressRegex = /^[a-zA-Z0-9]+$/;

export default function Register() {
    const [formData, setFormData] = useState({
        nameKana: '',
        userId: '',
        email: '',
        password: '',
        confirmPassword: '',
        referralId: '',
        usdtAddress: '',
        walletType: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isUserIdAvailable, setIsUserIdAvailable] = useState(true);
    const [isReferralIdValid, setIsReferralIdValid] = useState(true);

    // ユーザーIDの重複チェック
    const checkUserIdAvailability = async (userId) => {
        if (!userId || !userIdRegex.test(userId)) return false;

        const { data, error } = await supabase
            .from('profiles')
            .select('user_id')
            .eq('user_id', userId)
            .single();

        return !data && !error;
    };

    // 紹介者IDの存在チェック
    const checkReferralId = async (referralId) => {
        if (!referralId) return false;

        const { data, error } = await supabase
            .from('profiles')
            .select('user_id')
            .eq('user_id', referralId)
            .single();

        return data && !error;
    };

    useEffect(() => {
        if (formData.userId) {
            const timer = setTimeout(async () => {
                const isAvailable = await checkUserIdAvailability(formData.userId);
                setIsUserIdAvailable(isAvailable);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [formData.userId]);

    useEffect(() => {
        if (formData.referralId) {
            const timer = setTimeout(async () => {
                const isValid = await checkReferralId(formData.referralId);
                setIsReferralIdValid(isValid);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [formData.referralId]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // 全体的なバリデーション
        if (!formData.nameKana || !kanaRegex.test(formData.nameKana)) {
            setError('名前は全角カタカナで入力してください');
            setLoading(false);
            return;
        }

        if (!formData.userId || !userIdRegex.test(formData.userId)) {
            setError('ユーザーIDは半角英数6文字以上で入力してください');
            setLoading(false);
            return;
        }

        if (!isUserIdAvailable) {
            setError('このユーザーIDは既に使用されています');
            setLoading(false);
            return;
        }

        if (!formData.email || !emailRegex.test(formData.email)) {
            setError('有効なメールアドレスを入力してください');
            setLoading(false);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('パスワードが一致しません');
            setLoading(false);
            return;
        }

        if (!isReferralIdValid) {
            setError('有効な紹介者IDを入力してください');
            setLoading(false);
            return;
        }

        if (formData.usdtAddress && !usdtAddressRegex.test(formData.usdtAddress)) {
            setError('有効なUSDTアドレスを入力してください');
            setLoading(false);
            return;
        }

        try {
            // 新規ユーザー登録
            const { data, error: signUpError } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
            });

            if (signUpError) {
                console.error('Signup error:', signUpError);
                throw signUpError;
            }

            if (!data.user) {
                throw new Error('User data is missing after signup');
            }

            // プロフィール作成
            const { error: profileError } = await supabase
                .from('profiles')
                .insert([
                    {
                        id: data.user.id,
                        name_kana: formData.nameKana,
                        user_id: formData.userId,
                        email: formData.email,
                        referral_id: formData.referralId,
                        usdt_address: formData.usdtAddress,
                        wallet_type: formData.walletType,
                        user_type: 'user',
                        created_at: new Date(),
                        updated_at: new Date()
                    }
                ]);

            if (profileError) {
                console.error('Profile creation error:', profileError);
                throw profileError;
            }

            setSuccessMessage('登録が完了しました。メールを確認してください。');

        } catch (error) {
            console.error('Registration error:', error);
            setError('登録に失敗しました: ' + error.message);
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
                        mb: 4,
                        fontWeight: 'bold',
                        color: '#1a237e'
                    }}
                >
                    新規登録
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {successMessage && (
                    <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
                        {successMessage}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                    <StyledTextField
                        required
                        fullWidth
                        label="お名前（カタカナ）"
                        name="nameKana"
                        value={formData.nameKana}
                        onChange={handleChange}
                        error={formData.nameKana && !kanaRegex.test(formData.nameKana)}
                        helperText={formData.nameKana && !kanaRegex.test(formData.nameKana) ? "カタカナで入力してください" : ""}
                    />

                    <StyledTextField
                        required
                        fullWidth
                        label="ユーザーID（半角英数6文字以上）"
                        name="userId"
                        value={formData.userId}
                        onChange={handleChange}
                        error={
                            (formData.userId && !userIdRegex.test(formData.userId)) ||
                            (formData.userId && !isUserIdAvailable)
                        }
                        helperText={
                            formData.userId && !userIdRegex.test(formData.userId)
                                ? "半角英数6文字以上で入力してください"
                                : formData.userId && !isUserIdAvailable
                                    ? "このユーザーIDは既に使用されています"
                                    : ""
                        }
                    />

                    <StyledTextField
                        required
                        fullWidth
                        label="メールアドレス"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={formData.email && !emailRegex.test(formData.email)}
                        helperText={formData.email && !emailRegex.test(formData.email) ? "有効なメールアドレスを入力してください" : ""}
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

                    <StyledTextField
                        required
                        fullWidth
                        label="パスワード（確認）"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        error={formData.confirmPassword && formData.password !== formData.confirmPassword}
                        helperText={formData.confirmPassword && formData.password !== formData.confirmPassword ? "パスワードが一致しません" : ""}
                    />

                    <StyledTextField
                        required
                        fullWidth
                        label="紹介者ID"
                        name="referralId"
                        value={formData.referralId}
                        onChange={handleChange}
                        error={formData.referralId && !isReferralIdValid}
                        helperText={formData.referralId && !isReferralIdValid ? "有効な紹介者IDを入力してください" : ""}
                    />

                    <StyledTextField
                        fullWidth
                        label="USDTアドレス"
                        name="usdtAddress"
                        value={formData.usdtAddress}
                        onChange={handleChange}
                        error={formData.usdtAddress && !usdtAddressRegex.test(formData.usdtAddress)}
                        helperText={formData.usdtAddress && !usdtAddressRegex.test(formData.usdtAddress) ? "有効なUSDTアドレスを入力してください" : ""}
                    />

                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>ウォレットタイプ</InputLabel>
                        <Select
                            name="walletType"
                            value={formData.walletType}
                            onChange={handleChange}
                        >
                            <MenuItem value="TRC20">TRC20</MenuItem>
                            <MenuItem value="ERC20">ERC20</MenuItem>
                            <MenuItem value="BEP20">BEP20</MenuItem>
                        </Select>
                    </FormControl>

                    <StyledButton
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : '登録'}
                    </StyledButton>

                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <Link
                            to="/"
                            style={{
                                textDecoration: 'none',
                                color: '#1a237e',
                                fontSize: '0.875rem'
                            }}
                        >
                            ログインはこちら
                        </Link>
                    </Box>
                </Box>
            </StyledPaper>
        </Container>
    );
}
