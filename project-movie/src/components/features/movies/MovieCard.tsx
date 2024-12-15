// src/components/features/movies/MovieCard.tsx

import Link from 'next/link';
import Image from 'next/image';
import { Movie } from "@/type/Movie";
import { getImageUrl } from "@/app/utils/imageUtils";

interface MovieCardProps {
    movie: Movie;
    showViews?: boolean;
}

export default function MovieCard({ movie, showViews = false }: MovieCardProps) {
    return (
        <Link href={`/${movie.slug}`}>
            <div className="w-[180px] h-[340px] bg-gray-800 rounded-lg overflow-hidden group">
                {/* Poster Container với lazy loading */}
                <div className="relative w-[180px] h-[260px] overflow-hidden bg-gray-900">
                    <Image
                        src={getImageUrl(movie.posterUrl || movie.thumbUrl)}
                        alt={movie.name}
                        fill
                        sizes="180px"
                        className="object-cover transform-gpu group-hover:scale-110 transition-transform duration-300"
                        loading="lazy" // Thêm lazy loading
                        placeholder="blur" // Thêm placeholder
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQdHx4eHRoaHSQrJyEwPENDPzE2O0FBNi5QWUE5RjpFQUtgUk9GTVdZWkFUY19iWmJJYVn/2wBDARUXFyAeIBogHB4gICBZPjA+WVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVn/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=" // Thêm base64 blur image
                    />
                    <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2.5 py-1 rounded shadow-lg z-10">
                        {movie.quality}
                    </div>

                    <span className="absolute top-2 right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2.5 py-1 rounded shadow-lg z-10">
                        {movie.episodeCurrent}
                    </span>

                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center z-20">
                        <svg
                            className="w-16 h-16 text-white opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                            />
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                </div>

                <div className="p-3 h-[80px] flex flex-col justify-between">
                    <h3 className="text-white text-[15px] font-medium line-clamp-2">
                        {movie.name}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>{movie.year}</span>
                        {showViews && (
                            <span>{movie.views.toLocaleString()} lượt xem</span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}