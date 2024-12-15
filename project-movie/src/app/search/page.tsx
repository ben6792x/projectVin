'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Movie } from "@/type/Movie";
import { movieService } from "@/service/movieService";
import LoadingSpinner from "@/components/features/shared/LoadingSpinner";
import MovieCard from "@/components/features/movies/MovieCard";
import Pagination from "@/components/features/shared/Pagination";

const ITEMS_PER_PAGE = 24;

export default function SearchPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q');
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!query) return;
            try {
                setLoading(true);
                const results = await movieService.searchMovies(query);
                setMovies(results);
                setCurrentPage(1);
            } catch (error) {
                console.error('Error searching movies:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [query]);

    const totalPages = Math.ceil(movies.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentMovies = movies.slice(startIndex, endIndex);

    if (loading) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-6">
            {/* Header gọn hơn */}
            <div className="mb-6">
                <h1 className="text-xl text-white mb-2">
                    Kết quả tìm kiếm cho: <span className="text-blue-500">"{query}"</span>
                    <span className="text-gray-400 text-sm ml-2">({movies.length} kết quả)</span>
                </h1>
            </div>

            {movies.length === 0 ? (
                <div className="text-center text-gray-400 py-12">
                    <p>Không tìm thấy kết quả nào cho "{query}"</p>
                </div>
            ) : (
                <>
                    {/* Điều chỉnh container để match với MovieCard */}
                    <div className="flex flex-wrap gap-4">
                        {currentMovies.map((movie) => (
                            <div key={movie.id} className="w-[180px]">
                                <MovieCard movie={movie} />
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="mt-8 flex justify-center">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
}