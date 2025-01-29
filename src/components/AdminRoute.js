import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminRoute = ({ children }) => {
    const { user, isAdmin } = useAuth();
    return user && isAdmin ? children : <Navigate to="/login" />;
};

export default AdminRoute;
