import Link from 'next/link';
import { FiEdit3 } from 'react-icons/fi';

interface PostItem {
    id: string;
    title: string;
    author_name: string;
    created_at: string;
}

export default function PostList({
    boardId,
    posts,
}: {
    boardId: string;
    posts: PostItem[];
}) {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-5">
                <div>
                    <h1 className="text-2xl font-black text-gray-900">
                        {boardId === 'notice'
                            ? '공지사항'
                            : boardId === 'qna'
                              ? '상품 Q&A'
                              : '구매 후기'}
                    </h1>
                    <p className="mt-1 text-xs text-gray-500">
                        총 {posts.length}개의 게시물이 등록되어 있습니다.
                    </p>
                </div>
                <Link
                    href={`/boards/${boardId}/new`}
                    className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700"
                >
                    <FiEdit3 className="h-4 w-4" />
                    <span>글쓰기</span>
                </Link>
            </div>

            <div className="divide-y divide-gray-100 rounded-2xl border border-gray-100 bg-white">
                {posts.map((post) => (
                    <div
                        key={post.id}
                        className="flex items-center justify-between p-4 hover:bg-gray-50/60"
                    >
                        <div className="space-y-1">
                            <Link
                                href={`/boards/${boardId}/${post.id}`}
                                className="text-sm font-semibold text-gray-900 hover:text-blue-600"
                            >
                                {post.title}
                            </Link>
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                <span>{post.author_name}</span>
                                <span>•</span>
                                <span>
                                    {new Date(
                                        post.created_at,
                                    ).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
