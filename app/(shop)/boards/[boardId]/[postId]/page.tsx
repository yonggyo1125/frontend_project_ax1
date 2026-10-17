export const instant = false;

import { getCurrentUser } from '@/domains/auth/queries/getCurrentUser.query';
import PostDetail from '@/domains/boards/components/PostDetail';
import { getBoardSetting } from '@/domains/boards/queries/getBoardSetting.query';
import { getPostById } from '@/domains/boards/queries/getPostById.query';
import { notFound } from 'next/navigation';

export default async function BoardPostDetailPage({
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

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
            <PostDetail
                boardId={boardId}
                boardName={boardSetting.name}
                post={post}
                currentUserId={user?.id}
                isAdmin={isAdmin}
            />
        </div>
    );
}
