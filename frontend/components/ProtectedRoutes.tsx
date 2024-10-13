import React from 'react';
import { Redirect } from 'expo-router';
import {useAuth} from "@/context/AuthContext";


interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: 'ADMIN' | 'SALESPERSON' | 'DISTRIBUTOR';
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
    const { user } = useAuth();

    if (!user) {
        return <Redirect href="/login" />;
    }

    if (requiredRole && user.role !== requiredRole) {
        return <Redirect href="/" />;
    }

    return <>{children}</>;
}