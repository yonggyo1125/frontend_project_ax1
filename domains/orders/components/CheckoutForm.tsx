'use client';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { ActionState, INITIAL_ACTION_STATE } from '@/shared/types/action.types';
import { cn } from '@/shared/utils/cn';
import { formatPrice } from '@/shared/utils/formatPrice';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect } from 'react';
import { FiAlertCircle, FiCreditCard, FiTruck } from 'react-icons/fi';

async function checkoutAction(
    prevState: ActionState,
    formData: FormData,
): Promise<ActionState> {
    const recipientName = formData.get('recipientName') as string;
    const phone = formData.get('phone') as string;
    const address = formData.get('address') as string;
    const detailAddress = formData.get('detailAddress') as string;
    const paymentAgreed = formData.get('paymentAgreed') as string;

    const errors: Record<string, string> = {};
    const phoneRegex = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;

    if (!recipientName || !recipientName.trim()) {
        errors.recipientName = '수령인 이름을 입력해 주세요.';
    }
    if (!phone || !phone.trim()) {
        errors.phone = '연락처를 입력해 주세요.';
    } else if (!phoneRegex.test(phone.trim())) {
        errors.phone =
            '올바른 휴대폰 번호 형식을 입력해 주세요. (예: 010-1234-5678)';
    }
    if (!address || !address.trim()) {
        errors.address = '기본 배송지 주소를 입력해 주세요.';
    }
    if (!detailAddress || !detailAddress.trim()) {
        errors.detailAddress = '상세 주소를 입력해 주세요.';
    }
    if (!paymentAgreed) {
        errors.paymentAgreed = '주문 및 결제 필수 약관에 동의해야 합니다.';
    }

    if (Object.keys(errors).length > 0) {
        return { success: false, errors };
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
        success: true,
        data: { orderId: 'ORD-20261015-001' },
    };
}

export default function CheckoutForm() {
    const router = useRouter();
    const [state, formAction, isPending] = useActionState(
        checkoutAction,
        INITIAL_ACTION_STATE,
    );

    const itemsTotal = 81000;
    const shippingFee = itemsTotal >= 50000 ? 0 : 3000;
    const totalAmount = itemsTotal + shippingFee;

    // 결제 생성 성공 시 완료 페이지로 전환
    useEffect(() => {
        if (state.success && (state.data as { orderId: string })?.orderId) {
            router.push(
                `/checkout/success?orderId=${(state.data as { orderId: string }).orderId}`,
            );
        }
    }, [state, router]);

    return (
        <form
            action={formAction}
            noValidate
            className="grid grid-cols-1 gap-8 lg:grid-cols-3"
        >
            <div className="space-y-6 lg:col-span-2">
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
                        <FiTruck className="h-5 w-5 text-blue-600" />
                        <h2 className="text-base font-bold text-gray-900">
                            배송 정보 입력
                        </h2>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-700">
                                    수령인
                                </label>
                                <Input
                                    name="recipientName"
                                    placeholder="홍길동"
                                    className={cn(
                                        state.errors?.recipientName &&
                                            'border-red-500 bg-red-50/20',
                                    )}
                                />
                                {state.errors?.recipientName && (
                                    <p className="flex items-center gap-1 text-xs text-red-500">
                                        <FiAlertCircle className="h-3 w-3" />
                                        <span>
                                            {state.errors.recipientName}
                                        </span>
                                    </p>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-xs font-semibold text-gray-700">
                                    연락처
                                </label>
                                <Input
                                    name="phone"
                                    placeholder="010-0000-0000"
                                    className={cn(
                                        state.errors?.phone &&
                                            'border-red-500 bg-red-50/20',
                                    )}
                                />
                                {state.errors?.phone && (
                                    <p className="flex items-center gap-1 text-xs text-red-500">
                                        <FiAlertCircle className="h-3 w-3" />
                                        <span>{state.errors.phone}</span>
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-700">
                                배송 주소
                            </label>
                            <div className="flex gap-2">
                                <Input
                                    name="zipCode"
                                    defaultValue="06236"
                                    readOnly
                                    className="w-28 bg-gray-50 text-gray-500"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => alert('우편번호 검색 기능')}
                                >
                                    우편번호 검색
                                </Button>
                            </div>
                            <Input
                                name="address"
                                placeholder="기본 주소를 입력하세요"
                                className={cn(
                                    'mt-2',
                                    state.errors?.address &&
                                        'border-red-500 bg-red-50/20',
                                )}
                            />
                            {state.errors?.address && (
                                <p className="flex items-center gap-1 text-xs text-red-500">
                                    <FiAlertCircle className="h-3 w-3" />
                                    <span>{state.errors.address}</span>
                                </p>
                            )}

                            <Input
                                name="detailAddress"
                                placeholder="상세 주소를 입력하세요 (동, 호수 등)"
                                className={cn(
                                    'mt-2',
                                    state.errors?.detailAddress &&
                                        'border-red-500 bg-red-50/20',
                                )}
                            />
                            {state.errors?.detailAddress && (
                                <p className="flex items-center gap-1 text-xs text-red-500">
                                    <FiAlertCircle className="h-3 w-3" />
                                    <span>{state.errors.detailAddress}</span>
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
                        <FiCreditCard className="h-5 w-5 text-blue-600" />
                        <h2 className="text-base font-bold text-gray-900">
                            결제 수단
                        </h2>
                    </div>
                    {/* 토스 결제 위젯 플레이스홀더 */}
                    <div className="flex h-44 flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/70 p-6 text-center">
                        <span className="font-bold text-gray-800">
                            Toss Payments 결제 위젯 영역
                        </span>
                        <p className="mt-1 text-xs text-gray-400">
                            9일 차 토스페이먼츠 연동 시 카드/간편결제 UI가 자동
                            렌더링됩니다.
                        </p>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-1">
                <div className="sticky top-24 space-y-4 rounded-2xl border border-gray-100 bg-gray-50/80 p-6 shadow-sm">
                    <h3 className="text-sm font-black text-gray-900">
                        최종 결제 금액
                    </h3>
                    <div className="space-y-2.5 text-xs text-gray-600">
                        <div className="flex justify-between">
                            <span>총 상품금액</span>
                            <span className="font-semibold text-gray-900">
                                {formatPrice(itemsTotal)}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>배송비</span>
                            <span className="font-semibold text-gray-900">
                                {formatPrice(shippingFee)}
                            </span>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-3">
                        <div className="flex items-baseline justify-between">
                            <span className="text-xs font-bold text-gray-900">
                                총 결제금액
                            </span>
                            <span className="text-xl font-black text-blue-600">
                                {formatPrice(totalAmount)}
                            </span>
                        </div>
                    </div>

                    <div className="pt-2">
                        <label className="flex items-start gap-2 text-xs text-gray-600">
                            <input
                                type="checkbox"
                                name="paymentAgreed"
                                value="true"
                                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span>
                                구매조건 확인 및 결제 진행에 동의합니다. (필수)
                            </span>
                        </label>
                        {state.errors?.paymentAgreed && (
                            <p className="mt-1 flex items-center gap-1 text-xs text-red-500">
                                <FiAlertCircle className="h-3 w-3" />
                                <span>{state.errors.paymentAgreed}</span>
                            </p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        disabled={isPending}
                        className="h-12 w-full bg-blue-600 font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700"
                    >
                        {isPending
                            ? '주문 생성 중...'
                            : `${formatPrice(totalAmount)} 결제하기`}
                    </Button>
                </div>
            </div>
        </form>
    );
}
