export const instant = false;

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

    const [boardSetting, posts] = await Promise.all([
        getBoardSetting(boardId),
        getPostsByBoard(boardId),
    ]);

    if (!boardSetting) {
        notFound();
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
            <PostList
                boardId={boardId}
                boardSetting={boardSetting}
                posts={posts}
            />
        </div>
    );
}
