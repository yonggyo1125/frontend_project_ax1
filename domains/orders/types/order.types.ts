export interface ShippingInfo {
    recipientName: string;
    phone: string;
    zipCode: string;
    address: string;
    detailAddress: string;
    deliveryMemo?: string;
}

export type OrderStatus = 'PENDING' | 'PAID' | 'CANCELLED';

export type PaymentTransactionType = 'PAYMENT' | 'CANCEL' | 'PARTIAL_CANCEL';

export type TossPaymentStatus =
    | 'READY'
    | 'IN_PROGRESS'
    | 'WAITING_FOR_DEPOSIT'
    | 'DONE'
    | 'CANCELED'
    | 'PARTIAL_CANCELED'
    | 'ABORTED'
    | 'EXPIRED';

export interface OrderItem {
    id: string;
    order_id: string;
    product_id: string | null;
    product_name: string;
    price: number;
    quantity: number;
    created_at: string;
}

export interface PaymentLog {
    id: string;
    order_id: string;
    payment_key: string;
    transaction_key?: string | null;
    transaction_type: PaymentTransactionType;
    status: TossPaymentStatus;
    method: string;
    amount: number;
    supplied_amount: number;
    vat: number;
    cancel_reason?: string | null;
    tax_free_amount: number;
    requested_at?: string | null;
    approved_at?: string | null;
    receipt_url?: string | null;
    raw_response?: Record<string, unknown> | null;
    created_at: string;
}

export interface Order {
    id: string;
    user_id: string | null;
    items_total_amount: number;
    shipping_fee: number;
    total_amount: number;
    status: OrderStatus;
    shipping_info: ShippingInfo;
    payment_key?: string | null;
    created_at: string;
    updated_at: string;
    order_items?: OrderItem[];
    payments?: PaymentLog[];
}

// 클라이언트 주문서에서 전송하는 개별 품목 데이터
export interface OrderItemInput {
    productId: string;
    name: string;
    price: number;
    quantity: number;
}

// 서버 DB(products)에서 조회한 실제 상품 기준 데이터
export interface ServerProductPriceInfo {
    id: string;
    name: string;
    price: number;
}

// create_order_with_items RPC의 p_items JSONB 규격과 1:1 매핑되는 영구 스냅샷 타입
export interface OrderItemSnapshot {
    product_id: string;
    product_name: string;
    price: number;
    quantity: number;
}

// 주문 금액 및 배송비 무결성 검증 결과
export interface OrderAmountValidationResult {
    valid: boolean;
    message?: string;
    serverItemsTotalAmount: number;
    serverShippingFee: number;
    serverTotalAmount: number;
    snapshotItems: OrderItemSnapshot[];
}

// 토스 결제 승인 요청 입력 파라미터 (/checkout/success 콜백 쿼리 대응)
export interface ConfirmPaymentInput {
    paymentKey: string;
    orderId: string;
    amount: number;
}

// 토스페이먼츠 v1/payments/confirm API 응답 스펙
export interface TossPaymentConfirmResponse {
    paymentKey: string;
    orderId: string;
    orderName?: string;
    status: TossPaymentStatus;
    method?: string;
    totalAmount: number;
    suppliedAmount?: number;
    vat?: number;
    taxFreeAmount?: number;
    requestedAt?: string;
    approvedAt?: string;
    lastTransactionKey?: string | null;
    receipt?: {
        url?: string;
    } | null;
    [key: string]: unknown;
}

// confirmPaymentAction 반환 데이터 규격
export interface ConfirmPaymentResultData {
    order: Order;
    alreadyPaid?: boolean;
}
