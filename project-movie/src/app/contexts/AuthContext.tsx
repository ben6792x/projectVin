'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/service/api'; // Import api instance

interface User {
    username: string;
    roles: string[];
}

interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    logout: () => void;
    isAdmin: () => boolean;
    isAuthenticated: boolean;
    login: (userData: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = () => {
            const storedUser = localStorage.getItem('user');
            const token = localStorage.getItem('token');

            if (storedUser && token) {
                try {
                    const userData = JSON.parse(storedUser);
                    setUser(userData);
                    setIsAuthenticated(true);

                    // Set token trong api instance
                    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                    if (window.location.pathname === '/login') {
                        if (userData.roles?.includes('ROLE_ADMIN')) {
                            router.replace('/admin/movies');
                        } else {
                            router.replace('/');
                        }
                    }
                } catch (error) {
                    console.error('Error parsing user data:', error);
                    handleLogout();
                }
            } else {
                handleLogout();
            }
        };

        checkAuth();
    }, [router]);

    const login = async (userData: User) => {
        try {
            setUser(userData);
            setIsAuthenticated(true);

            // Lưu vào localStorage
            localStorage.setItem('user', JSON.stringify(userData));

            // Lưu vào cookies
            document.cookie = `user=${JSON.stringify(userData)}; path=/`;
            const token = localStorage.getItem('token');
            if (token) {
                document.cookie = `token=${token}; path=/`;
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            }

            // Redirect
            if (userData.roles?.includes('ROLE_ADMIN')) {
                console.log('Redirecting to admin after login...');
                window.location.href = '/admin/movies';
            } else {
                console.log('Redirecting to home after login...');
                window.location.href = '/';
            }
        } catch (error) {
            console.error('Error during login redirect:', error);
        }
    };

    const handleLogout = () => {
        setUser(null);
        setIsAuthenticated(false);

        // Clear localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('token');

        // Clear cookies
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
        document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';

        // Clear authorization header
        delete api.defaults.headers.common['Authorization'];
    };

    const logout = () => {
        handleLogout();
        console.log('Redirecting to login after logout...');
        router.replace('/login');
    };

    const isAdmin = () => {
        return user?.roles?.includes('ROLE_ADMIN') ?? false;
    };

    return (
        <AuthContext.Provider value={{
            user,
            setUser,
            logout,
            isAdmin,
            isAuthenticated,
            login
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}