'use client';

import {
    calculateCartSummary,
    useCartStore,
} from '@/domains/cart/store/cart.store';
import { createOrderAction } from '@/domains/orders/actions/createOrder.action';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { INITIAL_ACTION_STATE } from '@/shared/types/action.types';
import { cn } from '@/shared/utils/cn';
import { formatPrice } from '@/shared/utils/formatPrice';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useMemo } from 'react';
import {
    FiAlertCircle,
    FiCreditCard,
    FiShoppingBag,
    FiTruck,
} from 'react-icons/fi';

export default function CheckoutForm() {
    const router = useRouter();

    // Zustand 스토어의 하이드레이션 완료 여부 및 장바구니 품목 구독
    const hasHydrated = useCartStore((state) => state._hasHydrated);
    const items = useCartStore((state) => state.items);
    const clearCart = useCartStore((state) => state.clearCart);

    const { itemsTotalAmount, shippingFee, totalAmount } =
        calculateCartSummary(items);

    // Server Action 전송용 품목 JSON 직렬화
    const serializedItems = useMemo(
        () =>
            JSON.stringify(
                items.map((item) => ({
                    productId: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                })),
            ),
        [items],
    );

    const [state, formAction, isPending] = useActionState(
        createOrderAction,
        INITIAL_ACTION_STATE,
    );

    // 원자성 가주문 생성 성공 시 장바구니를 비우고 완료 페이지로 전환
    useEffect(() => {
        const resultData = state.data as
            { orderId?: string; totalAmount?: number } | undefined;

        if (state.success && resultData?.orderId) {
            clearCart();
            router.push(
                `/checkout/success?orderId=${resultData.orderId}&amount=${resultData.totalAmount ?? totalAmount}`,
            );
        }
    }, [state.success, state.data, totalAmount, clearCart, router]);

    if (!hasHydrated) {
        return (
            <div className="h-96 w-full animate-pulse rounded-3xl bg-gray-100" />
        );
    }

    if (items.length === 0 && !state.success) {
        return (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white p-14 text-center">
                <FiShoppingBag className="mb-3 h-10 w-10 text-gray-400" />
                <p className="text-base font-bold text-gray-800">
                    주문할 상품이 장바구니에 없습니다.
                </p>
                <p className="mt-1 text-xs text-gray-400">
                    먼저 상품을 장바구니에 담은 뒤 주문서를 작성해 주세요.
                </p>
                <Link
                    href="/products"
                    className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-700"
                >
                    상품 목록으로 이동
                </Link>
            </div>
        );
    }

    return (
        <form
            action={formAction}
            noValidate
            className="grid grid-cols-1 gap-8 lg:grid-cols-3"
        >
            {/* 서버 무결성 검증(validateOrderAmount) 및 RPC 전달용 Hidden Inputs */}
            <input type="hidden" name="itemsJson" value={serializedItems} />
            <input
                type="hidden"
                name="itemsTotalAmount"
                value={itemsTotalAmount}
            />
            <input type="hidden" name="shippingFee" value={shippingFee} />
            <input type="hidden" name="totalAmount" value={totalAmount} />

            <div className="space-y-6 lg:col-span-2">
                {state.message && !state.success && (
                    <div className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-bold text-red-600">
                        <FiAlertCircle className="h-4 w-4 shrink-0" />
                        <span>{state.message}</span>
                    </div>
                )}

                {/* 주문 상품 내역 확인 섹션 */}
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3">
                        <div className="flex items-center gap-2">
                            <FiShoppingBag className="h-5 w-5 text-blue-600" />
                            <h2 className="text-base font-bold text-gray-900">
                                주문 상품 정보 ({items.length}종)
                            </h2>
                        </div>
                        <Link
                            href="/cart"
                            className="text-xs font-semibold text-blue-600 hover:underline"
                        >
                            장바구니 수정
                        </Link>
                    </div>

                    <div className="divide-y divide-gray-100">
                        {items.map((item) => {
                            const thumb = item.image || '/placeholder.png';
                            return (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gray-50">
                                            <Image
                                                src={thumb}
                                                alt={item.name}
                                                fill
                                                unoptimized={thumb.startsWith(
                                                    '/files/',
                                                )}
                                                sizes="56px"
                                                className="object-cover"
                                            />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-900">
                                                {item.name}
                                            </p>
                                            <p className="mt-0.5 text-[11px] text-gray-500">
                                                {formatPrice(item.price)} x{' '}
                                                {item.quantity}개
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-black text-gray-900">
                                        {formatPrice(
                                            item.price * item.quantity,
                                        )}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 배송지 입력 섹션 */}
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
                        <FiTruck className="h-5 w-5 text-blue-600" />
                        <h2 className="text-base font-bold text-gray-900">
                            배송 정보 입력
                        </h2>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-700">
                                    수령인
                                </label>
                                <Input
                                    name="recipientName"
                                    placeholder="홍길동"
                                    className={cn(
                                        state.errors?.recipientName &&
                                            'border-red-500 bg-red-50/20',
                                    )}
                                />
                                {state.errors?.recipientName && (
                                    <p className="flex items-center gap-1 text-xs text-red-500">
                                        <FiAlertCircle className="h-3 w-3" />
                                        <span>
                                            {state.errors.recipientName}
                                        </span>
                                    </p>
                                )}
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-700">
                                    연락처
                                </label>
                                <Input
                                    name="phone"
                                    placeholder="010-0000-0000"
                                    className={cn(
                                        state.errors?.phone &&
                                            'border-red-500 bg-red-50/20',
                                    )}
                                />
                                {state.errors?.phone && (
                                    <p className="flex items-center gap-1 text-xs text-red-500">
                                        <FiAlertCircle className="h-3 w-3" />
                                        <span>{state.errors.phone}</span>
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-700">
                                배송 주소
                            </label>
                            <div className="flex gap-2">
                                <Input
                                    name="zipCode"
                                    defaultValue="06236"
                                    readOnly
                                    className="w-28 bg-gray-50 text-gray-500"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => alert('우편번호 검색 기능')}
                                >
                                    우편번호 검색
                                </Button>
                            </div>
                            <Input
                                name="address"
                                placeholder="기본 주소를 입력하세요"
                                className={cn(
                                    'mt-2',
                                    state.errors?.address &&
                                        'border-red-500 bg-red-50/20',
                                )}
                            />
                            {state.errors?.address && (
                                <p className="flex items-center gap-1 text-xs text-red-500">
                                    <FiAlertCircle className="h-3 w-3" />
                                    <span>{state.errors.address}</span>
                                </p>
                            )}
                            <Input
                                name="detailAddress"
                                placeholder="상세 주소를 입력하세요 (동, 호수 등)"
                                className={cn(
                                    'mt-2',
                                    state.errors?.detailAddress &&
                                        'border-red-500 bg-red-50/20',
                                )}
                            />
                            {state.errors?.detailAddress && (
                                <p className="flex items-center gap-1 text-xs text-red-500">
                                    <FiAlertCircle className="h-3 w-3" />
                                    <span>{state.errors.detailAddress}</span>
                                </p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-700">
                                배송 요청사항 (선택)
                            </label>
                            <Input
                                name="deliveryMemo"
                                placeholder="문 앞에 놓아주세요 / 경비실에 맡겨주세요"
                            />
                        </div>
                    </div>
                </div>

                {/* 결제 수단 영역 */}
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
                        <FiCreditCard className="h-5 w-5 text-blue-600" />
                        <h2 className="text-base font-bold text-gray-900">
                            결제 수단
                        </h2>
                    </div>
                    {/* 토스 결제 위젯 플레이스홀더 */}
                    <div className="flex h-44 flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/70 p-6 text-center">
                        <span className="font-bold text-gray-800">
                            Toss Payments 결제 위젯 영역
                        </span>
                        <p className="mt-1 text-xs text-gray-400">
                            9일 차 토스페이먼츠 연동 시 카드/간편결제 UI가 자동
                            렌더링됩니다.
                        </p>
                    </div>
                </div>
            </div>

            {/* 우측 최종 결제 금액 요약 */}
            <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-4 rounded-2xl border border-gray-100 bg-gray-50/80 p-6 shadow-sm">
                    <h3 className="text-sm font-black text-gray-900">
                        최종 결제 금액
                    </h3>
                    <div className="space-y-2.5 text-xs text-gray-600">
                        <div className="flex justify-between">
                            <span>총 상품금액</span>
                            <span className="font-semibold text-gray-900">
                                {formatPrice(itemsTotalAmount)}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>배송비</span>
                            <span className="font-semibold text-gray-900">
                                {formatPrice(shippingFee)}
                            </span>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-3">
                        <div className="flex items-baseline justify-between">
                            <span className="text-xs font-bold text-gray-900">
                                총 결제금액
                            </span>
                            <span className="text-xl font-black text-blue-600">
                                {formatPrice(totalAmount)}
                            </span>
                        </div>
                    </div>

                    <div className="pt-2">
                        <label className="flex items-start gap-2 text-xs text-gray-600">
                            <input
                                type="checkbox"
                                name="paymentAgreed"
                                value="true"
                                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span>
                                구매조건 확인 및 결제 진행에 동의합니다. (필수)
                            </span>
                        </label>
                        {state.errors?.paymentAgreed && (
                            <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
                                <FiAlertCircle className="h-3 w-3" />
                                <span>{state.errors.paymentAgreed}</span>
                            </p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        disabled={isPending}
                        className="h-12 w-full bg-blue-600 font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700"
                    >
                        {isPending
                            ? '원자성 주문서 생성 중...'
                            : `${formatPrice(totalAmount)} 결제하기`}
                    </Button>
                </div>
            </div>
        </form>
    );
}
