import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import Login from './components/Login';
import Register from './components/Register';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import { Container } from '@mui/material';

function App() {
    return (
        <Router>
            <AuthProvider>
                <Header />
                <Container>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/admin/login" element={<AdminLogin />} />

                        {/* Protected Routes */}
                        <Route
                            path="/"
                            element={
                                <PrivateRoute>
                                    <Dashboard />
                                </PrivateRoute>
                            }
                        />

                        {/* Admin Routes */}
                        <Route
                            path="/admin"
                            element={
                                <AdminRoute>
                                    <AdminDashboard />
                                </AdminRoute>
                            }
                        />

                        {/* Default Route */}
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </Container>
            </AuthProvider>
        </Router>
    );
}

export default App;
