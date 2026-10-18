import { Order } from '@/domains/orders/types/order.types';
import { cn } from '@/shared/utils/cn';
import { formatPrice } from '@/shared/utils/formatPrice';
import Link from 'next/link';
import {
    FiCheckCircle,
    FiCreditCard,
    FiExternalLink,
    FiMapPin,
    FiPackage,
} from 'react-icons/fi';

interface OrderReceiptProps {
    orderId: string;
    amount?: number;
    order?: Order | null;
}

export default function OrderReceipt({
    orderId,
    amount = 81000,
    order,
}: OrderReceiptProps) {
    const isPaid = order ? order.status === 'PAID' : false;
    const displayAmount = order ? order.total_amount : amount;
    const latestPayment =
        order?.payments && order.payments.length > 0 ? order.payments[0] : null;

    return (
        <div className="mx-auto max-w-2xl rounded-3xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-100/50 md:p-8">
            <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                    <FiCheckCircle className="h-10 w-10" />
                </div>
                <span
                    className={cn(
                        'inline-block rounded-full px-3 py-1 text-xs font-bold',
                        isPaid
                            ? 'bg-green-50 text-green-700'
                            : 'bg-blue-50 text-blue-600',
                    )}
                >
                    {isPaid ? '결제 승인 완료 (PAID)' : '주문 접수 확인'}
                </span>
                <h1 className="mt-2 text-2xl font-black text-gray-900">
                    {isPaid
                        ? '주문 및 결제가 완료되었습니다!'
                        : '주문서가 접수되었습니다'}
                </h1>
                <p className="mt-1 text-xs text-gray-500">
                    고객님의 소중한 주문과 결제 내역이 안전하게 기록되었습니다.
                </p>
            </div>

            {/* 핵심 결제 요약 정보 */}
            <div className="mt-6 space-y-2.5 rounded-2xl bg-gray-50 p-5 text-xs">
                <div className="flex justify-between gap-4">
                    <span className="shrink-0 text-gray-400">주문 번호</span>
                    <span className="truncate font-mono font-bold text-gray-900">
                        {order?.id || orderId}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400">결제 상태</span>
                    <span
                        className={cn(
                            'font-bold',
                            isPaid ? 'text-green-600' : 'text-blue-600',
                        )}
                    >
                        {isPaid
                            ? '결제 완료 (PAID)'
                            : `결제 대기 (${order?.status || 'PENDING'})`}
                    </span>
                </div>
                {latestPayment && (
                    <>
                        <div className="flex justify-between">
                            <span className="text-gray-400">결제 수단</span>
                            <span className="font-semibold text-gray-800">
                                {latestPayment.method}
                            </span>
                        </div>
                        {latestPayment.approved_at && (
                            <div className="flex justify-between">
                                <span className="text-gray-400">승인 일시</span>
                                <span className="font-mono text-gray-700">
                                    {new Date(
                                        latestPayment.approved_at,
                                    ).toLocaleString('ko-KR')}
                                </span>
                            </div>
                        )}
                    </>
                )}
                {order && (
                    <>
                        <div className="flex justify-between border-t border-gray-200/70 pt-2">
                            <span className="text-gray-400">
                                순수 상품 금액
                            </span>
                            <span className="font-semibold text-gray-700">
                                {formatPrice(order.items_total_amount)}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">배송비</span>
                            <span className="font-semibold text-gray-700">
                                {order.shipping_fee === 0
                                    ? '무료 (0원)'
                                    : formatPrice(order.shipping_fee)}
                            </span>
                        </div>
                    </>
                )}
                <div className="flex items-baseline justify-between border-t border-gray-200 pt-2.5">
                    <span className="font-bold text-gray-700">
                        총 결제 확정 금액
                    </span>
                    <span className="text-lg font-black text-blue-600">
                        {formatPrice(displayAmount)}
                    </span>
                </div>

                {latestPayment?.receipt_url && (
                    <div className="pt-2 text-right">
                        <a
                            href={latestPayment.receipt_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:underline"
                        >
                            <FiCreditCard className="h-3 w-3" />
                            <span>토스페이먼츠 매출전표(영수증) 보기</span>
                            <FiExternalLink className="h-3 w-3" />
                        </a>
                    </div>
                )}
            </div>

            {/* 주문 품목 스냅샷 목록 */}
            {order?.order_items && order.order_items.length > 0 && (
                <div className="mt-5 rounded-2xl border border-gray-100 p-4">
                    <div className="mb-3 flex items-center gap-1.5 text-xs font-bold text-gray-800">
                        <FiPackage className="h-4 w-4 text-blue-600" />
                        <span>
                            주문 상품 내역 ({order.order_items.length}건)
                        </span>
                    </div>
                    <div className="divide-y divide-gray-100 text-xs">
                        {order.order_items.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0"
                            >
                                <div>
                                    <p className="font-semibold text-gray-900">
                                        {item.product_name}
                                    </p>
                                    <p className="text-[11px] text-gray-400">
                                        단가 {formatPrice(item.price)} · 수량{' '}
                                        {item.quantity}개
                                    </p>
                                </div>
                                <span className="font-bold text-gray-900">
                                    {formatPrice(item.price * item.quantity)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 배송지 정보 요약 */}
            {order?.shipping_info && (
                <div className="mt-4 rounded-2xl border border-gray-100 p-4 text-xs">
                    <div className="mb-2 flex items-center gap-1.5 font-bold text-gray-800">
                        <FiMapPin className="h-4 w-4 text-blue-600" />
                        <span>배송지 정보</span>
                    </div>
                    <div className="space-y-1 text-gray-600">
                        <p>
                            <span className="font-semibold text-gray-800">
                                {order.shipping_info.recipientName}
                            </span>{' '}
                            ({order.shipping_info.phone})
                        </p>
                        <p>
                            [{order.shipping_info.zipCode}]{' '}
                            {order.shipping_info.address}{' '}
                            {order.shipping_info.detailAddress}
                        </p>
                        {order.shipping_info.deliveryMemo && (
                            <p className="text-gray-400">
                                요청사항: {order.shipping_info.deliveryMemo}
                            </p>
                        )}
                    </div>
                </div>
            )}

            <div className="mt-8 flex gap-3 text-center">
                <Link
                    href="/products"
                    className="flex-1 rounded-xl border border-gray-300 py-3 text-xs font-bold text-gray-700 transition-colors hover:bg-gray-50"
                >
                    쇼핑 계속하기
                </Link>
                <Link
                    href="/"
                    className="flex-1 rounded-xl bg-gray-900 py-3 text-xs font-bold text-white transition-colors hover:bg-gray-800"
                >
                    홈으로 가기
                </Link>
            </div>
        </div>
    );
}
