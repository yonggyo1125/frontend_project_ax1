'use client';

import { registerAction } from '@/domains/auth/actions/register.action';
import FileUpload from '@/domains/files/components/FileUpload';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { INITIAL_ACTION_STATE } from '@/shared/types/action.types';
import { cn } from '@/shared/utils/cn';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useMemo } from 'react';
import { FiAlertCircle, FiLock, FiMail, FiUser } from 'react-icons/fi';
import { v4 as uuid4 } from 'uuid';

export default function RegisterForm() {
    const router = useRouter();
    const currentGid = useMemo(() => `profile-${uuid4()}`, []);

    const [state, formAction, isPending] = useActionState(
        registerAction,
        INITIAL_ACTION_STATE,
    );

    useEffect(() => {
        if (state.success) {
            alert('회원가입이 완료되었습니다! 환영합니다.');
            router.push('/');
            router.refresh();
        }
    }, [state.success, router]);

    return (
        <div className="mx-auto w-full max-w-md rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
            <div className="mb-8 text-center">
                <span className="text-xs font-bold tracking-wider text-blue-600 uppercase">
                    Create Account
                </span>
                <h1 className="mt-1 text-2xl font-black text-gray-900">
                    회원가입
                </h1>
                <p className="mt-1.5 text-xs text-gray-500">
                    간단한 정보 입력으로 스파르타 쇼핑몰 회원이 되어보세요.
                </p>
            </div>

            {state.message && !state.success && (
                <div className="mb-6 flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 p-3.5 text-xs font-medium text-red-600">
                    <FiAlertCircle className="h-4 w-4 shrink-0" />
                    <span>{state.message}</span>
                </div>
            )}

            <form action={formAction} noValidate className="space-y-4">
                <input type="hidden" name="gid" value={currentGid} />

                {/* 이름(닉네임) 필드 */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">
                        이름 (닉네임)
                    </label>
                    <div className="relative">
                        <FiUser className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                            type="text"
                            name="name"
                            placeholder="홍길동 (2자 이상)"
                            autoComplete="name"
                            className={cn(
                                'h-11 pl-10',
                                state.errors?.name &&
                                    'border-red-500 bg-red-50/20 focus-visible:ring-red-500',
                            )}
                        />
                    </div>
                    {state.errors?.name && (
                        <p className="flex items-center gap-1 text-xs font-medium text-red-500">
                            <FiAlertCircle className="h-3 w-3 shrink-0" />
                            <span>{state.errors.name}</span>
                        </p>
                    )}
                </div>

                {/* 이메일 필드 */}
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

                {/* 비밀번호 필드 */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">
                        비밀번호
                    </label>
                    <div className="relative">
                        <FiLock className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                            type="password"
                            name="password"
                            placeholder="8자 이상 비밀번호 입력"
                            autoComplete="new-password"
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

                {/* 비밀번호 확인 필드 */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">
                        비밀번호 확인
                    </label>
                    <div className="relative">
                        <FiLock className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                            type="password"
                            name="passwordConfirm"
                            placeholder="비밀번호를 한 번 더 입력하세요"
                            autoComplete="new-password"
                            className={cn(
                                'h-11 pl-10',
                                state.errors?.passwordConfirm &&
                                    'border-red-500 bg-red-50/20 focus-visible:ring-red-500',
                            )}
                        />
                    </div>
                    {state.errors?.passwordConfirm && (
                        <p className="flex items-center gap-1 text-xs font-medium text-red-500">
                            <FiAlertCircle className="h-3 w-3 shrink-0" />
                            <span>{state.errors.passwordConfirm}</span>
                        </p>
                    )}
                </div>

                {/* 프로필 이미지 업로드 (선택) */}
                <div className="space-y-1.5 pt-1">
                    <label className="text-xs font-bold text-gray-700">
                        프로필 이미지 (선택)
                    </label>
                    <FileUpload
                        gid={currentGid}
                        location="profile"
                        multiple={false}
                    />
                </div>

                <div className="pt-2">
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="h-11 w-full bg-blue-600 text-xs font-bold text-white hover:bg-blue-700"
                    >
                        {isPending ? '가입 처리 중...' : '회원가입 완료'}
                    </Button>
                </div>
            </form>

            <div className="mt-6 border-t border-gray-100 pt-6 text-center text-xs text-gray-500">
                이미 계정이 있으신가요?{' '}
                <Link
                    href="/login"
                    className="font-bold text-gray-900 hover:underline"
                >
                    로그인하기
                </Link>
            </div>
        </div>
    );
}
