'use server';

import { ActionState } from '@/shared/types/action.types';
import { createServerClient } from '@/shared/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function deletePostAction(
    boardId: string,
    postId: string,
): Promise<ActionState> {
    const supabase = createServerClient();

    const { error } = await supabase
        .from('posts')
        .update({
            deleted_at: new Date().toISOString(),
        })
        .eq('id', postId);

    if (error) {
        return {
            success: false,
            message: `게시글 삭제에 실패했습니다: ${error.message}`,
        };
    }

    revalidatePath(`/boards/${boardId}`);

    return {
        success: true,
    };
}
