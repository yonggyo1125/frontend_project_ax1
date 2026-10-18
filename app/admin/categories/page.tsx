export const instant = false;

import CategoryTreeManager from '@/domains/categories/components/CategoryTreeManager';
import { getCategoryTree } from '@/domains/categories/queries/getCategoryTree.query';

export default async function AdminCategoriesPage() {
    const categories = await getCategoryTree();

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-black text-gray-900">
                카테고리 및 진열 관리
            </h1>
            <CategoryTreeManager categories={categories} />
        </div>
    );
}
