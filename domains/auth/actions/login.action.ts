'use server';

import { validateLoginInput } from '@/domains/auth/utils/authValidation';
import { createServerClient } from '@/shared/lib/supabase';
import { ActionState } from '@/shared/types/action.types';
import { revalidatePath } from 'next/cache';

export async function loginAction(
    prevState: ActionState,
    formData: FormData,
): Promise<ActionState> {
    const email = (formData.get('email') as string) || '';
    const password = (formData.get('password') as string) || '';

    // 입력값 유효성 검증
    const errors = validateLoginInput({ email, password });
    if (Object.keys(errors).length > 0) {
        return {
            success: false,
            errors,
        };
    }

    const supabase = createServerClient();

    // Supabase 이메일/비밀번호 로그인 요청
    const { data: authData, error: signInError } =
        await supabase.auth.signInWithPassword({
            email: email.trim(),
            password,
        });

    if (signInError || !authData.user) {
        return {
            success: false,
            message: '이메일 또는 비밀번호가 일치하지 않습니다.',
        };
    }

    // public.profiles 조회 (RLS 정책에 의해 탈퇴한 일반 회원은 조회되지 않음)
    const { data: profile } = await supabase
        .from('profiles')
        .select('id, name, role, deleted_at')
        .eq('id', authData.user.id)
        .single();

    if (!profile || profile.deleted_at) {
        await supabase.auth.signOut();
        return {
            success: false,
            message: '탈퇴 처리되었거나 프로필이 존재하지 않는 계정입니다.',
        };
    }

    revalidatePath('/', 'layout');

    return {
        success: true,
        message: '로그인되었습니다.',
    };
}
