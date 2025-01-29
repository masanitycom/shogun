import React, { useEffect, useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    styled,
} from '@mui/material';
import Header from '../../components/Layout/Header';
import { supabase } from '../../utils/supabaseClient';
import { useNavigate } from 'react-router-dom';

const MainContent = styled(Box)(({ theme }) => ({
    paddingTop: theme.spacing(10),
    minHeight: '100vh',
    background: '#f5f7fa',
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
    borderRadius: theme.spacing(2),
    boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .03)',
}));

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [adminProfile, setAdminProfile] = useState(null);

    useEffect(() => {
        const checkAdmin = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                navigate('/');
                return;
            }

            // 管理者権限の確認
            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (!profile || profile.user_type !== 'admin') {
                navigate('/');
                return;
            }

            setAdminProfile(profile);
        };

        checkAdmin();
    }, [navigate]);

    return (
        <Box>
            <Header userType="admin" />
            <MainContent>
                <Container maxWidth="lg">
                    <StyledPaper>
                        <Typography variant="h5" gutterBottom>
                            管理者ダッシュボード
                        </Typography>
                        {/* ここに管理者機能を追加 */}
                    </StyledPaper>
                </Container>
            </MainContent>
        </Box>
    );
}
