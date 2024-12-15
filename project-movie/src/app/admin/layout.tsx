'use client';



import Sidebar from "@/app/admin/movies/components/Sidebar";
import withAdminAuth from "@/app/admin/auth/withAdminAuth";

function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar />
            <main className="flex-1 overflow-x-hidden overflow-y-auto">
                <div className="container mx-auto px-6 py-8">
                    {children}
                </div>
            </main>
        </div>
    );
}

export default withAdminAuth(AdminLayout);