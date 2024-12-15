// src/services/seoService.ts
import api from './api';
import axios from "axios";
import config from "@/config";

export const seoService = {
    getSitemap: async () => {
        try {
            const sitemapUrl = `${config.API.BASE_URL}/sitemap.xml`;
            console.log('=== Sitemap Request Debug ===');
            console.log('Config BASE_URL:', config.API.BASE_URL);
            console.log('Full Sitemap URL:', sitemapUrl);
            console.log('Headers:', {
                'Accept': 'application/xml, text/xml, */*',
                'User-Agent': 'Mozilla/5.0',
            });

            const response = await axios.get(sitemapUrl, {
                headers: {
                    'Accept': 'application/xml, text/xml, */*',
                    'User-Agent': 'Mozilla/5.0',
                },
                baseURL: undefined
            });

            console.log('Response Status:', response.status);
            console.log('Response Headers:', response.headers);
            console.log('Response Data Preview:', response.data.substring(0, 200));
            console.log('=== End Debug ===');

            return response.data;
        } catch (error: any) {
            console.error('=== Sitemap Error Debug ===');
            console.error('Error Message:', error.message);
            console.error('Error Status:', error.response?.status);
            console.error('Error Response:', error.response?.data);
            console.error('Request URL:', `${config.API.BASE_URL}/sitemap.xml`);
            console.error('=== End Error Debug ===');
            throw error;
        }
    },

    getRobots: async () => {
        try {
            const response = await axios.get(`${config.API.BASE_URL}/robots.txt`, {
                headers: {
                    'Accept': 'text/plain',
                    'User-Agent': 'Mozilla/5.0',
                },
                baseURL: undefined
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching robots:', error);
            throw error;
        }
    }
};