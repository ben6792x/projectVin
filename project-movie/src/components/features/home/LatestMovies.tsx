// src/components/features/home/LatestMovies.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Movie } from '@/type/Movie';
import { movieService } from '@/service/movieService';
import {getImageUrl} from "@/app/utils/imageUtils";


export default function LatestMovies() {
    const [latestMovies, setLatestMovies] = useState<Movie[]>([]);
    const [topMovies, setTopMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [latest, top] = await Promise.all([
                    movieService.getLatestMovies(),
                    movieService.getTopMoviesByViews()
                ]);
                setLatestMovies(latest);
                setTopMovies(top);
            } catch (err) {
                setError('Failed to load movies');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="container mx-auto px-4 mt-8">
                <div className="flex gap-6">
                    <div className="w-[80%] animate-pulse">
                        <div className="grid grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                            {[...Array(12)].map((_, index) => (
                                <div key={index} className="h-[280px] bg-gray-700 rounded-lg" />
                            ))}
                        </div>
                    </div>
                    <div className="w-[20%] bg-gray-800 h-[600px] rounded-lg animate-pulse" />
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500 text-center p-4">{error}</div>;
    }

    if (loading) {
        return (
            <div className="container mx-auto px-4 mt-8">
                {/* Điều chỉnh loading state cho responsive */}
                <div className="flex flex-col lg:flex-row gap-6">
                    <div className="w-full lg:w-[80%] animate-pulse">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                            {[...Array(12)].map((_, index) => (
                                <div key={index} className="h-[280px] bg-gray-700 rounded-lg" />
                            ))}
                        </div>
                    </div>
                    <div className="w-full lg:w-[20%] h-[400px] lg:h-[600px] bg-gray-800 rounded-lg animate-pulse" />
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500 text-center p-4">{error}</div>;
    }

    return (
        <div className="container mx-auto px-4 mt-8">
            {/* Chuyển từ flex sang flex-col trên mobile */}
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Phần Mới Cập Nhật */}
                <div className="w-full lg:w-[80%]">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                            <h2 className="text-lg sm:text-xl font-bold text-green-500">Mới Cập Nhật</h2>
                            <Link
                                href="/schedule"
                                className="flex items-center text-gray-400 hover:text-blue-500 transition duration-300"
                            >
                                <span className="text-xs sm:text-sm">Lịch phim</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none"
                                     viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M9 5l7 7-7 7"/>
                                </svg>
                            </Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
                        {latestMovies.map((movie) => (
                            <Link
                                key={movie.id}
                                href={`/${movie.slug}`}
                                className="relative group"
                            >
                                <div className="relative overflow-hidden rounded-lg">
                                    <Image
                                        src={getImageUrl(movie.posterUrl || movie.thumbUrl)}
                                        alt={movie.name}
                                        width={300}
                                        height={450}
                                        className="w-full aspect-[2/3] object-cover transform group-hover:scale-105 transition duration-300"
                                    />
                                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs rounded-md z-10">
                                        {movie.episodeCurrent} [{movie.quality}]
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
                                    <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 text-white transform translate-y-full group-hover:translate-y-0 transition duration-300">
                                        <h3 className="font-bold text-xs sm:text-sm mb-1 line-clamp-2">{movie.name}</h3>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Phần Bảng Xếp Hạng */}
                <div className="w-full lg:w-[20%] mt-6 lg:mt-0">
                    <div className="bg-gray-800 rounded-lg p-4">
                        <h2 className="text-lg sm:text-xl font-bold text-yellow-500 mb-4">Bảng Xếp Hạng</h2>
                        {/* Trên mobile hiển thị dạng grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                            {topMovies.map((movie, index) => (
                                <Link
                                    key={movie.id}
                                    href={`/${movie.slug}`}
                                    className="flex items-center space-x-3 hover:bg-gray-700/50 p-2 rounded-lg transition duration-300"
                                >
                                    <span className="text-xl sm:text-2xl font-bold text-blue-500 min-w-[24px]">
                                        {index + 1}
                                    </span>
                                    <Image
                                        src={getImageUrl(movie.posterUrl || movie.thumbUrl)}
                                        alt={movie.name}
                                        width={48}
                                        height={64}
                                        className="w-12 h-16 object-cover rounded"
                                    />
                                    <div className="flex-1 min-w-0"> {/* Thêm min-w-0 để tránh overflow */}
                                        <h3 className="text-white text-xs sm:text-sm font-medium line-clamp-1">
                                            {movie.name}
                                        </h3>
                                        <p className="text-gray-400 text-xs">
                                            {movie.episodeCurrent} [{movie.quality}]
                                        </p>
                                        <p className="text-blue-400 text-xs mt-1">
                                            {movie.views.toLocaleString()} lượt xem
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}