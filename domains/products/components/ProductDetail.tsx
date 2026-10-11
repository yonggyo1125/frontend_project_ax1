'use client';

import { Product } from '@/domains/products/types/product.types';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/utils/cn';
import { formatPrice } from '@/shared/utils/formatPrice';
import Link from 'next/link';
import { useState } from 'react';
import {
    FiCreditCard,
    FiExternalLink,
    FiMinus,
    FiPlus,
    FiShoppingBag,
} from 'react-icons/fi';

interface ProductDetailProps {
    product: Product;
    isModal?: boolean;
}

export default function ProductDetail({
    product,
    isModal = false,
}: ProductDetailProps) {
    const [quantity, setQuantity] = useState(1);

    const handleDecrease = () => setQuantity((prev) => Math.max(1, prev - 1));
    const handleIncrease = () => setQuantity((prev) => prev + 1);

    return (
        <div className="flex flex-col justify-between space-y-5">
            <div className="space-y-3">
                <div className="space-y-1">
                    <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-600">
                        {isModal ? '빠른 미리보기' : '정품 보증'}
                    </span>
                    <h1
                        className={cn(
                            'font-bold text-gray-900',
                            isModal
                                ? 'text-lg md:text-xl'
                                : 'text-xl md:text-2xl lg:text-3xl',
                        )}
                    >
                        {product.name}
                    </h1>
                </div>

                <div className="flex items-baseline gap-2 border-b border-gray-100 pb-3">
                    <span
                        className={cn(
                            'font-black text-gray-900',
                            isModal ? 'text-2xl' : 'text-2xl md:text-3xl',
                        )}
                    >
                        {formatPrice(product.price)}
                    </span>
                    <span className="text-xs text-gray-400">부가세 포함</span>
                </div>

                {/* 모달일 경우 본문 3줄 말줄임, 전면 상세일 경우 전체 표시 */}
                <p
                    className={cn(
                        'text-sm leading-relaxed text-gray-600',
                        isModal && 'line-clamp-3',
                    )}
                >
                    {product.description}
                </p>

                {/* 모달에서만 전면 상세 페이지 이동 링크 노출 */}
                {isModal && (
                    <div className="pt-1">
                        <Link
                            href={`/products/${product.id}`}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
                        >
                            <span>상품 상세정보 더보기</span>
                            <FiExternalLink className="h-3 w-3" />
                        </Link>
                    </div>
                )}
            </div>

            <div className="space-y-4 rounded-xl bg-gray-50 p-4">
                {/* 수량 제어 컨트롤러 */}
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-700">
                        주문 수량
                    </span>
                    <div className="flex items-center rounded-lg border border-gray-200 bg-white shadow-sm">
                        <button
                            type="button"
                            onClick={handleDecrease}
                            className="p-2 text-gray-600 hover:bg-gray-50 active:bg-gray-100"
                            aria-label="수량 감소"
                        >
                            <FiMinus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-10 text-center text-xs font-bold text-gray-900">
                            {quantity}
                        </span>
                        <button
                            type="button"
                            onClick={handleIncrease}
                            className="p-2 text-gray-600 hover:bg-gray-50 active:bg-gray-100"
                            aria-label="수량 증가"
                        >
                            <FiPlus className="h-3.5 w-3.5" />
                        </button>
                    </div>
                </div>

                {/* 총 주문 금액 연산 결과 */}
                <div className="flex items-center justify-between border-t border-gray-200/60 pt-3">
                    <span className="text-xs font-medium text-gray-500">
                        총 결제 예상 금액
                    </span>
                    <span className="text-xl font-black text-blue-600">
                        {formatPrice(product.price * quantity)}
                    </span>
                </div>
            </div>

            {/* CTA 액션 버튼 그룹 */}
            <div className="grid grid-cols-2 gap-3 pt-1">
                <Button
                    type="button"
                    variant="outline"
                    className="h-11 w-full gap-1.5 border-gray-300 font-bold text-gray-700 hover:bg-gray-50"
                    onClick={() =>
                        alert(
                            `장바구니에 [${product.name}] ${quantity}개를 담았습니다.`,
                        )
                    }
                >
                    <FiShoppingBag className="h-4 w-4" />
                    <span>장바구니</span>
                </Button>
                <Button
                    type="button"
                    className="h-11 w-full gap-1.5 bg-blue-600 font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700"
                    onClick={() =>
                        alert(
                            `[${product.name}] 바로 주문서 작성 단계로 이동합니다.`,
                        )
                    }
                >
                    <FiCreditCard className="h-4 w-4" />
                    <span>바로 구매</span>
                </Button>
            </div>
        </div>
    );
}
