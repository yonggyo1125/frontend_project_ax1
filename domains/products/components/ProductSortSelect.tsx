'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

interface ProductSortSelectProps {
    currentSort: string;
}

export default function ProductSortSelect({
    currentSort,
}: ProductSortSelectProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('sort', e.target.value);
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <select
            value={currentSort}
            onChange={handleSortChange}
            aria-label="상품 정렬 기준"
            className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-xs text-gray-700 outline-none focus:border-blue-600"
        >
            <option value="priority">추천 진열순</option>
            <option value="recent">최신순</option>
            <option value="price_asc">낮은 가격순</option>
            <option value="price_desc">높은 가격순</option>
        </select>
    );
}
