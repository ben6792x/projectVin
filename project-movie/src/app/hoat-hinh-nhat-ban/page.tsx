// src/app/hoat-hinh-nhat-ban/page.tsx
import { Metadata } from 'next';
import JapaneseAnime from '@/components/features/movies/JapaneseAnime';
import Link from 'next/link';
import MovieListSchema from "@/components/features/shared/MovieListSchema";
import {Movie} from "@/type/Movie";
import {movieService} from "@/service/movieService";
interface JapaneseAnimeProps {
    movies: Movie[];
}
export const metadata: Metadata = {
    title: 'Phim Hoạt Hình Nhật Bản | Anime Nhật Bản Mới Nhất | Anime3D',
    description: 'Xem phim hoạt hình Nhật Bản, anime Nhật Bản mới nhất 2024, chất lượng HD, vietsub, thuyết minh. Tổng hợp các bộ anime hay nhất, nổi tiếng nhất tại Anime3D.',
    keywords: [
        'hoạt hình nhật bản',
        'anime nhật bản',
        'phim hoạt hình',
        'anime vietsub',
        'anime mới nhất',
        'anime HD',
        'xem anime online',
        'anime hay nhất'
    ].join(', '),
    openGraph: {
        title: 'Phim Hoạt Hình Nhật Bản | Anime Nhật Bản Mới Nhất',
        description: 'Xem phim hoạt hình Nhật Bản, anime Nhật Bản mới nhất, chất lượng cao HD, vietsub, thuyết minh.',
        type: 'website',
        url: 'https://anime3d.online/hoat-hinh-nhat-ban',
        siteName: 'Anime3D.Online',
        images: [
            {
                url: 'https://anime3d.online/og-japanese-anime.jpg',
                width: 1200,
                height: 630,
                alt: 'Hoạt Hình Nhật Bản - Anime3D',
            }
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Phim Hoạt Hình Nhật Bản | Anime Nhật Bản Mới Nhất',
        description: 'Xem phim hoạt hình Nhật Bản, anime Nhật Bản mới nhất, chất lượng cao HD.',
        images: ['https://anime3d.online/og-japanese-anime.jpg'],
    },
    alternates: {
        canonical: 'https://anime3d.online/hoat-hinh-nhat-ban',
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

export default async function JapaneseAnimePage() {
    try {
        const response = await movieService.getAllJapaneseMovies(0, 28);
        const movies = response?.content || [];
        const totalPages = response?.totalPages || 0;
        const totalElements = response?.totalElements || 0;

        return (
            <>
                <MovieListSchema
                    movies={movies}
                    type="JapaneseAnime"
                    title="Phim Hoạt Hình Nhật Bản"
                    description="Danh sách phim hoạt hình Nhật Bản mới nhất"
                />

                <div className="container mx-auto px-4">
                    <JapaneseAnime
                        initialMovies={movies}
                        initialTotalPages={totalPages}
                        initialTotalElements={totalElements}
                    />
                </div>
            </>
        );
    } catch (error) {
        console.error('Error loading Japanese anime:', error);
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