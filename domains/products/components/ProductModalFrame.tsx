'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import { FiX } from 'react-icons/fi';

export default function ProductModalFrame({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();

    const handleClose = () => {
        router.back();
    };

    return (
        <div
            onClick={handleClose}
            className="animate-in fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm duration-200"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl md:p-8"
            >
                <button
                    type="button"
                    onClick={handleClose}
                    className="absolute top-5 right-5 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                    aria-label="닫기"
                >
                    <FiX className="h-6 w-6" />
                </button>
                {children}
            </div>
        </div>
    );
}
