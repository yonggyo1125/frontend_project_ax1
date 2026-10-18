'use server';

import { FileLocation } from '@/domains/files/types/file.types';
import { createServerClient } from '@/shared/lib/supabase';
import { ActionState } from '@/shared/types/action.types';

export async function confirmFilesAction(
    gid: string,
    location?: FileLocation,
): Promise<ActionState> {
    if (!gid || !gid.trim()) {
        return {
            success: false,
            message: '확정할 파일 그룹 ID(gid)가 없습니다.',
        };
    }

    const supabase = createServerClient();

    let query = supabase
        .from('file_info')
        .update({ done: true })
        .eq('gid', gid.trim());

    if (location) {
        query = query.eq('location', location);
    }

    const { error } = await query;

    if (error) {
        return {
            success: false,
            message: `파일 완료 확정 처리 실패: ${error.message}`,
        };
    }

    return {
        success: true,
    };
}
