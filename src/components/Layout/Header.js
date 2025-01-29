import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    styled,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../utils/supabaseClient';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
    boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
}));

const StyledButton = styled(Button)(({ theme }) => ({
    color: 'white',
    '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
}));

export default function Header({ userType = 'user' }) {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut();
            navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <StyledAppBar position="fixed">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    {userType === 'admin' ? '管理者ダッシュボード' : 'ダッシュボード'}
                </Typography>
                <Box>
                    <StyledButton
                        onClick={handleLogout}
                        startIcon={<LogoutIcon />}
                    >
                        ログアウト
                    </StyledButton>
                </Box>
            </Toolbar>
        </StyledAppBar>
    );
}
