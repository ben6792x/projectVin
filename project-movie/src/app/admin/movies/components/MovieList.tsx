// src/app/admin/movies/components/MovieList.tsx
'use client';

import { useState, useEffect } from 'react';
import {Movie} from "@/type/Movie";
import {adminMovieService} from "@/service/admin/movieService";
import {Switch} from "@headlessui/react";
import { toast } from 'react-hot-toast';
import Link from "next/link";
import Image from 'next/image';
import {getImageUrl} from "@/app/utils/imageUtils";
import axios from "axios";
import {useAuth} from "@/app/contexts/AuthContext";
export default function MovieList() {
    const [movies, setMovies] = useState<Movie[]>([]);  // Khởi tạo là mảng rỗng
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const { isAdmin } = useAuth();
    useEffect(() => {
        fetchMovies();
    }, [page]);

    const fetchMovies = async () => {
        try {
            setLoading(true);
            const response = await adminMovieService.getMovies(page);
            setMovies(response.data.content || []); // Thêm fallback là mảng rỗng
            setTotalPages(response.data.totalPages);
            setTotalElements(response.data.totalElements);
        } catch (error) {
            console.error('Error fetching movies:', error);
            setMovies([]); // Set mảng rỗng nếu có lỗi
        } finally {
            setLoading(false);
        }
    };
    const handleDelete = async (slug: string) => {
        if (!isAdmin()) {
            toast.error('Bạn không có quyền xóa movie');
            return;
        }

        try {
            if (!confirm('Bạn có chắc chắn muốn xóa movie này?')) {
                return;
            }

            setLoading(true);
            const loadingToast = toast.loading('Đang xóa movie...');

            await adminMovieService.deleteMovie(slug);

            toast.dismiss(loadingToast);
            toast.success('Xóa movie thành công');

            // Refresh danh sách
            await fetchMovies();

        } catch (error: any) {
            console.error('Delete error:', error);
            toast.error(error.message || 'Có lỗi xảy ra khi xóa movie');
        } finally {
            setLoading(false);
        }
    };
    if (loading) {
        return <div className="text-center py-4">Loading...</div>;
    }

    if (!movies.length) {
        return <div className="text-center py-4">Không có phim nào.</div>;
    }
    const handleToggleSlide = async (movieId: string) => {
        try {
            await adminMovieService.toggleSlide(movieId);
            setMovies(prevMovies =>
                prevMovies.map(movie =>
                    movie.id === movieId
                        ? { ...movie, inSlide: !movie.inSlide }
                        : movie
                )
            );
            // Thêm toast notification
            toast.success(
                'Đã cập nhật trạng thái slide. Bạn có thể xem danh sách phim trong slide tại trang Quản lý Slide.',
                { duration: 3000 }
            );
        } catch (error) {
            console.error('Error toggling slide:', error);
            toast.error('Có lỗi xảy ra khi cập nhật trạng thái slide');
        }
    };

    return (
        <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Danh sách phim</h2>
                <span className="text-sm text-gray-500">
                    Tổng số: {totalElements} phim
                </span>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tên phim
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tên gốc
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Số tập
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Lượt xem
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Cập nhật
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {movies.map((movie) => (
                        <tr key={movie.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="relative h-10 w-10 mr-3">
                                        <Image
                                            src={getImageUrl(movie.thumbUrl)}
                                            alt={movie.name}
                                            fill
                                            className="rounded-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <Link
                                            href={`/admin/movies/${movie.slug}`}
                                            className="text-sm font-medium text-gray-900 hover:text-indigo-600"
                                        >
                                            {movie.name}
                                        </Link>
                                        <div className="text-sm text-gray-500">
                                            {movie.year}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {movie.originName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {movie.episodeCurrent}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {movie.views?.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(movie.modifiedAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <Switch
                                    checked={movie.inSlide}
                                    onChange={() => handleToggleSlide(movie.id)}
                                    className={`${
                                        movie.inSlide ? 'bg-indigo-600' : 'bg-gray-200'
                                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out`}
                                >
                                    <span
                                        className={`${
                                            movie.inSlide ? 'translate-x-6' : 'translate-x-1'
                                        } inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out`}
                                    />
                                </Switch>
                                <button
                                    onClick={() => handleDelete(movie.slug)}
                                    className="text-red-600 hover:text-red-800 transition-colors duration-200 ml-2"
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
                                            strokeWidth={2}
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                        />
                                    </svg>
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex justify-between items-center">
                <div className="text-sm text-gray-700">
                    Trang {page + 1} / {totalPages}
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={() => setPage(p => Math.max(0, p - 1))}
                        disabled={page === 0}
                        className="px-4 py-2 border rounded text-sm disabled:opacity-50"
                    >
                        Trước
                    </button>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                        disabled={page === totalPages - 1}
                        className="px-4 py-2 border rounded text-sm disabled:opacity-50"
                    >
                        Sau
                    </button>
                </div>
            </div>
        </div>
    );
}