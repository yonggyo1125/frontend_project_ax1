import { Category } from '@/domains/categories/types/category.types';
import { createServerClient } from '@/shared/lib/supabase';
import { cache } from 'react';
import { buildCategoryTree } from '../utils/categoryTree';

export const getCategoryTree = cache(async (): Promise<Category[]> => {
    const supabase = createServerClient();

    const { data, error } = await supabase
        .from('categories')
        .select('id, parent_id, name, depth, sort_order')
        .is('deleted_at', null)
        .order('depth', { ascending: true })
        .order('sort_order', { ascending: true });

    if (error || !data) {
        console.error('카테고리 트리 조회 실패:', error?.message);
        return [];
    }

    return buildCategoryTree(data as Category[]);
});
