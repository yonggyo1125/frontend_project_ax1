import { getFilesByGid } from '@/domains/files/queries/getFilesByGid.query';
import { Product } from '@/domains/products/types/product.types';
import { createServerClient } from '@/shared/lib/supabase';
import { cache } from 'react';

export const getProductById = cache(
    async (productId: string): Promise<Product | null> => {
        const supabase = createServerClient();

        // UUID 형식 검증 (잘못된 ID 입력 시 DB 에러 방지 및 즉시 404 유도)
        const uuidRegex =
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(productId)) {
            return null;
        }

        const { data: productRow, error } = await supabase
            .from('products')
            .select(
                `
                id,
                gid,
                name,
                price,
                description,
                created_at,
                category_products (
                    category_id,
                    display_priority,
                    is_displayed
                )
            `,
            )
            .eq('id', productId)
            .single();

        if (error || !productRow) {
            return null;
        }

        // 상품 갤러리 이미지 조회 (file_info)
        const files = await getFilesByGid(productRow.gid, 'product_main');
        const images =
            files.length > 0
                ? files.map((f) => f.url!).filter(Boolean)
                : ['/placeholder.png'];

        const mapping = Array.isArray(productRow.category_products)
            ? productRow.category_products[0]
            : productRow.category_products;

        return {
            id: productRow.id,
            gid: productRow.gid,
            categoryId: mapping?.category_id || '',
            name: productRow.name,
            price: Number(productRow.price),
            description: productRow.description || '',
            images,
            isDisplayed: mapping?.is_displayed ?? true,
            displayPriority: Number(mapping?.display_priority ?? 0),
            createdAt: productRow.created_at,
        };
    },
);
