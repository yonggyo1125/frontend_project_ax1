import { Product } from '@/domains/products/types/product.types';
import { formatPrice } from '@/shared/utils/formatPrice';
import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    return (
        <div className="group relative flex flex-col rounded-2xl border border-gray-100 bg-white p-3.5 transition-all hover:border-gray-200 hover:shadow-lg">
            <Link
                href={`/products/${product.id}`}
                className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-50"
            >
                <Image
                    src={product.images[0] || '/placeholder.png'}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
            </Link>

            <div className="mt-3 flex flex-1 flex-col justify-between">
                <div>
                    <h3 className="line-clamp-2 text-sm font-medium text-gray-800 group-hover:text-blue-600">
                        <Link href={`/products/${product.id}`}>
                            {product.name}
                        </Link>
                    </h3>
                </div>
                <div className="mt-2.5 flex items-baseline justify-between">
                    <span className="text-lg font-bold text-gray-900">
                        {formatPrice(product.price)}
                    </span>
                    <span className="text-[11px] font-medium text-gray-400">
                        무료배송
                    </span>
                </div>
            </div>
        </div>
    );
}
