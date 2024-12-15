
'use client';

import {useEffect, useRef, useState} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { movieService } from '@/service/movieService';
import config from '@/config';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';  // Thêm dòng này
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import {Movie} from "@/type/Movie";
import {getImageUrl} from "@/app/utils/imageUtils";
import LoadingSpinner from "@/components/features/shared/LoadingSpinner";



export default function MovieSlider() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [imageLoading, setImageLoading] = useState<{ [key: string]: boolean }>({});
    const [error, setError] = useState('');
    const swiperRef = useRef<SwiperType | null>(null);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const data = await movieService.getMovieSlides();
                setMovies(data);
            } catch (err) {
                setError('Failed to load movies');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, []);

    if (loading) {
        return <div className="h-[500px] animate-pulse bg-gray-800" />;
    }

    if (error) {
        return <div className="text-red-500 text-center p-4">{error}</div>;
    }

    return (
        <div className="container mx-auto px-4 mt-8">
            <div className="swiper-container-wrapper">
                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    slidesPerView={8}
                    spaceBetween={8}
                    loop={true}
                    speed={800}
                    effect="slide"
                    navigation={{
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    }}
                    pagination={{
                        el: '.swiper-pagination',
                        clickable: true,
                    }}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                    }}
                    breakpoints={{
                        320: {
                            slidesPerView: 2,
                            spaceBetween: 8
                        },
                        640: {
                            slidesPerView: 4,
                            spaceBetween: 10
                        },
                        768: {
                            slidesPerView: 5,
                            spaceBetween: 10
                        },
                        1024: {
                            slidesPerView: 6,
                            spaceBetween: 10
                        },
                        1280: {
                            slidesPerView: 8,
                            spaceBetween: 10
                        }
                    }}
                    onSwiper={(swiper) => {
                        swiperRef.current = swiper;
                    }}
                    onMouseEnter={() => {
                        if (swiperRef.current?.autoplay) {
                            swiperRef.current.autoplay.stop();
                        }
                    }}
                    onMouseLeave={() => {
                        if (swiperRef.current?.autoplay) {
                            swiperRef.current.autoplay.start();
                        }
                    }}
                >
                    {movies.map((movie) => (
                        <SwiperSlide key={movie.id} className="px-1">
                            <Link href={`/${movie.slug}`}>
                                <div className="relative group movie-card shadow-lg">
                                    {/* Loading Spinner.tsx Container */}
                                    {imageLoading[movie.id] && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 z-20">
                                            <LoadingSpinner />
                                        </div>
                                    )}
                                    <Image
                                        src={getImageUrl(movie.posterUrl || movie.thumbUrl)}
                                        alt={movie.name || 'Movie Poster'}
                                        width={300}
                                        height={450}
                                        className={`
                                            w-full h-full object-cover transition-all duration-300 
                                            group-hover:scale-105
                                            ${imageLoading[movie.id] ? 'opacity-0' : 'opacity-100'}
                                        `}
                                        loading="lazy"
                                        placeholder="blur"
                                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQrJyEwPENDPzE2O0FBNi5QWUE5RjpFQUtgUk9GTVdZWkFUY19iWmJJYVn/2wBDARUXFyAeIBogHB4gICBZPjA+WVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVn/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                                        onLoadingComplete={() => {
                                            setImageLoading(prev => ({
                                                ...prev,
                                                [movie.id]: false
                                            }));
                                        }}
                                        onLoadStart={() => {
                                            setImageLoading(prev => ({
                                                ...prev,
                                                [movie.id]: true
                                            }));
                                        }}
                                    />
                                    <div className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold z-10">
                                        {movie.episodeCurrent} [{movie.quality}]
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 p-3 movie-overlay z-10">
                                        <h3 className="text-base font-bold text-white mb-1 line-clamp-1">
                                            {movie.name}
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {/* Chỉ lấy 2 categories đầu tiên */}
                                            {movie.categories.slice(0, 2).map((category) => (
                                                <span
                                                    key={category.id}
                                                    className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded"
                                                >
                                                    {category.name}
                                                </span>
                                            ))}
                                            {/* Hiển thị số categories còn lại nếu có */}
                                            {movie.categories.length > 2 && (
                                                <span className="text-white text-xs">
                                                    +{movie.categories.length - 2}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            <div className="text-gray-400 mt-4 p-4 bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-6">
                    <Image
                        src="/images/icon_tv.png"
                        alt="YanHH3D.TV Icon"
                        width={80}
                        height={80}
                        className="rounded-lg"
                    />
                    <div className="flex-1">
                        <h2 className="text-xl font-bold text-blue-500 mb-2">
                            Hoạn Nghênh Đạo Hữu Đã Ghé Thăm YanHH3D
                        </h2>
                        <p className="text-base">
                            Bảo danh tại đây
                            <Link href="/login"
                                  className="text-blue-500 hover:text-blue-400 transition duration-300 mx-1">
                                Đăng nhập
                            </Link>
                            để sử dụng các chức năng: Bỏ quảng cáo, Phim yêu thích, Lịch sử xem, Bình luận ...
                            <br />
                            Chưa nhập môn ?
                            <Link href="/register" className="text-green-500 hover:text-green-400 transition duration-300 ml-1">
                                Đăng ký ngay
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}