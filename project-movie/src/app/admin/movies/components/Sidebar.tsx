// src/app/admin/components/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    HomeIcon,
    FilmIcon,
    ChartBarIcon,
    UsersIcon,
    Cog6ToothIcon as CogIcon,
    ArrowPathIcon as SyncIcon
} from '@heroicons/react/24/outline';
import {PhotoIcon} from "@heroicons/react/16/solid";

const menuItems = [
    {
        name: 'Dashboard',
        href: '/admin',
        icon: HomeIcon
    },
    {
        name: 'Quản lý phim',
        href: '/admin/movies',
        icon: FilmIcon
    },
    {
        name: 'Đồng bộ phim',
        href: '/admin/movies/sync',
        icon: SyncIcon
    },
    {
        name: 'Quản lý Slide',  // Thêm mục này
        href: '/admin/slides',
        icon: PhotoIcon  // Hoặc icon phù hợp khác
    },
    {
        name: 'Thống kê',
        href: '/admin/stats',
        icon: ChartBarIcon
    },
    {
        name: 'Người dùng',
        href: '/admin/users',
        icon: UsersIcon
    },
    {
        name: 'Cài đặt',
        href: '/admin/settings',
        icon: CogIcon
    }
];


export default function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="flex flex-col h-full bg-gray-800 text-white w-64">
            {/* Logo */}
            <div className="flex items-center justify-center h-16 bg-gray-900">
                <span className="text-xl font-bold">Admin Panel</span>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 overflow-y-auto py-4">
                <ul className="space-y-2 px-2">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={`flex items-center px-4 py-2 text-sm rounded-lg hover:bg-gray-700 transition-colors ${
                                        isActive ? 'bg-gray-700' : ''
                                    }`}
                                >
                                    <item.icon className="w-5 h-5 mr-3" />
                                    {item.name}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* User Profile */}
            <div className="border-t border-gray-700 p-4">
                <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                        <span className="text-sm font-medium">A</span>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm font-medium">Admin</p>
                        <p className="text-xs text-gray-400">admin@example.com</p>
                    </div>
                </div>
            </div>
        </div>
    );
}