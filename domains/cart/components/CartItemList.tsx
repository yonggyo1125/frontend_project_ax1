'use client';

import CartSummary from '@/domains/cart/components/CartSummary';
import { useCartStore } from '@/domains/cart/store/cart.store';
import { formatPrice } from '@/shared/utils/formatPrice';
import Image from 'next/image';
import Link from 'next/link';

import { FiMinus, FiPlus, FiShoppingBag, FiTrash2 } from 'react-icons/fi';

export default function CartItemList() {
    // Zustand 스토어의 하이드레이션 완료 여부 구독
    const hasHydrated = useCartStore((state) => state._hasHydrated);

    const items = useCartStore((state) => state.items);
    const increaseQuantity = useCartStore((state) => state.increaseQuantity);
    const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
    const removeItem = useCartStore((state) => state.removeItem);
    const clearCart = useCartStore((state) => state.clearCart);

    // Hydration 대기 중 스켈레톤 UI 표시
    if (!hasHydrated) {
        return (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="space-y-4 lg:col-span-2">
                    <div className="h-28 w-full animate-pulse rounded-2xl bg-gray-100" />
                    <div className="h-28 w-full animate-pulse rounded-2xl bg-gray-100" />
                </div>
                <div className="h-72 w-full animate-pulse rounded-3xl bg-gray-100 lg:col-span-1" />
            </div>
        );
    }

    const handleClearCart = () => {
        if (!confirm('장바구니에 담긴 모든 상품을 비우시겠습니까?')) return;
        clearCart();
    };

    return (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
                {items.length > 0 && (
                    <div className="flex items-center justify-between pb-1">
                        <span className="text-xs font-bold text-gray-600">
                            담긴 상품 ({items.length}종)
                        </span>
                        <button
                            type="button"
                            onClick={handleClearCart}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-gray-400 transition-colors hover:text-red-500"
                        >
                            <FiTrash2 className="h-3.5 w-3.5" />
                            <span>장바구니 비우기</span>
                        </button>
                    </div>
                )}

                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white p-14 text-center">
                        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-50 text-gray-400">
                            <FiShoppingBag className="h-6 w-6" />
                        </div>
                        <p className="text-sm font-bold text-gray-700">
                            장바구니가 비어 있습니다.
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                            원하시는 상품을 장바구니에 담아보세요!
                        </p>
                        <Link
                            href="/products"
                            className="mt-5 inline-flex items-center rounded-xl bg-gray-900 px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-gray-800"
                        >
                            상품 둘러보기
                        </Link>
                    </div>
                ) : (
                    items.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                        >
                            <Link
                                href={`/products/${item.id}`}
                                className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-50"
                            >
                                <Image
                                    src={item.image || '/placeholder.png'}
                                    alt={item.name}
                                    fill
                                    sizes="80px"
                                    className="object-cover"
                                />
                            </Link>

                            <div className="flex flex-1 flex-col justify-between">
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <Link
                                            href={`/products/${item.id}`}
                                            className="text-sm font-bold text-gray-900 hover:text-blue-600"
                                        >
                                            {item.name}
                                        </Link>
                                        <p className="mt-0.5 text-xs text-gray-400">
                                            단가: {formatPrice(item.price)}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeItem(item.id)}
                                        aria-label={`${item.name} 삭제`}
                                        className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                                    >
                                        <FiTrash2 className="h-4 w-4" />
                                    </button>
                                </div>

                                <div className="mt-3 flex items-center justify-between">
                                    <span className="text-sm font-black text-gray-900">
                                        {formatPrice(
                                            item.price * item.quantity,
                                        )}
                                    </span>

                                    <div className="flex items-center rounded-lg border border-gray-200 bg-white">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                decreaseQuantity(item.id)
                                            }
                                            disabled={item.quantity <= 1}
                                            aria-label="수량 감소"
                                            className="p-1.5 text-gray-500 hover:bg-gray-50 disabled:opacity-30"
                                        >
                                            <FiMinus className="h-3 w-3" />
                                        </button>
                                        <span className="w-8 text-center text-xs font-bold text-gray-900">
                                            {item.quantity}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                increaseQuantity(item.id)
                                            }
                                            aria-label="수량 증가"
                                            className="p-1.5 text-gray-500 hover:bg-gray-50"
                                        >
                                            <FiPlus className="h-3 w-3" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* 우측 주문 요약 영역 */}
            <div className="lg:col-span-1">
                <CartSummary />
            </div>
        </div>
    );
}
