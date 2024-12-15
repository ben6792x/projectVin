import { Metadata } from 'next';
import { movieService } from "@/service/movieService";
import {Episode} from "@/type/Episode";

interface Props {
    params: {
        slug: string;
        episode: string;
    };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const movie = await movieService.getMovieBySlug(params.slug);
    // Thêm kiểu Episode cho ep
    const episode = movie.episodes.find((ep: Episode) => ep.slug === params.episode);

    const title = `${movie.name} - ${episode?.name} | Anime3D`;
    const description = `Xem phim ${movie.name} ${episode?.name} vietsub chất lượng cao HD. 
        ${movie.originName} [${movie.quality}] tại Anime3D.Online`;

    return {
        title,
        description,
        keywords: [
            movie.name,
            movie.originName,
            episode?.name,
            'xem phim online',
            'vietsub',
            movie.quality,
            'anime 3d'
        ].join(', '),
        openGraph: {
            title,
            description,
            type: 'video.episode',
            url: `https://anime3d.online/${movie.slug}/${episode?.slug}`,
            images: [
                {
                    url: movie.posterUrl || movie.thumbUrl,
                    width: 1200,
                    height: 630,
                    alt: `${movie.name} ${episode?.name}`,
                }
            ],
            siteName: 'Anime3D.Online',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [movie.posterUrl || movie.thumbUrl],
        },
        alternates: {
            canonical: `https://anime3d.online/${movie.slug}/${episode?.slug}`,
        },
    };
}

export default function WatchLayout({
                                        children,
                                    }: {
    children: React.ReactNode;
}) {
    return children;
}