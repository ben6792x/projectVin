// components/shared/MetaTags.tsx
import { Movie } from '@/type/Movie';
import Head from "next/head";


interface MetaTagsProps {
    movie: Movie;
    currentUrl: string;
}

export default function MovieMetaTags({ movie, currentUrl }: MetaTagsProps) {
    const title = `${movie.name} (${movie.originName}) [${movie.quality}] | Anime3D`;
    const description = `Xem phim ${movie.name} (${movie.originName}) ${movie.year} - ${movie.episodeCurrent} 
        vietsub chất lượng ${movie.quality}. Thể loại: ${movie.categories.map(c => c.name).join(', ')}`;

    const keywords = [
        movie.name,
        movie.originName,
        `${movie.name} vietsub`,
        `${movie.originName} vietsub`,
        movie.categories.map(c => c.name).join(', '),
        'anime 3d',
        'hoạt hình',
        movie.quality,
        movie.year.toString()
    ].join(', ');

    return (
        <Head>
            {/* Basic Meta Tags */}
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />

            {/* Open Graph */}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={movie.posterUrl || movie.thumbUrl} />
            <meta property="og:type" content="video.movie" />
            <meta property="og:url" content={currentUrl} />
            <meta property="og:site_name" content="Anime3D.Online" />

            {/* Additional Movie Meta */}
            <meta property="video:duration" content={movie.duration} />
            <meta property="video:release_date" content={movie.year.toString()} />
            <meta property="video:series" content="true" />
            <meta property="video:tag" content={movie.categories.map(c => c.name).join(', ')} />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={movie.posterUrl || movie.thumbUrl} />

            {/* Canonical URL */}
            <link rel="canonical" href={currentUrl} />

            {/* Additional Meta */}
            <meta name="author" content="Anime3D.Online" />
            <meta name="robots" content="index, follow" />
            <meta name="language" content={movie.language} />
            <meta name="revisit-after" content="1 days" />
            <meta name="rating" content="general" />
        </Head>
    );
}