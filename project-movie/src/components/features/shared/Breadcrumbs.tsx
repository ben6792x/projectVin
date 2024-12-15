// components/shared/Breadcrumbs.tsx
import Link from 'next/link';
import {Country} from "@/type/Country";


interface BreadcrumbsProps {
    country: Country;
    movieName: string;
    episodeName?: string; // Thêm optional episodeName
}

const ChevronIcon = () => (
    <svg
        className="fill-current w-3 h-3 mx-3"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 320 512"
    >
        <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"/>
    </svg>
);

export default function Breadcrumbs({ country, movieName, episodeName }: BreadcrumbsProps) {
    return (
        <nav className="text-sm mb-4" aria-label="Breadcrumb">
            <ol className="list-none p-0 inline-flex flex-wrap items-center">
                {/* Home */}
                <li className="flex items-center">
                    <Link
                        href="/"
                        className="text-blue-400 hover:text-blue-500 transition-colors"
                    >
                        Trang chủ
                    </Link>
                    <ChevronIcon />
                </li>

                {/* Country */}
                <li className="flex items-center">
                    <Link
                        href={`/hoat-hinh-${country.slug}`}
                        className="text-blue-400 hover:text-blue-500 transition-colors"
                    >
                        {country.name}
                    </Link>
                    <ChevronIcon />
                </li>

                {/* Movie Name */}
                <li className="flex items-center">
                    <Link
                        href={`/${movieName}`}
                        className="text-blue-400 hover:text-blue-500 transition-colors"
                    >
                        {movieName}
                    </Link>
                    {episodeName && <ChevronIcon />}
                </li>

                {/* Episode Name - Chỉ hiển thị nếu có */}
                {episodeName && (
                    <li>
                        <span className="text-gray-400">{episodeName}</span>
                    </li>
                )}
            </ol>
        </nav>
    );
}