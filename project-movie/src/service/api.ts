import axios from 'axios';
import config from "@/config";


const api = axios.create({
    baseURL: config.API.BASE_URL,
    timeout: 3000000,
    withCredentials: false,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Add request interceptor
api.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        // Log request config để debug
        console.log('Request Config:', {
            url: config.url,
            method: config.method,
            headers: config.headers,
            baseURL: config.baseURL
        });
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Log detailed error
        console.error('API Error:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
            config: {
                url: error.config?.url,
                method: error.config?.method,
                baseURL: error.config?.baseURL,
                headers: error.config?.headers
            }
        });

        if (typeof window !== 'undefined' && error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const API_ENDPOINTS = {
    MOVIES: '/movies',
    MOVIE_DETAIL: (slug: string) => `/movies/${slug}`,
    SITEMAP: '/sitemap.xml.xml',
    ROBOTS: '/robotsTxt.txt',
    CATEGORIES: '/categories',
};

// Movie services
const { ENDPOINTS } = config.API;

// Movie services
export const movieService = {
    getMovies: async (params?: any) => {
        const response = await api.get(ENDPOINTS.PUBLIC.MOVIES, { params });
        return response.data;
    },

    getMovieBySlug: async (slug: string) => {
        const response = await api.get(ENDPOINTS.PUBLIC.MOVIE_DETAIL(slug));
        return response.data;
    },

    getCategories: async () => {
        const response = await api.get(ENDPOINTS.PUBLIC.CATEGORIES);
        return response.data;
    },

    getMoviesByCategory: async (
        slug: string,
        page = config.PAGINATION.DEFAULT_PAGE,
        size = config.PAGINATION.DEFAULT_PAGE_SIZE,
        sortBy = 'modifiedAt',
        direction = 'desc'
    ) => {
        const response = await api.get(ENDPOINTS.PUBLIC.MOVIES_BY_CATEGORY(slug), {
            params: {
                page,
                size,
                sortBy,
                direction
            }
        });
        return response.data;
    }
};


export default api;