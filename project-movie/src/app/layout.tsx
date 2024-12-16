import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from "@/components/layout/Header";
import {AuthProvider} from "@/app/contexts/AuthContext";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    metadataBase: new URL('https://anime3d.online'),
    title: {
        default: 'Anime3D - Xem Phim Anime 3D Vietsub HD Online',
        template: '%s | Anime3D'
    },
    description: 'Anime3D - Website xem phim anime 3D, hoạt hình Trung Quốc vietsub HD miễn phí. Kho phim anime 3D đồ họa đẹp, cập nhật nhanh và đầy đủ nhất.',
    keywords: 'anime 3d, phim hoạt hình 3d, anime trung quốc, donghua, phim anime vietsub, anime3d.online, hoạt hình 3d trung quốc, xem anime online, phim hoạt hình mới nhất',
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    verification: {
        google: 'google-site-verification=hsP7YKkVne7JIKIWoak3RDCLXyalV3t5ThNTzL_8ACk',
    },
    alternates: {
        canonical: 'https://anime3d.online'
    },
    openGraph: {
        siteName: 'Anime3D',
        type: 'website',
        locale: 'vi_VN',
        url: 'https://anime3d.online',
        title: 'Anime3D - Xem Phim Anime 3D Vietsub HD Online',
        description: 'Anime3D - Website xem phim anime 3D, hoạt hình Trung Quốc vietsub HD miễn phí. Kho phim anime 3D đồ họa đẹp, cập nhật nhanh và đầy đủ nhất.',
        images: [
            {
                url: 'https://anime3d.online/og-image.jpg', // Thêm ảnh OG của bạn
                width: 1200,
                height: 630,
                alt: 'Anime3D - Xem Phim Anime 3D Online',
            }
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Anime3D - Xem Phim Anime 3D Vietsub HD Online',
        description: 'Anime3D - Website xem phim anime 3D, hoạt hình Trung Quốc vietsub HD miễn phí. Kho phim anime 3D đồ họa đẹp, cập nhật nhanh và đầy đủ nhất.',
        images: ['https://anime3d.online/og-image.jpg'],
    },
    authors: [{ name: 'Anime3D' }],
    creator: 'Anime3D',
    publisher: 'Anime3D',
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="vi">
        <head>
            <link rel="icon" href="/favicon.ico" />
            <meta name="theme-color" content="#111827" /> {/* Màu theme cho mobile */}
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        </head>
        <body className={`${inter.className} bg-gray-900 min-h-screen`}>
        <AuthProvider>
            <Header/>
            <main>{children}</main>
        </AuthProvider>
        </body>
        </html>
    )
}