import CategoryNav from '@/domains/categories/components/CategoryNav';
import { getCategoryTree } from '@/domains/categories/queries/getCategoryTree.query';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/utils/cn';
import Link from 'next/link';
import { FiGrid, FiShoppingBag, FiUser } from 'react-icons/fi';

export default async function Header() {
    const categories = await getCategoryTree();

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

                <nav className="flex items-center gap-1 md:gap-3">
                    <Link
                        href="/products"
                        aria-label="전체 상품"
                        className="flex h-10 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-blue-600 md:px-3 md:text-sm"
                    >
                        <FiGrid className="h-4 w-4 shrink-0" />
                        <span className="hidden md:inline">전체 상품</span>
                    </Link>

                    <Link
                        href="/cart"
                        aria-label="장바구니"
                        className="flex h-10 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-blue-600 md:px-3 md:text-sm"
                    >
                        <FiShoppingBag className="h-4 w-4 shrink-0" />
                        <span className="hidden md:inline">장바구니</span>
                    </Link>

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

            <CategoryNav categories={categories} />
        </header>
    );
}
