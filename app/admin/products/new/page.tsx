export const instant = false;

import { getCategoryTree } from '@/domains/categories/queries/getCategoryTree.query';
import ProductForm from '@/domains/products/components/ProductForm';

export default async function AdminNewProductPage() {
    const categories = await getCategoryTree();

    return (
        <div className="mx-auto max-w-4xl space-y-6">
            <div>
                <h1 className="text-2xl font-black text-gray-900">
                    새 상품 등록
                </h1>
                <p className="mt-1 text-xs text-gray-500">
                    신규 상품의 마스터 정보와 샤딩 갤러리 이미지를 등록합니다.
                </p>
            </div>
            <ProductForm categories={categories} />
        </div>
    );
}
