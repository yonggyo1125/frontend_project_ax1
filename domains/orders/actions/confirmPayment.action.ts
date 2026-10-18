'use server';

import { getOrderReceipt } from '@/domains/orders/queries/getOrderReceipt.query';
import {
    requestTossPaymentConfirm,
    verifyOrderBeforeConfirm,
} from '@/domains/orders/services/toss.service';
import {
    ConfirmPaymentInput,
    ConfirmPaymentResultData,
} from '@/domains/orders/types/order.types';
import { createServerClient } from '@/shared/lib/supabase';
import { ActionState } from '@/shared/types/action.types';
import { revalidatePath } from 'next/cache';

export async function confirmPaymentAction(
    input: ConfirmPaymentInput,
): Promise<ActionState<ConfirmPaymentResultData>> {
    const paymentKey = input.paymentKey?.trim() || '';
    const orderId = input.orderId?.trim() || '';
    const amount = Number(input.amount);

    const supabase = createServerClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return {
            success: false,
            message: '결제 승인을 위해 로그인이 필요합니다.',
        };
    }

    // DB에서 생성된 가주문(PENDING) 조회
    const existingOrder = await getOrderReceipt(orderId);
    if (!existingOrder) {
        return {
            success: false,
            message: '존재하지 않거나 접근 권한이 없는 주문 번호입니다.',
        };
    }

    // 가주문 금액(total_amount)과 결제 승인 요청 금액(amount) 교차 검증 및 멱등성 확인
    const verification = verifyOrderBeforeConfirm(existingOrder, {
        paymentKey,
        orderId,
        amount,
    });

    if (!verification.valid) {
        return {
            success: false,
            message:
                verification.message ||
                '주문 금액 검증에 실패하여 결제를 승인할 수 없습니다.',
        };
    }

    // 이미 PAID 완료된 주문인 경우(새로고침 등) 토스 API 재호출 없이 즉시 성공 반환
    if (verification.alreadyPaid) {
        return {
            success: true,
            message: '이미 결제가 완료된 주문입니다.',
            data: {
                order: existingOrder,
                alreadyPaid: true,
            },
        };
    }

    // 토스페이먼츠 결제 승인 API(POST /v1/payments/confirm) 호출
    const tossResult = await requestTossPaymentConfirm({
        paymentKey,
        orderId,
        amount,
    });

    if (!tossResult.success || !tossResult.data) {
        return {
            success: false,
            message:
                tossResult.message ||
                '토스페이먼츠 결제 승인 처리 중 오류가 발생했습니다.',
        };
    }

    const tossData = tossResult.data;

    // public.orders 상태를 'PAID'로 업데이트하고 payment_key 기록
    const { error: orderUpdateError } = await supabase
        .from('orders')
        .update({
            status: 'PAID',
            payment_key: tossData.paymentKey || paymentKey,
            updated_at: new Date().toISOString(),
        })
        .eq('id', orderId);

    if (orderUpdateError) {
        return {
            success: false,
            message: `주문 상태 업데이트에 실패했습니다: ${orderUpdateError.message}`,
        };
    }

    // public.payments 테이블에 결제 승인 트랜잭션 로그 INSERT
    const receiptUrl =
        tossData.receipt && typeof tossData.receipt.url === 'string'
            ? tossData.receipt.url
            : null;

    const { error: paymentInsertError } = await supabase
        .from('payments')
        .insert([
            {
                order_id: orderId,
                payment_key: tossData.paymentKey || paymentKey,
                transaction_key: tossData.lastTransactionKey || null,
                transaction_type: 'PAYMENT',
                status: tossData.status || 'DONE',
                method: tossData.method || '카드',
                amount: Number(tossData.totalAmount ?? amount),
                supplied_amount: Number(tossData.suppliedAmount ?? 0),
                vat: Number(tossData.vat ?? 0),
                tax_free_amount: Number(tossData.taxFreeAmount ?? 0),
                requested_at: tossData.requestedAt || new Date().toISOString(),
                approved_at: tossData.approvedAt || new Date().toISOString(),
                receipt_url: receiptUrl,
                raw_response: tossData as Record<string, unknown>,
            },
        ]);

    if (paymentInsertError) {
        console.error(
            '결제 트랜잭션 로그(payments) 기록 실패:',
            paymentInsertError.message,
        );
    }

    // 영수증 및 관리자 주문 관리 경로 캐시 재검증
    revalidatePath('/checkout/success');
    revalidatePath('/admin/orders');

    // 최종 업데이트된 주문 + 품목 + 결제 로그 재조회하여 반환
    const updatedOrder = (await getOrderReceipt(orderId)) || {
        ...existingOrder,
        status: 'PAID',
        payment_key: tossData.paymentKey || paymentKey,
    };

    return {
        success: true,
        message: '결제 승인이 정상적으로 완료되었습니다.',
        data: {
            order: updatedOrder,
            alreadyPaid: false,
        },
    };
}
