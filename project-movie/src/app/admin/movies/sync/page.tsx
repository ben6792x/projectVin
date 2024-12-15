import SyncMovieForm from "@/app/admin/movies/components/SyncMovieForm";


export default function SyncPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold">Đồng bộ phim</h1>
            <SyncMovieForm />
        </div>
    );
}