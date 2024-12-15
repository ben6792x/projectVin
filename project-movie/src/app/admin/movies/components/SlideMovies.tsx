// src/app/admin/slides/components/SlideMovies.tsx
'use client';

import { useState, useEffect } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';
import {Movie} from "@/type/Movie";
import {adminMovieService} from "@/service/admin/movieService";
import config from '@/config';
import Image from 'next/image';
import {getImageUrl} from "@/app/utils/imageUtils";
export default function SlideMovies() {
    const [slideMovies, setSlideMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSlideMovies();
    }, []);

    const fetchSlideMovies = async () => {
        try {
            setLoading(true);
            const response = await adminMovieService.getSlideMovies();
            setSlideMovies(response.data);
        } catch (error) {
            console.error('Error fetching slide movies:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFromSlide = async (movieId: string) => {
        try {
            await adminMovieService.toggleSlide(movieId);
            await fetchSlideMovies(); // Refresh list after removing
        } catch (error) {
            console.error('Error removing movie from slide:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Stats */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="text-sm text-gray-600">
                    Tổng số phim trong slide: <span className="font-semibold">{slideMovies.length}</span>
                </div>
            </div>

            {/* Grid of movies */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {slideMovies.map((movie) => (
                    <div key={movie.id} className="bg-white rounded-lg shadow overflow-hidden">

                        <div className="aspect-w-16 aspect-h-9 relative">
                            <Image
                                src={getImageUrl(movie.posterUrl || movie.thumbUrl)}
                                alt={movie.name}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        </div>
                        <div className="p-4">
                            <h3 className="font-semibold text-gray-900">{movie.name}</h3>
                            <p className="text-sm text-gray-500 mt-1">{movie.originName}</p>
                            <div className="mt-2 flex items-center justify-between">
                                <span className="text-xs text-gray-500">
                                    {movie.year} • {movie.episodeCurrent}
                                </span>
                                <button
                                    onClick={() => handleRemoveFromSlide(movie.id)}
                                    className="text-red-600 hover:text-red-700 transition-colors"
                                    title="Xóa khỏi slide"
                                >
                                    <TrashIcon className="h-5 w-5"/>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {slideMovies.length === 0 && (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                    <p className="text-gray-500">
                        Chưa có phim nào trong slide.
                        Hãy thêm phim vào slide từ trang Quản lý phim.
                    </p>
                </div>
            )}
        </div>
    );
}