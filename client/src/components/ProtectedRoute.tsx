// ProtectedRoute.tsx
import React, { FC, ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Loading from '../pages/Loading';

type ProtectedRouteProps = {
  children: ReactElement;
};

export const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  console.log('logging the user in protected routes:', user);

  if (isLoading) {
    // Render some loading indicator or return null to wait
    return <Loading />;
  }
  
  if (!user || user.guest === true) {
    return <Navigate to="/login" replace />;
  }

  return children;
};