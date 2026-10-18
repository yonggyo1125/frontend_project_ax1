'use server';

import { createServerClient } from '@/shared/lib/supabase';
import { ActionState } from '@/shared/types/action.types';
import { revalidatePath } from 'next/cache';

export async function updateProfileAction(
    prevState: ActionState,
    formData: FormData,
): Promise<ActionState> {
    const name = (formData.get('name') as string) || '';
    const gid = (formData.get('gid') as string) || '';

    if (!name.trim() || name.trim().length < 2) {
        return {
            success: false,
            errors: {
                name: '이름(닉네임)은 2자 이상 입력해 주세요.',
            },
        };
    }

    const supabase = createServerClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return {
            success: false,
            message: '로그인이 필요한 요청입니다.',
        };
    }

    // RLS 정책("본인 또는 관리자 프로필 수정 허용")에 의해 본인 프로필만 UPDATE 허용
    const { error } = await supabase
        .from('profiles')
        .update({
            name: name.trim(),
            ...(gid ? { gid } : {}),
            updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

    if (error) {
        return {
            success: false,
            message: `프로필 수정에 실패했습니다: ${error.message}`,
        };
    }

    // 새로 업로드된 프로필 이미지가 있다면 done = true 처리
    if (gid) {
        await supabase
            .from('file_info')
            .update({ done: true })
            .eq('gid', gid)
            .eq('location', 'profile');
    }

    revalidatePath('/', 'layout');
    revalidatePath('/profile');

    return {
        success: true,
        message: '프로필 정보가 성공적으로 수정되었습니다.',
    };
}
