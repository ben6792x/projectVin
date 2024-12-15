'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {Movie} from "@/type/Movie";
import {movieService} from "@/service/movieService";
import {getImageUrl} from "@/app/utils/imageUtils";


interface RelatedMoviesProps {
    currentSlug: string;
}

export default function RelatedMovies({ currentSlug }: RelatedMoviesProps) {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRelatedMovies = async () => {
            try {
                const response = await movieService.getRelatedMovies(currentSlug);
                if (response) {
                    setMovies(response.content);
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRelatedMovies();
    }, [currentSlug]);

    if (loading) {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {[...Array(6)].map((_, index) => (
                    <div key={index} className="animate-pulse">
                        <div className="aspect-[2/3] bg-gray-800 rounded-lg"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (movies.length === 0) return null;

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {movies.map((movie) => (
                <Link
                    key={movie.id}
                    href={`/${movie.slug}`}
                    className="group"
                >
                    <div className="relative rounded-lg overflow-hidden">
                        <div className="aspect-[2/3] relative">
                            <Image
                                src={getImageUrl(movie.posterUrl || movie.thumbUrl)}
                                alt={movie.name}
                                fill
                                sizes="(max-width: 640px) 50vw,
                                       (max-width: 768px) 33vw,
                                       (max-width: 1024px) 25vw,
                                       16vw"
                                className="object-cover transform group-hover:scale-105 transition duration-300"
                            />
                            <div className="absolute top-2 right-2 bg-blue-500/90 backdrop-blur-sm text-white px-2 py-0.5 rounded text-xs font-medium">
                                {movie.quality}
                            </div>
                            {movie.episodeCurrent && (
                                <div className="absolute top-2 left-2 bg-red-500/90 backdrop-blur-sm text-white px-2 py-0.5 rounded text-xs font-medium">
                                    {movie.episodeCurrent}
                                </div>
                            )}
                        </div>
                        <div className="p-2">
                            <h3 className="text-sm font-semibold text-white line-clamp-2 group-hover:text-blue-400 transition">
                                {movie.name}
                            </h3>
                            <p className="text-xs text-gray-400 mt-1">
                                {movie.year}
                            </p>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
}