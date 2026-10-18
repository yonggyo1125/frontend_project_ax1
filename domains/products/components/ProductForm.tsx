'use client';

import { Category } from '@/domains/categories/types/category.types';
import FileUpload from '@/domains/files/components/FileUpload';
import { FileInfo } from '@/domains/files/types/file.types';
import { createProductAction } from '@/domains/products/actions/createProduct.action';
import { updateProductAction } from '@/domains/products/actions/updateProduct.action';
import { Product } from '@/domains/products/types/product.types';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { INITIAL_ACTION_STATE } from '@/shared/types/action.types';
import { cn } from '@/shared/utils/cn';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useMemo } from 'react';
import { FiAlertCircle, FiArrowLeft, FiSave } from 'react-icons/fi';
import { v4 as uuid4 } from 'uuid';

interface ProductFormProps {
    categories: Category[];
    initialData?: Product;
    initialFiles?: FileInfo[];
}

interface FlatCategoryOption {
    id: string;
    label: string;
}

// 1~3차 중첩 카테고리 트리를 셀렉트 박스용 경로 문자열(예: 패션의류 > 상의 > 티셔츠)로 평탄화
function flattenCategoriesForSelect(
    nodes: Category[],
    parentPath = '',
): FlatCategoryOption[] {
    const result: FlatCategoryOption[] = [];
    for (const node of nodes) {
        const currentPath = parentPath
            ? `${parentPath} > ${node.name}`
            : node.name;
        result.push({ id: node.id, label: currentPath });
        if (node.children && node.children.length > 0) {
            result.push(
                ...flattenCategoriesForSelect(node.children, currentPath),
            );
        }
    }
    return result;
}

