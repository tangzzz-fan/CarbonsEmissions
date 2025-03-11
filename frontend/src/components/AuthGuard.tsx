import React from 'react';
import { useAuth } from '../hooks/useAuth';

interface AuthGuardProps {
  permissionCode?: string;
  roleName?: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  permissionCode,
  roleName,
  children,
  fallback = null,
}) => {
  const { hasPermission, hasRole } = useAuth();

  const hasAccess = () => {
    if (permissionCode && !hasPermission(permissionCode)) {
      return false;
    }
    if (roleName && !hasRole(roleName)) {
      return false;
    }
    return true;
  };

  return hasAccess() ? <>{children}</> : <>{fallback}</>;
};

// 权限HOC，用于包装需要权限控制的组件
export const withAuth = (
  WrappedComponent: React.ComponentType<any>,
  permissionCode?: string,
  roleName?: string
) => {
  return (props: any) => (
    <AuthGuard permissionCode={permissionCode} roleName={roleName}>
      <WrappedComponent {...props} />
    </AuthGuard>
  );
};