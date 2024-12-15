

import MovieSlider from "@/components/features/home/MovieSlider";
import LatestMovies from "@/components/features/home/LatestMovies";
import ChineseMovies from "@/components/features/home/ChineseMovies";
import JapaneseMovies from "@/components/features/home/JapaneseMovies";
import MovieSchedule from "@/components/features/home/MovieSchedule";

export default async function Home() {

    return (
        <main className="min-h-screen bg-gray-900">
            <MovieSlider />
            <LatestMovies />
            <ChineseMovies />
            <JapaneseMovies />
            <MovieSchedule />
        </main>
    );
}