'use server';

import { createServerClient } from '@/shared/lib/supabase';
import { ActionState } from '@/shared/types/action.types';
import { revalidatePath } from 'next/cache';
import { v4 as uuid4 } from 'uuid';

export async function createPostAction(
    boardId: string,
    prevState: ActionState,
    formData: FormData,
): Promise<ActionState> {
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const gid = (formData.get('gid') as string) || `post-${uuid4()}`;
    const errors: Record<string, string> = {};

    if (!title || !title.trim()) {
        errors.title = '게시글 제목을 입력해 주세요.';
    } else if (title.trim().length < 2) {
        errors.title = '제목은 2자 이상 입력해야 합니다.';
    }

    // HTML 태그를 제거한 순수 텍스트 기준 길이 검증
    const strippedContent = content
        ? content.replace(/<[^>]*>?/gm, '').trim()
        : '';
    if (!strippedContent) {
        errors.content = '본문 내용을 입력해 주세요.';
    } else if (strippedContent.length < 10) {
        errors.content = '내용은 최소 10자 이상 작성해야 합니다.';
    }

    if (Object.keys(errors).length > 0) {
        return { success: false, errors };
    }

    const supabase = createServerClient();

    // 현재 세션 사용자 확인
    const {
        data: { user },
    } = await supabase.auth.getUser();

    let authorName = '익명';
    if (user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('name')
            .eq('id', user.id)
            .single();
        if (profile?.name) authorName = profile.name;
    }

    const { data, error } = await supabase
        .from('posts')
        .insert([
            {
                board_id: boardId,
                user_id: user?.id || null,
                author_name: authorName,
                title: title.trim(),
                content,
                gid,
            },
        ])
        .select('id')
        .single();

    if (error) {
        return {
            success: false,
            message: `게시글 등록에 실패했습니다: ${error.message}`,
        };
    }

    revalidatePath(`/boards/${boardId}`);

    return {
        success: true,
        data: { postId: data.id },
    };
}
