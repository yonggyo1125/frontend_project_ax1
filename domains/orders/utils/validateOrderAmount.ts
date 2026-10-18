import {
    DEFAULT_SHIPPING_FEE,
    FREE_SHIPPING_THRESHOLD,
} from '@/domains/cart/types/cart.types';
import {
    OrderAmountValidationResult,
    OrderItemInput,
    OrderItemSnapshot,
    ServerProductPriceInfo,
} from '@/domains/orders/types/order.types';

export interface ValidateOrderAmountParams {
    clientItems: OrderItemInput[];
    serverProducts: ServerProductPriceInfo[];
    clientItemsTotalAmount: number;
    clientShippingFee: number;
    clientTotalAmount: number;
}

export function validateOrderAmount({
    clientItems,
    serverProducts,
    clientItemsTotalAmount,
    clientShippingFee,
    clientTotalAmount,
}: ValidateOrderAmountParams): OrderAmountValidationResult {
    if (!clientItems || clientItems.length === 0) {
        return {
            valid: false,
            message: '주문할 상품 목록이 비어 있습니다.',
            serverItemsTotalAmount: 0,
            serverShippingFee: 0,
            serverTotalAmount: 0,
            snapshotItems: [],
        };
    }

    const productMap = new Map<string, ServerProductPriceInfo>();
    for (const prod of serverProducts) {
        productMap.set(prod.id, prod);
    }

    let serverItemsTotalAmount = 0;
    const snapshotItems: OrderItemSnapshot[] = [];

    for (const item of clientItems) {
        if (
            !item.quantity ||
            item.quantity < 1 ||
            !Number.isInteger(item.quantity)
        ) {
            return {
                valid: false,
                message: `상품 주문 수량이 올바르지 않습니다. (${item.name})`,
                serverItemsTotalAmount: 0,
                serverShippingFee: 0,
                serverTotalAmount: 0,
                snapshotItems: [],
            };
        }

        const dbProduct = productMap.get(item.productId);
        if (!dbProduct) {
            return {
                valid: false,
                message: `존재하지 않거나 판매 중단된 상품이 포함되어 있습니다. (${item.name})`,
                serverItemsTotalAmount: 0,
                serverShippingFee: 0,
                serverTotalAmount: 0,
                snapshotItems: [],
            };
        }

        // 클라이언트가 보낸 단가와 실제 DB 상품 단가 비교 (단가 위·변조 방어)
        if (Number(item.price) !== Number(dbProduct.price)) {
            return {
                valid: false,
                message: `상품 가격 정보가 변경되었거나 위·변조되었습니다. (${dbProduct.name})`,
                serverItemsTotalAmount: 0,
                serverShippingFee: 0,
                serverTotalAmount: 0,
                snapshotItems: [],
            };
        }

        serverItemsTotalAmount += dbProduct.price * item.quantity;
        snapshotItems.push({
            product_id: dbProduct.id,
            product_name: dbProduct.name,
            price: dbProduct.price,
            quantity: item.quantity,
        });
    }

    // 서버 기준 조건부 배송비 계산 (50,000원 이상 무료, 미만 3,000원)
    const serverShippingFee =
        serverItemsTotalAmount >= FREE_SHIPPING_THRESHOLD
            ? 0
            : DEFAULT_SHIPPING_FEE;
    const serverTotalAmount = serverItemsTotalAmount + serverShippingFee;

    // 순수 상품 합계 검증
    if (clientItemsTotalAmount !== serverItemsTotalAmount) {
        return {
            valid: false,
            message: `상품 총액이 서버 계산 결과와 일치하지 않습니다. (요청: ${clientItemsTotalAmount}원, 서버: ${serverItemsTotalAmount}원)`,
            serverItemsTotalAmount,
            serverShippingFee,
            serverTotalAmount,
            snapshotItems: [],
        };
    }

    // 배송비 위·변조 검증
    if (clientShippingFee !== serverShippingFee) {
        return {
            valid: false,
            message: `배송비가 서버 정책과 일치하지 않습니다. (요청: ${clientShippingFee}원, 서버: ${serverShippingFee}원)`,
            serverItemsTotalAmount,
            serverShippingFee,
            serverTotalAmount,
            snapshotItems: [],
        };
    }

    // 최종 결제 금액 일치 검증
    if (clientTotalAmount !== serverTotalAmount) {
        return {
            valid: false,
            message: `최종 결제 예정 금액이 위·변조되었거나 일치하지 않습니다. (요청: ${clientTotalAmount}원, 서버: ${serverTotalAmount}원)`,
            serverItemsTotalAmount,
            serverShippingFee,
            serverTotalAmount,
            snapshotItems: [],
        };
    }

    return {
        valid: true,
        serverItemsTotalAmount,
        serverShippingFee,
        serverTotalAmount,
        snapshotItems,
    };
}
