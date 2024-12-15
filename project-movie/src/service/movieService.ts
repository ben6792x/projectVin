import axios from 'axios';
import {Movie} from "@/type/Movie";
import index from '@/config';
import api from "@/service/api";
import {Schedule} from "@/type/Schedule";
import {PageResponse} from "@/type/MovieResponse";
import {isBrowser} from "@/app/utils/browser";
import config from "@/config";





interface ApiResponse<T> {
    status: string;
    data: T;
}
const getToken = () => {
    if (isBrowser()) {
        return localStorage.getItem('token');
    }
    return null;
};
const { ENDPOINTS } = config.API;

const API_URL = `${index.API.BASE_URL}${index.API.ENDPOINTS.PUBLIC.MOVIES}`;

export const movieService = {
    async getMovieSlides(): Promise<Movie[]> {
        try {
            const response = await axios.get<ApiResponse<Movie[]>>(
                `${index.API.BASE_URL}${index.API.ENDPOINTS.PUBLIC.MOVIE_SLIDES}`
            );
            return response.data.data;
        } catch (error) {
            console.error('Error fetching movie slides:', error);
            throw error;
        }
    },
    getLatestMovies: async () => {
        try {
            const response = await api.get<ApiResponse<Movie[]>>('/api/public/movies/latest');
            return response.data.data;
        } catch (error) {
            console.error('Error fetching latest movies:', error);
            throw error;
        }
    },
    getTopMoviesByViews: async () => {
        try {
            const response = await api.get<ApiResponse<Movie[]>>('/api/public/movies/top-views');
            return response.data.data;
        } catch (error) {
            console.error('Error fetching top movies:', error);
            throw error;
        }
    },
    getChineseMovies: async () => {
        try {
            const response = await api.get<ApiResponse<Movie[]>>('/api/public/movies/chinese');
            return response.data.data;
        } catch (error) {
            console.error('Error fetching Chinese movies:', error);
            return [];
        }
    },
    getJapaneseMovies: async () => {
        try {
            const response = await api.get<ApiResponse<Movie[]>>('/api/public/movies/japanese');
            return response.data.data;
        } catch (error) {
            console.error('Error fetching Japanese movies:', error);
            return [];
        }
    },
    getAllSchedules: async () => {
        try {
            const response = await api.get<ApiResponse<Schedule[]>>('/api/public/schedules');
            return response.data.data;
        } catch (error) {
            console.error('Error fetching schedules:', error);
            return [];
        }
    },
    getAllChineseMovies: async (page: number = 0, size: number = 28) => {
        try {
            const response = await api.get<ApiResponse<PageResponse<Movie>>>(
                `/api/public/movies/chinese/all?page=${page}&size=${size}`
            );
            return response.data.data;
        } catch (error) {
            console.error('Error fetching Chinese movies:', error);
            return null;
        }
    },
    getAllJapaneseMovies: async (page: number = 0, size: number = 28) => {
        try {
            const response = await api.get<ApiResponse<PageResponse<Movie>>>(
                `/api/public/movies/japanese/all?page=${page}&size=${size}`
            );
            return response.data.data;
        } catch (error) {
            console.error('Error fetching Japanese movies:', error);
            return null;
        }
    },

    getMovieBySlug: async (slug: string) => {
        try {
            const response = await api.get(`/api/public/movies/${slug}`);
            console.log('API Response:', response.data); // Thêm log để kiểm tra
            return response.data.data;
        } catch (error) {
            console.error('Error fetching movie:', error);
            throw error;
        }
    },

    getRelatedMovies: async (slug: string, page: number = 0, size: number = 6) => {
        try {
            const response = await api.get<ApiResponse<PageResponse<Movie>>>(
                `/api/public/movies/${slug}/related?page=${page}&size=${size}`
            );
            return response.data.data;
        } catch (error) {
            console.error('Error fetching related movies:', error);
            return null;
        }
    },
    searchMovies: async (query: string): Promise<Movie[]> => {
        try {
            const response = await api.get(`/api/public/movies/search?q=${encodeURIComponent(query)}`);
            return response.data.data;
        } catch (error) {
            console.error('Error searching movies:', error);
            throw error;
        }
    },
    incrementView: async (slug: string): Promise<number> => {
        try {
            const response = await api.post<ApiResponse<number>>(
                `/api/public/movies/${slug}/increment-view`
            );
            return response.data.data;
        } catch (error) {
            console.error('Error incrementing view:', error);
            throw error;
        }
    },
    toggleLike: async (slug: string): Promise<boolean> => {
        try {
            const response = await api.post(ENDPOINTS.PUBLIC.TOGGLE_LIKE(slug));
            return response.data.liked;
        } catch (error) {
            console.error('Error toggling like:', error);
            throw error;
        }
    },

    getLikedMovies: async () => {
        try {
            const response = await api.get(ENDPOINTS.PUBLIC.LIKED_MOVIES);
            return response.data;
        } catch (error) {
            console.error('Error getting liked movies:', error);
            throw error;
        }
    },
    getCategories: async () => {
        try {
            const response = await api.get(ENDPOINTS.PUBLIC.CATEGORIES);
            return response.data;
        } catch (error) {
            console.error('Error getting categories:', error);
            throw error;
        }
    },

    getMoviesByCategory: async (
        slug: string,
        page = config.PAGINATION.DEFAULT_PAGE,
        size = config.PAGINATION.DEFAULT_PAGE_SIZE,
        sortBy = 'modifiedAt',
        direction = 'desc'
    ) => {
        try {
            const response = await api.get(ENDPOINTS.PUBLIC.MOVIES_BY_CATEGORY(slug), {
                params: {
                    page,
                    size,
                    sortBy,
                    direction
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error getting movies by category:', error);
            throw error;
        }
    }
};