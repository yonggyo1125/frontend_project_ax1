'use server';

import { v4 as uuid4 } from 'uuid';

import { validateRegisterInput } from '@/domains/auth/utils/authValidation';
import { createServerClient } from '@/shared/lib/supabase';
import { ActionState } from '@/shared/types/action.types';
import { revalidatePath } from 'next/cache';

export async function registerAction(
    prevState: ActionState,
    formData: FormData,
): Promise<ActionState> {
    const name = (formData.get('name') as string) || '';
    const email = (formData.get('email') as string) || '';
    const password = (formData.get('password') as string) || '';
    const passwordConfirm = (formData.get('passwordConfirm') as string) || '';
    const gid = (formData.get('gid') as string) || `profile-${uuid4()}`;

    // 필드별 유효성 검사
    const errors = validateRegisterInput({
        name,
        email,
        password,
        passwordConfirm,
        gid,
    });

    if (Object.keys(errors).length > 0) {
        return {
            success: false,
            errors,
        };
    }

    const supabase = createServerClient();

    // Supabase Auth 계정 생성 (Confirm email 비활성화 시 즉시 세션 발급)
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
    });

    if (signUpError || !authData.user) {
        const isDuplicate =
            signUpError?.message
                ?.toLowerCase()
                .includes('already registered') ||
            signUpError?.message?.toLowerCase().includes('already exists');

        return {
            success: false,
            message: isDuplicate
                ? '이미 가입된 이메일 주소입니다. 다른 이메일을 사용해 주세요.'
                : `회원가입에 실패했습니다: ${signUpError?.message || '알 수 없는 오류'}`,
        };
    }

    const userId = authData.user.id;

    // public.profiles 테이블에 회원 프로필 행 직접 INSERT
    // (RLS 정책 "본인 프로필 생성 허용": WITH CHECK (auth.uid() = id) 검증 통과)
    const { error: profileError } = await supabase.from('profiles').insert([
        {
            id: userId,
            gid,
            name: name.trim(),
            role: 'user',
        },
    ]);

    if (profileError) {
        return {
            success: false,
            message: `회원 프로필 생성에 실패했습니다: ${profileError.message}`,
        };
    }

    // 회원가입 중 업로드된 프로필 이미지가 있는 경우 done = true 완료 처리
    await supabase
        .from('file_info')
        .update({ done: true })
        .eq('gid', gid)
        .eq('location', 'profile');

    revalidatePath('/', 'layout');

    return {
        success: true,
        message: '회원가입이 완료되었습니다.',
        data: { userId },
    };
}
