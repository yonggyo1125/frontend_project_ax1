import {
    Order,
    OrderItem,
    OrderStatus,
    PaymentLog,
    ShippingInfo,
} from '@/domains/orders/types/order.types';
import { createServerClient } from '@/shared/lib/supabase';
import { cache } from 'react';

const UUID_REGEX =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const getOrderReceipt = cache(
    async (orderId: string): Promise<Order | null> => {
        if (!orderId || !UUID_REGEX.test(orderId.trim())) {
            return null;
        }

        const supabase = createServerClient();

        const { data, error } = await supabase
            .from('orders')
            .select(
                `
                id,
                user_id,
                items_total_amount,
                shipping_fee,
                total_amount,
                status,
                shipping_info,
                payment_key,
                created_at,
                updated_at,
                order_items (
                    id,
                    order_id,
                    product_id,
                    product_name,
                    price,
                    quantity,
                    created_at
                ),
                payments (
                    id,
                    order_id,
                    payment_key,
                    transaction_key,
                    transaction_type,
                    status,
                    method,
                    amount,
                    supplied_amount,
                    vat,
                    cancel_reason,
                    tax_free_amount,
                    requested_at,
                    approved_at,
                    receipt_url,
                    raw_response,
                    created_at
                )
            `,
            )
            .eq('id', orderId.trim())
            .is('deleted_at', null)
            .single();

        if (error || !data) {
            return null;
        }

        const rawItems = Array.isArray(data.order_items)
            ? data.order_items
            : [];
        const rawPayments = Array.isArray(data.payments) ? data.payments : [];

        return {
            id: data.id,
            user_id: data.user_id,
            items_total_amount: Number(data.items_total_amount),
            shipping_fee: Number(data.shipping_fee),
            total_amount: Number(data.total_amount),
            status: data.status as OrderStatus,
            shipping_info: data.shipping_info as ShippingInfo,
            payment_key: data.payment_key,
            created_at: data.created_at,
            updated_at: data.updated_at,
            order_items: rawItems.map((item) => ({
                id: item.id,
                order_id: item.order_id,
                product_id: item.product_id,
                product_name: item.product_name,
                price: Number(item.price),
                quantity: Number(item.quantity),
                created_at: item.created_at,
            })) as OrderItem[],
            payments: rawPayments.map((pay) => ({
                id: pay.id,
                order_id: pay.order_id,
                payment_key: pay.payment_key,
                transaction_key: pay.transaction_key,
                transaction_type: pay.transaction_type,
                status: pay.status,
                method: pay.method,
                amount: Number(pay.amount),
                supplied_amount: Number(pay.supplied_amount ?? 0),
                vat: Number(pay.vat ?? 0),
                cancel_reason: pay.cancel_reason,
                tax_free_amount: Number(pay.tax_free_amount ?? 0),
                requested_at: pay.requested_at,
                approved_at: pay.approved_at,
                receipt_url: pay.receipt_url,
                raw_response: pay.raw_response as Record<
                    string,
                    unknown
                > | null,
                created_at: pay.created_at,
            })) as PaymentLog[],
        };
    },
);
