export const instant = false;

import { getCurrentUser } from '@/domains/auth/queries/getCurrentUser.query';
import { canWritePost } from '@/domains/auth/utils/authValidation';
import PostList from '@/domains/boards/components/PostList';
import { getBoardSetting } from '@/domains/boards/queries/getBoardSetting.query';
import { getPostsByBoard } from '@/domains/boards/queries/getPostsByBoard.query';
import { notFound } from 'next/navigation';

export default async function BoardPage({
    params,
}: {
    params: Promise<{ boardId: string }>;
}) {
    const { boardId } = await params;

    const [boardSetting, posts, { user, isAdmin }] = await Promise.all([
        getBoardSetting(boardId),
        getPostsByBoard(boardId),
        getCurrentUser(),
    ]);

    if (!boardSetting) {
        notFound();
    }

    const canWrite = canWritePost(boardSetting.write_role, user, isAdmin);

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
            <PostList
                boardId={boardId}
                boardSetting={boardSetting}
                posts={posts}
                canWrite={canWrite}
            />
        </div>
    );
}
