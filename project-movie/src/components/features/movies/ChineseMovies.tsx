// components/features/movies/ChineseMovies.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Movie } from "@/type/Movie";
import { movieService } from '@/service/movieService';
import LoadingSpinner from "@/components/features/shared/LoadingSpinner";
import MovieCard from "@/components/features/movies/MovieCard";
import Pagination from "@/components/features/shared/Pagination";

interface ChineseMoviesProps {
    initialMovies?: Movie[];
}

const ITEMS_PER_PAGE = 28;
interface ChineseMoviesProps {
    initialMovies?: Movie[];
    initialTotalPages?: number;
    initialTotalElements?: number;
}
export default function ChineseMovies({
                                          initialMovies,
                                          initialTotalPages,
                                          initialTotalElements
                                      }: ChineseMoviesProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get('page')) || 1;

    const [movies, setMovies] = useState<Movie[]>(initialMovies || []);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [totalPages, setTotalPages] = useState(initialTotalPages || 0);
    const [totalElements, setTotalElements] = useState(initialTotalElements || 0);

    useEffect(() => {
        console.log('Current Page Changed:', currentPage);

        // Nếu là trang đầu và có initialMovies, không cần fetch lại
        if (currentPage === 1 && initialMovies) {
            console.log('Using initial movies for first page');
            setMovies(initialMovies);
            setTotalPages(initialTotalPages || 0);
            setTotalElements(initialTotalElements || 0);
            return;
        }

        const fetchMovies = async () => {
            console.log('Fetching movies for page:', currentPage);
            setLoading(true);
            try {
                const response = await movieService.getAllChineseMovies(currentPage - 1, ITEMS_PER_PAGE);
                console.log('API Response:', response);

                if (response) {
                    setMovies(response.content);
                    setTotalPages(response.totalPages);
                    setTotalElements(response.totalElements);
                }
            } catch (err) {
                setError('Failed to load Chinese movies');
                console.error('Error fetching movies:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, [currentPage, initialMovies, initialTotalPages, initialTotalElements]);

    const handlePageChange = (newPage: number) => {
        console.log('Changing to page:', newPage);
        if (newPage === 1) {
            router.push('/hoat-hinh-trung-quoc');
        } else {
            router.push(`/hoat-hinh-trung-quoc?page=${newPage}`);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-500">
                {error}
            </div>
        );
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
                    <li>
                        <span className="text-gray-500">Hoạt Hình Trung Quốc</span>
                    </li>
                </ol>
            </nav>

            {/* Header Section */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-blue-500">Phim Hoạt Hình Trung Quốc</h1>
                    <p className="text-gray-400 mt-2">
                        Tổng hợp những bộ phim hoạt hình Trung Quốc hay nhất, mới nhất
                    </p>
                </div>
                <div className="text-gray-400">
                    Tổng số phim: {totalElements}
                </div>
            </div>

            {/* Movie Grid */}
            <div className="flex flex-wrap gap-4">
                {movies.map((movie: Movie) => (
                    <div key={movie.id} className="w-[180px]">
                        <MovieCard movie={movie} />
                    </div>
                ))}
            </div>

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

            {/* SEO Content */}
            <div className="mt-12 prose prose-invert max-w-none">
                <h2>Phim Hoạt Hình Trung Quốc - Donghua Hay Nhất</h2>
                <p>
                    Phim hoạt hình Trung Quốc (Donghua) ngày càng phát triển và được đầu tư mạnh mẽ về mặt hình ảnh,
                    nội dung. Các bộ phim thường được chuyển thể từ tiểu thuyết tu tiên, huyền huyễn nổi tiếng với
                    đồ họa đẹp mắt và cốt truyện hấp dẫn.
                </p>
                <p>
                    Tại đây chúng tôi tổng hợp những bộ phim hoạt hình Trung Quốc mới nhất, hay nhất với chất lượng
                    cao, vietsub, thuyết minh đầy đủ. Các bộ phim được cập nhật thường xuyên, đảm bảo mang đến trải
                    nghiệm xem phim tốt nhất cho người xem.
                </p>
            </div>
        </div>
    );
}