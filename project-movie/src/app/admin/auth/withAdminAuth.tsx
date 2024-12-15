// app/admin/auth/withAdminAuth.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from "@/app/contexts/AuthContext";

export default function withAdminAuth<P extends object>(
    WrappedComponent: React.ComponentType<P>
) {
    return function WithAdminAuthComponent(props: P) {
        const router = useRouter();
        const { user } = useAuth();  // Chỉ lấy user từ context
        const [isLoading, setIsLoading] = useState(true);
        const [isAuthorized, setIsAuthorized] = useState(false);

        useEffect(() => {
            const checkAuth = async () => {
                try {
                    // Kiểm tra trực tiếp từ localStorage
                    const token = localStorage.getItem('token');
                    const userStr = localStorage.getItem('user');

                    if (!token || !userStr) {
                        router.replace('/login');  // Sử dụng replace thay vì push
                        return;
                    }

                    try {
                        const userData = JSON.parse(userStr);
                        if (!userData.roles?.includes('ROLE_ADMIN')) {
                            router.replace('/');
                            return;
                        }

                        setIsAuthorized(true);
                    } catch (error) {
                        console.error('Error parsing user data:', error);
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        router.replace('/login');
                    }
                } finally {
                    setIsLoading(false);
                }
            };

            checkAuth();
        }, [router]); // Chỉ phụ thuộc vào router

        // Kiểm tra thay đổi user
        useEffect(() => {
            if (user && !user.roles?.includes('ROLE_ADMIN')) {
                router.replace('/');
            }
        }, [user, router]);

        if (isLoading) {
            return (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
                </div>
            );
        }

        if (!isAuthorized) {
            return null;
        }

        return <WrappedComponent {...props} />;
    };
}