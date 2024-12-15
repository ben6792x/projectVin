// app/yeu-thich/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { movieService } from '@/service/movieService';
import { Movie } from '@/type/Movie';
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '@/components/features/shared/LoadingSpinner';
import Image from 'next/image';
import { getImageUrl } from "@/app/utils/imageUtils";
import Link from 'next/link';
import MovieCard from "@/components/features/movies/MovieCard";

export default function YeuThich() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            toast('Vui lòng đăng nhập để xem phim đã thích', {
                icon: '🔒',
            });
            router.push('/login');
            return;
        }
        fetchLikedMovies();
    }, [user, router]);

    const fetchLikedMovies = async () => {
        try {
            setLoading(true);
            const likedMovies = await movieService.getLikedMovies();
            setMovies(likedMovies);
        } catch (error) {
            console.error('Error fetching liked movies:', error);
            toast.error('Có lỗi xảy ra khi tải danh sách phim đã thích');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (movies.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-white">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Chưa có phim yêu thích</h2>
                    <p className="text-gray-400 mb-6">Hãy thêm phim vào danh sách yêu thích của bạn</p>
                    <Link
                        href="/"
                        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition duration-300"
                    >
                        Khám phá phim
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen text-white">
            <div className="container mx-auto px-4 py-6">
                <h1 className="text-2xl font-bold mb-6">Phim Đã Thích</h1>

                {/* Thay đổi sang flex wrap và sử dụng MovieCard component */}
                <div className="flex flex-wrap gap-4">
                    {movies.map((movie) => (
                        <div key={movie.id} className="w-[180px]">
                            <MovieCard movie={movie} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}