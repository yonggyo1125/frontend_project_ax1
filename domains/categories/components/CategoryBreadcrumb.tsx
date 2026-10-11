import { Category } from '@/domains/categories/types/category.types';
import { MOCK_CATEGORIES } from '@/shared/mocks/mockData';
import Link from 'next/link';
import { FiChevronRight, FiHome } from 'react-icons/fi';

interface CategoryBreadcrumbProps {
    categoryId?: string;
}

export default function CategoryBreadcrumb({
    categoryId,
}: CategoryBreadcrumbProps) {
    if (!categoryId) {
        return (
            <nav className="flex items-center gap-1.5 text-xs text-gray-500">
                <Link
                    href="/"
                    className="flex items-center gap-1 hover:text-gray-900"
                >
                    <FiHome className="h-3.5 w-3.5" />
                    <span>홈</span>
                </Link>
                <FiChevronRight className="h-3 w-3 text-gray-400" />
                <span className="font-semibold text-gray-900">전체 상품</span>
            </nav>
        );
    }

    // 트리 구조에서 부모 노드들을 역추적하여 경로를 탐색합니다.
    const findBreadcrumbs = (id: string, list: Category[]): Category[] => {
        for (const cat of list) {
            if (cat.id === id) return [cat];
            if (cat.children) {
                const sub = findBreadcrumbs(id, cat.children);
                if (sub.length > 0) return [cat, ...sub];
            }
        }
        return [];
    };

    const breadcrumbs = findBreadcrumbs(categoryId, MOCK_CATEGORIES);

    return (
        <nav className="flex items-center gap-1.5 text-xs text-gray-500">
            <Link
                href="/"
                className="flex items-center gap-1 hover:text-gray-900"
            >
                <FiHome className="h-3.5 w-3.5" />
                <span>홈</span>
            </Link>
            <FiChevronRight className="h-3 w-3 text-gray-400" />
            <Link href="/products" className="hover:text-gray-900">
                전체 상품
            </Link>
            {breadcrumbs.map((cat, idx) => (
                <div key={cat.id} className="flex items-center gap-1.5">
                    <FiChevronRight className="h-3 w-3 text-gray-400" />
                    {idx === breadcrumbs.length - 1 ? (
                        <span className="font-semibold text-blue-600">
                            {cat.name}
                        </span>
                    ) : (
                        <Link
                            href={`/products?category=${cat.id}`}
                            className="hover:text-gray-900"
                        >
                            {cat.name}
                        </Link>
                    )}
                </div>
            ))}
        </nav>
    );
}
