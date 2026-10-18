'use server';

import { createServerClient } from '@/shared/lib/supabase';
import { ActionState } from '@/shared/types/action.types';
import fs from 'node:fs/promises';
import path from 'node:path';

export async function deleteFileAction(fileId: number): Promise<ActionState> {
    if (!fileId || Number.isNaN(Number(fileId))) {
        return {
            success: false,
            message: '유효하지 않은 파일 ID입니다.',
        };
    }

    const supabase = createServerClient();

    // 삭제할 파일 메타데이터 조회
    const { data: fileInfo, error: selectError } = await supabase
        .from('file_info')
        .select('id, extension')
        .eq('id', fileId)
        .single();

    if (selectError || !fileInfo) {
        return {
            success: false,
            message: '삭제할 파일 정보를 찾을 수 없습니다.',
        };
    }

    // 샤딩 경로 계산 후 로컬 디스크 물리 파일 삭제
    const id = Number(fileInfo.id);
    const folderNumber = id % 20;
    const physicalPath = path.join(
        process.cwd(),
        'uploads',
        String(folderNumber),
        `${id}.${fileInfo.extension}`,
    );

    try {
        await fs.unlink(physicalPath);
    } catch {
        // 시드 데이터(외부 URL)이거나 디스크에 이미 없는 경우 무시하고 DB 정리 진행
    }

    // DB 메타데이터 레코드 삭제
    const { error: deleteError } = await supabase
        .from('file_info')
        .delete()
        .eq('id', id);

    if (deleteError) {
        return {
            success: false,
            message: `파일 DB 메타데이터 삭제 실패: ${deleteError.message}`,
        };
    }

    return {
        success: true,
        message: '파일이 삭제되었습니다.',
    };
}
