// components/features/movies/MovieSchema.tsx
import { Movie } from '@/type/Movie';

export default function MovieSchema({ movie }: { movie: Movie }) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "Movie",
        "name": movie.name,
        "alternateName": movie.originName,
        "image": movie.posterUrl || movie.thumbUrl,
        "thumbnailUrl": movie.thumbUrl,
        "dateModified": movie.modifiedAt,
        "duration": movie.duration,
        "inLanguage": movie.language,
        "contentRating": movie.quality,
        "numberOfEpisodes": movie.episodes.length,
        "episodeNumber": movie.episodeCurrent,
        "datePublished": movie.year.toString(),
        "genre": movie.categories.map(cat => cat.name),
        "countryOfOrigin": movie.countries.map(country => ({
            "@type": "Country",
            "name": country.name
        })),
        "interactionStatistic": {
            "@type": "InteractionCounter",
            "interactionType": "https://schema.org/WatchAction",
            "userInteractionCount": movie.views
        },
        "potentialAction": {
            "@type": "WatchAction",
            "target": `https://anime3d.online/${movie.slug}`
        }
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}