'use client';

import { cn } from '@/shared/utils/cn';
import Image from 'next/image';
import { useState } from 'react';

interface ImageGalleryProps {
    images: string[];
    title: string;
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(
        images[0] || '/placeholder.png',
    );

    if (!images || images.length === 0) {
        return (
            <div className="flex aspect-square w-full items-center justify-center rounded-2xl bg-gray-100 text-sm text-gray-400">
                등록된 이미지가 없습니다.
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {/* 대표 메인 이미지 (Next.js Image 최적화 적용) */}
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 shadow-inner">
                <Image
                    src={selectedImage}
                    alt={title}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-all duration-300"
                />
            </div>
            {images.length > 1 && (
                <div className="no-scrollbar flex items-center gap-3 overflow-x-auto pb-2">
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => setSelectedImage(img)}
                            className={cn(
                                'relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all',
                                selectedImage === img
                                    ? 'border-blue-600 ring-2 ring-blue-600/20'
                                    : 'border-transparent opacity-70 hover:opacity-100',
                            )}
                        >
                            <Image
                                src={img}
                                alt={`${title} 썸네일 ${idx + 1}`}
                                fill
                                sizes="80px"
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
