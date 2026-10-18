'use server';

import { getCurrentUser } from '@/domains/auth/queries/getCurrentUser.query';
import { deleteFileAction } from '@/domains/files/actions/deleteFile.action';
import { createServerClient } from '@/shared/lib/supabase';
import { ActionState } from '@/shared/types/action.types';
import { revalidatePath } from 'next/cache';

export async function deleteProductAction(
    productId: string,
): Promise<ActionState> {
    const { isAdmin } = await getCurrentUser();
    if (!isAdmin) {
        return {
            success: false,
            message: '관리자 권한이 필요한 요청입니다.',
        };
    }

    const supabase = createServerClient();

    // 삭제할 상품의 gid 조회
    const { data: product, error: selectError } = await supabase
        .from('products')
        .select('id, gid, name')
        .eq('id', productId)
        .single();

    if (selectError || !product) {
        return {
            success: false,
            message: '삭제할 상품 정보를 찾을 수 없습니다.',
        };
    }

    // 상품 gid에 연결된 file_info 조회 후 물리 파일 및 메타데이터 일괄 삭제
    const { data: files } = await supabase
        .from('file_info')
        .select('id')
        .eq('gid', product.gid);

    if (files && files.length > 0) {
        for (const file of files) {
            await deleteFileAction(Number(file.id));
        }
    }

    // products 마스터 레코드 삭제 (category_products는 CASCADE 자동 삭제)
    const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

    if (deleteError) {
        return {
            success: false,
            message: `상품 삭제에 실패했습니다: ${deleteError.message}`,
        };
    }

    revalidatePath('/');
    revalidatePath('/products');
    revalidatePath('/admin/products');
    revalidatePath('/admin/categories');

    return {
        success: true,
        message: `[${product.name}] 상품이 삭제되었습니다.`,
    };
}
