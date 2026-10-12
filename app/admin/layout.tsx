import AdminSidebar from '@/shared/components/AdminSidebar';
import React from 'react';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-gray-50 text-gray-900">
            {/* 관리자 사이드바 */}
            <AdminSidebar />

            {/* 관리자 컨텐츠 영역 */}
            <main className="flex-1 overflow-y-auto p-6 md:p-8">
                {children}
            </main>
        </div>
    );
}
