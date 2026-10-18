export const instant = false;

import CategoryBreadcrumb from '@/domains/categories/components/CategoryBreadcrumb';
import ImageGallery from '@/domains/files/components/ImageGallery';
import ProductDetail from '@/domains/products/components/ProductDetail';
import { getProductById } from '@/domains/products/queries/getProductById.query';
import { notFound } from 'next/navigation';

interface ProductPageProps {
    params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { id } = await params;
    const product = await getProductById(id);

    if (!product) {
        notFound();
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
            <div className="mb-6">
                <CategoryBreadcrumb categoryId={product.categoryId} />
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12 lg:gap-16">
                <ImageGallery images={product.images} title={product.name} />
                <ProductDetail product={product} />
            </div>
        </div>
    );
}
