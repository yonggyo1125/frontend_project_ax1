'use server';

import {
    OrderItemInput,
    ShippingInfo,
} from '@/domains/orders/types/order.types';
import { validateOrderAmount } from '@/domains/orders/utils/validateOrderAmount';
import { createServerClient } from '@/shared/lib/supabase';
import { ActionState } from '@/shared/types/action.types';
import { revalidatePath } from 'next/cache';

const PHONE_REGEX = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;

export async function createOrderAction(
    prevState: ActionState,
    formData: FormData,
): Promise<ActionState> {
    const recipientName =
        (formData.get('recipientName') as string)?.trim() || '';
    const phone = (formData.get('phone') as string)?.trim() || '';
    const zipCode = (formData.get('zipCode') as string)?.trim() || '06236';
    const address = (formData.get('address') as string)?.trim() || '';
    const detailAddress =
        (formData.get('detailAddress') as string)?.trim() || '';
    const deliveryMemo = (formData.get('deliveryMemo') as string)?.trim() || '';
    const paymentAgreed = formData.get('paymentAgreed') as string;

    const itemsJson = (formData.get('itemsJson') as string) || '[]';
    const clientItemsTotalAmount = Number(
        formData.get('itemsTotalAmount') || 0,
    );
    const clientShippingFee = Number(formData.get('shippingFee') || 0);
    const clientTotalAmount = Number(formData.get('totalAmount') || 0);

    // 배송지 입력 필드 유효성 검사
    const errors: Record<string, string> = {};

    if (!recipientName) {
        errors.recipientName = '수령인 이름을 입력해 주세요.';
    }
    if (!phone) {
        errors.phone = '연락처를 입력해 주세요.';
    } else if (!PHONE_REGEX.test(phone)) {
        errors.phone =
            '올바른 휴대폰 번호 형식을 입력해 주세요. (예: 010-1234-5678)';
    }
    if (!address) {
        errors.address = '기본 배송지 주소를 입력해 주세요.';
    }
    if (!detailAddress) {
        errors.detailAddress = '상세 주소를 입력해 주세요.';
    }
    if (!paymentAgreed) {
        errors.paymentAgreed = '주문 및 결제 필수 약관에 동의해야 합니다.';
    }

    if (Object.keys(errors).length > 0) {
        return {
            success: false,
            errors,
        };
    }

    // 장바구니 품목 JSON 파싱
    let clientItems: OrderItemInput[] = [];
    try {
        clientItems = JSON.parse(itemsJson) as OrderItemInput[];
    } catch {
        return {
            success: false,
            message: '주문 상품 데이터 형식이 올바르지 않습니다.',
        };
    }

    if (!Array.isArray(clientItems) || clientItems.length === 0) {
        return {
            success: false,
            message: '주문할 상품이 장바구니에 없습니다.',
        };
    }

    const supabase = createServerClient();

    // 로그인 세션 사용자 확인
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return {
            success: false,
            message: '주문을 진행하려면 로그인이 필요합니다.',
        };
    }

    // DB에서 실제 상품 정보(단가, 상품명) 일괄 조회
    const productIds = clientItems.map((item) => item.productId);
    const { data: dbProducts, error: productsError } = await supabase
        .from('products')
        .select('id, name, price')
        .in('id', productIds);

    if (productsError || !dbProducts) {
        return {
            success: false,
            message: `상품 가격 정보를 조회하지 못했습니다: ${productsError?.message || 'DB 오류'}`,
        };
    }

    // 서버 단가 및 조건부 배송비 무결성 검증
    const validation = validateOrderAmount({
        clientItems,
        serverProducts: dbProducts.map((p) => ({
            id: p.id,
            name: p.name,
            price: Number(p.price),
        })),
        clientItemsTotalAmount,
        clientShippingFee,
        clientTotalAmount,
    });

    if (!validation.valid) {
        return {
            success: false,
            message:
                validation.message ||
                '주문 금액 검증에 실패했습니다. 장바구니를 다시 확인해 주세요.',
        };
    }

    const shippingInfo: ShippingInfo = {
        recipientName,
        phone,
        zipCode,
        address,
        detailAddress,
        ...(deliveryMemo ? { deliveryMemo } : {}),
    };

    // Supabase PL/pgSQL RPC(create_order_with_items) 단일 호출로 원자성 가주문(PENDING) 생성
    const { data: orderId, error: rpcError } = await supabase.rpc(
        'create_order_with_items',
        {
            p_user_id: user.id,
            p_items_total_amount: validation.serverItemsTotalAmount,
            p_shipping_fee: validation.serverShippingFee,
            p_total_amount: validation.serverTotalAmount,
            p_shipping_info: shippingInfo,
            p_items: validation.snapshotItems,
        },
    );

    if (rpcError || !orderId) {
        return {
            success: false,
            message: `주문서 생성에 실패했습니다: ${rpcError?.message || '알 수 없는 오류'}`,
        };
    }

    revalidatePath('/admin/orders');

    return {
        success: true,
        message: '주문서가 생성되었습니다.',
        data: {
            orderId: String(orderId),
            totalAmount: validation.serverTotalAmount,
        },
    };
}
