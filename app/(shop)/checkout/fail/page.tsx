export const instant = false;

import Link from 'next/link';
import { FiAlertOctagon, FiArrowLeft, FiShoppingBag } from 'react-icons/fi';

export default async function OrderFailPage({
    searchParams,
}: {
    searchParams: Promise<{
        code?: string;
        message?: string;
        orderId?: string;
    }>;
}) {
    const {
        code = 'PAY_PROCESS_CANCELED',
        message = '사용자에 의해 결제가 취소되었거나 승인에 실패했습니다.',
        orderId,
    } = await searchParams;

    return (
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
            <div className="mx-auto max-w-lg rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-xl shadow-gray-100/50">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-600">
                    <FiAlertOctagon className="h-10 w-10" />
                </div>

                <span className="inline-block rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600">
                    결제 중단 안내
                </span>
                <h1 className="mt-2 text-2xl font-black text-gray-900">
                    결제를 완료하지 못했습니다
                </h1>
                <p className="mt-1 text-xs text-gray-500">
                    장바구니 상품은 그대로 보관되어 있으니 다시 결제를 진행하실
                    수 있습니다.
                </p>

                <div className="mt-6 space-y-2.5 rounded-2xl bg-gray-50 p-5 text-left text-xs">
                    <div className="flex justify-between gap-4">
                        <span className="shrink-0 text-gray-400">
                            에러 코드
                        </span>
                        <span className="font-mono font-bold text-red-600">
                            {code}
                        </span>
                    </div>
                    <div className="flex justify-between gap-4">
                        <span className="shrink-0 text-gray-400">
                            실패 사유
                        </span>
                        <span className="text-right font-semibold text-gray-800">
                            {message}
                        </span>
                    </div>
                    {orderId && (
                        <div className="flex justify-between gap-4 border-t border-gray-200/80 pt-2">
                            <span className="shrink-0 text-gray-400">
                                가주문 번호
                            </span>
                            <span className="truncate font-mono text-gray-600">
                                {orderId}
                            </span>
                        </div>
                    )}
                </div>

                <div className="mt-8 flex gap-3">
                    <Link
                        href="/cart"
                        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-gray-300 py-3 text-xs font-bold text-gray-700 transition-colors hover:bg-gray-50"
                    >
                        <FiShoppingBag className="h-4 w-4" />
                        <span>장바구니로 이동</span>
                    </Link>
                    <Link
                        href="/checkout"
                        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-blue-600 py-3 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition-colors hover:bg-blue-700"
                    >
                        <FiArrowLeft className="h-4 w-4" />
                        <span>다시 결제하기</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
