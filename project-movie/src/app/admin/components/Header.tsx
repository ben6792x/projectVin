// src/app/admin/components/Header.tsx
export default function Header({ title }: { title: string }) {
    return (
        <div className="bg-white shadow">
            <div className="px-4 sm:px-6 lg:px-8 py-6">
                <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
            </div>
        </div>
    );
}