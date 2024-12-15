'use client';

import { useState } from 'react';
import { adminMovieService } from "@/service/admin/movieService";
import { toast } from 'react-hot-toast';
import {formatDuration} from "@/app/utils/format";

interface SyncResult {
    successMessages: string[];
}

export default function SyncMovieForm() {
    const [slugs, setSlugs] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [syncProgress, setSyncProgress] = useState<SyncProgress[]>([]);
    const [syncResults, setSyncResults] = useState<SyncResult | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSyncResults(null);
        setSyncProgress([]);

        try {
            const slugList = slugs
                .split('\n')
                .map(slug => slug.trim())
                .filter(slug => slug.length > 0);

            if (slugList.length === 0) {
                toast.error('Vui lòng nhập ít nhất một slug');
                return;
            }

            const loadingToast = toast.loading(`Đang đồng bộ ${slugList.length} phim...`);

            const result = await adminMovieService.syncMovies(slugList, {
                onProgress: (progress) => {
                    setSyncProgress(progress);
                }
            });

            toast.dismiss(loadingToast);

            if (result.successMessages.length > 0) {
                setSyncResults(result);
                toast.success(`Đã đồng bộ thành công ${result.successMessages.length} phim`);
                setSlugs('');
            } else {
                toast.error('Không có phim nào được đồng bộ thành công');
            }

        } catch (error) {
            console.error('Sync error:', error);
            toast.error('Có lỗi xảy ra khi đồng bộ phim');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="bg-white shadow rounded-lg p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="slugs" className="block text-sm font-medium text-gray-700 mb-2">
                        Nhập danh sách slug (mỗi slug một dòng)
                    </label>
                    <textarea
                        id="slugs"
                        value={slugs}
                        onChange={(e) => setSlugs(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        rows={10}
                        placeholder="dau-pha-thuong-khung-phan-5&#10;dont-give-up"
                        disabled={loading}
                    />
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={loading || !slugs.trim()}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Đang đồng bộ...
                            </span>
                        ) : 'Đồng bộ phim'}
                    </button>
                </div>
            </form>

            {/* Progress Tracking */}
            {syncProgress.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-gray-800 font-medium mb-4">
                        Tiến trình đồng bộ ({syncProgress.filter(p => p.status === 'completed').length}/{syncProgress.length})
                    </h3>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                        {syncProgress.map((item) => (
                            <div
                                key={item.slug}
                                className={`p-3 rounded-lg flex items-center justify-between ${
                                    item.status === 'completed' ? 'bg-green-50' :
                                        item.status === 'processing' ? 'bg-blue-50' :
                                            item.status === 'failed' ? 'bg-red-50' :
                                                'bg-gray-50'
                                }`}
                            >
                                <div className="flex items-center">
                                    {item.status === 'processing' && (
                                        <svg
                                            className="animate-spin -ml-1 mr-3 h-4 w-4 text-blue-500"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            />
                                        </svg>
                                    )}
                                    <span className="font-medium">{item.slug}</span>
                                </div>
                                <div className="text-sm">
                                    {item.status === 'completed' && item.startTime && item.endTime && (
                                        <span className="text-green-600">
                                                Hoàn thành ({formatDuration(item.endTime - item.startTime)})
                                            </span>
                                    )}
                                    {item.status === 'processing' && (
                                        <span className="text-blue-600">Đang xử lý...</span>
                                    )}
                                    {item.status === 'failed' && (
                                        <span className="text-red-600">{item.error || 'Thất bại'}</span>
                                    )}
                                    {item.status === 'pending' && (
                                        <span className="text-gray-600">Đang chờ</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Hiển thị kết quả */}
            {syncResults && syncResults.successMessages.length > 0 && (
                <div className="mt-6">
                    <div className="bg-green-50 p-4 rounded-lg">
                        <h3 className="text-green-800 font-medium mb-2">
                            Kết quả đồng bộ ({syncResults.successMessages.length} phim)
                        </h3>
                        <ul className="space-y-2 text-sm max-h-60 overflow-y-auto">
                            {syncResults.successMessages.map((message, index) => (
                                <li key={index} className="text-green-600 flex items-center">
                                    <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span className="break-all">{message}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {/* Hướng dẫn */}
            <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Hướng dẫn:</h3>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    <li>Nhập mỗi slug trên một dòng mới</li>
                    <li>Ví dụ:
                        <pre className="mt-1 bg-gray-50 p-2 rounded text-xs">
                            dau-pha-thuong-khung-phan-5{'\n'}
                            dont-give-up{'\n'}
                            blue-lock
                        </pre>
                    </li>
                    <li>Có thể lấy slug từ URL của phim trên trang gốc</li>
                </ul>
            </div>
        </div>
    );
}