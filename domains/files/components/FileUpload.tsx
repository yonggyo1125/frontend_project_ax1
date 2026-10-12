'use client';

import { FileLocation } from '@/domains/files/types/file.types';
import { cn } from '@/shared/utils/cn';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { FiFile, FiTrash2, FiUploadCloud } from 'react-icons/fi';

interface FileUploadProps {
    gid: string;
    location: FileLocation;
    multiple?: boolean;
    maxSizeMb?: number;
}

export default function FileUpload({
    gid,
    location,
    multiple = false,
    maxSizeMb = 10,
}: FileUploadProps) {
    const [selectedFiles, setSelectedFiles] = useState<
        { file: File; previewUrl: string }[]
    >([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        setErrorMessage(null);
        const validFiles: { file: File; previewUrl: string }[] = [];

        for (const file of files) {
            if (file.size > maxSizeMb * 1024 * 1024) {
                setErrorMessage(
                    `파일 크기는 최대 ${maxSizeMb}MB 이하만 업로드 가능합니다.`,
                );
                return;
            }
            const previewUrl = file.type.startsWith('image/')
                ? URL.createObjectURL(file)
                : '';
            validFiles.push({ file, previewUrl });
        }

        setSelectedFiles((prev) =>
            multiple ? [...prev, ...validFiles] : validFiles,
        );
    };

    const handleRemove = (index: number) => {
        setSelectedFiles((prev) => {
            const next = [...prev];
            if (next[index].previewUrl)
                URL.revokeObjectURL(next[index].previewUrl);
            next.splice(index, 1);
            return next;
        });
    };

    return (
        <div className="space-y-3">
            <div
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                    'group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/60 p-6 transition-all hover:border-blue-500 hover:bg-blue-50/30',
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
                        <FiUploadCloud className="h-5 w-5" />
                    </div>
                    <p className="mt-1 text-xs font-semibold text-gray-700 group-hover:text-blue-600">
                        클릭하여 파일 선택 또는 드래그 앤 드롭
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

            {selectedFiles.length > 0 && (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                    {selectedFiles.map((item, idx) => (
                        <div
                            key={idx}
                            className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white p-2 shadow-sm"
                        >
                            <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
                                {item.previewUrl ? (
                                    <Image
                                        src={item.previewUrl}
                                        alt={item.file.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-gray-400">
                                        <FiFile className="h-8 w-8" />
                                    </div>
                                )}
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemove(idx);
                                    }}
                                    className="absolute top-1.5 right-1.5 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-600"
                                >
                                    <FiTrash2 className="h-3.5 w-3.5" />
                                </button>
                            </div>
                            <span className="mt-1.5 truncate text-[11px] font-medium text-gray-700">
                                {item.file.name}
                            </span>
                            <span className="text-[10px] text-gray-400">
                                {(item.file.size / 1024).toFixed(1)} KB
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
