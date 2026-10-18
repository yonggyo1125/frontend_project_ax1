export const instant = false;

import CartItemList from '@/domains/cart/components/CartItemList';
import { Suspense } from 'react';

export default function CartPage() {
    return (
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
            <h1 className="mb-6 text-2xl font-black text-gray-900">장바구니</h1>
            <Suspense>
                <CartItemList />
            </Suspense>
        </div>
    );
}
