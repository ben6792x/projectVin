// src/services/admin/movieService.ts



import {MoviePageResponse} from "@/type/MoviePageResponse";
import {Movie} from "@/type/Movie";
import api from "@/service/api";
import config from "@/config";
import {Schedule} from "@/type/Schedule";
import axios from "axios";
import {ApiResponse} from "@/type/ApiResponse";



interface SyncResult {
    successMessages: string[];
}
interface SyncOptions {
    onProgress?: (progress: SyncProgress[]) => void;
}
export const adminMovieService = {
    getMovies: async (page: number = 0, size: number = 10) => {
        try {
            const response = await api.get<ApiResponse<MoviePageResponse>>(
                config.API.ENDPOINTS.ADMIN.MOVIES,
                {
                    params: {
                        page,
                        size
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching movies:', error);
            throw error;
        }
    },

    syncMovies: async (slugs: string[]): Promise<SyncResult> => {
        try {
            const BATCH_SIZE = 20; // Xử lý 20 phim mỗi lần
            const allResults: string[] = [];

            // Chia thành các batch nhỏ
            for (let i = 0; i < slugs.length; i += BATCH_SIZE) {
                const batchSlugs = slugs.slice(i, i + BATCH_SIZE);

                try {
                    const response = await api.post<ApiResponse<string[]>>(
                        config.API.ENDPOINTS.ADMIN.SYNC_MOVIES,
                        { slugs: batchSlugs },
                        {
                            timeout: 300000, // Giữ nguyên 5 phút cho mỗi batch
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem('token')}`
                            }
                        }
                    );

                    if (response.data.data) {
                        allResults.push(...response.data.data);
                    }

                    // Thêm delay giữa các batch
                    if (i + BATCH_SIZE < slugs.length) {
                        await new Promise(resolve => setTimeout(resolve, 2000));
                    }
                } catch (error) {
                    console.error(`Error syncing batch ${i / BATCH_SIZE + 1}:`, error);
                }
            }

            return {
                successMessages: allResults
            };

        } catch (error) {
            console.error('Error syncing movies:', error);
            throw error;
        }
    },

    getMovieStats: async () => {
        try {
            const response = await api.get(config.API.ENDPOINTS.ADMIN.MOVIE_STATS);
            return response.data;
        } catch (error) {
            console.error('Error fetching movie stats:', error);
            throw error;
        }
    },
    toggleSlide: async (movieId: string) => {
        try {
            const response = await api.put<ApiResponse<Movie>>(
                `${config.API.ENDPOINTS.ADMIN.MOVIES}/${movieId}/toggle-slide`
            );
            return response.data;
        } catch (error) {
            console.error('Error toggling slide:', error);
            throw error;
        }
    },
    getSlideMovies: async () => {
        try {
            const response = await api.get<ApiResponse<Movie[]>>(
                `${config.API.ENDPOINTS.ADMIN.MOVIES}/slides`
            );
            return response.data;
        } catch (error) {
            console.error('Error getting slide movies:', error);
            throw error;
        }
    },
    deleteMovie: async (slug: string) => {
        try {
            // Log thông tin để debug
            const token = localStorage.getItem('token');
            console.log('Deleting movie with slug:', slug);
            console.log('Using token:', token);

            const response = await api.delete<ApiResponse<null>>(
                `${config.API.ENDPOINTS.ADMIN.MOVIES}/${slug}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.status === "true") {
                console.log('Movie deleted successfully');
                return response.data;
            }

            throw new Error(response.data.message || 'Failed to delete movie');

        } catch (error) {
            console.error('Error deleting movie:', error);

            if (axios.isAxiosError(error)) {
                switch (error.response?.status) {
                    case 403:
                        throw new Error('Bạn không có quyền xóa movie');
                    case 404:
                        throw new Error('Không tìm thấy movie');
                    case 500:
                        throw new Error('Lỗi server khi xóa movie');
                    default:
                        throw new Error('Có lỗi xảy ra khi xóa movie');
                }
            }

            throw error;
        }
    }
};