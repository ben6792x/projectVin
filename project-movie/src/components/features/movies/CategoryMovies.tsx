// components/features/movies/CategoryMovies.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Movie } from '@/type/Movie';
import { movieService } from '@/service/api';
import LoadingSpinner from '@/components/features/shared/LoadingSpinner';
import MovieCard from '@/components/features/movies/MovieCard';
import Pagination from '@/components/features/shared/Pagination';
import {Category} from "@/type/Category";

interface CategoryMoviesProps {
    initialMovies: Movie[];
    initialTotalPages: number;
    categorySlug: string;
    initialCategoryName?: string;
}

export default function CategoryMovies({
                                           initialMovies,
                                           initialTotalPages,
                                           categorySlug,
                                           initialCategoryName
                                       }: CategoryMoviesProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get('page')) || 1;

    const [movies, setMovies] = useState<Movie[]>(initialMovies);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [totalPages, setTotalPages] = useState(initialTotalPages);
    const [categoryName, setCategoryName] = useState(initialCategoryName || '');

    useEffect(() => {
        const fetchMovies = async () => {
            if (currentPage === 1 && initialMovies.length > 0) {
                return;
            }

            setLoading(true);
            try {
                const response = await movieService.getMoviesByCategory(
                    categorySlug,
                    currentPage - 1,
                    21,
                    'modifiedAt',
                    'desc'
                );

                if (response.status === 'true') {
                    setMovies(response.data.content);
                    setTotalPages(response.data.totalPages);
                    if (!categoryName && response.data.content.length > 0) {
                        const category = response.data.content[0].categories.find(
                            (cat: Category) => cat.slug === categorySlug
                        );
                        if (category) {
                            setCategoryName(category.name);
                        }
                    }
                } else {
                    setError('Không thể tải danh sách phim');
                }
            } catch (error) {
                console.error('Error fetching movies:', error);
                setError('Đã có lỗi xảy ra khi tải danh sách phim');
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, [categorySlug, currentPage, initialMovies, categoryName]);

    const handlePageChange = (newPage: number) => {
        router.push(`/the-loai/${categorySlug}${newPage > 1 ? `?page=${newPage}` : ''}`);
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Breadcrumbs */}
            <nav className="text-sm mb-8" aria-label="Breadcrumb">
                <ol className="list-none p-0 inline-flex">
                    <li className="flex items-center">
                        <Link href="/" className="text-blue-400 hover:text-blue-500">
                            Trang chủ
                        </Link>
                        <span className="mx-2">/</span>
                    </li>
                    <li className="flex items-center">
                        <span className="text-blue-400 hover:text-blue-500">
                            Thể loại
                        </span>
                        <span className="mx-2">/</span>
                    </li>
                    <li>
                        <span className="text-gray-500">{categoryName}</span>
                    </li>
                </ol>
            </nav>

            {/* Header Section */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-white">
                    {categoryName ? `Thể loại: ${categoryName}` : 'Danh sách phim'}
                </h1>
                <div className="text-gray-400 text-sm">
                    Tổng số phim: {movies.length}
                </div>
            </div>

            {/* Error State */}
            {error && (
                <div className="text-center text-red-500 mt-8 bg-red-500/10 p-4 rounded-lg">
                    {error}
                </div>
            )}

            {/* Movies Grid */}
            {!error && (
                <>
                    {movies.length === 0 ? (
                        <div className="text-center text-gray-400 mt-8 bg-gray-800/50 p-8 rounded-lg">
                            Không tìm thấy phim nào trong thể loại này
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-5 justify-center sm:justify-start">
                            {movies.map((movie) => (
                                <MovieCard key={movie.id} movie={movie} />
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-8 flex justify-center">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    )}
                </>
            )}

            {/* SEO Content */}
            <div className="mt-12 prose prose-invert max-w-none">
                <h2>Phim Anime Thể Loại {categoryName}</h2>
                <p>
                    Tổng hợp các bộ phim anime thể loại {categoryName} hay nhất, mới nhất.
                    Với chất lượng HD và vietsub đầy đủ, chúng tôi mang đến cho bạn
                    những trải nghiệm xem phim tuyệt vời nhất.
                </p>
            </div>
        </div>
    );
}