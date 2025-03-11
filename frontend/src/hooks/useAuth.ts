import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { AuthState, Permission } from '../types/auth';

export const useAuth = () => {
  const { user, permissions, isAuthenticated } = useSelector<{ auth: AuthState }>(
    (state) => state.auth
  );

  const hasPermission = useCallback(
    (permissionCode: string) => {
      if (!isAuthenticated || !permissions) return false;
      return permissions.includes(permissionCode);
    },
    [isAuthenticated, permissions]
  );

  const hasRole = useCallback(
    (roleName: string) => {
      if (!isAuthenticated || !user?.roles) return false;
      return user.roles.some((role) => role.name === roleName);
    },
    [isAuthenticated, user]
  );

  const userPermissions = useMemo(() => {
    if (!user?.roles) return [];
    const permissionSet = new Set<string>();
    user.roles.forEach((role) => {
      role.permissions.forEach((permission) => {
        permissionSet.add(permission.code);
      });
    });
    return Array.from(permissionSet);
  }, [user]);

  return {
    user,
    isAuthenticated,
    permissions: userPermissions,
    hasPermission,
    hasRole,
  };
};