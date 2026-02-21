import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../context/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
    const { user, isAuthenticated } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        // Enforce login if not authenticated
        // In this mock, we might auto-login or redirect to a login page if it existed
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    if (user && !allowedRoles.includes(user.role)) {
        // Redirect to a "Forbidden" page or back to home if role not authorized
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
