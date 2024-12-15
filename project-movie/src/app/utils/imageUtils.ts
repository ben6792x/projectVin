// src/utils/imageUtils.ts
import config from '@/config';

export const getImageUrl = (path: string | undefined | null): string => {
    if (!path) return config.IMAGE.FALLBACK;
    if (path.startsWith('http')) return path;
    // Loại bỏ dấu / ở đầu path nếu có và dấu / ở cuối IMAGE_BASE_URL
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    const baseUrl = config.API.IMAGE_BASE_URL.endsWith('/')
        ? config.API.IMAGE_BASE_URL.slice(0, -1)
        : config.API.IMAGE_BASE_URL;
    return `${baseUrl}/${cleanPath}`;
};