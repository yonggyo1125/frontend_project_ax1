import {
    ConfirmPaymentInput,
    Order,
    TossPaymentConfirmResponse,
} from '@/domains/orders/types/order.types';

const TOSS_CONFIRM_API_URL = 'https://api.tosspayments.com/v1/payments/confirm';
const DEFAULT_TEST_SECRET_KEY = 'test_gsk_docs_OaPz8L5KdmQXkzRz3y47BMw6';

// 토스 시크릿 키를 Basic Auth 규격(Base64("${secretKey}:"))으로 인코딩합니다.
export function encodeTossBasicAuth(secretKey: string): string {
    const cleanKey = secretKey.trim();
    const encoded = Buffer.from(`${cleanKey}:`).toString('base64');
    return `Basic ${encoded}`;
}

// 토스 결제창에 표시할 주문명(예: "오버핏 헤비 코튼 라운드 티셔츠 외 1건")을 포맷팅합니다.
export function formatOrderName(
    items: Array<{ name: string; quantity?: number }>,
): string {
    if (!items || items.length === 0) {
        return '스파르타 쇼핑몰 주문 상품';
    }
    const firstItemName = items[0].name.trim() || '주문 상품';
    if (items.length === 1) {
        return firstItemName;
    }
    return `${firstItemName} 외 ${items.length - 1}건`;
}

// 토스 승인 API 호출 전 DB에 저장된 가주문(orders) 정보와 콜백 파라미터의 정합성을 검증합니다.
export function verifyOrderBeforeConfirm(
    order: Pick<Order, 'id' | 'status' | 'total_amount'>,
    input: ConfirmPaymentInput,
): { valid: boolean; alreadyPaid?: boolean; message?: string } {
    if (!input.paymentKey || !input.paymentKey.trim()) {
        return {
            valid: false,
            message: '결제 키(paymentKey)가 누락되었습니다.',
        };
    }

    if (!input.orderId || input.orderId !== order.id) {
        return {
            valid: false,
            message: '주문 번호(orderId)가 일치하지 않습니다.',
        };
    }

    if (!Number.isFinite(input.amount) || input.amount <= 0) {
        return {
            valid: false,
            message: '유효하지 않은 결제 승인 금액입니다.',
        };
    }

    // DB에 기록된 가주문 총액(total_amount)과 토스 콜백 금액(amount) 교차 검증
    if (Number(order.total_amount) !== Number(input.amount)) {
        return {
            valid: false,
            message: `결제 승인 요청 금액(${input.amount}원)이 주문서 금액(${order.total_amount}원)과 일치하지 않습니다.`,
        };
    }

    if (order.status === 'CANCELLED') {
        return {
            valid: false,
            message: '이미 취소 처리된 주문은 결제 승인할 수 없습니다.',
        };
    }

    // 이미 PAID 처리된 주문인 경우 멱등성(Idempotency) 보장
    if (order.status === 'PAID') {
        return {
            valid: true,
            alreadyPaid: true,
        };
    }

    return {
        valid: true,
        alreadyPaid: false,
    };
}

export interface TossConfirmServiceResult {
    success: boolean;
    code?: string;
    message?: string;
    data?: TossPaymentConfirmResponse;
}

// 토스페이먼츠 결제 승인 API(POST /v1/payments/confirm)를 호출합니다.
export async function requestTossPaymentConfirm(
    input: ConfirmPaymentInput,
): Promise<TossConfirmServiceResult> {
    const secretKey = process.env.TOSS_SECRET_KEY || DEFAULT_TEST_SECRET_KEY;

    try {
        const response = await fetch(TOSS_CONFIRM_API_URL, {
            method: 'POST',
            headers: {
                Authorization: encodeTossBasicAuth(secretKey),
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                paymentKey: input.paymentKey,
                orderId: input.orderId,
                amount: Number(input.amount),
            }),
            cache: 'no-store',
        });

        const payload = (await response.json()) as Record<string, unknown>;

        if (!response.ok) {
            return {
                success: false,
                code: String(payload.code || 'TOSS_CONFIRM_ERROR'),
                message: String(
                    payload.message || '토스페이먼츠 결제 승인에 실패했습니다.',
                ),
            };
        }

        return {
            success: true,
            data: payload as unknown as TossPaymentConfirmResponse,
        };
    } catch (error) {
        const errMsg =
            error instanceof Error
                ? error.message
                : '네트워크 통신 오류가 발생했습니다.';
        return {
            success: false,
            code: 'NETWORK_ERROR',
            message: `토스 결제 승인 서버 통신 실패: ${errMsg}`,
        };
    }
}
