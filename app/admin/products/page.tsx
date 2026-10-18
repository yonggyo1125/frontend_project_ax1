export const instant = false;

import { getCategoryTree } from '@/domains/categories/queries/getCategoryTree.query';
import ProductManageTable from '@/domains/products/components/ProductManageTable';
import { getProducts } from '@/domains/products/queries/getProducts.query';

export default async function AdminProductsPage() {
    const [products, categories] = await Promise.all([
        getProducts(),
        getCategoryTree(),
    ]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-black text-gray-900">
                    상품 마스터 관리
                </h1>
                <p className="mt-1 text-xs text-gray-500">
                    쇼핑몰의 전체 상품을 조회하고 신규 등록·수정·삭제를
                    수행합니다.
                </p>
            </div>
            <ProductManageTable products={products} categories={categories} />
        </div>
    );
}
