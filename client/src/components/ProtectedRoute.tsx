// ProtectedRoute.tsx
import React, { FC, ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

type ProtectedRouteProps = {
  children: ReactElement;
};

export const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAuth();
  console.log('logging the user in protected routes:', user);
  
  if (!user || (user.guest === true)) {
    // Redirect to the login page if the user is not authenticated
    return <Navigate to="/login" replace />;
  }

  return children;
};