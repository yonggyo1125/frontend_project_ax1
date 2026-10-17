export const instant = false;

import PostForm from '@/domains/boards/components/PostForm';
import { getBoardSetting } from '@/domains/boards/queries/getBoardSetting.query';
import { notFound } from 'next/navigation';

export default async function BoardNewPage({
    params,
}: {
    params: Promise<{ boardId: string }>;
}) {
    const { boardId } = await params;
    const boardSetting = await getBoardSetting(boardId);

    if (!boardSetting) {
        notFound();
    }

    return (
        <div className="mx-auto max-w-4xl px-4 py-8 md:px-6">
            <PostForm boardId={boardId} boardName={boardSetting.name} />
        </div>
    );
}
