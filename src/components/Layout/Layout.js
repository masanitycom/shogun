// src/components/Layout/Layout.js

import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import Navbar from './Navbar';

const Layout = () => {
    return (
        <Box>
            <Navbar />
            <Container component="main" sx={{ mt: 4 }}>
                <Outlet />
            </Container>
        </Box>
    );
};

export default Layout;
