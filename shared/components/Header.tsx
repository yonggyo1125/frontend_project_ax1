import CategoryNav from '@/domains/categories/components/CategoryNav';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/utils/cn';
import Link from 'next/link';
import { FiGrid, FiShoppingBag, FiUser } from 'react-icons/fi';

export default function Header() {
    const mockCartItemCount = 2; // 임시 장바구니 수량

    return (
        <header
            className={cn(
                'sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-md transition-all',
            )}
        >
            {/* 기본 모바일: h-14, px-4 / md 이상: h-16, px-6 */}
            <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 md:h-16 md:px-6">
                {/* 로고 영역 */}
                <Link
                    href="/"
                    className="text-lg font-black tracking-tight text-gray-900 transition-colors hover:text-blue-600 md:text-xl"
                >
                    Team Sparta
                </Link>

                {/* 네비게이션 영역 */}
                <nav className="flex items-center gap-1 md:gap-3">
                    {/* 전체 상품 링크 */}
                    <Link
                        href="/products"
                        aria-label="전체 상품"
                        className="flex h-10 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-blue-600 md:px-3 md:text-sm"
                    >
                        <FiGrid className="h-4 w-4 shrink-0" />
                        <span className="hidden md:inline">전체 상품</span>
                    </Link>

                    {/* 장바구니 링크 (카트 뱃지 포함) */}
                    <Link
                        href="/cart"
                        aria-label="장바구니"
                        className="relative flex h-10 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-blue-600 md:px-3 md:text-sm"
                    >
                        <FiShoppingBag className="h-4 w-4 shrink-0" />
                        <span className="hidden md:inline">장바구니</span>
                        {mockCartItemCount > 0 && (
                            <Badge
                                variant="destructive"
                                className="h-4 min-w-4 px-1 text-[10px] leading-none md:ml-0.5"
                            >
                                {mockCartItemCount}
                            </Badge>
                        )}
                    </Link>

                    {/* 로그인 버튼 */}
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
                            <span className="text-xs md:text-sm">로그인</span>
                        </Link>
                    </Button>
                </nav>
            </div>

            {/* 중첩 카테고리 GNB Bar */}
            <CategoryNav />
        </header>
    );
}
