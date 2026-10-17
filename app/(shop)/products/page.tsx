export const instant = false;

import CategoryBreadcrumb from '@/domains/categories/components/CategoryBreadcrumb';
import { getCategoryProducts } from '@/domains/categories/queries/getCategoryProducts.query';
import ProductGrid from '@/domains/products/components/ProductGrid';
import ProductSortSelect from '@/domains/products/components/ProductSortSelect';

interface ProductsPageProps {
    searchParams: Promise<{
        category?: string;
        sort?: string;
    }>;
}

export default async function ProductsPage({
    searchParams,
}: ProductsPageProps) {
    const { category, sort = 'priority' } = await searchParams;

    const products = await getCategoryProducts({
        categoryId: category,
        sort,
    });

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
            <div className="mb-6 flex flex-col gap-4 border-b border-gray-100 pb-5 md:flex-row md:items-center md:justify-between">
                <CategoryBreadcrumb categoryId={category} />
                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">
                        총 {products.length}개 상품
                    </span>
                    <ProductSortSelect currentSort={sort} />
                </div>
            </div>

            <ProductGrid products={products} />
        </div>
    );
}
