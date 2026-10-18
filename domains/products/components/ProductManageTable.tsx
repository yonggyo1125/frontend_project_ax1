'use client';

import { Category } from '@/domains/categories/types/category.types';
import { deleteProductAction } from '@/domains/products/actions/deleteProduct.action';
import { Product } from '@/domains/products/types/product.types';
import { cn } from '@/shared/utils/cn';
import { formatPrice } from '@/shared/utils/formatPrice';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import {
    FiBox,
    FiEdit2,
    FiExternalLink,
    FiPlus,
    FiTrash2,
} from 'react-icons/fi';

interface ProductManageTableProps {
    products: Product[];
    categories: Category[];
}

function buildCategoryNameMap(
    nodes: Category[],
    parentPath = '',
    map = new Map<string, string>(),
): Map<string, string> {
    for (const node of nodes) {
        const path = parentPath ? `${parentPath} > ${node.name}` : node.name;
        map.set(node.id, path);
        if (node.children && node.children.length > 0) {
            buildCategoryNameMap(node.children, path, map);
        }
    }
    return map;
}

export default function ProductManageTable({
    products,
    categories,
}: ProductManageTableProps) {
    const router = useRouter();
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const categoryNameMap = useMemo(
        () => buildCategoryNameMap(categories),
        [categories],
    );

    const handleDelete = async (product: Product) => {
        const confirmed = confirm(
            `정말로 [${product.name}] 상품을 삭제하시겠습니까?\n연결된 로컬 샤딩 이미지도 함께 삭제됩니다.`,
        );
        if (!confirmed) return;

        setDeletingId(product.id);
        try {
            const result = await deleteProductAction(product.id);
            if (result.success) {
                alert(result.message || '상품이 삭제되었습니다.');
                router.refresh();
            } else {
                alert(result.message || '상품 삭제에 실패했습니다.');
            }
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col justify-between gap-3 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:flex-row sm:items-center">
                <div>
                    <h2 className="text-base font-black text-gray-900">
                        등록 상품 목록 (총 {products.length}건)
                    </h2>
                    <p className="mt-0.5 text-xs text-gray-500">
                        상품 마스터 정보, 샤딩 갤러리 이미지 및 카테고리 진열
                        상태를 통합 관리합니다.
                    </p>
                </div>
                <Link
                    href="/admin/products/new"
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-blue-700"
                >
                    <FiPlus className="h-4 w-4" />
                    <span>새 상품 등록</span>
                </Link>
            </div>

            {products.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white p-16 text-center">
                    <FiBox className="mb-3 h-10 w-10 text-gray-400" />
                    <p className="text-sm font-bold text-gray-700">
                        등록된 상품이 없습니다.
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                        우측 상단의 새 상품 등록 버튼을 눌러 첫 번째 상품을
                        추가해 보세요.
                    </p>
                </div>
            ) : (
                <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="border-b border-gray-100 bg-gray-50/80 text-[11px] font-bold text-gray-500 uppercase">
                                <tr>
                                    <th className="px-5 py-3.5">상품 정보</th>
                                    <th className="px-4 py-3.5">
                                        진열 카테고리
                                    </th>
                                    <th className="px-4 py-3.5">판매가</th>
                                    <th className="px-4 py-3.5 text-center">
                                        우선순위
                                    </th>
                                    <th className="px-4 py-3.5 text-center">
                                        진열 상태
                                    </th>
                                    <th className="px-5 py-3.5 text-right">
                                        관리
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {products.map((product) => {
                                    const thumb =
                                        product.images[0] || '/placeholder.png';
                                    const categoryLabel =
                                        categoryNameMap.get(
                                            product.categoryId,
                                        ) || '미지정';
                                    const isDeleting =
                                        deletingId === product.id;

                                    return (
                                        <tr
                                            key={product.id}
                                            className="transition-colors hover:bg-gray-50/60"
                                        >
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-3">
                                                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                                                        <Image
                                                            src={thumb}
                                                            alt={product.name}
                                                            fill
                                                            unoptimized={thumb.startsWith(
                                                                '/files/',
                                                            )}
                                                            sizes="48px"
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-1.5">
                                                            <Link
                                                                href={`/products/${product.id}`}
                                                                target="_blank"
                                                                className="truncate font-bold text-gray-900 hover:text-blue-600"
                                                            >
                                                                {product.name}
                                                            </Link>
                                                            <FiExternalLink className="h-3 w-3 shrink-0 text-gray-400" />
                                                        </div>
                                                        <p className="mt-0.5 font-mono text-[10px] text-gray-400">
                                                            GID: {product.gid} ·
                                                            이미지{' '}
                                                            {
                                                                product.images
                                                                    .length
                                                            }
                                                            장
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3.5 font-medium text-gray-600">
                                                {categoryLabel}
                                            </td>
                                            <td className="px-4 py-3.5 font-black text-gray-900">
                                                {formatPrice(product.price)}
                                            </td>
                                            <td className="px-4 py-3.5 text-center font-mono font-bold text-gray-700">
                                                {product.displayPriority}
                                            </td>
                                            <td className="px-4 py-3.5 text-center">
                                                <span
                                                    className={cn(
                                                        'inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold',
                                                        product.isDisplayed
                                                            ? 'bg-green-50 text-green-700'
                                                            : 'bg-gray-100 text-gray-500',
                                                    )}
                                                >
                                                    {product.isDisplayed
                                                        ? '진열 중'
                                                        : '숨김'}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5 text-right">
                                                <div className="inline-flex items-center gap-1.5">
                                                    <Link
                                                        href={`/admin/products/${product.id}/edit`}
                                                        className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-[11px] font-bold text-gray-700 transition-colors hover:border-blue-600 hover:text-blue-600"
                                                    >
                                                        <FiEdit2 className="h-3 w-3" />
                                                        <span>수정</span>
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        disabled={isDeleting}
                                                        onClick={() =>
                                                            handleDelete(
                                                                product,
                                                            )
                                                        }
                                                        className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-[11px] font-bold text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50"
                                                    >
                                                        <FiTrash2 className="h-3 w-3" />
                                                        <span>
                                                            {isDeleting
                                                                ? '삭제 중'
                                                                : '삭제'}
                                                        </span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
