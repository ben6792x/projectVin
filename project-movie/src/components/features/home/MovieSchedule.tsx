// src/components/features/home/MovieSchedule.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {Schedule} from "@/type/Schedule";
import {movieService} from "@/service/movieService";
import {getImageUrl} from "@/app/utils/imageUtils";


// Hàm helper để thêm ngày
const addDays = (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

// Hàm helper để format ngày
const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

// Hàm helper để format ngày ngắn
const formatShortDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${day}/${month}`;
};

const DAYS_OF_WEEK = [
    { short: 'Thứ 2', full: 'Thứ Hai' },
    { short: 'Thứ 3', full: 'Thứ Ba' },
    { short: 'Thứ 4', full: 'Thứ Tư' },
    { short: 'Thứ 5', full: 'Thứ Năm' },
    { short: 'Thứ 6', full: 'Thứ Sáu' },
    { short: 'Thứ 7', full: 'Thứ Bảy' },
    { short: 'CN', full: 'Chủ Nhật' }
];

const STATUS_STYLES = {
    'Đã Phát Hành': 'bg-green-500/20 text-green-400',
    'Sắp Phát Hành': 'bg-yellow-500/20 text-yellow-400',
    'Chưa Phát Hành': 'bg-gray-500/20 text-gray-400'
};

export default function MovieSchedule() {
    const [activeDay, setActiveDay] = useState(0);
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                const data = await movieService.getAllSchedules();
                setSchedules(data);
            } catch (err) {
                console.error('Failed to load schedules:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchSchedules();
    }, []);

    const today = new Date();

    return (
        <div className="container mx-auto px-4 mt-8 mb-8">
            <div className="bg-gray-800 rounded-lg p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-blue-500">Lịch Phát Hành Phim</h2>
                    <div className="flex space-x-2 overflow-x-auto pb-2">
                        {DAYS_OF_WEEK.map((day, index) => {
                            const date = addDays(today, index);
                            return (
                                <button
                                    key={index}
                                    onClick={() => setActiveDay(index)}
                                    className={`flex flex-col items-center px-4 py-2 rounded-lg transition duration-300 whitespace-nowrap
                                        ${activeDay === index
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-700 text-gray-300 hover:bg-blue-500 hover:text-white'}`}
                                >
                                    <span className="text-sm font-medium">{day.short}</span>
                                    <span className="text-xs opacity-75">
                                        {formatShortDate(date)}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                        <tr className="text-gray-400 border-b border-gray-700">
                            <th className="py-3 px-4 text-left">Thời Gian</th>
                            <th className="py-3 px-4 text-left">Tên Phim</th>
                            <th className="py-3 px-4 text-left">Tập</th>
                            <th className="py-3 px-4 text-left">Thể Loại</th>
                            <th className="py-3 px-4 text-left">Trạng Thái</th>
                        </tr>
                        </thead>
                        <tbody className="text-gray-300">
                        {schedules[activeDay]?.movies.map((movie, index) => (
                            <tr key={movie.id} className="border-b border-gray-700 hover:bg-gray-700/50 transition duration-300">
                                <td className="py-3 px-4">
                                    <div className="text-sm">{`${20 + index}:00`}</div>
                                    <div className="text-xs text-gray-500">
                                        {formatDate(addDays(today, activeDay))}
                                    </div>
                                </td>
                                <td className="py-3 px-4">
                                    <Link href={`/${movie.slug}`} className="flex items-center space-x-3">
                                        <Image
                                            src={getImageUrl(movie.posterUrl || movie.thumbUrl)}
                                            alt={movie.name}
                                            width={40}
                                            height={56}
                                            className="w-10 h-14 object-cover rounded"
                                        />
                                        <span className="hover:text-blue-500 cursor-pointer">
                                                {movie.name}
                                            <span className="block text-xs text-gray-400">
                                                    {movie.originName}
                                                </span>
                                            </span>
                                    </Link>
                                </td>
                                <td className="py-3 px-4">
                                    {movie.episodeCurrent}
                                </td>
                                <td className="py-3 px-4">
                                    {movie.categories.map((category, i) => (
                                        <span
                                            key={category.id}
                                            className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs mr-2"
                                        >
                                                {category.name}
                                            </span>
                                    ))}
                                </td>
                                <td className="py-3 px-4">
                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                            STATUS_STYLES[schedules[activeDay].timeSlots[index].status]
                                        }`}>
                                            {schedules[activeDay].timeSlots[index].status}
                                        </span>
                                </td>
                            </tr>
                        ))}
                        {(!schedules[activeDay]?.movies.length) && (
                            <tr>
                                <td colSpan={5} className="text-center py-8 text-gray-500">
                                    Chưa có lịch chiếu cho ngày này
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}