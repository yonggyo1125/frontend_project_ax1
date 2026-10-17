'use client';

import { logoutAction } from '@/domains/auth/actions/logout.action';
import { Button } from '@/shared/components/ui/button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FiLogOut } from 'react-icons/fi';

export default function LogoutButton() {
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        const result = await logoutAction();
        if (result.success) {
            router.push('/');
            router.refresh();
        } else {
            alert(result.message || '로그아웃에 실패했습니다.');
            setIsLoggingOut(false);
        }
    };

    return (
        <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isLoggingOut}
            onClick={handleLogout}
            className="h-9 gap-1.5 px-2.5 text-xs font-semibold text-gray-700 hover:text-red-600 md:px-3"
        >
            <FiLogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">
                {isLoggingOut ? '로그아웃 중...' : '로그아웃'}
            </span>
        </Button>
    );
}
