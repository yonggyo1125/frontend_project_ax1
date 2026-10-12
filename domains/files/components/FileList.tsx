import { FileInfo } from '@/domains/files/types/file.types';
import Link from 'next/link';
import { FiDownload, FiFileText } from 'react-icons/fi';

interface FileListProps {
    files: FileInfo[];
}

export default function FileList({ files }: FileListProps) {
    if (!files || files.length === 0) return null;

    return (
        <div className="mt-6 rounded-2xl border border-gray-100 bg-gray-50/80 p-4">
            <h4 className="mb-3 text-xs font-bold text-gray-600">
                첨부파일 목록 ({files.length}개)
            </h4>
            <div className="divide-y divide-gray-200/60 rounded-xl border border-gray-200 bg-white">
                {files.map((file) => (
                    <div
                        key={file.id}
                        className="flex items-center justify-between px-4 py-2.5 text-xs transition-colors hover:bg-gray-50"
                    >
                        <div className="flex items-center gap-2.5 overflow-hidden">
                            <FiFileText className="h-4 w-4 shrink-0 text-blue-500" />
                            <span className="truncate font-medium text-gray-800">
                                {file.original_name}
                            </span>
                            <span className="shrink-0 text-gray-400">
                                ({(file.file_size / 1024).toFixed(1)} KB)
                            </span>
                        </div>
                        {/* 8일차에 진행하는 파일 다운로드 엔드포인트로 우선 연결 */}
                        <Link
                            href={`/files/${file.id}`}
                            className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-gray-700 shadow-sm hover:border-blue-500 hover:text-blue-600"
                        >
                            <FiDownload className="h-3 w-3" />
                            <span>다운로드</span>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
