'use server';

import { getCurrentUser } from '@/domains/auth/queries/getCurrentUser.query';
import { confirmFilesAction } from '@/domains/files/actions/confirmFiles.action';
import { createServerClient } from '@/shared/lib/supabase';
import { ActionState } from '@/shared/types/action.types';
import { revalidatePath } from 'next/cache';

export async function updateProductAction(
    productId: string,
    prevState: ActionState,
    formData: FormData,
): Promise<ActionState> {
    const { isAdmin } = await getCurrentUser();
    if (!isAdmin) {
        return {
            success: false,
            message: '관리자 권한이 필요한 요청입니다.',
        };
    }

    const gid = (formData.get('gid') as string) || '';
    const name = (formData.get('name') as string)?.trim() || '';
    const priceRaw = formData.get('price') as string;
    const categoryId = (formData.get('categoryId') as string)?.trim() || '';
    const description = (formData.get('description') as string)?.trim() || '';
    const displayPriority = Number(formData.get('displayPriority') || 1);
    const isDisplayed = formData.get('isDisplayed') === 'true';

    const errors: Record<string, string> = {};

    if (!name) {
        errors.name = '상품명을 입력해 주세요.';
    } else if (name.length < 2) {
        errors.name = '상품명은 최소 2자 이상 입력해야 합니다.';
    }

    const price = Number(priceRaw);
    if (!priceRaw || Number.isNaN(price) || price < 0) {
        errors.price = '올바른 판매 가격(0원 이상)을 입력해 주세요.';
    }

    if (!categoryId) {
        errors.categoryId = '진열할 카테고리를 선택해 주세요.';
    }

    if (Object.keys(errors).length > 0) {
        return {
            success: false,
            errors,
        };
    }

    const supabase = createServerClient();

    // products 마스터 정보 UPDATE
    const { error: updateError } = await supabase
        .from('products')
        .update({
            name,
            price: Math.floor(price),
            description,
            updated_at: new Date().toISOString(),
        })
        .eq('id', productId);

    if (updateError) {
        return {
            success: false,
            message: `상품 수정에 실패했습니다: ${updateError.message}`,
        };
    }

    // category_products 매핑 갱신 (기존 매핑 정리 후 선택된 카테고리로 재매핑)
    await supabase
        .from('category_products')
        .delete()
        .eq('product_id', productId);

    const { error: mappingError } = await supabase
        .from('category_products')
        .insert([
            {
                category_id: categoryId,
                product_id: productId,
                display_priority: Number.isNaN(displayPriority)
                    ? 1
                    : displayPriority,
                is_displayed: isDisplayed,
            },
        ]);

    if (mappingError) {
        return {
            success: false,
            message: `카테고리 매핑 갱신에 실패했습니다: ${mappingError.message}`,
        };
    }

    // 수정 중 새로 추가된 상품 이미지 확정 처리
    if (gid) {
        await confirmFilesAction(gid, 'product_main');
    }

    revalidatePath('/');
    revalidatePath('/products');
    revalidatePath(`/products/${productId}`);
    revalidatePath('/admin/products');
    revalidatePath(`/admin/products/${productId}/edit`);

    return {
        success: true,
        message: `상품 [${name}] 정보가 성공적으로 수정되었습니다.`,
        data: { productId },
    };
}
