import { axiosInstance } from '@/lib/axios';
import { API_ENDPOINTS } from '@/config/api';
import type {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  User,
} from '@/types';

export const authService = {
  // Login
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await axiosInstance.post<AuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );
    this.setTokens(response.data.access_token, response.data.refresh_token);
    return response.data;
  },

  // Register
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await axiosInstance.post<AuthResponse>(
      API_ENDPOINTS.AUTH.REGISTER,
      credentials
    );
    this.setTokens(response.data.access_token, response.data.refresh_token);
    return response.data;
  },

  // Logout
  async logout(): Promise<void> {
    try {
      await axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT);
    } finally {
      this.clearTokens();
    }
  },

  // Get current user
  async getCurrentUser(): Promise<User> {
    const response = await axiosInstance.get<User>(API_ENDPOINTS.AUTH.ME);
    return response.data;
  },

  // Token management
  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  },

  clearTokens(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  },

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  },
};
