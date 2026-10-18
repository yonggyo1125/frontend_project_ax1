'use client';

import FileUpload from '@/domains/files/components/FileUpload';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { ActionState, INITIAL_ACTION_STATE } from '@/shared/types/action.types';
import { cn } from '@/shared/utils/cn';
import { useActionState, useEffect } from 'react';
import { FiAlertCircle } from 'react-icons/fi';
import { v4 as uuid4 } from 'uuid';

async function createProductAction(
    prevState: ActionState,
    formData: FormData,
): Promise<ActionState> {
    const name = formData.get('name') as string;
    const price = formData.get('price') as string;
    const errors: Record<string, string> = {};

    if (!name || !name.trim()) errors.name = '상품명을 입력해 주세요.';
    if (!price || Number(price) <= 0)
        errors.price = '올바른 상품 판매가를 입력해 주세요.';

    if (Object.keys(errors).length > 0) {
        return { success: false, errors };
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
    return {
        success: true,
        message: `신규 상품 [${name}] 등록이 완료되었습니다.`,
    };
}

export default function AdminNewProductPage() {
    const [state, formAction, isPending] = useActionState(
        createProductAction,
        INITIAL_ACTION_STATE,
    );

    useEffect(() => {
        if (state.success && state.message) {
            alert(state.message);
        }
    }, [state.success, state.message]);

    return (
        <div className="mx-auto max-w-4xl space-y-6">
            <div>
                <h1 className="text-2xl font-black text-gray-900">
                    새 상품 등록
                </h1>
                <p className="text-xs text-gray-500">
                    신규 상품의 마스터 정보와 이미지를 등록합니다.
                </p>
            </div>

            <form
                action={formAction}
                noValidate
                className="space-y-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm"
            >
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">
                        상품명
                    </label>
                    <Input
                        name="name"
                        placeholder="예: 와이드 스트레이트 인디고 데님 팬츠"
                        className={cn(
                            state.errors?.name && 'border-red-500 bg-red-50/20',
                        )}
                    />
                    {state.errors?.name && (
                        <p className="flex items-center gap-1 text-xs text-red-500">
                            <FiAlertCircle className="h-3 w-3" />
                            <span>{state.errors.name}</span>
                        </p>
                    )}
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">
                        판매 가격 (원)
                    </label>
                    <Input
                        name="price"
                        type="number"
                        placeholder="58000"
                        className={cn(
                            state.errors?.price &&
                                'border-red-500 bg-red-50/20',
                        )}
                    />
                    {state.errors?.price && (
                        <p className="flex items-center gap-1 text-xs text-red-500">
                            <FiAlertCircle className="h-3 w-3" />
                            <span>{state.errors.price}</span>
                        </p>
                    )}
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">
                        상품 대표/갤러리 이미지 (다중 업로드)
                    </label>
                    <FileUpload
                        gid={`prod-${uuid4()}`}
                        location="product_main"
                        multiple={true}
                    />
                </div>

                <div className="flex justify-end pt-4">
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="bg-blue-600 px-6 font-bold text-white hover:bg-blue-700"
                    >
                        {isPending ? '등록 처리 중...' : '상품 등록하기'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
