// src/app/hoat-hinh-trung-quoc/page.tsx
import { Metadata } from 'next';
import ChineseMovies from '@/components/features/movies/ChineseMovies';
import { movieService } from '@/service/movieService';
import MovieListSchema from "@/components/features/shared/MovieListSchema";

export const metadata: Metadata = {
    title: 'Phim Hoạt Hình Trung Quốc | Donghua Mới Nhất | Anime3D',
    description: 'Xem phim hoạt hình Trung Quốc (Donghua) mới nhất 2024, chất lượng HD, vietsub, thuyết minh. Tổng hợp các bộ donghua hay nhất, nổi tiếng nhất tại Anime3D.',
    keywords: [
        'hoạt hình trung quốc',
        'donghua',
        'phim hoạt hình',
        'donghua vietsub',
        'donghua mới nhất',
        'donghua HD',
        'xem donghua online',
        'donghua hay nhất'
    ].join(', '),
    openGraph: {
        title: 'Phim Hoạt Hình Trung Quốc | Donghua Mới Nhất',
        description: 'Xem phim hoạt hình Trung Quốc, donghua mới nhất, chất lượng cao HD, vietsub, thuyết minh.',
        type: 'website',
        url: 'https://anime3d.online/hoat-hinh-trung-quoc',
        siteName: 'Anime3D.Online',
        images: [
            {
                url: 'https://anime3d.online/og-chinese-anime.jpg',
                width: 1200,
                height: 630,
                alt: 'Hoạt Hình Trung Quốc - Anime3D',
            }
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Phim Hoạt Hình Trung Quốc | Donghua Mới Nhất',
        description: 'Xem phim hoạt hình Trung Quốc, donghua mới nhất, chất lượng cao HD.',
        images: ['https://anime3d.online/og-chinese-anime.jpg'],
    },
    alternates: {
        canonical: 'https://anime3d.online/hoat-hinh-trung-quoc',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
};

export default async function ChineseMoviesPage() {
    try {
        const response = await movieService.getAllChineseMovies(0, 28);
        const movies = response?.content || [];
        const totalPages = response?.totalPages || 0;
        const totalElements = response?.totalElements || 0;

        return (
            <>
                <MovieListSchema
                    movies={movies}
                    type="ChineseAnime"
                    title="Phim Hoạt Hình Trung Quốc"
                    description="Danh sách phim hoạt hình Trung Quốc mới nhất"
                />
                <ChineseMovies
                    initialMovies={movies}
                    initialTotalPages={totalPages}
                    initialTotalElements={totalElements}
                />
            </>
        );
    } catch (error) {
        console.error('Error loading Chinese movies:', error);
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-500 mb-4">
                        Đã có lỗi xảy ra
                    </h1>
                    <p className="text-gray-400">
                        Không thể tải danh sách phim. Vui lòng thử lại sau.
                    </p>
                </div>
            </div>
        );
    }
}