'use client';

import { loginAction } from '@/domains/auth/actions/login.action';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { INITIAL_ACTION_STATE } from '@/shared/types/action.types';
import { cn } from '@/shared/utils/cn';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useActionState, useEffect } from 'react';
import { FiAlertCircle, FiLock, FiMail } from 'react-icons/fi';

export default function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get('redirectTo') || '/';

    const [state, formAction, isPending] = useActionState(
        loginAction,
        INITIAL_ACTION_STATE,
    );

    useEffect(() => {
        if (state.success) {
            router.push(redirectTo);
            router.refresh();
        }
    }, [state.success, redirectTo, router]);

    return (
        <div className="mx-auto w-full max-w-md rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
            <div className="mb-8 text-center">
                <span className="text-xs font-bold tracking-wider text-blue-600 uppercase">
                    Welcome Back
                </span>
                <h1 className="mt-1 text-2xl font-black text-gray-900">
                    로그인
                </h1>
                <p className="mt-1.5 text-xs text-gray-500">
                    스파르타 쇼핑몰 계정으로 로그인하여 모든 서비스를
                    이용하세요.
                </p>
            </div>

            {state.message && !state.success && (
                <div className="mb-6 flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 p-3.5 text-xs font-medium text-red-600">
                    <FiAlertCircle className="h-4 w-4 shrink-0" />
                    <span>{state.message}</span>
                </div>
            )}

            <form action={formAction} noValidate className="space-y-5">
                {/* 이메일 입력 */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">
                        이메일 주소
                    </label>
                    <div className="relative">
                        <FiMail className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                            type="email"
                            name="email"
                            placeholder="you@example.com"
                            autoComplete="email"
                            className={cn(
                                'h-11 pl-10',
                                state.errors?.email &&
                                    'border-red-500 bg-red-50/20 focus-visible:ring-red-500',
                            )}
                        />
                    </div>
                    {state.errors?.email && (
                        <p className="flex items-center gap-1 text-xs font-medium text-red-500">
                            <FiAlertCircle className="h-3 w-3 shrink-0" />
                            <span>{state.errors.email}</span>
                        </p>
                    )}
                </div>

                {/* 비밀번호 입력 */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">
                        비밀번호
                    </label>
                    <div className="relative">
                        <FiLock className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                            type="password"
                            name="password"
                            placeholder="비밀번호를 입력하세요"
                            autoComplete="current-password"
                            className={cn(
                                'h-11 pl-10',
                                state.errors?.password &&
                                    'border-red-500 bg-red-50/20 focus-visible:ring-red-500',
                            )}
                        />
                    </div>
                    {state.errors?.password && (
                        <p className="flex items-center gap-1 text-xs font-medium text-red-500">
                            <FiAlertCircle className="h-3 w-3 shrink-0" />
                            <span>{state.errors.password}</span>
                        </p>
                    )}
                </div>

                <Button
                    type="submit"
                    disabled={isPending}
                    className="h-11 w-full bg-gray-900 text-xs font-bold text-white hover:bg-gray-800"
                >
                    {isPending ? '로그인 처리 중...' : '로그인'}
                </Button>
            </form>

            <div className="mt-6 border-t border-gray-100 pt-6 text-center text-xs text-gray-500">
                아직 계정이 없으신가요?{' '}
                <Link
                    href="/register"
                    className="font-bold text-blue-600 hover:underline"
                >
                    회원가입하기
                </Link>
            </div>
        </div>
    );
}
