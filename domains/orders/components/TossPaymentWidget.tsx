'use client';

import {
    ANONYMOUS,
    loadTossPayments,
    TossPaymentsWidgets,
} from '@tosspayments/tosspayments-sdk';
import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from 'react';
import { FiAlertCircle, FiLoader } from 'react-icons/fi';

const DEFAULT_TEST_CLIENT_KEY = 'test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm';

export interface RequestTossPaymentParams {
    orderId: string;
    orderName: string;
    customerName?: string;
    customerEmail?: string;
    customerMobilePhone?: string;
}

export interface TossPaymentWidgetHandle {
    requestPayment: (params: RequestTossPaymentParams) => Promise<void>;
}

interface TossPaymentWidgetProps {
    amount: number;
    customerKey?: string;
    onReadyChange?: (ready: boolean) => void;
}

const TossPaymentWidget = forwardRef<
    TossPaymentWidgetHandle,
    TossPaymentWidgetProps
>(function TossPaymentWidget({ amount, customerKey, onReadyChange }, ref) {
    const widgetsRef = useRef<TossPaymentsWidgets | null>(null);
    const [isReady, setIsReady] = useState(false);
    const [widgetError, setWidgetError] = useState<string | null>(null);

    const clientKey =
        process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || DEFAULT_TEST_CLIENT_KEY;

    // 토스페이먼츠 SDK 로드 및 결제수단/약관 UI 마운트
    useEffect(() => {
        let isMounted = true;

        async function initPaymentWidgets() {
            if (amount <= 0) return;

            try {
                setWidgetError(null);
                const tossPayments = await loadTossPayments(clientKey);
                if (!isMounted) return;

                const widgets = tossPayments.widgets({
                    customerKey: customerKey || ANONYMOUS,
                });

                await widgets.setAmount({
                    currency: 'KRW',
                    value: amount,
                });

                await Promise.all([
                    widgets.renderPaymentMethods({
                        selector: '#toss-payment-methods',
                        variantKey: 'DEFAULT',
                    }),
                    widgets.renderAgreement({
                        selector: '#toss-payment-agreement',
                        variantKey: 'AGREEMENT',
                    }),
                ]);

                if (!isMounted) return;
                widgetsRef.current = widgets;
                setIsReady(true);
                onReadyChange?.(true);
            } catch (error) {
                if (!isMounted) return;
                console.error('토스 결제 위젯 초기화 실패:', error);
                setWidgetError(
                    '결제 위젯을 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
                );
                setIsReady(false);
                onReadyChange?.(false);
            }
        }

        initPaymentWidgets();

        return () => {
            isMounted = false;
            widgetsRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [clientKey, customerKey]);

    // 결제 예정 금액(amount) 변동 시 위젯 금액 실시간 업데이트
    useEffect(() => {
        if (widgetsRef.current && isReady && amount > 0) {
            widgetsRef.current
                .setAmount({
                    currency: 'KRW',
                    value: amount,
                })
                .catch((err) => {
                    console.error('토스 위젯 금액 업데이트 실패:', err);
                });
        }
    }, [amount, isReady]);

    // 부모 폼(CheckoutForm)에서 가주문 생성 완료 후 호출할 결제창 오픈 핸들러
    useImperativeHandle(
        ref,
        () => ({
            requestPayment: async ({
                orderId,
                orderName,
                customerName,
                customerEmail,
                customerMobilePhone,
            }: RequestTossPaymentParams) => {
                if (!widgetsRef.current || !isReady) {
                    throw new Error(
                        '결제 위젯이 아직 준비되지 않았습니다. 잠시 후 다시 시도해 주세요.',
                    );
                }

                const cleanPhone = customerMobilePhone
                    ? customerMobilePhone.replace(/[^0-9]/g, '')
                    : undefined;

                await widgetsRef.current.requestPayment({
                    orderId,
                    orderName,
                    customerName: customerName || '주문자',
                    customerEmail: customerEmail || undefined,
                    customerMobilePhone: cleanPhone || undefined,
                    successUrl: `${window.location.origin}/checkout/success`,
                    failUrl: `${window.location.origin}/checkout/fail`,
                });
            },
        }),
        [isReady],
    );

    return (
        <div className="space-y-4">
            {widgetError && (
                <div className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-600">
                    <FiAlertCircle className="h-4 w-4 shrink-0" />
                    <span>{widgetError}</span>
                </div>
            )}

            {!isReady && !widgetError && (
                <div className="flex h-48 flex-col items-center justify-center gap-2 rounded-2xl border border-gray-100 bg-gray-50/70 p-6 text-xs text-gray-500">
                    <FiLoader className="h-6 w-6 animate-spin text-blue-600" />
                    <span className="font-semibold">
                        토스페이먼츠 결제 수단을 불러오고 있습니다...
                    </span>
                </div>
            )}

            {/* 토스 결제 수단 렌더링 컨테이너 */}
            <div
                id="toss-payment-methods"
                className="w-full overflow-hidden rounded-xl"
            />

            {/* 토스 이용약관 렌더링 컨테이너 */}
            <div
                id="toss-payment-agreement"
                className="w-full overflow-hidden rounded-xl"
            />
        </div>
    );
});

export default TossPaymentWidget;
