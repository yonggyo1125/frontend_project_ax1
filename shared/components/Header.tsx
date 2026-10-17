import LogoutButton from '@/domains/auth/components/LogoutButton';
import { getCurrentUser } from '@/domains/auth/queries/getCurrentUser.query';
import CategoryNav from '@/domains/categories/components/CategoryNav';
import { getCategoryTree } from '@/domains/categories/queries/getCategoryTree.query';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/utils/cn';
import Link from 'next/link';
import {
    FiGrid,
    FiMessageSquare,
    FiSettings,
    FiShoppingBag,
    FiUser,
} from 'react-icons/fi';

export default async function Header() {
    const [categories, { user, isAdmin }] = await Promise.all([
        getCategoryTree(),
        getCurrentUser(),
    ]);

    return (
        <header
            className={cn(
                'sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-md transition-all',
            )}
        >
            <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 md:h-16 md:px-6">
                <Link
                    href="/"
                    className="text-lg font-black tracking-tight text-gray-900 transition-colors hover:text-blue-600 md:text-xl"
                >
                    Team Sparta
                </Link>

                <nav className="flex items-center gap-1 md:gap-2.5">
                    <Link
                        href="/products"
                        aria-label="전체 상품"
                        className="flex h-10 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-blue-600 md:px-3 md:text-sm"
                    >
                        <FiGrid className="h-4 w-4 shrink-0" />
                        <span className="hidden md:inline">전체 상품</span>
                    </Link>

                    <Link
                        href="/boards/notice"
                        aria-label="커뮤니티 게시판"
                        className="flex h-10 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-blue-600 md:px-3 md:text-sm"
                    >
                        <FiMessageSquare className="h-4 w-4 shrink-0" />
                        <span className="hidden md:inline">커뮤니티</span>
                    </Link>

                    <Link
                        href="/cart"
                        aria-label="장바구니"
                        className="flex h-10 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-blue-600 md:px-3 md:text-sm"
                    >
                        <FiShoppingBag className="h-4 w-4 shrink-0" />
                        <span className="hidden md:inline">장바구니</span>
                    </Link>

                    {/* 관리자(admin) 전용 관리 센터 진입 버튼 */}
                    {isAdmin && (
                        <Link
                            href="/admin/categories"
                            className="flex h-9 items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 text-xs font-bold text-blue-600 transition-colors hover:bg-blue-100 md:px-3"
                        >
                            <FiSettings className="h-3.5 w-3.5 shrink-0" />
                            <span className="hidden sm:inline">관리자</span>
                        </Link>
                    )}

                    {/* 로그인 세션 유무에 따른 조건부 UI 분기 */}
                    {user ? (
                        <div className="flex items-center gap-1.5 pl-1">
                            <Link
                                href="/profile"
                                className="flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50/80 px-2.5 text-xs font-bold text-gray-800 transition-colors hover:border-blue-600 hover:bg-white md:px-3"
                            >
                                <FiUser className="h-3.5 w-3.5 text-blue-600" />
                                <span>{user.name}님</span>
                            </Link>
                            <LogoutButton />
                        </div>
                    ) : (
                        <div className="flex items-center gap-1.5 pl-1">
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-9 px-2.5 md:px-3"
                            >
                                <Link
                                    href="/login"
                                    className="flex items-center gap-1.5"
                                >
                                    <FiUser className="h-3.5 w-3.5" />
                                    <span className="text-xs md:text-sm">
                                        로그인
                                    </span>
                                </Link>
                            </Button>
                            <Button
                                size="sm"
                                className="hidden h-9 bg-gray-900 px-3 text-xs font-bold text-white hover:bg-gray-800 sm:inline-flex"
                            >
                                <Link href="/register">회원가입</Link>
                            </Button>
                        </div>
                    )}
                </nav>
            </div>

            <CategoryNav categories={categories} />
        </header>
    );
}
