'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {Movie} from "@/type/Movie";
import {movieService} from "@/service/movieService";
import LoadingSpinner from "@/components/features/shared/LoadingSpinner";
import Breadcrumbs from "@/components/features/shared/Breadcrumbs";


export default function WatchEpisode() {
    const params = useParams();
    const slug = params?.slug as string;
    const episodeSlug = params?.episode as string;
    const [movie, setMovie] = useState<Movie | null>(null);
    const [loading, setLoading] = useState(true);
    const [viewIncremented, setViewIncremented] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await movieService.getMovieBySlug(slug);
                console.log('Movie data:', response);
                console.log('Episodes:', response.episodes);
                console.log('Episode Slug from params:', episodeSlug);
                setMovie(response);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchData();
        }
    }, [slug]);
    useEffect(() => {
        const incrementView = async () => {
            if (movie && !viewIncremented) {
                try {
                    console.log('Incrementing view for:', slug);
                    await movieService.incrementView(slug);
                    setViewIncremented(true);
                    console.log('View incremented successfully');
                } catch (error) {
                    console.error('Error incrementing view:', error);
                }
            }
        };

        incrementView();
    }, [movie, slug, viewIncremented]);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!movie || !movie.episodes) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                <p>Không tìm thấy phim</p>
            </div>
        );
    }

    // Tìm episode hiện tại
    const currentEpisode = movie.episodes.find(ep => ep.slug === episodeSlug);

    // Debug logs
    console.log('Episode Slug:', episodeSlug);
    console.log('Current Episode:', currentEpisode);
    console.log('All Episodes Slugs:', movie.episodes.map(ep => ep.slug));

    if (!currentEpisode) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                <p>Không tìm thấy tập phim</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <div className="container mx-auto px-4 py-6">
                <div className="max-w-4xl mx-auto mb-4">
                    <Breadcrumbs
                        country={movie.countries[0]}
                        movieName={movie.name}
                        episodeName={currentEpisode.name}
                    />
                </div>
                {/* Video Player - Thêm max-w-4xl và mx-auto để giới hạn chiều rộng và căn giữa */}
                <div className="max-w-4xl mx-auto">
                    <div className="aspect-video bg-black rounded-lg overflow-hidden mb-6">
                        <iframe
                            src={currentEpisode.linkEmbed}
                            className="w-full h-full"
                            title={`${movie.name} - ${currentEpisode.name}`}
                            allowFullScreen
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        />
                    </div>
                </div>

                {/* Movie Info - Cũng thêm max-w-4xl để đồng bộ với player */}
                <div className="max-w-4xl mx-auto">
                    <div className="bg-gray-800 rounded-lg p-4">
                        <h1 className="text-xl font-bold mb-2">{movie.name}</h1>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                            <span>{currentEpisode.name}</span>
                            <span>{currentEpisode.serverName}</span>
                        </div>
                    </div>
                </div>

                {/* Episodes List */}
                <div className="mt-6">
                    <h2 className="text-lg font-semibold mb-3">Danh sách tập</h2>
                    <div
                        className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-2">
                        {movie.episodes.map((ep) => (
                            <Link
                                key={ep.id}
                                href={`/${movie.slug}/${ep.slug}`}
                                className={`px-3 py-2 rounded text-sm font-medium text-center transition
                                ${ep.slug === episodeSlug
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                                }`}
                            >
                                {ep.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}