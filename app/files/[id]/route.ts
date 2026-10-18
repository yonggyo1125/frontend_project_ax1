import { createServerClient } from '@/shared/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;
    const fileId = Number(id);

    if (Number.isNaN(fileId) || fileId <= 0) {
        return new NextResponse('잘못된 파일 ID입니다.', { status: 400 });
    }

    const supabase = createServerClient();

    // DB에서 파일 메타데이터 조회
    const { data: fileInfo, error } = await supabase
        .from('file_info')
        .select('*')
        .eq('id', fileId)
        .single();

    if (error || !fileInfo) {
        return new NextResponse('파일 정보를 찾을 수 없습니다.', {
            status: 404,
        });
    }

    // 외부 URL 시드 데이터인 경우 해당 URL로 리다이렉트
    if (
        fileInfo.original_name.startsWith('http://') ||
        fileInfo.original_name.startsWith('https://')
    ) {
        return NextResponse.redirect(fileInfo.original_name);
    }

    // 샤딩 경로 탐색 (id % 20)
    const folderNumber = fileId % 20;
    const physicalPath = path.join(
        process.cwd(),
        'uploads',
        String(folderNumber),
        `${fileId}.${fileInfo.extension}`,
    );

    try {
        const fileBuffer = await fs.readFile(physicalPath);
        // RFC 5987 표준 UTF-8 원본 파일명 인코딩 헤더 구성 (한글 깨짐 방지)
        const encodedFileName = encodeURIComponent(fileInfo.original_name);

        // 이미지 파일인 경우 브라우저 인라인 렌더링, 그 외에는 다운로드 강제
        const isImage = fileInfo.content_type.startsWith('image/');
        const dispositionType = isImage ? 'inline' : 'attachment';

        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Type':
                    fileInfo.content_type || 'application/octet-stream',
                'Content-Disposition': `${dispositionType}; filename*=UTF-8''${encodedFileName}`,
                'Cache-Control': 'public, max-age=31536000, immutable',
            },
        });
    } catch {
        return new NextResponse('디스크에 물리 파일이 존재하지 않습니다.', {
            status: 404,
        });
    }
}
