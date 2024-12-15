// components/shared/MovieListSchema.tsx
import {Category} from "@/type/Category";
import {Movie} from "@/type/Movie";

interface MovieListSchemaProps {
    movies: Movie[];
    type: string;
    title: string;
    description: string;
}

export default function MovieListSchema({ movies, type, title, description }: MovieListSchemaProps) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": title,
        "description": description,
        "numberOfItems": movies.length,
        "itemListElement": movies.map((movie, index) => ({
            "@type": "Movie",
            "position": index + 1,
            "name": movie.name,
            "url": `https://anime3d.online/${movie.slug}`,
            "image": movie.posterUrl || movie.thumbUrl,
            "datePublished": movie.year.toString(),
            "genre": movie.categories.map((cat: Category) => cat.name),
            "inLanguage": "ja",
            "countryOfOrigin": {
                "@type": "Country",
                "name": "Japan"
            }
        }))
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}