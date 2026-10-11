import { Product } from '@/domains/products/types/product.types';
import ProductCard from './ProductCard';

interface ProductGridProps {
    products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
    if (products.length === 0) {
        return (
            <div className="flex min-h-75 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 p-8 text-center">
                <p className="text-base font-semibold text-gray-700">
                    해당 조건의 상품이 없습니다.
                </p>
                <p className="mt-1 text-xs text-gray-400">
                    다른 카테고리를 선택하거나 필터를 초기화해 보세요.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}
