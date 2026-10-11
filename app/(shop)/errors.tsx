'use client';

import { Button } from '@/shared/components/ui/button';
import Link from 'next/link';
import { useEffect } from 'react';
import { FiAlertTriangle } from 'react-icons/fi';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('쇼핑몰 탐색 화면 런타임 에러 발생:', error);
    }, [error]);

    return (
        <div className="mx-auto flex min-h-100 max-w-xl flex-col items-center justify-center px-4 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <FiAlertTriangle className="h-7 w-7" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
                상품 정보를 불러오지 못했습니다
            </h2>
            <p className="mt-2 text-sm text-gray-500">
                {error.message || '일시적인 네트워크 장애가 발생했습니다.'}
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
                <Button
                    onClick={() => reset()}
                    className="bg-red-600 font-bold hover:bg-red-700"
                >
                    다시 시도
                </Button>

                <Link
                    href="/"
                    className="inline-flex h-9 items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
                >
                    홈으로 이동
                </Link>
            </div>
        </div>
    );
}
