import PostList from '@/domains/boards/components/PostList';

export default async function BoardPage({
    params,
}: {
    params: Promise<{ boardId: string }>;
}) {
    const { boardId } = await params;
    const mockPosts = [
        {
            id: 'post-1',
            title: `${boardId} 게시판의 첫 번째 안내글입니다.`,
            author_name: '관리자',
            created_at: '2026-10-15T09:00:00Z',
        },
    ];

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
            <PostList boardId={boardId} posts={mockPosts} />
        </div>
    );
}
