// app/movies/[slug]/page.tsx
import { Metadata } from 'next';
import { movieService } from "@/service/movieService";
import RelatedMovies from "@/components/features/movies/RelatedMovies";
import MovieDetail from "@/components/features/movies/MovieDetail";
import MovieSchema from "@/components/features/movies/MovieSchema";
import Image from 'next/image';
import {getImageUrl} from "@/app/utils/imageUtils";
import Link from "next/link";
import Breadcrumbs from "@/components/features/shared/Breadcrumbs";
import {Category} from "@/type/Category";

interface Props {
    params: {
        slug: string;
    };
}

// Generate Metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const movie = await movieService.getMovieBySlug(params.slug);
    const title = `${movie.name} (${movie.originName}) [${movie.quality}] | Anime3D`;
    const description = `Xem phim ${movie.name} (${movie.originName}) ${movie.year} - ${movie.episodeCurrent} 
        vietsub chất lượng ${movie.quality}. Thể loại: ${movie.categories.map((c: Category) => c.name).join(', ')}`;

    return {
        title,
        description,
        keywords: [
            movie.name,
            movie.originName,
            `${movie.name} vietsub`,
            movie.categories.map((category: Category) => category.name).join(', '),
            'anime 3d',
            'hoạt hình',
            movie.quality,
            movie.year.toString()
        ].join(', '),
        openGraph: {
            title,
            description,
            type: 'video.movie',
            url: `https://anime3d.online/${movie.slug}`,
            images: [
                {
                    url: getImageUrl(movie.posterUrl || movie.thumbUrl),
                    width: 1200,
                    height: 630,
                    alt: movie.name,
                }
            ],
            siteName: 'Anime3D.Online',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [getImageUrl(movie.posterUrl || movie.thumbUrl)],
        },
        alternates: {
            canonical: `https://anime3d.online/${movie.slug}`,
        },
    };
}

export default async function MovieDetailPage({ params }: Props) {
    const movie = await movieService.getMovieBySlug(params.slug);
    const primaryCountry = movie.countries[0];
    return (
        <>
            <MovieSchema movie={movie} />

            <div className="min-h-screen text-white">
                {/* Hero Banner */}
                <div className="relative h-[200px] mb-6">
                    <div className="absolute inset-0 overflow-hidden">
                        <Image
                            src={getImageUrl(movie.posterUrl || movie.thumbUrl)}
                            alt={movie.name}
                            fill
                            className="object-cover object-center opacity-20"
                            priority
                            sizes="100vw"
                            quality={85}
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/90 to-gray-900"></div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="container mx-auto px-4 -mt-[180px] relative z-10">
                    <div className="bg-gray-800/60 backdrop-blur rounded-xl p-5">
                        {/* Chỉ hiển thị Breadcrumbs nếu có country */}
                        {primaryCountry && (
                            <Breadcrumbs
                                country={primaryCountry}
                                movieName={movie.name}
                            />
                        )}

                        <MovieDetail movie={movie}/>
                    </div>

                    {/* Related Movies Section */}
                    <div className="mt-6">
                        <h2 className="text-xl font-bold mb-4">Có thể bạn cũng thích</h2>
                        <RelatedMovies currentSlug={params.slug}/>
                    </div>
                </div>
            </div>
        </>
    );
}