// src/config/index.ts
const config = {
    API: {
        BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'https://phimpandatv.org',
        IMAGE_BASE_URL: 'https://phimpandatv.org/',
        ENDPOINTS: {
            AUTH: {
                LOGIN: '/api/auth/login'
            },
            ADMIN: {
                MOVIES: '/api/v1/movies',
                SYNC_MOVIES: '/api/v1/movies/sync-by-slugs',
                MOVIE_STATS: '/api/v1/movies/stats',
            },
            PUBLIC: {
                MOVIES: '/api/public/movies',
                MOVIE_SLIDES: '/api/public/movies/slides',
                MOVIE_DETAIL: (slug: string) => `/api/public/movies/slug/${slug}`,
                TOGGLE_LIKE: (slug: string) => `/api/public/movies/${slug}/like`,
                LIKED_MOVIES: '/api/public/movies/liked',
                SITEMAP: '/sitemap.xml.xml',
                ROBOTS: '/robots.txt',
                CATEGORIES: '/api/public/movies/category',
                MOVIES_BY_CATEGORY: (slug: string) => `/api/public/movies/category/${slug}`,
            },
        }
    },
    PAGINATION: {
        DEFAULT_PAGE_SIZE: 10,
        DEFAULT_PAGE: 0
    },
    IMAGE: {
        FALLBACK: '/images/no-image.png'
    }
};

export default config;