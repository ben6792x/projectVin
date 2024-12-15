// src/components/shared/LoadingSpinner.tsx
export default function LoadingSpinner() {
    return (
        <div className="flex items-center justify-center">
            <div className="relative">
                {/* Outer circle */}
                <div className="w-12 h-12 rounded-full border-4 border-blue-200 border-opacity-20"></div>
                {/* Inner spinning circle */}
                <div className="w-12 h-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin absolute top-0 left-0"></div>
            </div>
        </div>
    );
}