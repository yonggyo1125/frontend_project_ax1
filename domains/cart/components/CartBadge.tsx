'use client';

import { useCartStore } from '@/domains/cart/store/cart.store';
import Link from 'next/link';
import { FiShoppingBag } from 'react-icons/fi';

export default function CartBadge() {
    // Zustand 스토어의 하이드레이션 완료 여부 구독
    const hasHydrated = useCartStore((state) => state._hasHydrated);

    const totalCount = useCartStore((state) =>
        state.items.reduce((sum, item) => sum + item.quantity, 0),
    );

    return (
        <Link
            href="/cart"
            aria-label="장바구니"
            className="relative flex h-10 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-blue-600 md:px-3 md:text-sm"
        >
            <FiShoppingBag className="h-4 w-4 shrink-0" />
            <span className="hidden md:inline">장바구니</span>
            {hasHydrated && totalCount > 0 && (
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 text-[11px] font-extrabold text-white shadow-xs">
                    {totalCount > 99 ? '99+' : totalCount}
                </span>
            )}
        </Link>
    );
}
