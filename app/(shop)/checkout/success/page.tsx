export const instant = false;

import PaymentSuccessHandler from '@/domains/orders/components/PaymentSuccessHandler';
import { getOrderReceipt } from '@/domains/orders/queries/getOrderReceipt.query';
import { Suspense } from 'react';

export default async function OrderSuccessPage({
    searchParams,
}: {
    searchParams: Promise<{
        paymentKey?: string;
        orderId?: string;
        amount?: string;
    }>;
}) {
    const {
        paymentKey,
        orderId = 'ORD-20261023-001',
        amount,
    } = await searchParams;

    const initialOrder = await getOrderReceipt(orderId);
    const parsedAmount = amount
        ? Number(amount)
        : (initialOrder?.total_amount ?? 81000);

    return (
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
            <Suspense>
                <PaymentSuccessHandler
                    paymentKey={paymentKey}
                    orderId={orderId}
                    amount={parsedAmount}
                    initialOrder={initialOrder}
                />
            </Suspense>
        </div>
    );
}
