export const instant = false;

import { getCurrentUser } from '@/domains/auth/queries/getCurrentUser.query';
import { canWritePost } from '@/domains/auth/utils/authValidation';
import PostForm from '@/domains/boards/components/PostForm';
import { getBoardSetting } from '@/domains/boards/queries/getBoardSetting.query';
import { notFound, redirect } from 'next/navigation';

export default async function BoardNewPage({
    params,
}: {
    params: Promise<{ boardId: string }>;
}) {
    const { boardId } = await params;

    const [boardSetting, { user, isAdmin }] = await Promise.all([
        getBoardSetting(boardId),
        getCurrentUser(),
    ]);

    if (!boardSetting) {
        notFound();
    }

    // 비로그인 사용자가 회원/관리자 전용 게시판 글쓰기에 접근한 경우 로그인 페이지로 이동
    if (!user && boardSetting.write_role !== 'all') {
        redirect(`/login?redirectTo=/boards/${boardId}/new`);
    }

    // 로그인했으나 게시판 쓰기 권한(예: notice 게시판의 admin 권한)이 없는 경우 목록으로 이동
    if (!canWritePost(boardSetting.write_role, user, isAdmin)) {
        redirect(`/boards/${boardId}`);
    }

    return (
        <div className="mx-auto max-w-4xl px-4 py-8 md:px-6">
            <PostForm boardId={boardId} boardName={boardSetting.name} />
        </div>
    );
}
