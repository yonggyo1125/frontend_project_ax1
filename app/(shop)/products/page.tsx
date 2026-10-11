export const instant = false;

import CategoryBreadcrumb from '@/domains/categories/components/CategoryBreadcrumb';
import ProductGrid from '@/domains/products/components/ProductGrid';
import { MOCK_PRODUCTS } from '@/shared/mocks/mockData';

interface ProductsPageProps {
    searchParams: Promise<{
        category?: string;
        sort?: string;
    }>;
}

export default async function ProductsPage({
    searchParams,
}: ProductsPageProps) {
    const { category, sort = 'recent' } = await searchParams;

    // 카테고리 필터링
    const filtered = category
        ? MOCK_PRODUCTS.filter(
              (p) =>
                  p.categoryId.startsWith(category) ||
                  p.categoryId === category,
          )
        : [...MOCK_PRODUCTS];

    // 정렬 처리
    if (sort === 'price_asc') {
        filtered.sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc') {
        filtered.sort((a, b) => b.price - a.price);
    } else {
        filtered.sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
        );
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
            <div className="mb-6 flex flex-col gap-4 border-b border-gray-100 pb-5 md:flex-row md:items-center md:justify-between">
                <CategoryBreadcrumb categoryId={category} />

                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">
                        총 {filtered.length}개 상품
                    </span>
                    <select
                        defaultValue={sort}
                        className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-xs text-gray-700 outline-none focus:border-blue-600"
                    >
                        <option value="recent">최신순</option>
                        <option value="price_asc">낮은 가격순</option>
                        <option value="price_desc">높은 가격순</option>
                    </select>
                </div>
            </div>

            <ProductGrid products={filtered} />
        </div>
    );
}
