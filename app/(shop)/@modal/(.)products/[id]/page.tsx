'use client';

import ImageGallery from '@/domains/files/components/ImageGallery';
import ProductDetail from '@/domains/products/components/ProductDetail';
import { MOCK_PRODUCTS } from '@/shared/mocks/mockData';
import { useRouter } from 'next/navigation';
import React from 'react';
import { FiX } from 'react-icons/fi';

export default function ProductInterceptModal({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const router = useRouter();
    // React 19 / Next.js 비동기 params 언래핑
    const resolvedParams = React.use(params);
    const product = MOCK_PRODUCTS.find((p) => p.id === resolvedParams.id);

    if (!product) return null;

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

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <ImageGallery
                        images={product.images}
                        title={product.name}
                    />
                    <ProductDetail product={product} isModal={true} />
                </div>
            </div>
        </div>
    );
}
