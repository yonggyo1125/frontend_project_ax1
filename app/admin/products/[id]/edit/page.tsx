export const instant = false;

import { getCategoryTree } from '@/domains/categories/queries/getCategoryTree.query';
import { getFilesByGid } from '@/domains/files/queries/getFilesByGid.query';
import ProductForm from '@/domains/products/components/ProductForm';
import { getProductById } from '@/domains/products/queries/getProductById.query';
import { notFound } from 'next/navigation';

export default async function AdminEditProductPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const [product, categories] = await Promise.all([
        getProductById(id),
        getCategoryTree(),
    ]);

    if (!product) {
        notFound();
    }

    const existingFiles = await getFilesByGid(product.gid, 'product_main');

    return (
        <div className="mx-auto max-w-4xl space-y-6">
            <div>
                <h1 className="text-2xl font-black text-gray-900">상품 수정</h1>
                <p className="mt-1 text-xs text-gray-500">
                    [{product.name}] 상품의 정보, 진열 카테고리 및 갤러리
                    이미지를 수정합니다.
                </p>
            </div>
            <ProductForm
                categories={categories}
                initialData={product}
                initialFiles={existingFiles}
            />
        </div>
    );
}
