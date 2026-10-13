import {
    BoardSetting,
    BoardWriteRole,
} from '@/domains/boards/types/board.types';
import { createServerClient } from '@/shared/lib/supabase';

export async function getAllBoards(): Promise<BoardSetting[]> {
    const supabase = createServerClient();

    const { data, error } = await supabase
        .from('boards')
        .select('id, name, description, write_role, created_at')
        .is('deleted_at', null)
        .order('created_at', { ascending: true });

    if (error || !data) {
        console.error('전체 게시판 설정 조회 실패:', error?.message);
        return [];
    }

    return data.map((row) => ({
        id: row.id,
        name: row.name,
        description: row.description || '',
        write_role: row.write_role as BoardWriteRole,
        created_at: row.created_at,
    }));
}
