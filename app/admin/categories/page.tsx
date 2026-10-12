import CategoryTreeManager from '@/domains/categories/components/CategoryTreeManager';

export default function AdminCategoriesPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-black text-gray-900">
                카테고리 및 진열 관리
            </h1>
            <CategoryTreeManager />
        </div>
    );
}
