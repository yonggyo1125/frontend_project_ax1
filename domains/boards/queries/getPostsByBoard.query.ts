import { Post } from '@/domains/boards/types/post.types';
import { createServerClient } from '@/shared/lib/supabase';

export async function getPostsByBoard(boardId: string): Promise<Post[]> {
    const supabase = createServerClient();

    const { data, error } = await supabase
        .from('posts')
        .select(
            'id, gid, board_id, user_id, author_name, title, content, created_at, updated_at',
        )
        .eq('board_id', boardId)
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

    if (error || !data) {
        console.error(`[${boardId}] 게시판 글 목록 조회 실패:`, error?.message);
        return [];
    }

    return data as Post[];
}
