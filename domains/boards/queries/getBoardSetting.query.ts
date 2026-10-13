import {
    BoardSetting,
    BoardWriteRole,
} from '@/domains/boards/types/board.types';
import { createServerClient } from '@/shared/lib/supabase';
import { cache } from 'react';

export const getBoardSetting = cache(
    async (boardId: string): Promise<BoardSetting | null> => {
        const supabase = createServerClient();

        const { data, error } = await supabase
            .from('boards')
            .select('id, name, description, write_role, created_at')
            .eq('id', boardId)
            .is('deleted_at', null)
            .single();

        if (error || !data) {
            return null;
        }

        return {
            id: data.id,
            name: data.name,
            description: data.description || '',
            write_role: data.write_role as BoardWriteRole,
            created_at: data.created_at,
        };
    },
);