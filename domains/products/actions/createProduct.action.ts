'use server';
import { getCurrentUser } from '@/domains/auth/queries/getCurrentUser.query';
import { confirmFilesAction } from '@/domains/files/actions/confirmFiles.action';
import { createServerClient } from '@/shared/lib/supabase';
import { ActionState } from '@/shared/types/action.types';
import { revalidatePath } from 'next/cache';
import { v4 as uuid4 } from 'uuid';

export async function createProductAction(
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

    const gid = (formData.get('gid') as string) || `prod-${uuid4()}`;
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

    // products 마스터 테이블 INSERT
    const { data: product, error: productError } = await supabase
        .from('products')
        .insert([
            {
                gid,
                name,
                price: Math.floor(price),
                description,
            },
        ])
        .select('id')
        .single();

    if (productError || !product) {
        return {
            success: false,
            message: `상품 등록에 실패했습니다: ${productError?.message || '알 수 없는 오류'}`,
        };
    }

    // category_products 카테고리 매핑 및 진열 상태 INSERT
    const { error: mappingError } = await supabase
        .from('category_products')
        .insert([
            {
                category_id: categoryId,
                product_id: product.id,
                display_priority: Number.isNaN(displayPriority)
                    ? 1
                    : displayPriority,
                is_displayed: isDisplayed,
            },
        ]);

    if (mappingError) {
        await supabase.from('products').delete().eq('id', product.id);
        return {
            success: false,
            message: `카테고리 진열 매핑 저장에 실패했습니다: ${mappingError.message}`,
        };
    }

    // 업로드된 상품 대표/갤러리 이미지(file_info)를 done = true로 확정
    await confirmFilesAction(gid, 'product_main');

    revalidatePath('/');
    revalidatePath('/products');
    revalidatePath('/admin/products');
    revalidatePath('/admin/categories');

    return {
        success: true,
        message: `신규 상품 [${name}] 등록이 완료되었습니다.`,
        data: { productId: product.id },
    };
}
