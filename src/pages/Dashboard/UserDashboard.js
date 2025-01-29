// src/pages/Dashboard/UserDashboard.js
import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/Layout/DashboardLayout';
import { Box, Grid, Paper, Typography } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import GroupIcon from '@mui/icons-material/Group';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';

// ダッシュボードホーム画面のコンポーネント
const DashboardHome = () => {
    return (
        <Box>
            <Grid container spacing={3}>
                {/* 統計カード */}
                <Grid item xs={12} sm={6} md={4}>
                    <Paper
                        sx={{
                            p: 3,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Typography variant="h6">あなたのメンバー数</Typography>
                        <Typography variant="h3">0</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Paper
                        sx={{
                            p: 3,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Typography variant="h6">総収入</Typography>
                        <Typography variant="h3">¥0</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Paper
                        sx={{
                            p: 3,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Typography variant="h6">今月の収入</Typography>
                        <Typography variant="h3">¥0</Typography>
                    </Paper>
                </Grid>

                {/* メンバーツリー */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            メンバーツリー
                        </Typography>
                        {/* ここにツリー表示のコンポーネントを追加 */}
                        <Typography variant="body1" color="text.secondary">
                            まだメンバーがいません
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

// メンバー一覧画面のコンポーネント
const Members = () => (
    <Box>
        <Typography variant="h5">メンバー一覧</Typography>
        {/* メンバー一覧の実装 */}
    </Box>
);

// 収入管理画面のコンポーネント
const Income = () => (
    <Box>
        <Typography variant="h5">収入管理</Typography>
        {/* 収入管理の実装 */}
    </Box>
);

// プロフィール画面のコンポーネント
const Profile = () => (
    <Box>
        <Typography variant="h5">プロフィール設定</Typography>
        {/* プロフィール設定の実装 */}
    </Box>
);

// 設定画面のコンポーネント
const Settings = () => (
    <Box>
        <Typography variant="h5">設定</Typography>
        {/* 設定画面の実装 */}
    </Box>
);

export default function UserDashboard() {
    const navigate = useNavigate();

    const menuItems = [
        {
            text: 'ダッシュボード',
            icon: <DashboardIcon />,
            onClick: () => navigate('/dashboard'),
        },
        {
            text: 'メンバー',
            icon: <GroupIcon />,
            onClick: () => navigate('/dashboard/members'),
        },
        {
            text: '収入管理',
            icon: <AccountBalanceWalletIcon />,
            onClick: () => navigate('/dashboard/income'),
        },
        {
            text: 'プロフィール',
            icon: <PersonIcon />,
            onClick: () => navigate('/dashboard/profile'),
        },
        {
            text: '設定',
            icon: <SettingsIcon />,
            onClick: () => navigate('/dashboard/settings'),
        },
    ];

    return (
        <DashboardLayout title="ユーザーダッシュボード" menuItems={menuItems}>
            <Routes>
                <Route path="/" element={<DashboardHome />} />
                <Route path="/members" element={<Members />} />
                <Route path="/income" element={<Income />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<Settings />} />
            </Routes>
        </DashboardLayout>
    );
}
