import { Category } from '@/domains/categories/types/category.types';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import Link from 'next/link';
import { FiChevronDown } from 'react-icons/fi';

interface CategoryNavProps {
    categories: Category[];
}

export default function CategoryNav({ categories }: CategoryNavProps) {
    return (
        <div className="w-full border-b border-gray-100 bg-white">
            <div className="mx-auto flex max-w-7xl items-center px-4 md:px-6">
                {/* 모바일 뷰 - 가로 스크롤 메뉴 */}
                <nav className="no-scrollbar flex space-x-2 overflow-x-auto py-2.5 md:hidden">
                    <Link
                        href="/products"
                        className="shrink-0 rounded-full bg-gray-900 px-3 py-1 text-xs font-semibold text-white"
                    >
                        전체
                    </Link>
                    {categories.map((cat) => (
                        <Link
                            key={cat.id}
                            href={`/products?category=${cat.id}`}
                            className="shrink-0 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-200"
                        >
                            {cat.name}
                        </Link>
                    ))}
                </nav>

                {/* 데스크톱 뷰 (md:) - 1~3차 중첩 드롭다운 GNB 메뉴 */}
                <nav className="hidden items-center gap-6 py-3 md:flex">
                    <Link
                        href="/products"
                        className="text-sm font-bold text-gray-900 transition-colors hover:text-blue-600"
                    >
                        전체 카테고리
                    </Link>
                    {categories.map((cat) => (
                        <div key={cat.id} className="relative">
                            {cat.children && cat.children.length > 0 ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-gray-700 transition-colors outline-none hover:text-blue-600">
                                        <span>{cat.name}</span>
                                        <FiChevronDown className="h-3.5 w-3.5 text-gray-400" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align="start"
                                        className="w-48 bg-white p-1.5 shadow-lg"
                                    >
                                        <DropdownMenuItem>
                                            <Link
                                                href={`/products?category=${cat.id}`}
                                                className="w-full cursor-pointer text-xs font-bold text-blue-600"
                                            >
                                                {cat.name} 전체보기
                                            </Link>
                                        </DropdownMenuItem>
                                        {cat.children.map((sub) => (
                                            <div key={sub.id}>
                                                <DropdownMenuItem>
                                                    <Link
                                                        href={`/products?category=${sub.id}`}
                                                        className="w-full cursor-pointer text-xs font-semibold text-gray-800"
                                                    >
                                                        {sub.name}
                                                    </Link>
                                                </DropdownMenuItem>
                                                {sub.children &&
                                                    sub.children.map(
                                                        (third) => (
                                                            <DropdownMenuItem
                                                                key={third.id}
                                                            >
                                                                <Link
                                                                    href={`/products?category=${third.id}`}
                                                                    className="w-full cursor-pointer pl-3 text-[11px] text-gray-500 hover:text-blue-600"
                                                                >
                                                                    └{' '}
                                                                    {third.name}
                                                                </Link>
                                                            </DropdownMenuItem>
                                                        ),
                                                    )}
                                            </div>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <Link
                                    href={`/products?category=${cat.id}`}
                                    className="text-sm font-medium text-gray-700 transition-colors hover:text-blue-600"
                                >
                                    {cat.name}
                                </Link>
                            )}
                        </div>
                    ))}
                </nav>
            </div>
        </div>
    );
}
