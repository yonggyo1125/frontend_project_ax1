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
