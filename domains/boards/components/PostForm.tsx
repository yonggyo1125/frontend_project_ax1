'use client';

import FileUpload from '@/domains/files/components/FileUpload';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { ActionState, INITIAL_ACTION_STATE } from '@/shared/types/action.types';
import { cn } from '@/shared/utils/cn';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect } from 'react';
import { FiAlertCircle } from 'react-icons/fi';

interface PostFormProps {
    boardId: string;
    postId?: string;
    initialData?: {
        title: string;
        content: string;
    };
}

async function postAction(
    prevState: ActionState,
    formData: FormData,
): Promise<ActionState> {
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const errors: Record<string, string> = {};

    if (!title || !title.trim()) {
        errors.title = '게시글 제목을 입력해 주세요.';
    } else if (title.trim().length < 2) {
        errors.title = '제목은 2자 이상 입력해야 합니다.';
    }

    if (!content || !content.trim()) {
        errors.content = '본문 내용을 입력해 주세요.';
    } else if (content.trim().length < 10) {
        errors.content = '내용은 최소 10자 이상 작성해야 합니다.';
    }

    if (Object.keys(errors).length > 0) {
        return { success: false, errors };
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
    return { success: true };
}

const CURRENT_TIME = Date.now();

export default function PostForm({
    boardId,
    postId,
    initialData,
}: PostFormProps) {
    const router = useRouter();
    const isEdit = Boolean(postId);
    const [state, formAction, isPending] = useActionState(
        postAction,
        INITIAL_ACTION_STATE,
    );

    useEffect(() => {
        if (state.success) {
            alert(`게시글이 성공적으로 ${isEdit ? '수정' : '등록'}되었습니다.`);
            router.push(`/boards/${boardId}`);
        }
    }, [state.success, isEdit, boardId, router]);

    return (
        <form
            action={formAction}
            noValidate
            className="space-y-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm md:p-8"
        >
            <div className="border-b border-gray-100 pb-4">
                <span className="text-xs font-bold tracking-wider text-blue-600 uppercase">
                    {boardId}
                </span>
                <h1 className="mt-1 text-2xl font-black text-gray-900">
                    {isEdit ? '게시글 수정' : '새 글 작성'}
                </h1>
            </div>

            <div className="space-y-4">
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">
                        게시글 제목
                    </label>
                    <Input
                        name="title"
                        defaultValue={initialData?.title || ''}
                        placeholder="제목을 입력하세요"
                        className={cn(
                            'h-11',
                            state.errors?.title &&
                                'border-red-500 bg-red-50/20',
                        )}
                    />
                    {state.errors?.title && (
                        <p className="flex items-center gap-1 text-xs font-medium text-red-500">
                            <FiAlertCircle className="h-3 w-3" />
                            <span>{state.errors.title}</span>
                        </p>
                    )}
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">
                        본문 내용
                    </label>
                    <textarea
                        name="content"
                        rows={10}
                        defaultValue={initialData?.content || ''}
                        placeholder="문의 사항이나 본문 내용을 상세히 작성해 주세요 (최소 10자)"
                        className={cn(
                            'w-full rounded-2xl border border-gray-200 p-4 text-sm transition-colors outline-none focus:border-blue-600',
                            state.errors?.content &&
                                'border-red-500 bg-red-50/20',
                        )}
                    />
                    {state.errors?.content && (
                        <p className="flex items-center gap-1 text-xs font-medium text-red-500">
                            <FiAlertCircle className="h-3 w-3" />
                            <span>{state.errors.content}</span>
                        </p>
                    )}
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">
                        첨부파일
                    </label>
                    <FileUpload
                        gid={`post-temp-${CURRENT_TIME}`}
                        location="post_attach"
                        multiple={true}
                    />
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    className="h-11 px-6 text-xs font-bold"
                >
                    취소
                </Button>
                <Button
                    type="submit"
                    disabled={isPending}
                    className="h-11 bg-gray-900 px-6 text-xs font-bold text-white hover:bg-gray-800"
                >
                    {isPending
                        ? '저장 중...'
                        : isEdit
                          ? '수정 완료'
                          : '등록 완료'}
                </Button>
            </div>
        </form>
    );
}
