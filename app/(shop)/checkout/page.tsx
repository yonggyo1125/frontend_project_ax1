import CheckoutForm from '@/domains/orders/components/CheckoutForm';

export default function CheckoutPage() {
    return (
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
            <h1 className="mb-6 text-2xl font-black text-gray-900">
                주문서 작성
            </h1>
            <CheckoutForm />
        </div>
    );
}
