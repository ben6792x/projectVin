// src/app/admin/movies/components/MovieStats.tsx
'use client';

import { useState, useEffect } from 'react';
import {adminMovieService} from "@/service/admin/movieService";


export default function MovieStats() {
    const [stats, setStats] = useState({
        totalMovies: 0,
        totalViews: 0,
        recentlySynced: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await adminMovieService.getMovieStats();
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-gray-500 text-sm font-medium">Tổng số phim</h3>
                <p className="text-3xl font-bold">{stats.totalMovies}</p>
            </div>
            <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-gray-500 text-sm font-medium">Tổng lượt xem</h3>
                <p className="text-3xl font-bold">{stats.totalViews}</p>
            </div>
            <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-gray-500 text-sm font-medium">Mới đồng bộ</h3>
                <p className="text-3xl font-bold">{stats.recentlySynced}</p>
            </div>
        </div>
    );
}