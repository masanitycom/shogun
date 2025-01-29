// src/components/Auth/RequireAuth.js

import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const RequireAuth = ({ children, requiredRole }) => {
    const { currentUser, userData } = useAuth();

    if (!currentUser) {
        return <Navigate to={requiredRole === 'admin' ? '/admin/login' : '/login'} />;
    }

    if (requiredRole === 'admin' && userData?.role !== 'admin') {
        return <Navigate to="/login" />;
    }

    return children;
};

export default RequireAuth;
