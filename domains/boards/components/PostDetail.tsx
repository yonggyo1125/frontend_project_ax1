'use client';

import { deletePostAction } from '@/domains/boards/actions/deletePost.action';
import { Post } from '@/domains/boards/types/post.types';
import FileList from '@/domains/files/components/FileList';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FiArrowLeft, FiEdit2, FiTrash2 } from 'react-icons/fi';

interface PostDetailProps {
    boardId: string;
    boardName: string;
    post: Post;
    currentUserId?: string | null;
    isAdmin?: boolean;
}

export default function PostDetail({
    boardId,
    boardName,
    post,
    currentUserId,
    isAdmin = false,
}: PostDetailProps) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    // 권한 판별: 관리자이거나 작성자 본인인 경우에만 편집 허용
    const canManage = Boolean(
        isAdmin || (currentUserId && post.user_id === currentUserId),
    );

    const handleDelete = async () => {
        if (!confirm('정말로 이 게시글을 삭제하시겠습니까?')) return;

        setIsDeleting(true);
        const result = await deletePostAction(boardId, post.id);

        if (result.success) {
            alert('게시글이 성공적으로 삭제되었습니다.');
            router.push(`/boards/${boardId}`);
        } else {
            alert(result.message || '게시글 삭제 처리에 실패했습니다.');
            setIsDeleting(false);
        }
    };

    return (
        <article className="mx-auto max-w-4xl space-y-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
            <div className="border-b border-gray-100 pb-5">
                <Link
                    href={`/boards/${boardId}`}
                    className="text-xs font-bold tracking-wider text-blue-600 uppercase hover:underline"
                >
                    {boardName}
                </Link>
                <h1 className="mt-2 text-xl font-black text-gray-900 md:text-2xl">
                    {post.title}
                </h1>
                <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
                    <span className="font-semibold text-gray-700">
                        {post.author_name}
                    </span>
                    <span>·</span>
                    <span>
                        {new Date(post.created_at).toLocaleString('ko-KR')}
                    </span>
                </div>
            </div>

            {/* 위지윅 리치 텍스트 HTML 렌더링 */}
            <div
                className="prose prose-sm min-h-48 max-w-none text-sm leading-relaxed text-gray-700"
                dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* 첨부파일 다운로드 리스트 연동 */}
            {post.attachments && post.attachments.length > 0 && (
                <FileList files={post.attachments} />
            )}

            <div className="flex items-center justify-between border-t border-gray-100 pt-5">
                <Link
                    href={`/boards/${boardId}`}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50"
                >
                    <FiArrowLeft className="h-4 w-4" />
                    <span>목록으로</span>
                </Link>

                {/* 작성자 본인 및 관리자 전용 액션 버튼 그룹 */}
                {canManage && (
                    <div className="flex items-center gap-2">
                        <Link
                            href={`/boards/${boardId}/${post.id}/edit`}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-gray-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-gray-800"
                        >
                            <FiEdit2 className="h-3.5 w-3.5" />
                            <span>수정</span>
                        </Link>
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-bold text-red-600 hover:bg-red-100 disabled:opacity-50"
                        >
                            <FiTrash2 className="h-3.5 w-3.5" />
                            <span>{isDeleting ? '삭제 중...' : '삭제'}</span>
                        </button>
                    </div>
                )}
            </div>
        </article>
    );
}
