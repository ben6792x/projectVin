/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['phimpandatv.org'],
        unoptimized: true
    },
    async rewrites() {
        return [
            {
                source: '/sitemap.xml',
                destination: 'https://phimpandatv.org/sitemap.xml'
            },
            {
                source: '/robots.txt',
                destination: 'https://phimpandatv.org/robots.txt'
            }
        ]
    }
}

module.exports = nextConfig