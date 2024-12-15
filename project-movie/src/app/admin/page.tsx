'use client';

import { useState, useEffect } from 'react';
import {
    UsersIcon,
    FilmIcon,
    EyeIcon,
    HeartIcon
} from '@heroicons/react/24/outline';
import {useRouter} from "next/navigation";
import {useAuth} from "@/app/contexts/AuthContext";

interface DashboardStats {
    totalUsers: number;
    totalMovies: number;
    totalViews: number;
    totalLikes: number;
}

export default function AdminDashboard() {
    const router = useRouter();
    const { user, isAuthenticated, isAdmin } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState<DashboardStats>({
        totalUsers: 0,
        totalMovies: 0,
        totalViews: 0,
        totalLikes: 0
    });

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Đợi một chút để đảm bảo auth state đã được khôi phục
                await new Promise(resolve => setTimeout(resolve, 100));

                if (!isAuthenticated) {
                    router.push('/login?redirect=/admin');
                    return;
                }

                if (!isAdmin()) {
                    router.push('/');
                    return;
                }

                // Nếu đã authenticate và là admin, load data
                loadDashboardData();
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [isAuthenticated, user, router, isAdmin]);

    const loadDashboardData = async () => {
        try {
            // TODO: Fetch actual stats from your API
            setStats({
                totalUsers: 1234,
                totalMovies: 567,
                totalViews: 98765,
                totalLikes: 4321
            });
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        }
    };

    // Show loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    // Nếu không phải admin hoặc chưa đăng nhập, component sẽ redirect trước khi render
    if (!isAuthenticated || !isAdmin()) {
        return null;
    }

    const statCards = [
        {
            title: 'Tổng người dùng',
            value: stats.totalUsers,
            icon: UsersIcon,
            color: 'bg-blue-500'
        },
        {
            title: 'Tổng phim',
            value: stats.totalMovies,
            icon: FilmIcon,
            color: 'bg-green-500'
        },
        {
            title: 'Lượt xem',
            value: stats.totalViews,
            icon: EyeIcon,
            color: 'bg-yellow-500'
        },
        {
            title: 'Lượt thích',
            value: stats.totalLikes,
            icon: HeartIcon,
            color: 'bg-red-500'
        }
    ];

    return (
        <div>
            <h1 className="text-3xl font-semibold text-gray-800 mb-6">
                Dashboard
            </h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-lg shadow-md p-6 transition-transform hover:scale-105"
                    >
                        <div className="flex items-center">
                            <div className={`p-3 rounded-full ${stat.color} bg-opacity-75`}>
                                <stat.icon className="h-6 w-6 text-white" />
                            </div>
                            <div className="ml-4">
                                <h2 className="text-sm font-medium text-gray-600">
                                    {stat.title}
                                </h2>
                                <p className="text-2xl font-semibold text-gray-800">
                                    {stat.value.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Hoạt động gần đây
                </h2>
                <div className="space-y-4">
                    {/* Add your recent activity items here */}
                    <div className="border-b pb-4">
                        <p className="text-gray-600">
                            Chưa có hoạt động nào
                        </p>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Thao tác nhanh
                    </h2>
                    <div className="space-y-4">
                        <button className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                            Thêm phim mới
                        </button>
                        <button className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
                            Quản lý người dùng
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Thông báo hệ thống
                    </h2>
                    <div className="space-y-4">
                        <p className="text-gray-600">
                            Không có thông báo mới
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}