// src/app/admin/slides/page.tsx


import SlideMovies from "@/app/admin/movies/components/SlideMovies";

export default function SlidesPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">Quản lý Slide</h1>
            </div>
            <SlideMovies />
        </div>
    );
}