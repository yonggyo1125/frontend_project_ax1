export const instant = false;

import OrderReceipt from '@/domains/orders/components/OrderReceipt';
import { Suspense } from 'react';

export default async function OrderSuccessPage({
    searchParams,
}: {
    searchParams: Promise<{ orderId?: string; amount?: string }>;
}) {
    const { orderId = 'ORD-20261020-001', amount } = await searchParams;
    const parsedAmount = amount ? Number(amount) : 81000;

    return (
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
            <Suspense>
                <OrderReceipt orderId={orderId} amount={parsedAmount} />
            </Suspense>
        </div>
    );
}
