// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const path = request.nextUrl.pathname;

    // Định nghĩa các routes cần bảo vệ (protected routes)
    const protectedRoutes = ['/admin'];

    // Định nghĩa các routes công khai (public routes)
    const publicRoutes = ['/', '/movies', '/search', '/category'];

    // Các trang auth
    const authRoutes = ['/login', '/register'];

    // Nếu đang ở trang auth và đã đăng nhập -> redirect về home
    if (authRoutes.some(route => path.startsWith(route)) && token) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Nếu là route công khai -> cho phép truy cập
    if (publicRoutes.some(route => path.startsWith(route))) {
        return NextResponse.next();
    }

    // Kiểm tra các protected routes
    if (protectedRoutes.some(route => path.startsWith(route))) {
        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url));
        }

        // Kiểm tra role cho admin routes
        if (path.startsWith('/admin')) {
            try {
                const user = request.cookies.get('user')?.value;
                const userData = user ? JSON.parse(user) : null;
                if (!userData?.roles?.includes('ROLE_ADMIN')) {
                    return NextResponse.redirect(new URL('/', request.url));
                }
            } catch {
                return NextResponse.redirect(new URL('/login', request.url));
            }
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/admin/:path*',
        '/login',
        '/register',
        '/',
        '/movies/:path*'
    ]
};