// components/shared/WebsiteSchema.tsx
export default function WebsiteSchema() {
    const schema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Anime3D",
        "url": "https://anime3d.online",
        "potentialAction": {
            "@type": "SearchAction",
            "target": "https://anime3d.online/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
        }
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}