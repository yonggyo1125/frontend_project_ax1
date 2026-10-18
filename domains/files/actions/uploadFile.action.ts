'use server';

import { FileInfo, FileLocation } from '@/domains/files/types/file.types';
import { createServerClient } from '@/shared/lib/supabase';
import fs from 'node:fs/promises';
import path from 'node:path';

export interface UploadFileResult {
    success: boolean;
    message?: string;
    fileInfo?: FileInfo;
}

export async function uploadFileAction(
    formData: FormData,
): Promise<UploadFileResult> {
    const file = formData.get('file') as File | null;
    const gid = (formData.get('gid') as string) || '';
    const location =
        (formData.get('location') as FileLocation) || 'post_attach';
    const seq = Number(formData.get('seq') || 0);

    if (!file || file.size === 0) {
        return {
            success: false,
            message: '업로드할 파일이 선택되지 않았습니다.',
        };
    }

    if (!gid.trim()) {
        return {
            success: false,
            message: '파일 그룹 ID(gid)가 누락되었습니다.',
        };
    }

    const supabase = createServerClient();
    const rawExt = file.name.includes('.')
        ? (file.name.split('.').pop()?.toLowerCase() ?? '')
        : '';
    const extension = rawExt.replace(/[^a-z0-9]/g, '') ?? '';

    // DB에 메타데이터를 먼저 INSERT하여 BIGSERIAL id 선점
    const { data: row, error: dbError } = await supabase
        .from('file_info')
        .insert([
            {
                gid: gid.trim(),
                location,
                original_name: file.name,
                content_type: file.type || 'application/octet-stream',
                extension,
                file_size: file.size,
                done: false, // 폼 최종 제출 전까지 임시 상태 유지
                seq,
            },
        ])
        .select('*')
        .single();

    if (dbError || !row) {
        return {
            success: false,
            message: `파일 메타데이터 DB 등록 실패: ${dbError?.message || '알 수 없는 오류'}`,
        };
    }

    const fileId = Number(row.id);

    try {
        // 디렉터리 샤딩 경로 계산 (id % 20)
        const folderNumber = fileId % 20;
        const uploadDir = path.join(
            process.cwd(),
            'uploads',
            String(folderNumber),
        );
        const physicalPath = path.join(uploadDir, `${fileId}.${extension}`);

        // 샤딩 디렉터리 자동 생성 및 물리 파일 바이너리 저장
        await fs.mkdir(uploadDir, { recursive: true });
        const buffer = Buffer.from(await file.arrayBuffer());
        await fs.writeFile(physicalPath, buffer);

        return {
            success: true,
            fileInfo: {
                id: fileId,
                gid: row.gid,
                location: row.location as FileLocation,
                original_name: row.original_name,
                content_type: row.content_type,
                extension: row.extension,
                file_size: Number(row.file_size),
                done: row.done,
                seq: row.seq,
                created_at: row.created_at,
                url: `/files/${fileId}`, // 클라이언트에서 접근할 스트리밍 경로
            },
        };
    } catch (fsError) {
        // 파일 시스템 저장 실패 시 DB 고아 레코드 즉시 삭제 (보상 트랜잭션)
        await supabase.from('file_info').delete().eq('id', fileId);
        const errMsg =
            fsError instanceof Error
                ? fsError.message
                : '알 수 없는 디스크 쓰기 오류';
        return {
            success: false,
            message: `로컬 디스크 저장 실패: ${errMsg}`,
        };
    }
}
