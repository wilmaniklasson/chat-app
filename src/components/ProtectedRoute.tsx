
import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
    element: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
    const token = localStorage.getItem('token');

    // Om token inte finns, navigera till inloggningssidan
    if (!token) {
        return <Navigate to="/" replace />;
    }

    return element; // Om token finns, returnera den skyddade komponenten
};

export default ProtectedRoute;
