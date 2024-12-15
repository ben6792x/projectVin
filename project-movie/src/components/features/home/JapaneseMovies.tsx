// src/components/features/home/JapaneseMovies.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Movie } from '@/type/Movie';
import { movieService } from '@/service/movieService';
import { getImageUrl } from "@/app/utils/imageUtils";

export default function JapaneseMovies() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const data = await movieService.getJapaneseMovies();
                // Lấy 8 phim đầu tiên
                setMovies(data.slice(0, 8));
            } catch (err) {
                setError('Failed to load Japanese movies');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, []);

    if (loading) {
        return (
            <div className="container mx-auto px-4 mt-8">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-700 w-48 mb-6 rounded" />
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                        {[...Array(8)].map((_, index) => (
                            <div key={index} className="h-[280px] bg-gray-700 rounded-lg" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500 text-center p-4">{error}</div>;
    }

    return (
        <div className="container mx-auto px-4 mt-8">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-red-500">Phim Nhật Bản</h2>
                <Link
                    href="/hoat-hinh-nhat-ban"
                    className="text-gray-400 hover:text-red-500 transition duration-300"
                >
                    Xem tất cả
                </Link>
            </div>

            {/* Thay đổi grid-cols để hiển thị 8 phim trên một hàng */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                {movies.map((movie) => (
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
                                className="w-full h-[280px] object-cover transform group-hover:scale-110 transition duration-300"
                            />
                            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs rounded-md z-10">
                                {movie.episodeCurrent} [{movie.quality}]
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="absolute bottom-0 left-0 right-0 p-3 text-white transform translate-y-full group-hover:translate-y-0 transition duration-300">
                                <h3 className="font-bold text-sm mb-1">{movie.name}</h3>
                                <p className="text-xs text-gray-300">{movie.originName}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}