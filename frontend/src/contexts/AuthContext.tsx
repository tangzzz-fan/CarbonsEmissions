import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, Permission } from '../types/auth';

interface AuthContextType {
    user: User | null;
    permissions: Permission[];
    isAuthenticated: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    hasPermission: (permission: string) => boolean;
    hasRole: (role: string) => boolean;
    isAdmin: () => boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        // 检查本地存储中是否有用户信息
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const userData = JSON.parse(storedUser);
            setUser(userData);
            setPermissions(userData.permissions || []);
            setIsAuthenticated(true);
        }
    }, []);

    const login = async (username: string, password: string) => {
        try {
            // 这里应该是实际的登录API调用
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                throw new Error('登录失败');
            }

            const userData = await response.json();
            setUser(userData);
            setPermissions(userData.permissions || []);
            setIsAuthenticated(true);
            localStorage.setItem('user', JSON.stringify(userData));
        } catch (error) {
            console.error('登录错误:', error);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        setPermissions([]);
        setIsAuthenticated(false);
        localStorage.removeItem('user');
    };

    const hasPermission = (permission: string) => {
        return permissions.includes(permission);
    };

    const hasRole = (role: string) => {
        return user?.role === role;
    };

    const isAdmin = () => {
        return user?.role === 'admin';
    };

    return (
        <AuthContext.Provider value={{
            user,
            permissions,
            isAuthenticated,
            login,
            logout,
            hasPermission,
            hasRole,
            isAdmin
        }}>
            {children}
        </AuthContext.Provider>
    );
}; 