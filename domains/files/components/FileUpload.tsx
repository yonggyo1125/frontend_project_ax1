'use client';

import { deleteFileAction } from '@/domains/files/actions/deleteFile.action';
import { uploadFileAction } from '@/domains/files/actions/uploadFile.action';
import { FileInfo, FileLocation } from '@/domains/files/types/file.types';
import { cn } from '@/shared/utils/cn';
import Image from 'next/image';
import { useRef, useState } from 'react';
import {
    FiCheckCircle,
    FiFile,
    FiLoader,
    FiTrash2,
    FiUploadCloud,
} from 'react-icons/fi';

interface FileUploadProps {
    gid: string;
    location: FileLocation;
    multiple?: boolean;
    maxSizeMb?: number;
    initialFiles?: FileInfo[];
}

export default function FileUpload({
    gid,
    location,
    multiple = false,
    maxSizeMb = 10,
    initialFiles = [],
}: FileUploadProps) {
    const [uploadedFiles, setUploadedFiles] =
        useState<FileInfo[]>(initialFiles);
    const [isUploading, setIsUploading] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const processFiles = async (files: File[]) => {
        if (files.length === 0) return;
        setErrorMessage(null);

        // 용량 제한 검증
        for (const file of files) {
            if (file.size > maxSizeMb * 1024 * 1024) {
                setErrorMessage(
                    `파일 크기는 최대 ${maxSizeMb}MB 이하만 업로드 가능합니다. (${file.name})`,
                );
                return;
            }
        }

        const targetFiles = multiple ? files : [files[0]];
        setIsUploading(true);

        try {
            // 단일 파일 모드(예: 프로필 이미지)일 때 기존 파일이 있으면 먼저 삭제
            if (!multiple && uploadedFiles.length > 0) {
                for (const prevFile of uploadedFiles) {
                    await deleteFileAction(prevFile.id);
                }
            }

            const newlyUploaded: FileInfo[] = [];
            const baseSeq = multiple ? uploadedFiles.length : 0;

            for (let i = 0; i < targetFiles.length; i++) {
                const file = targetFiles[i];
                const formData = new FormData();
                formData.append('file', file);
                formData.append('gid', gid);
                formData.append('location', location);
                formData.append('seq', String(baseSeq + i));

                const result = await uploadFileAction(formData);
                if (!result.success || !result.fileInfo) {
                    setErrorMessage(
                        result.message ||
                            `${file.name} 업로드 중 오류가 발생했습니다.`,
                    );
                    break;
                }
                newlyUploaded.push(result.fileInfo);
            }

            if (newlyUploaded.length > 0) {
                setUploadedFiles((prev) =>
                    multiple ? [...prev, ...newlyUploaded] : newlyUploaded,
                );
            }
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        await processFiles(files);
    };

    const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (isUploading) return;
        const files = Array.from(e.dataTransfer.files || []);
        await processFiles(files);
    };

    const handleRemove = async (fileId: number) => {
        setDeletingId(fileId);
        setErrorMessage(null);
        try {
            const result = await deleteFileAction(fileId);
            if (result.success) {
                setUploadedFiles((prev) =>
                    prev.filter((item) => item.id !== fileId),
                );
            } else {
                setErrorMessage(result.message || '파일 삭제에 실패했습니다.');
            }
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <div className="space-y-3">
            <div
                onClick={() => !isUploading && fileInputRef.current?.click()}
                onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                }}
                onDrop={handleDrop}
                className={cn(
                    'group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/60 p-6 transition-all hover:border-blue-500 hover:bg-blue-50/30',
                    isUploading && 'pointer-events-none opacity-60',
                )}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple={multiple}
                    onChange={handleFileChange}
                    className="hidden"
                    aria-label="파일 선택"
                />
                <div className="flex flex-col items-center gap-1.5 text-center">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm transition-transform group-hover:scale-110 group-hover:text-blue-600">
                        {isUploading ? (
                            <FiLoader className="h-5 w-5 animate-spin text-blue-600" />
                        ) : (
                            <FiUploadCloud className="h-5 w-5" />
                        )}
                    </div>
                    <p className="mt-1 text-xs font-semibold text-gray-700 group-hover:text-blue-600">
                        {isUploading
                            ? '파일을 업로드하고 있습니다...'
                            : '클릭하여 파일 선택 또는 드래그 앤 드롭'}
                    </p>
                    <p className="text-[11px] text-gray-400">
                        최대 {maxSizeMb}MB (
                        {multiple ? '다중 파일 선택 가능' : '단일 파일'})
                    </p>
                </div>
            </div>

            {errorMessage && (
                <p className="text-xs font-medium text-red-500">
                    {errorMessage}
                </p>
            )}

            {uploadedFiles.length > 0 && (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                    {uploadedFiles.map((item) => {
                        const isImage = item.content_type.startsWith('image/');
                        const fileUrl = item.url || `/files/${item.id}`;
                        const isDeleting = deletingId === item.id;

                        return (
                            <div
                                key={item.id}
                                className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white p-2 shadow-sm"
                            >
                                <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
                                    {isImage ? (
                                        <Image
                                            src={fileUrl}
                                            alt={item.original_name}
                                            fill
                                            unoptimized
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-gray-400">
                                            <FiFile className="h-8 w-8 text-blue-500" />
                                            <span className="text-[10px] font-bold uppercase">
                                                {item.extension}
                                            </span>
                                        </div>
                                    )}
                                    <button
                                        type="button"
                                        disabled={isDeleting}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemove(item.id);
                                        }}
                                        aria-label={`${item.original_name} 삭제`}
                                        className="absolute top-1.5 right-1.5 rounded-full bg-black/60 p-1.5 text-white transition-opacity hover:bg-red-600 disabled:opacity-50"
                                    >
                                        <FiTrash2 className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                                <div className="mt-1.5 flex items-center gap-1">
                                    <FiCheckCircle className="h-3 w-3 shrink-0 text-green-600" />
                                    <span className="truncate text-[11px] font-medium text-gray-700">
                                        {item.original_name}
                                    </span>
                                </div>
                                <span className="text-[10px] text-gray-400">
                                    {(item.file_size / 1024).toFixed(1)} KB · #
                                    {item.id} (폴더 {item.id % 20})
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
