export type Permission = string;

export interface User {
  id: string;
  username: string;
  role: string;
  permissions?: Permission[];
  // 其他用户属性
}

export interface Role {
  id: number;
  name: string;
  permissions: Permission[];
}

export interface AuthState {
  user: User | null;
  token: string | null;
  permissions: string[];
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}