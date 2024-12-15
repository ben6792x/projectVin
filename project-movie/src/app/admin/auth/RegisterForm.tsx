'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from "@/service/admin/authService/authService";

export default function RegisterForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const validateForm = () => {
        if (password.length < 6) {
            setError('Mật khẩu phải có ít nhất 6 ký tự');
            return false;
        }
        if (password !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            return false;
        }
        if (username.length < 3) {
            setError('Tên đăng nhập phải có ít nhất 3 ký tự');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            await authService.register({ username, password });
            router.push('/login');
        } catch (err: any) {
            setError(err.response?.data?.error || 'Đăng ký thất bại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-900">
            <div className="w-full max-w-md space-y-8">
                <div>
                    <h2 className="text-center text-3xl font-bold text-white">Đăng Ký</h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-300">
                                Tên đăng nhập
                            </label>
                            <input
                                id="username"
                                type="text"
                                required
                                className="mt-1 block w-full rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-white shadow-sm focus:border-blue-500 focus:outline-none"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Nhập tên đăng nhập"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                                Mật khẩu
                            </label>
                            <input
                                id="password"
                                type="password"
                                required
                                className="mt-1 block w-full rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-white shadow-sm focus:border-blue-500 focus:outline-none"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Nhập mật khẩu"
                            />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                                Xác nhận mật khẩu
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                required
                                className="mt-1 block w-full rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-white shadow-sm focus:border-blue-500 focus:outline-none"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Nhập lại mật khẩu"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-center text-red-500 bg-red-100/10 p-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition duration-200"
                    >
                        {loading ? 'Đang đăng ký...' : 'Đăng ký'}
                    </button>

                    <div className="text-center text-gray-300">
                        Đã có tài khoản?{' '}
                        <Link href="/login" className="text-blue-400 hover:text-blue-300 hover:underline transition duration-200">
                            Đăng nhập
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}