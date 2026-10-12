export const instant = false;

import PostForm from '@/domains/boards/components/PostForm';

export default async function BoardNewPage({
    params,
}: {
    params: Promise<{ boardId: string }>;
}) {
    const { boardId } = await params;

    return (
        <div className="mx-auto max-w-4xl px-4 py-8 md:px-6">
            <PostForm boardId={boardId} />
        </div>
    );
}
