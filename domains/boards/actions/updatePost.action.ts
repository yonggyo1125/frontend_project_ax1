'use server';

import { ActionState } from '@/shared/types/action.types';
import { createServerClient } from '@/shared/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function updatePostAction(
    boardId: string,
    postId: string,
    prevState: ActionState,
    formData: FormData,
): Promise<ActionState> {
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const errors: Record<string, string> = {};

    if (!title || !title.trim()) {
        errors.title = '게시글 제목을 입력해 주세요.';
    } else if (title.trim().length < 2) {
        errors.title = '제목은 2자 이상 입력해야 합니다.';
    }

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

    const { error } = await supabase
        .from('posts')
        .update({
            title: title.trim(),
            content,
            updated_at: new Date().toISOString(),
        })
        .eq('id', postId);

    if (error) {
        return {
            success: false,
            message: `게시글 수정에 실패했습니다: ${error.message}`,
        };
    }

    revalidatePath(`/boards/${boardId}`);
    revalidatePath(`/boards/${boardId}/${postId}`);

    return {
        success: true,
    };
}
