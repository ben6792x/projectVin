// app/category/[slug]/page.tsx
import { Metadata } from 'next';
import { movieService } from '@/service/api';
import CategoryMovies from "@/components/features/movies/CategoryMovies";

interface Props {
    params: {
        slug: string;
    };
}

// Generate metadata động dựa trên category
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    try {
        const response = await movieService.getMoviesByCategory(
            params.slug,
            0,
            1,
            'modifiedAt',
            'desc'
        );

        const categoryName = response.data.content[0]?.categories.find(
            (cat: any) => cat.slug === params.slug
        )?.name || 'Phim Anime';

        return {
            title: `${categoryName} | Xem Phim Anime Thể Loại ${categoryName} | Anime3D`,
            description: `Xem phim anime thể loại ${categoryName} mới nhất, chất lượng cao HD, vietsub. 
                Tổng hợp các bộ phim anime hay nhất thuộc thể loại ${categoryName}.`,
            keywords: [
                categoryName,
                `anime ${categoryName}`,
                'phim hoạt hình',
                'anime vietsub',
                'xem anime online'
            ].join(', '),
            openGraph: {
                title: `Phim Anime Thể Loại ${categoryName}`,
                description: `Xem phim anime thể loại ${categoryName} mới nhất, chất lượng cao HD.`,
                type: 'website',
                url: `https://anime3d.online/category/${params.slug}`,
                siteName: 'Anime3D.Online',
            },
            alternates: {
                canonical: `https://anime3d.online/category/${params.slug}`,
            },
        };
    } catch (error) {
        return {
            title: 'Thể Loại Phim Anime | Anime3D',
            description: 'Xem phim anime theo thể loại tại Anime3D',
        };
    }
}

export default async function CategoryPage({ params }: Props) {
    try {
        // Fetch initial data
        const response = await movieService.getMoviesByCategory(
            params.slug,
            0,
            20,
            'modifiedAt',
            'desc'
        );

        const initialMovies = response.data.content;
        const totalPages = response.data.totalPages;
        const categoryName = response.data.content[0]?.categories.find(
            (cat: any) => cat.slug === params.slug
        )?.name;

        return <CategoryMovies
            initialMovies={initialMovies}
            initialTotalPages={totalPages}
            categorySlug={params.slug}
            initialCategoryName={categoryName}
        />;
    } catch (error) {
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