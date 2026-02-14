import React from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ allowedRoles }) => {
    const { user } = useAuth();
    const location = useLocation();

    if (!user) {
        // Redirect to login if not authenticated
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect to home or forbidden page if role not allowed
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
