// components/features/movies/VideoSchema.tsx


import {Movie} from "@/type/Movie";
import {Episode} from "@/type/Episode";

interface VideoSchemaProps {
    movie: Movie;
    episode: Episode;
}

export default function VideoSchema({ movie, episode }: VideoSchemaProps) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        "name": `${movie.name} - ${episode.name}`,
        "description": `Xem phim ${movie.name} ${episode.name} vietsub HD`,
        "thumbnailUrl": movie.posterUrl || movie.thumbUrl,
        "uploadDate": movie.modifiedAt,
        "duration": movie.duration,
        "embedUrl": episode.linkEmbed,
        "potentialAction": {
            "@type": "WatchAction",
            "target": `https://anime3d.online/${movie.slug}/${episode.slug}`
        }
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}