
import { LoginRequest } from "@/type/LoginRequest";
import { LoginResponse } from "@/type/LoginResponse";
import { RegisterRequest } from "@/type/RegisterRequest";
import config from "@/config";
import api from "@/service/api";

const AUTH_URL = '/api/auth';  // Không cần full URL vì đã có baseURL trong api instance

export const authService = {
    async login(data: LoginRequest): Promise<LoginResponse> {
        try {
            const response = await api.post<LoginResponse>('/api/auth/login', data);

            // Kiểm tra response.data trước
            if (!response.data) {
                throw new Error('Invalid response from server');
            }

            // Lưu token và user info
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify({
                username: response.data.username,
                roles: response.data.roles,
            }));

            // Set Authorization header cho các request tiếp theo
            api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

            return response.data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    async register(data: RegisterRequest): Promise<void> {
        try {
            await api.post(`${AUTH_URL}/register`, data);
        } catch (error) {
            console.error('Register error:', error);
            throw error;
        }
    },

    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete api.defaults.headers.common['Authorization'];

        // Optional: Redirect to login page
        if (typeof window !== 'undefined') {
            window.location.href = '/login';
        }
    },

    getCurrentUser(): LoginResponse | null {
        if (typeof window === 'undefined') return null;

        const userStr = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (userStr && token) {
            return JSON.parse(userStr);
        }
        return null;
    },

    isAuthenticated(): boolean {
        if (typeof window === 'undefined') return false;

        const token = localStorage.getItem('token');
        return !!token;
    },

    // Thêm method để check token validity
    async validateToken(): Promise<boolean> {
        try {
            const token = localStorage.getItem('token');
            if (!token) return false;

            // Gọi API endpoint để validate token (nếu có)
            await api.get(`${AUTH_URL}/validate`);
            return true;
        } catch (error) {
            this.logout();
            return false;
        }
    }
};