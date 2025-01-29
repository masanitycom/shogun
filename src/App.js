// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './components/Auth/Login';
import AdminLogin from './components/Auth/AdminLogin';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import ResetPassword from './components/Auth/ResetPassword';
import UpdateProfile from './components/Profile/UpdateProfile';
import RequireAuth from './components/Auth/RequireAuth';
import Layout from './components/Layout/Layout';
import CodeReference from './pages/CodeReference';

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    {/* 認証関連ルート */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />

                    {/* 認証が必要なルート */}
                    <Route
                        path="/"
                        element={
                            <RequireAuth>
                                <Layout />
                            </RequireAuth>
                        }
                    >
                        {/* ダッシュボード */}
                        <Route
                            path="/"
                            element={<Navigate to="/dashboard" replace />}
                        />
                        <Route
                            path="/dashboard"
                            element={<Dashboard />}
                        />

                        {/* プロフィール関連 */}
                        <Route
                            path="/update-profile"
                            element={<UpdateProfile />}
                        />
                    </Route>

                    {/* 管理者用ルート */}
                    <Route
                        path="/admin/*"
                        element={
                            <RequireAuth requiredRole="admin">
                                <Layout />
                            </RequireAuth>
                        }
                    >
                        <Route
                            path="dashboard"
                            element={<AdminDashboard />}
                        />
                    </Route>

                    {/* 開発用ルート */}
                    <Route path="/code-reference" element={<CodeReference />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
