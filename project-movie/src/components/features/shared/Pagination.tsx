// src/components/shared/Pagination.tsx
interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    const maxVisiblePages = 5;

    let visiblePages = pages;
    if (totalPages > maxVisiblePages) {
        const start = Math.max(
            1,
            Math.min(currentPage - Math.floor(maxVisiblePages / 2), totalPages - maxVisiblePages + 1)
        );
        visiblePages = pages.slice(start - 1, start + maxVisiblePages - 1);
    }

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded-lg bg-gray-800 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-500 hover:text-white transition duration-300"
                >
                    Prev
                </button>

                {visiblePages.map((page) => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`px-3 py-1 rounded-lg transition duration-300 ${
                            currentPage === page
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-800 text-gray-300 hover:bg-blue-500 hover:text-white'
                        }`}
                    >
                        {page}
                    </button>
                ))}

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded-lg bg-gray-800 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-500 hover:text-white transition duration-300"
                >
                    Next
                </button>
            </div>
            <div className="text-gray-400 text-sm">
                Trang {currentPage} / {totalPages}
            </div>
        </div>
    );
}