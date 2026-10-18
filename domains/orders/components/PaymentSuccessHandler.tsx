'use client';

import { useCartStore } from '@/domains/cart/store/cart.store';
import { confirmPaymentAction } from '@/domains/orders/actions/confirmPayment.action';
import OrderReceipt from '@/domains/orders/components/OrderReceipt';
import { Order } from '@/domains/orders/types/order.types';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { FiAlertTriangle, FiLoader } from 'react-icons/fi';

interface PaymentSuccessHandlerProps {
    paymentKey?: string;
    orderId: string;
    amount: number;
    initialOrder?: Order | null;
}

export default function PaymentSuccessHandler({
    paymentKey,
    orderId,
    amount,
    initialOrder = null,
}: PaymentSuccessHandlerProps) {
    const clearCart = useCartStore((state) => state.clearCart);
    const hasRequestedRef = useRef(false);

    const isAlreadyConfirmed = initialOrder?.status === 'PAID';

    const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(
        initialOrder,
    );
    const [isConfirming, setIsConfirming] = useState<boolean>(
        Boolean(paymentKey && !isAlreadyConfirmed),
    );
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        // 이미 서버에서 PAID 상태가 확인된 경우 장바구니만 비우고 종료
        if (isAlreadyConfirmed) {
            clearCart();
            return;
        }

        // paymentKey가 없으면 단순 조회 모드
        if (!paymentKey) {
            return;
        }

        // React Strict Mode에서 useEffect 이중 실행으로 인한 중복 승인 요청 방지
        if (hasRequestedRef.current) {
            return;
        }
        hasRequestedRef.current = true;

        async function runConfirmPayment() {
            setIsConfirming(true);
            setErrorMessage(null);

            const result = await confirmPaymentAction({
                paymentKey: paymentKey!,
                orderId,
                amount,
            });

            if (result.success && result.data?.order) {
                clearCart();
                setConfirmedOrder(result.data.order);
                setIsConfirming(false);
            } else {
                setErrorMessage(
                    result.message ||
                        '결제 승인 확인에 실패했습니다. 고객센터로 문의해 주세요.',
                );
                setIsConfirming(false);
            }
        }

        runConfirmPayment();
    }, [paymentKey, orderId, amount, isAlreadyConfirmed, clearCart]);

    if (isConfirming) {
        return (
            <div className="mx-auto flex max-w-lg flex-col items-center justify-center rounded-3xl border border-gray-100 bg-white p-12 text-center shadow-xl shadow-gray-100/50">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    <FiLoader className="h-8 w-8 animate-spin" />
                </div>
                <h1 className="text-xl font-black text-gray-900">
                    토스페이먼츠 결제 승인 처리 중...
                </h1>
                <p className="mt-2 text-xs text-gray-500">
                    결제 금액 무결성을 검증하고 주문을 최종 확정하고 있습니다.
                    잠시만 기다려 주세요.
                </p>
            </div>
        );
    }

    if (errorMessage) {
        return (
            <div className="mx-auto max-w-lg rounded-3xl border border-red-100 bg-white p-8 text-center shadow-xl shadow-gray-100/50">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600">
                    <FiAlertTriangle className="h-9 w-9" />
                </div>
                <h1 className="text-xl font-black text-gray-900">
                    결제 승인에 실패했습니다
                </h1>
                <p className="mt-2 rounded-2xl bg-red-50/70 p-3.5 text-xs font-medium text-red-600">
                    {errorMessage}
                </p>
                <div className="mt-6 flex gap-3">
                    <Link
                        href="/checkout"
                        className="flex-1 rounded-xl bg-blue-600 py-3 text-xs font-bold text-white hover:bg-blue-700"
                    >
                        주문서로 돌아가기
                    </Link>
                    <Link
                        href="/cart"
                        className="flex-1 rounded-xl border border-gray-300 py-3 text-xs font-bold text-gray-700 hover:bg-gray-50"
                    >
                        장바구니 확인
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <OrderReceipt
            orderId={orderId}
            amount={amount}
            order={confirmedOrder}
        />
    );
}
