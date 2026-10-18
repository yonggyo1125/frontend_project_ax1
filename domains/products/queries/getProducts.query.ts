import { resolveFileUrl } from '@/domains/files/utils/resolveFileUrl';
import { Product } from '@/domains/products/types/product.types';
import { createServerClient } from '@/shared/lib/supabase';

export async function getProducts(): Promise<Product[]> {
    const supabase = createServerClient();

    const { data: productRows, error } = await supabase
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
        .order('created_at', { ascending: false });

    if (error || !productRows || productRows.length === 0) {
        if (error) {
            console.error('전체 상품 목록 조회 실패:', error.message);
        }
        return [];
    }

    // 모든 상품의 gid로 file_info 이미지 일괄 조회
    const gids = productRows.map((p) => p.gid);
    const { data: fileRows } = await supabase
        .from('file_info')
        .select('id, gid, original_name, seq')
        .in('gid', gids)
        .eq('location', 'product_main')
        .eq('done', true)
        .order('seq', { ascending: true })
        .order('id', { ascending: true });

    const imageMap = new Map<string, string[]>();
    if (fileRows) {
        for (const file of fileRows) {
            const url = resolveFileUrl({
                id: Number(file.id),
                original_name: file.original_name,
            });
            const list = imageMap.get(file.gid) || [];
            list.push(url);
            imageMap.set(file.gid, list);
        }
    }

    return productRows.map((row) => {
        const mapping = Array.isArray(row.category_products)
            ? row.category_products[0]
            : row.category_products;

        return {
            id: row.id,
            gid: row.gid,
            categoryId: mapping?.category_id || '',
            name: row.name,
            price: Number(row.price),
            description: row.description || '',
            images: imageMap.get(row.gid) || ['/placeholder.png'],
            isDisplayed: mapping?.is_displayed ?? true,
            displayPriority: Number(mapping?.display_priority ?? 0),
            createdAt: row.created_at,
        };
    });
}
