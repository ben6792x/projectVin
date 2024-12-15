// src/app/admin/movies/page.tsx

import MovieList from './components/MovieList';
import Header from "@/components/layout/Header";

export default function MoviesPage() {
    return (
        <>
            <div className="mt-6">
                <MovieList />
            </div>
        </>
    );
}