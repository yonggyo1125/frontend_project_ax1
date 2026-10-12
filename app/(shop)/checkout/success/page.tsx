import OrderReceipt from '@/domains/orders/components/OrderReceipt';

export default async function OrderSuccessPage({
    searchParams,
}: {
    searchParams: Promise<{ orderId?: string }>;
}) {
    const { orderId = 'ORD-20261015-001' } = await searchParams;

    return (
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
            <OrderReceipt orderId={orderId} />
        </div>
    );
}
