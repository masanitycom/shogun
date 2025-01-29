// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import DashboardLayout from './components/Layout/DashboardLayout';
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import UserDashboard from './pages/Dashboard/UserDashboard';
import ResetPassword from './components/Auth/ResetPassword';
import CodeReference from './pages/CodeReference';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1a237e',
        },
    },
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <Router>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/code-reference" element={<CodeReference />} />
                    {/* ユーザーダッシュボード */}
                    <Route path="/dashboard/*" element={
                        <DashboardLayout>
                            <UserDashboard />
                        </DashboardLayout>
                    } />
                    {/* 管理者ダッシュボード */}
                    <Route path="/admin/dashboard/*" element={
                        <DashboardLayout>
                            <AdminDashboard />
                        </DashboardLayout>
                    } />
                </Routes>
            </Router>
        </ThemeProvider>
    );
}

export default App;
