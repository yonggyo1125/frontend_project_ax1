export const instant = false;

import ImageGallery from '@/domains/files/components/ImageGallery';
import ProductDetail from '@/domains/products/components/ProductDetail';
import ProductModalFrame from '@/domains/products/components/ProductModalFrame';
import { getProductById } from '@/domains/products/queries/getProductById.query';

export default async function ProductInterceptModal({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const product = await getProductById(id);

    if (!product) return null;

    return (
        <ProductModalFrame>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <ImageGallery images={product.images} title={product.name} />
                <ProductDetail product={product} isModal={true} />
            </div>
        </ProductModalFrame>
    );
}
