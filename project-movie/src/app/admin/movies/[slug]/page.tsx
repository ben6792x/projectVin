'use client';

import { useEffect, useState } from 'react';
import {useParams, useRouter} from 'next/navigation';
import Image from 'next/image';
import { Movie } from '@/type/Movie';
import { movieService } from '@/service/movieService';
import LoadingSpinner from '@/components/features/shared/LoadingSpinner';
import {getImageUrl} from "@/app/utils/imageUtils";
import RelatedMovies from "@/components/features/movies/RelatedMovies";
import Link from "next/link";
import {useAuth} from "@/app/contexts/AuthContext";
import {toast} from "react-hot-toast";


export default function MovieDetail() {
    const { slug } = useParams();
    const [movie, setMovie] = useState<Movie | null>(null);
    const [loading, setLoading] = useState(true);
    const [isLiked, setIsLiked] = useState(false);
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        fetchMovieDetail();
    }, [slug]);

    const fetchMovieDetail = async () => {
        try {
            setLoading(true);
            const movie = await movieService.getMovieBySlug(slug as string);
            setMovie(movie);
        } catch (error) {
            console.error('Error fetching movie detail:', error);
        } finally {
            setLoading(false);
        }
    };
    const handleLikeClick = async () => {
        if (!user) {
            toast('Vui lòng đăng nhập để thích phim', {
                icon: '🔒',
            });
            router.push('/login');
            return;
        }

        if (!movie) {
            toast.error('Không tìm thấy thông tin phim');
            return;
        }

        try {
            // Sử dụng toggleLike với slug thay vì likeMovie với id
            const liked = await movieService.toggleLike(movie.slug);
            setIsLiked(liked);
            toast.success(liked ? 'Đã thích phim' : 'Đã bỏ thích phim');
        } catch (error) {
            console.error('Error toggling like:', error);
            toast.error('Có lỗi xảy ra khi thực hiện thao tác');
        }
    };

    // Kiểm tra trạng thái like
    useEffect(() => {
        const checkLikeStatus = async () => {
            if (user && movie) {
                try {
                    const likedMovies = await movieService.getLikedMovies();
                    // Thêm type Movie cho parameter m
                    setIsLiked(likedMovies.some((m: Movie) => m.slug === movie.slug));
                } catch (error) {
                    console.error('Error checking like status:', error);
                }
            }
        };

        checkLikeStatus();
    }, [user, movie]);
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (!movie) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">Không tìm thấy phim</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen text-white">
            {/* Hero Banner */}
            <div className="relative h-[200px] mb-6">
                <div className="absolute inset-0 overflow-hidden">
                    <Image
                        src={getImageUrl(movie.posterUrl || movie.thumbUrl)}
                        alt={movie.name}
                        fill
                        className="object-cover object-center opacity-20"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/90 to-gray-900"></div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 -mt-[180px] relative z-10">
                <div className="bg-gray-800/60 backdrop-blur rounded-xl p-5">
                    {/* Movie Info Section */}
                    <div className="flex flex-col lg:flex-row gap-5">
                        {/* Left Column - Poster */}
                        <div className="lg:w-[180px]">
                            <div className="relative rounded-lg overflow-hidden shadow-lg">
                                <Image
                                    src={getImageUrl(movie.posterUrl || movie.thumbUrl)}
                                    alt={movie.name}
                                    width={180}
                                    height={240}
                                    className="w-full h-[240px] object-cover"
                                />
                                <div
                                    className="absolute top-2 right-2 bg-blue-500/90 backdrop-blur-sm text-white px-2 py-0.5 rounded-md text-xs font-medium">
                                    {movie.quality}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-2 mt-3">
                                {movie.episodes && movie.episodes.length > 0 ? (
                                    <Link
                                        href={`/${movie.slug}/${movie.episodes[0].slug}`}
                                        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center space-x-2 transition duration-300"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                        </svg>
                                        <span>Xem Phim</span>
                                    </Link>
                                ) : (
                                    <button
                                        disabled
                                        className="w-full bg-gray-500 cursor-not-allowed text-white py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center space-x-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                        </svg>
                                        <span>Chưa có tập phim</span>
                                    </button>
                                )}
                                <button
                                    onClick={handleLikeClick}
                                    className={`w-full ${
                                        isLiked
                                            ? 'bg-red-500 hover:bg-red-600'
                                            : 'bg-gray-700 hover:bg-gray-600'
                                    } text-white py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center space-x-2 transition duration-300`}
                                >
                                    <svg
                                        className="w-4 h-4"
                                        fill={isLiked ? 'currentColor' : 'none'}
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                        />
                                    </svg>
                                    <span>{isLiked ? 'Đã Thích' : 'Yêu Thích'}</span>
                                </button>
                            </div>
                        </div>

                        {/* Right Column - Info */}
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                {movie.name}
                            </h1>

                            {/* Stats Row */}
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                <div className="flex items-center bg-yellow-500/10 px-4 py-2 rounded-xl">
                                    <svg className="w-5 h-5 text-yellow-500 mr-2" fill="currentColor"
                                         viewBox="0 0 20 20">
                                        <path
                                            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                    </svg>
                                    <span className="font-semibold">9.5</span>
                                </div>
                                <div className="flex items-center bg-blue-500/10 px-4 py-2 rounded-xl">
                                    <svg className="w-5 h-5 text-blue-400 mr-2" fill="none" stroke="currentColor"
                                         viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                                    </svg>
                                    <span>{movie.views.toLocaleString()} lượt xem</span>
                                </div>
                                <div className="flex items-center bg-purple-500/10 px-4 py-2 rounded-xl">
                                    <svg className="w-5 h-5 text-purple-400 mr-2" fill="none" stroke="currentColor"
                                         viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                              d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"/>
                                    </svg>
                                    <span>{movie.episodeCurrent}</span>
                                </div>
                            </div>

                            {/* Info Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                                <div className="bg-gray-700/50 p-2.5 rounded-lg">
                                    <h3 className="text-gray-400 text-xs mb-1">Tên khác</h3>
                                    <p className="text-sm font-medium">{movie.originName}</p>
                                </div>
                                <div className="bg-gray-700/50 p-2.5 rounded-lg">
                                    <h3 className="text-gray-400 text-xs mb-1">Thể loại</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {movie.categories.map(category => (
                                            <a key={category.id} href="#"
                                               className="text-blue-400 hover:text-blue-300 transition">
                                                {category.name}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-gray-700/50 p-2.5 rounded-lg">
                                    <h3 className="text-gray-400 text-xs mb-1">Năm phát hành</h3>
                                    <p className="font-medium">{movie.year}</p>
                                </div>
                                <div className="bg-gray-700/50 p-2.5 rounded-lg">
                                    <h3 className="text-gray-400 text-xs mb-1">Trạng thái</h3>
                                    <p className="font-medium">Đang phát hành</p>
                                </div>
                                <div className="bg-gray-700/50 p-2.5 rounded-lg">
                                    <h3 className="text-gray-400 text-xs mb-1">Quốc gia</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {movie.countries.map(country => (
                                            <span key={country.id} className="font-medium">
                                                {country.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-gray-700/50 p-2.5 rounded-lg">
                                    <h3 className="text-gray-400 text-xs mb-1">Thời lượng</h3>
                                    <p className="font-medium">{movie.duration}</p>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="bg-gray-700/30 rounded-lg p-3 mb-4">
                                <h2 className="text-base font-semibold mb-2">Nội dung phim</h2>
                                <p className="text-gray-300 text-sm leading-relaxed">
                                    {/* Add description if available in your Movie type */}
                                    Nội dung đang được cập nhật...
                                </p>
                            </div>

                            {/* Episodes */}
                            <div>
                                <h2 className="text-base font-semibold mb-2">Danh sách tập</h2>
                                <div className="grid grid-cols-12 sm:grid-cols-15 md:grid-cols-20 gap-1.5">
                                    <button
                                        className="episode-btn bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                                        {movie.episodeCurrent}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-6">
                    <h2 className="text-xl font-bold mb-4">Có thể bạn cũng thích</h2>
                    <RelatedMovies currentSlug={slug as string}/>
                </div>
            </div>
        </div>
    );
}