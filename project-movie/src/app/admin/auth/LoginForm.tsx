'use client';

import {useEffect, useState} from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from "@/app/contexts/AuthContext";
import { authService } from "@/service/admin/authService/authService";

export default function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { setUser, login } = useAuth();

    // Kiểm tra auth chỉ khi component mount
    useEffect(() => {
        // Thêm flag để tránh redirect loop
        const isLoginPage = window.location.pathname === '/login';

        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');

        if (token && userStr && isLoginPage) {
            try {
                const user = JSON.parse(userStr);
                if (user.roles?.includes('ROLE_ADMIN')) {
                    router.push('/admin/movies');
                } else {
                    router.push('/');
                }
            } catch (error) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
    }, []); // Chỉ chạy một lần khi component mount

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await authService.login({ username, password });

            if (!response || !response.token) {
                throw new Error('Invalid response from server');
            }

            // Lưu token
            localStorage.setItem('token', response.token);
            document.cookie = `token=${response.token}; path=/`;

            // Tạo user object
            const userData = {
                username: response.username,
                roles: response.roles,
            };

            // Gọi login từ context để handle redirect
            await login(userData);

        } catch (err: any) {
            console.error('Login error:', err);
            setError('Tên đăng nhập hoặc mật khẩu không chính xác');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 px-4">
            <div className="w-full max-w-md space-y-8 bg-gray-800/50 p-8 rounded-2xl backdrop-blur-sm shadow-xl">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-white mb-2">Đăng Nhập</h2>
                    <p className="text-gray-400">Chào mừng bạn quay trở lại</p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-5">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
                                Tên đăng nhập
                            </label>
                            <div className="relative">
                                <input
                                    id="username"
                                    type="text"
                                    required
                                    className="w-full rounded-lg border border-gray-600 bg-gray-700 p-3 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                                    placeholder="Nhập tên đăng nhập"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                                Mật khẩu
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type="password"
                                    required
                                    className="w-full rounded-lg border border-gray-600 bg-gray-700 p-3 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200"
                                    placeholder="Nhập mật khẩu"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg text-sm text-center">
                            {error}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-blue-600 p-3 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Đang đăng nhập...
                                </span>
                            ) : (
                                'Đăng nhập'
                            )}
                        </button>
                    </div>

                    <div className="text-center text-gray-400">
                        Chưa có tài khoản?{' '}
                        <Link
                            href="/register"
                            className="text-blue-400 hover:text-blue-300 font-medium hover:underline transition-all duration-200"
                        >
                            Đăng ký ngay
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}