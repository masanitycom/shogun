// src/components/Layout/DashboardLayout.js
import React, { useState } from 'react';
import {
    Box,
    Drawer,
    AppBar,
    Toolbar,
    List,
    Typography,
    Divider,
    IconButton,
    ListItem,
    ListItemIcon,
    ListItemText,
    Avatar,
    Menu,
    MenuItem,
    styled
} from '@mui/material';
import {
    Menu as MenuIcon,
    ChevronLeft as ChevronLeftIcon,
    Dashboard as DashboardIcon,
    Person as PersonIcon,
    Group as GroupIcon,
    AccountBalance as AccountBalanceIcon,
    Settings as SettingsIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../utils/supabaseClient';

const drawerWidth = 240;

const Main = styled('main')(({ theme }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: 0,
}));

const StyledAppBar = styled(AppBar)(({ theme }) => ({
    backgroundColor: '#1a237e',
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
}));

export default function DashboardLayout({ children }) {
    const navigate = useNavigate();
    const [open, setOpen] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleDrawerToggle = () => {
        setOpen(!open);
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    const menuItems = [
        { text: 'ダッシュボード', icon: <DashboardIcon />, path: '/dashboard' },
        { text: 'プロフィール', icon: <PersonIcon />, path: '/dashboard/profile' },
        { text: 'メンバー', icon: <GroupIcon />, path: '/dashboard/members' },
        { text: '収入管理', icon: <AccountBalanceIcon />, path: '/dashboard/income' },
        { text: '設定', icon: <SettingsIcon />, path: '/dashboard/settings' }
    ];

    return (
        <Box sx={{ display: 'flex' }}>
            <StyledAppBar position="fixed">
                <Toolbar>
                    <IconButton
                        color="inherit"
                        onClick={handleDrawerToggle}
                        edge="start"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
                        MLM System
                    </Typography>
                    <IconButton
                        onClick={handleMenuOpen}
                        sx={{ padding: 0 }}
                    >
                        <Avatar />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                    >
                        <MenuItem onClick={() => navigate('/dashboard/profile')}>
                            プロフィール
                        </MenuItem>
                        <MenuItem onClick={handleLogout}>ログアウト</MenuItem>
                    </Menu>
                </Toolbar>
            </StyledAppBar>
            <Drawer
                variant="permanent"
                open={open}
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
            >
                <Toolbar />
                <Box sx={{ overflow: 'auto' }}>
                    <List>
                        {menuItems.map((item) => (
                            <ListItem
                                button
                                key={item.text}
                                onClick={() => navigate(item.path)}
                            >
                                <ListItemIcon>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>
            <Main>
                <Toolbar />
                {children}
            </Main>
        </Box>
    );
}
