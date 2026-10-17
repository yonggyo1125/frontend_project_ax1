'use server';

import { createServerClient } from '@/shared/lib/supabase';
import { ActionState } from '@/shared/types/action.types';
import { revalidatePath } from 'next/cache';

export async function withdrawAccountAction(): Promise<ActionState> {
    const supabase = createServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return {
            success: false,
            message: '로그인 세션이 존재하지 않습니다.',
        };
    }

    // profiles 테이블 Soft Delete 처리 (deleted_at 기록)
    const { error } = await supabase
        .from('profiles')
        .update({
            deleted_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

    if (error) {
        return {
            success: false,
            message: `회원 탈퇴 처리에 실패했습니다: ${error.message}`,
        };
    }

    // 세션 로그아웃 처리
    await supabase.auth.signOut();

    revalidatePath('/', 'layout');

    return {
        success: true,
        message: '회원 탈퇴가 완료되었습니다. 그동안 이용해 주셔서 감사합니다.',
    };
}
