import { formatPrice } from '@/shared/utils/formatPrice';
import Link from 'next/link';
import { FiCheckCircle } from 'react-icons/fi';

export default function OrderReceipt({ orderId }: { orderId: string }) {
    return (
        <div className="mx-auto max-w-lg rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-xl shadow-gray-100/50">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <FiCheckCircle className="h-10 w-10" />
            </div>
            <h1 className="text-2xl font-black text-gray-900">
                주문 및 결제 완료
            </h1>
            <p className="mt-1 text-xs text-gray-500">
                고객님의 소중한 주문이 정상 접수되었습니다.
            </p>

            <div className="mt-6 space-y-2.5 rounded-2xl bg-gray-50 p-5 text-left text-xs">
                <div className="flex justify-between">
                    <span className="text-gray-400">주문 번호</span>
                    <span className="font-bold text-gray-900">{orderId}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400">결제 상태</span>
                    <span className="font-bold text-blue-600">
                        결제 완료 (PAID)
                    </span>
                </div>
                <div className="flex justify-between border-t border-gray-200/80 pt-2">
                    <span className="text-gray-400">총 결제금액</span>
                    <span className="font-black text-gray-900">
                        {formatPrice(81000)}
                    </span>
                </div>
            </div>

            <div className="mt-8 flex gap-3">
                <Link
                    href="/products"
                    className="flex-1 rounded-xl border border-gray-300 py-3 text-xs font-bold text-gray-700 hover:bg-gray-50"
                >
                    쇼핑 계속하기
                </Link>
                <Link
                    href="/"
                    className="flex-1 rounded-xl bg-gray-900 py-3 text-xs font-bold text-white hover:bg-gray-800"
                >
                    홈으로 가기
                </Link>
            </div>
        </div>
    );
}
