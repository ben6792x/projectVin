// src/app/robotsTxt.txt/route.ts




import {seoService} from "@/service/seoService";

export async function GET() {
    try {
        const robots = await seoService.getRobots();

        return new Response(robots, {
            headers: {
                'Content-Type': 'text/plain',
                'Cache-Control': 'public, max-age=3600',
            },
        });
    } catch (error) {
        console.error('Robots.txt generation error:', error);
        return new Response('Error generating robotsTxt.txt', {
            status: 500,
        });
    }
}