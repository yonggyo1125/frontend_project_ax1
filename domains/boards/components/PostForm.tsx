'use client';

import { createPostAction } from '@/domains/boards/actions/createPost.action';
import { updatePostAction } from '@/domains/boards/actions/updatePost.action';
import FileUpload from '@/domains/files/components/FileUpload';
import { FileInfo } from '@/domains/files/types/file.types';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import WysiwygEditor from '@/shared/components/WysiwygEditor';
import { INITIAL_ACTION_STATE } from '@/shared/types/action.types';
import { cn } from '@/shared/utils/cn';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useMemo } from 'react';
import { FiAlertCircle } from 'react-icons/fi';
import { v4 as uuid4 } from 'uuid';

interface PostFormProps {
    boardId: string;
    boardName?: string;
    postId?: string;
    initialData?: {
        gid?: string;
        title: string;
        content: string;
        attachments?: FileInfo[];
    };
}

export default function PostForm({
    boardId,
    boardName,
    postId,
    initialData,
}: PostFormProps) {
    const router = useRouter();
    const isEdit = Boolean(postId);

    const currentGid = useMemo(
        () => initialData?.gid || `post-${uuid4()}`,
        [initialData?.gid],
    );

    const targetAction = isEdit
        ? updatePostAction.bind(null, boardId, postId!)
        : createPostAction.bind(null, boardId);

    const [state, formAction, isPending] = useActionState(
        targetAction,
        INITIAL_ACTION_STATE,
    );

    useEffect(() => {
        if (state.success) {
            alert(`게시글이 성공적으로 ${isEdit ? '수정' : '등록'}되었습니다.`);
            router.push(
                isEdit ? `/boards/${boardId}/${postId}` : `/boards/${boardId}`,
            );
            router.refresh();
        } else if (state.message) {
            alert(state.message);
        }
    }, [state.success, state.message, isEdit, boardId, postId, router]);

    return (
        <form
            action={formAction}
            noValidate
            className="space-y-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm md:p-8"
        >
            <input type="hidden" name="gid" value={currentGid} />

            <div className="border-b border-gray-100 pb-4">
                <span className="text-xs font-bold tracking-wider text-blue-600 uppercase">
                    {boardName || boardId}
                </span>
                <h1 className="mt-1 text-2xl font-black text-gray-900">
                    {isEdit ? '게시글 수정' : '새글 작성'}
                </h1>
            </div>

            <div className="space-y-4">
                {/* 제목 필드 */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">
                        게시글 제목
                    </label>
                    <Input
                        name="title"
                        defaultValue={initialData?.title || ''}
                        placeholder="제목을 입력하세요."
                        className={cn(
                            'h-11',
                            state.errors?.title &&
                                'border-red-500 bg-red-50/20 focus-visible:ring-red-500',
                        )}
                    />
                    {state.errors?.title && (
                        <p className="flex items-center gap-1 text-xs font-medium text-red-500">
                            <FiAlertCircle className="h-3 w-3 shrink-0" />
                            <span>{state.errors.title}</span>
                        </p>
                    )}
                </div>

                {/* 위지윅 본문 필드 */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">
                        본문 내용 (위지윅 에디터)
                    </label>
                    <WysiwygEditor
                        name="content"
                        defaultValue={initialData?.content || ''}
                        placeholder="문의 사항이나 안내 내용을 서식과 함께 상세히 작성해 주세요 (최소 10자)"
                        className={cn(
                            state.errors?.content &&
                                'border-red-500 bg-red-50/20',
                        )}
                    />
                    {state.errors?.content && (
                        <p className="flex items-center gap-1 text-xs font-medium text-red-500">
                            <FiAlertCircle className="h-3 w-3 shrink-0" />
                            <span>{state.errors.content}</span>
                        </p>
                    )}
                </div>

                {/* 첨부파일 업로더 */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">
                        첨부파일
                    </label>
                    <FileUpload
                        gid={currentGid}
                        location="post_attach"
                        multiple={true}
                        initialFiles={initialData?.attachments}
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
