export const instant = false;

import { getDescendantCategoryIds } from '@/domains/categories/utils/categoryTree';
import { resolveFileUrl } from '@/domains/files/utils/resolveFileUrl';
import { Product } from '@/domains/products/types/product.types';
import { createServerClient } from '@/shared/lib/supabase';
import { getCategoryTree } from './getCategoryTree.query';

export interface GetCategoryProductsParams {
    categoryId?: string;
    sort?: string;
    limit?: number;
}

export async function getCategoryProducts({
    categoryId,
    sort = 'priority',
    limit,
}: GetCategoryProductsParams = {}): Promise<Product[]> {
    const supabase = createServerClient();

    // 1. 특정 카테고리가 선택된 경우 하위(2차, 3차) 카테고리 ID까지 모두 수집
    let targetCategoryIds: string[] | null = null;
    if (categoryId) {
        const tree = await getCategoryTree();
        targetCategoryIds = getDescendantCategoryIds(categoryId, tree);
    }

    // 2. category_products 매핑 테이블과 products 테이블 조인 조회
    let mappingQuery = supabase
        .from('category_products')
        .select(
            `
            category_id,
            display_priority,
            is_displayed,
            products!inner (
                id,
                gid,
                name,
                price,
                description,
                created_at
            )
        `,
        )
        .eq('is_displayed', true)
        .order('display_priority', { ascending: true });

    if (targetCategoryIds && targetCategoryIds.length > 0) {
        mappingQuery = mappingQuery.in('category_id', targetCategoryIds);
    }

    const { data: mappedRows, error: mappingError } = await mappingQuery;

    if (mappingError || !mappedRows) {
        console.error('카테고리 상품 목록 조회 실패:', mappingError?.message);
        return [];
    }

    // 3. 중복 상품 제거 (여러 카테고리에 동시 매핑된 경우 가장 높은 우선순위 유지)
    const uniqueProductMap = new Map<
        string,
        {
            id: string;
            gid: string;
            categoryId: string;
            name: string;
            price: number;
            description: string;
            isDisplayed: boolean;
            displayPriority: number;
            createdAt: string;
        }
    >();

    for (const row of mappedRows) {
        const prod = Array.isArray(row.products)
            ? row.products[0]
            : row.products;
        if (!prod) continue;

        if (!uniqueProductMap.has(prod.id)) {
            uniqueProductMap.set(prod.id, {
                id: prod.id,
                gid: prod.gid,
                categoryId: row.category_id,
                name: prod.name,
                price: Number(prod.price),
                description: prod.description || '',
                isDisplayed: row.is_displayed,
                displayPriority: Number(row.display_priority),
                createdAt: prod.created_at,
            });
        }
    }

    const rawProducts = Array.from(uniqueProductMap.values());
    if (rawProducts.length === 0) return [];

    // 4. 수집된 상품들의 gid 목록으로 file_info 테이블에서 이미지 일괄 조회 (N+1 쿼리 방지)
    const gids = rawProducts.map((p) => p.gid);
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

    // 5. 프론트엔드 Product 도메인 모델로 조립
    const products: Product[] = rawProducts.map((item) => ({
        ...item,
        images: imageMap.get(item.gid) || ['/placeholder.png'],
    }));

    // 6. 정렬 조건 적용
    if (sort === 'price_asc') {
        products.sort((a, b) => a.price - b.price);
    } else if (sort === 'price_desc') {
        products.sort((a, b) => b.price - a.price);
    } else if (sort === 'recent') {
        products.sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
        );
    } else {
        // 기본값: 관리자 진열 우선순위 (displayPriority ASC)
        products.sort((a, b) => a.displayPriority - b.displayPriority);
    }

    if (limit && limit > 0) {
        return products.slice(0, limit);
    }

    return products;
}
