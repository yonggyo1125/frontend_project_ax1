'use client';

import {
    calculateCartSummary,
    useCartStore,
} from '@/domains/cart/store/cart.store';
import { FREE_SHIPPING_THRESHOLD } from '@/domains/cart/types/cart.types';
import { formatPrice } from '@/shared/utils/formatPrice';
import Link from 'next/link';
import { FiArrowRight, FiTruck } from 'react-icons/fi';

export default function CartSummary() {
    const items = useCartStore((state) => state.items);
    const { totalCount, itemsTotalAmount, shippingFee, totalAmount } =
        calculateCartSummary(items);

    const remainingForFreeShipping = Math.max(
        0,
        FREE_SHIPPING_THRESHOLD - itemsTotalAmount,
    );

    const freeShippingProgress = Math.min(
        100,
        Math.round((itemsTotalAmount / FREE_SHIPPING_THRESHOLD) * 100),
    );

    return (
        <div className="sticky top-24 space-y-5 rounded-3xl border border-gray-100 bg-gray-50/80 p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-200/70 pb-3">
                <h3 className="text-base font-black text-gray-900">
                    주문 요약
                </h3>
                <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-600">
                    총 {totalCount}개 품목
                </span>
            </div>

            {/* 무료배송 달성 진행상태 안내 */}
            {itemsTotalAmount > 0 && (
                <div className="space-y-2 rounded-2xl border border-blue-100 bg-white p-3.5">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                        <FiTruck className="h-4 w-4 shrink-0 text-blue-600" />
                        {remainingForFreeShipping === 0 ? (
                            <span className="font-bold text-blue-600">
                                무료배송 혜택이 적용되었습니다!
                            </span>
                        ) : (
                            <span>
                                <strong className="text-blue-600">
                                    {formatPrice(remainingForFreeShipping)}
                                </strong>{' '}
                                더 담으면 무료배송!
                            </span>
                        )}
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                        <div
                            className="h-full rounded-full bg-blue-600 transition-all duration-300"
                            style={{ width: `${freeShippingProgress}%` }}
                        />
                    </div>
                </div>
            )}

            <div className="space-y-2.5 text-xs text-gray-600">
                <div className="flex justify-between">
                    <span>순수 상품 금액</span>
                    <span className="font-semibold text-gray-900">
                        {formatPrice(itemsTotalAmount)}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span>배송비 (5만원 이상 무료)</span>
                    <span className="font-semibold text-gray-900">
                        {shippingFee === 0 && itemsTotalAmount > 0
                            ? '무료 (0원)'
                            : formatPrice(shippingFee)}
                    </span>
                </div>
            </div>

            <div className="border-t border-gray-200 pt-3.5">
                <div className="flex items-baseline justify-between font-black text-gray-900">
                    <span className="text-xs">총 결제 예정 금액</span>
                    <span className="text-xl text-blue-600">
                        {formatPrice(totalAmount)}
                    </span>
                </div>
            </div>

            {items.length > 0 ? (
                <Link
                    href="/checkout"
                    className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-blue-600 py-3.5 text-center text-xs font-bold text-white shadow-md shadow-blue-500/20 transition-colors hover:bg-blue-700"
                >
                    <span>주문서 작성하기</span>
                    <FiArrowRight className="h-4 w-4" />
                </Link>
            ) : (
                <button
                    type="button"
                    disabled
                    className="w-full cursor-not-allowed rounded-xl bg-gray-200 py-3.5 text-center text-xs font-bold text-gray-400"
                >
                    담긴 상품이 없습니다
                </button>
            )}
        </div>
    );
}
