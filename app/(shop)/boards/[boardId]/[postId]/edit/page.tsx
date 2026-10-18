export const instant = false;

import { getCurrentUser } from '@/domains/auth/queries/getCurrentUser.query';
import PostForm from '@/domains/boards/components/PostForm';
import { getBoardSetting } from '@/domains/boards/queries/getBoardSetting.query';
import { getPostById } from '@/domains/boards/queries/getPostById.query';
import { notFound } from 'next/navigation';

export default async function BoardPostEditPage({
    params,
}: {
    params: Promise<{ boardId: string; postId: string }>;
}) {
    const { boardId, postId } = await params;

    const [boardSetting, post, { user, isAdmin }] = await Promise.all([
        getBoardSetting(boardId),
        getPostById(postId),
        getCurrentUser(),
    ]);

    if (!boardSetting || !post || post.board_id !== boardId) {
        notFound();
    }

    const canEdit = Boolean(isAdmin || (user && post.user_id === user.id));
    if (!canEdit) {
        notFound();
    }

    return (
        <div className="mx-auto max-w-4xl px-4 py-8 md:px-6">
            <PostForm
                boardId={boardId}
                boardName={boardSetting.name}
                postId={post.id}
                initialData={{
                    gid: post.gid,
                    title: post.title,
                    content: post.content,
                    attachments: post.attachments,
                }}
            />
        </div>
    );
}
