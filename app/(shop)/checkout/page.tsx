export const instant = false;

import { getCurrentUser } from '@/domains/auth/queries/getCurrentUser.query';
import CheckoutForm from '@/domains/orders/components/CheckoutForm';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

export default async function CheckoutPage() {
    const { user } = await getCurrentUser();

    if (!user) {
        redirect('/login?redirectTo=/checkout');
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
            <h1 className="mb-6 text-2xl font-black text-gray-900">
                주문서 작성
            </h1>
            <Suspense>
                <CheckoutForm />
            </Suspense>
        </div>
    );
}
