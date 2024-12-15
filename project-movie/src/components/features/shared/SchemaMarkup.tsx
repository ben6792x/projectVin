// components/shared/SchemaMarkup.tsx
export default function SchemaMarkup({ data }: { data: any }) {
    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Anime3D.Online",
        "url": "https://anime3d.online",
        "potentialAction": {
            "@type": "SearchAction",
            "target": "https://anime3d.online/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
        }
    };

    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Anime3D",
        "url": "https://anime3d.online",
        "logo": "https://anime3d.online/logo.png",
        "sameAs": [
            "https://facebook.com/anime3d",
            "https://twitter.com/anime3d"
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
            />
        </>
    );
}