export default function ProductForm({
    categories,
    initialData,
    initialFiles = [],
}: ProductFormProps) {
    const router = useRouter();
    const isEdit = Boolean(initialData?.id);

    const currentGid = useMemo(
        () => initialData?.gid || `prod-${uuid4()}`,
        [initialData?.gid],
    );

    const categoryOptions = useMemo(
        () => flattenCategoriesForSelect(categories),
        [categories],
    );

    const targetAction = isEdit
        ? updateProductAction.bind(null, initialData!.id)
        : createProductAction;

    const [state, formAction, isPending] = useActionState(
        targetAction,
        INITIAL_ACTION_STATE,
    );

    useEffect(() => {
        if (state.success) {
            alert(
                state.message ||
                    `상품이 성공적으로 ${isEdit ? '수정' : '등록'}되었습니다.`,
            );
            router.push('/admin/products');
            router.refresh();
        } else if (state.message && !state.errors) {
            alert(state.message);
        }
    }, [state.success, state.message, state.errors, isEdit, router]);

    return (
        <form
            action={formAction}
            noValidate
            className="space-y-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm md:p-8"
        >
            <input type="hidden" name="gid" value={currentGid} />

            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                    <span className="text-xs font-bold tracking-wider text-blue-600 uppercase">
                        Product Management
                    </span>
                    <h2 className="mt-1 text-xl font-black text-gray-900">
                        {isEdit
                            ? '상품 정보 및 진열 수정'
                            : '신규 상품 마스터 등록'}
                    </h2>
                </div>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => router.push('/admin/products')}
                    className="gap-1.5 text-xs font-bold"
                >
                    <FiArrowLeft className="h-3.5 w-3.5" />
                    <span>목록으로</span>
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* 상품명 */}
                <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-bold text-gray-700">
                        상품명 <span className="text-red-500">*</span>
                    </label>
                    <Input
                        name="name"
                        defaultValue={initialData?.name || ''}
                        placeholder="예: 와이드 스트레이트 인디고 데님 팬츠"
                        className={cn(
                            'h-11',
                            state.errors?.name && 'border-red-500 bg-red-50/20',
                        )}
                    />
                    {state.errors?.name && (
                        <p className="flex items-center gap-1 text-xs font-medium text-red-500">
                            <FiAlertCircle className="h-3 w-3 shrink-0" />
                            <span>{state.errors.name}</span>
                        </p>
                    )}
                </div>

                {/* 판매 가격 */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">
                        판매 가격 (원) <span className="text-red-500">*</span>
                    </label>
                    <Input
                        name="price"
                        type="number"
                        min={0}
                        step={100}
                        defaultValue={initialData?.price ?? ''}
                        placeholder="58000"
                        className={cn(
                            'h-11',
                            state.errors?.price &&
                                'border-red-500 bg-red-50/20',
                        )}
                    />
                    {state.errors?.price && (
                        <p className="flex items-center gap-1 text-xs font-medium text-red-500">
                            <FiAlertCircle className="h-3 w-3 shrink-0" />
                            <span>{state.errors.price}</span>
                        </p>
                    )}
                </div>

                {/* 진열 카테고리 선택 */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">
                        진열 카테고리 <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="categoryId"
                        defaultValue={
                            initialData?.categoryId ||
                            categoryOptions[0]?.id ||
                            ''
                        }
                        aria-label="진열 카테고리"
                        className={cn(
                            'h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none focus:border-blue-600',
                            state.errors?.categoryId &&
                                'border-red-500 bg-red-50/20',
                        )}
                    >
                        <option value="">카테고리를 선택하세요</option>
                        {categoryOptions.map((opt) => (
                            <option key={opt.id} value={opt.id}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                    {state.errors?.categoryId && (
                        <p className="flex items-center gap-1 text-xs font-medium text-red-500">
                            <FiAlertCircle className="h-3 w-3 shrink-0" />
                            <span>{state.errors.categoryId}</span>
                        </p>
                    )}
                </div>

                {/* 진열 우선순위 */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">
                        진열 우선순위 (낮은 숫자일수록 상단 노출)
                    </label>
                    <Input
                        name="displayPriority"
                        type="number"
                        min={0}
                        defaultValue={initialData?.displayPriority ?? 1}
                        className="h-11"
                    />
                </div>

                {/* 쇼핑몰 진열 노출 여부 */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">
                        쇼핑몰 진열 상태
                    </label>
                    <select
                        name="isDisplayed"
                        defaultValue={
                            initialData?.isDisplayed === false
                                ? 'false'
                                : 'true'
                        }
                        aria-label="쇼핑몰 진열 상태"
                        className="h-11 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none focus:border-blue-600"
                    >
                        <option value="true">진열 노출 (판매 중)</option>
                        <option value="false">진열 숨김 (비노출)</option>
                    </select>
                </div>

                {/* 상품 상세 설명 */}
                <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-bold text-gray-700">
                        상품 상세 설명
                    </label>
                    <textarea
                        name="description"
                        rows={5}
                        defaultValue={initialData?.description || ''}
                        placeholder="상품의 소재, 핏, 주요 특징 등 상세 설명을 입력하세요."
                        className="w-full rounded-2xl border border-gray-200 p-4 text-sm text-gray-800 transition-colors outline-none focus:border-blue-600"
                    />
                </div>

                {/* 상품 대표/갤러리 이미지 다중 샤딩 업로더 */}
                <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-bold text-gray-700">
                        상품 대표/갤러리 이미지 (다중 업로드 · 첫 번째 이미지가
                        대표 썸네일)
                    </label>
                    <FileUpload
                        gid={currentGid}
                        location="product_main"
                        multiple={true}
                        initialFiles={initialFiles}
                    />
                </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push('/admin/products')}
                    className="h-11 px-6 text-xs font-bold"
                >
                    취소
                </Button>
                <Button
                    type="submit"
                    disabled={isPending}
                    className="h-11 gap-1.5 bg-blue-600 px-6 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700"
                >
                    <FiSave className="h-4 w-4" />
                    <span>
                        {isPending
                            ? '저장 처리 중...'
                            : isEdit
                              ? '상품 수정 완료'
                              : '상품 등록하기'}
                    </span>
                </Button>
            </div>
        </form>
    );
}
