'use client';

import { formatPrice } from '@/shared/utils/formatPrice';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';

export default function CartItemList() {
    const [items, setItems] = useState([
        {
            id: 'prod-001',
            name: '오버핏 헤비 코튼 라운드 티셔츠',
            price: 32000,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800',
        },
        {
            id: 'prod-002',
            name: '링클프리 클래식 옥스포드 셔츠',
            price: 49000,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800',
        },
    ]);

    const handleQuantity = (id: string, delta: number) => {
        setItems((prev) =>
            prev.map((item) =>
                item.id === id
                    ? { ...item, quantity: Math.max(1, item.quantity + delta) }
                    : item,
            ),
        );
    };

    const handleRemove = (id: string) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
    };

    const itemsTotal = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
    );

    return (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
                {items.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-gray-200 p-12 text-center text-sm text-gray-400">
                        장바구니가 비어 있습니다.
                    </div>
                ) : (
                    items.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
                        >
                            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-50">
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="flex flex-1 flex-col justify-between">
                                <div className="flex items-start justify-between">
                                    <h3 className="text-sm font-bold text-gray-900">
                                        {item.name}
                                    </h3>
                                    <button
                                        type="button"
                                        onClick={() => handleRemove(item.id)}
                                        className="text-gray-400 hover:text-red-500"
                                    >
                                        <FiTrash2 className="h-4 w-4" />
                                    </button>
                                </div>
                                <div className="mt-3 flex items-center justify-between">
                                    <span className="text-sm font-black text-gray-900">
                                        {formatPrice(
                                            item.price * item.quantity,
                                        )}
                                    </span>
                                    <div className="flex items-center rounded-lg border border-gray-200">
                                        <button
                                            onClick={() =>
                                                handleQuantity(item.id, -1)
                                            }
                                            className="p-1.5 text-gray-500 hover:bg-gray-50"
                                        >
                                            <FiMinus className="h-3 w-3" />
                                        </button>
                                        <span className="w-8 text-center text-xs font-bold">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() =>
                                                handleQuantity(item.id, 1)
                                            }
                                            className="p-1.5 text-gray-500 hover:bg-gray-50"
                                        >
                                            <FiPlus className="h-3 w-3" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-4 rounded-2xl border border-gray-100 bg-gray-50 p-6 shadow-sm">
                    <h3 className="text-sm font-black text-gray-900">
                        주문 요약
                    </h3>
                    <div className="space-y-2 text-xs text-gray-600">
                        <div className="flex justify-between">
                            <span>상품 금액</span>
                            <span className="font-semibold text-gray-900">
                                {formatPrice(itemsTotal)}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>배송비</span>
                            <span className="font-semibold text-gray-900">
                                {formatPrice(
                                    itemsTotal >= 50000 || itemsTotal === 0
                                        ? 0
                                        : 3000,
                                )}
                            </span>
                        </div>
                    </div>
                    <div className="border-t border-gray-200 pt-3">
                        <div className="flex justify-between font-black text-gray-900">
                            <span className="text-xs">총 결제 예정 금액</span>
                            <span className="text-lg text-blue-600">
                                {formatPrice(
                                    itemsTotal +
                                        (itemsTotal >= 50000 || itemsTotal === 0
                                            ? 0
                                            : 3000),
                                )}
                            </span>
                        </div>
                    </div>
                    <Link
                        href="/checkout"
                        className="block w-full rounded-xl bg-blue-600 py-3.5 text-center text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700"
                    >
                        주문서 작성하기
                    </Link>
                </div>
            </div>
        </div>
    );
}
