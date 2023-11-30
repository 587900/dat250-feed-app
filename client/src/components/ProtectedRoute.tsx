// ProtectedRoute.tsx
import React, { FC, ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Loading from '../pages/Loading';

type ProtectedRouteProps = {
  children: ReactElement;
  allowedRoles?: string[]; 
};

export const ProtectedRoute: FC<ProtectedRouteProps> = ({ children, allowedRoles = [] }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  const userHasRequiredRole = user && user.claims.some(claim => allowedRoles.includes(claim));

  if (!user || user.guest === true || !userHasRequiredRole) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
