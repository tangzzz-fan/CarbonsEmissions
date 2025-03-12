import React, { ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

interface AuthGuardProps {
  children: ReactNode;
  permissionCode?: string;
  roleCode?: string;
  redirectTo?: string;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  permissionCode,
  roleCode,
  redirectTo = '/login'
}) => {
  const { isAuthenticated, hasPermission, hasRole } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} />;
  }

  if (permissionCode && !hasPermission(permissionCode)) {
    return <Navigate to="/unauthorized" />;
  }

  if (roleCode && !hasRole(roleCode)) {
    return <Navigate to="/unauthorized" />;
  }

  return <>{children}</>;
};

export default AuthGuard;

// 权限HOC，用于包装需要权限控制的组件
export const withAuth = (
  WrappedComponent: React.ComponentType<any>,
  permissionCode?: string,
  roleName?: string
) => {
  return (props: any) => (
    <AuthGuard permissionCode={permissionCode} roleCode={roleName}>
      <WrappedComponent {...props} />
    </AuthGuard>
  );
};