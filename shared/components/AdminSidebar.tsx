'use client';

import { cn } from '@/shared/utils/cn';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    FiBox,
    FiGrid,
    FiHome,
    FiSettings,
    FiShoppingBag,
    FiUsers,
} from 'react-icons/fi';

const ADMIN_MENUS = [
    { label: '대시보드', href: '/admin', icon: FiHome },
    { label: '상품 관리', href: '/admin/products', icon: FiBox },
    { label: '카테고리/진열 관리', href: '/admin/categories', icon: FiGrid },
    { label: '주문 관리', href: '/admin/orders', icon: FiShoppingBag },
    { label: '회원 관리', href: '/admin/users', icon: FiUsers },
    { label: '게시판 설정', href: '/admin/boards', icon: FiSettings },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 shrink-0 border-r border-gray-800 bg-gray-900 p-4 text-white">
            <div className="mb-8 px-3 py-2">
                <Link
                    href="/"
                    className="text-lg font-black tracking-tight text-white hover:text-blue-400"
                >
                    Sparta Admin
                </Link>
                <p className="text-[11px] text-gray-400">
                    쇼핑몰 통합 백오피스
                </p>
            </div>
            <nav className="space-y-1">
                {ADMIN_MENUS.map((menu) => {
                    const Icon = menu.icon;
                    const isActive =
                        menu.href === '/admin'
                            ? pathname === '/admin'
                            : pathname.startsWith(menu.href);

                    return (
                        <Link
                            key={menu.href}
                            href={menu.href}
                            className={cn(
                                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-colors',
                                isActive
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                            )}
                        >
                            <Icon className="h-4 w-4" />
                            <span>{menu.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
