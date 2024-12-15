// components/features/movies/MovieDetail.tsx
'use client';

import { Movie } from "@/type/Movie";
import Image from 'next/image';
import Link from 'next/link';
import { getImageUrl } from "@/app/utils/imageUtils";
import { useState } from 'react';
import { useAuth } from "@/app/contexts/AuthContext";
import { movieService } from "@/service/movieService";
import { toast } from 'react-hot-toast';


interface MovieDetailProps {
    movie: Movie;
}

export default function MovieDetail({ movie }: MovieDetailProps) {
    const { user } = useAuth();
    const [isLiked, setIsLiked] = useState<boolean>(movie.isLiked || false);
    const [isLoading, setIsLoading] = useState(false);

    const handleToggleLike = async () => {
        if (!user) {
            toast.error('Vui lòng đăng nhập để sử dụng tính năng này');
            return;
        }

        try {
            setIsLoading(true);
            const liked = await movieService.toggleLike(movie.slug);
            setIsLiked(liked);
            toast.success(liked
                ? 'Đã thêm vào danh sách yêu thích'
                : 'Đã xóa khỏi danh sách yêu thích'
            );
        } catch (error) {
            console.error('Error toggling like:', error);
            toast.error('Có lỗi xảy ra, vui lòng thử lại sau');
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="flex flex-col md:flex-row gap-6">
            {/* Poster và Action Buttons */}
            <div className="w-full md:w-[180px] mx-auto md:mx-0">
                {/* Poster với overlay khi hover */}
                <Link href={movie.episodes && movie.episodes.length > 0 ? `/${movie.slug}/${movie.episodes[0].slug}` : '#'}>
                    <div className="relative group">
                        <Image
                            src={getImageUrl(movie.posterUrl || movie.thumbUrl)}
                            alt={movie.name}
                            width={180}
                            height={270}
                            className="w-full h-auto aspect-[2/3] rounded-lg shadow-lg"
                        />

                        {/* Overlay khi hover */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                            <div className="transform scale-75 group-hover:scale-100 transition-transform duration-300">
                                <svg
                                    className="w-16 h-16 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                    />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                        </div>

                        {/* Badge chất lượng */}
                        <div className="absolute top-2 right-2 bg-blue-500/90 backdrop-blur-sm text-white px-2 py-0.5 rounded-md text-xs font-medium">
                            {movie.quality}
                        </div>
                    </div>
                </Link>

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
                        onClick={handleToggleLike}
                        disabled={isLoading}
                        className={`w-full py-2 px-3 rounded-lg text-sm font-medium flex items-center justify-center space-x-2 transition duration-300 ${
                            isLiked
                                ? 'bg-red-500 hover:bg-red-600 text-white'
                                : 'bg-gray-700 hover:bg-gray-600 text-white'
                        }`}
                    >
                        <svg
                            className={`w-4 h-4 ${isLoading ? 'animate-pulse' : ''}`}
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

            {/* Info */}
            <div className="flex-1">
                <h1 className="text-2xl font-bold mb-2">{movie.name}</h1>
                <h2 className="text-gray-400 mb-4">{movie.originName}</h2>

                <div className="space-y-2">
                    <p><span className="text-gray-400">Năm phát hành:</span> {movie.year}</p>
                    <p><span className="text-gray-400">Thời lượng:</span> {movie.duration}</p>
                    <p><span className="text-gray-400">Chất lượng:</span> {movie.quality}</p>
                    <p><span className="text-gray-400">Ngôn ngữ:</span> {movie.language}</p>

                    {/* Categories */}
                    <div>
                        <div>
                            <span className="text-gray-400 mr-2">Thể loại:</span>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {movie.categories.map(category => (
                                    <Link
                                        key={category.id}
                                        href={`/the-loai/${category.slug}`}
                                        className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-full text-sm transition-colors duration-300"
                                    >
                                        {category.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Countries */}
                    <div className="flex flex-wrap gap-2">
                        {movie.countries.map(country => (
                            <span key={country.id} className="text-gray-400">
                                {country.name}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}