'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
import { Category } from '@/type/Category';
import { movieService } from '@/service/api';

export default function Header() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const { user, logout, isAdmin } = useAuth();
    const [categories, setCategories] = useState<Category[]>([]);
    const [showCategories, setShowCategories] = useState(false);
    const [dropdownTimeout, setDropdownTimeout] = useState<NodeJS.Timeout | null>(null);

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await movieService.getCategories();
                if (response.status === 'true') {
                    setCategories(response.data);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    const handleMouseEnter = () => {
        if (dropdownTimeout) {
            clearTimeout(dropdownTimeout);
            setDropdownTimeout(null);
        }
        setShowCategories(true);
    };

    const handleMouseLeave = () => {
        const timeout = setTimeout(() => {
            setShowCategories(false);
        }, 200);
        setDropdownTimeout(timeout);
    };

    return (
        <header className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white shadow-md">
            <div className="container max-w-screen-xl mx-auto px-4 py-3">
                <div className="flex flex-wrap items-center justify-between gap-y-3">
                    {/* Logo */}
                    <Link href="/" className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-500 hover:text-blue-400">
                        Anime3d.online
                    </Link>

                    {/* Search */}
                    <div className="w-full order-last lg:order-none lg:w-auto lg:flex-1 lg:max-w-lg">
                        <form onSubmit={handleSearch} className="relative">
                            <input
                                type="text"
                                placeholder="Tìm kiếm phim..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                            />
                            <button
                                type="submit"
                                className={`absolute right-3 top-1/2 -translate-y-1/2 hover:text-blue-500 ${
                                    !searchQuery.trim() ? 'text-gray-400' : ''
                                }`}
                                disabled={!searchQuery.trim()}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </button>
                        </form>
                    </div>

                    {/* Categories Dropdown */}
                    <div
                        className="relative"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        <button className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base text-white rounded-md hover:bg-gray-700 transition duration-300">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 sm:h-5 sm:w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                            <span>Thể loại</span>
                        </button>

                        {showCategories && (
                            <div className="absolute top-full right-0 sm:left-0 mt-2 w-60 sm:w-72 bg-gray-800 shadow-lg rounded-lg py-3 z-50 transition-opacity duration-300">
                                <div className="grid grid-cols-2 gap-2 px-4">
                                    {categories.map((category) => (
                                        <Link
                                            key={category.id}
                                            href={`/the-loai/${category.slug}`}
                                            className="block text-sm text-gray-300 hover:text-blue-400 hover:bg-gray-700 px-3 py-1 rounded transition duration-200"
                                        >
                                            {category.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Auth/Favorites Section */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        <Link
                            href="/yeu-thich"
                            className="hidden sm:flex items-center px-2 sm:px-3 py-1.5 sm:py-2 text-sm sm:text-base text-gray-300 hover:text-blue-500 hover:bg-gray-700 rounded-md transition duration-300"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 sm:h-5 sm:w-5 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                />
                            </svg>
                            <span>Yêu thích</span>
                        </Link>

                        {user ? (
                            <div className="flex items-center gap-2 sm:gap-3">
                                <span className="text-sm sm:text-base text-blue-500 font-medium">
                                    {isAdmin() ? '👑 ' : ''} {user.username}
                                </span>
                                <button
                                    onClick={logout}
                                    className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                                >
                                    Đăng xuất
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 sm:gap-3">
                                <Link
                                    href="/register"
                                    prefetch={true}
                                    className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base text-blue-500 border border-blue-500 rounded-md hover:text-white hover:bg-blue-500 transition"
                                >
                                    Đăng ký
                                </Link>
                                <Link
                                    href="/login"
                                    prefetch={true}
                                    className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                                >
                                    Đăng nhập
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}