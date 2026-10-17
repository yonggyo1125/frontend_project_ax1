import { FileInfo, FileLocation } from '@/domains/files/types/file.types';
import { resolveFileUrl } from '@/domains/files/utils/resolveFileUrl';
import { createServerClient } from '@/shared/lib/supabase';

export async function getFilesByGid(
    gid: string,
    location?: FileLocation,
): Promise<FileInfo[]> {
    const supabase = createServerClient();

    let query = supabase
        .from('file_info')
        .select('*')
        .eq('gid', gid)
        .eq('done', true)
        .order('seq', { ascending: true })
        .order('id', { ascending: true });

    if (location) {
        query = query.eq('location', location);
    }

    const { data, error } = await query;

    if (error || !data) {
        console.error('파일 목록 조회 실패:', error?.message);
        return [];
    }

    return data.map((row) => ({
        id: Number(row.id),
        gid: row.gid,
        location: row.location as FileLocation,
        original_name: row.original_name,
        content_type: row.content_type,
        extension: row.extension,
        file_size: Number(row.file_size),
        done: row.done,
        seq: row.seq,
        created_at: row.created_at,
        url: resolveFileUrl({
            id: Number(row.id),
            original_name: row.original_name,
        }),
    }));
}
