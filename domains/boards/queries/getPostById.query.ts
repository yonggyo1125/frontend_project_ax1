import { Post } from '@/domains/boards/types/post.types';
import { getFilesByGid } from '@/domains/files/queries/getFilesByGid.query';
import { createServerClient } from '@/shared/lib/supabase';
import { cache } from 'react';

export const getPostById = cache(
    async (postId: string): Promise<Post | null> => {
        const supabase = createServerClient();

        const uuidRegex =
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(postId)) {
            return null;
        }

        const { data, error } = await supabase
            .from('posts')
            .select(
                'id, gid, board_id, user_id, author_name, title, content, created_at, updated_at',
            )
            .eq('id', postId)
            .is('deleted_at', null)
            .single();

        if (error || !data) {
            return null;
        }

        const attachments = await getFilesByGid(data.gid, 'post_attach');

        return {
            ...(data as Post),
            attachments,
        };
    },
);
