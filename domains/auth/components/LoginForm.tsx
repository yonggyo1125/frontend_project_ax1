'use client';

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { ActionState, INITIAL_ACTION_STATE } from '@/shared/types/action.types';
import { cn } from '@/shared/utils/cn';
import Link from 'next/link';
import { useActionState } from 'react';
import { FiAlertCircle, FiLock, FiMail } from 'react-icons/fi';

// 임시 Mock Action
async function loginAction(
    prevState: ActionState,
    formData: FormData,
): Promise<ActionState> {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const errors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !email.trim()) {
        errors.email = '이메일 주소를 입력해 주세요.';
    } else if (!emailRegex.test(email)) {
        errors.email =
            '올바른 이메일 형식을 입력해 주세요. (예: user@sparta.com)';
    }

    if (!password) {
        errors.password = '비밀번호를 입력해 주세요.';
    } else if (password.length < 6) {
        errors.password = '비밀번호는 최소 6자 이상이어야 합니다.';
    }

    if (Object.keys(errors).length > 0) {
        return { success: false, errors };
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
    return { success: true, message: `${email} 계정으로 로그인되었습니다.` };
}

export default function LoginForm() {
    const [state, formAction, isPending] = useActionState(
        loginAction,
        INITIAL_ACTION_STATE,
    );

    return (
        <div className="mx-auto w-full max-w-md rounded-3xl border border-gray-100 bg-white p-8 shadow-xl shadow-gray-100/50">
            <div className="mb-6 text-center">
                <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">
                    Team Sparta
                </span>
                <h1 className="mt-2 text-2xl font-black tracking-tight text-gray-900">
                    로그인
                </h1>
                <p className="mt-1 text-xs text-gray-500">
                    서비스 이용을 위해 계정 정보를 입력해 주세요.
                </p>
            </div>

            {state.message && (
                <div
                    className={cn(
                        'mb-5 rounded-2xl p-3.5 text-center text-xs font-bold',
                        state.success
                            ? 'bg-blue-50 text-blue-600'
                            : 'bg-red-50 text-red-600',
                    )}
                >
                    {state.message}
                </div>
            )}

            <form action={formAction} noValidate className="space-y-4">
                {/* 이메일 입력 필드 */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">
                        이메일 계정
                    </label>
                    <div className="relative">
                        <FiMail className="absolute top-3.5 left-3.5 h-4 w-4 text-gray-400" />
                        <Input
                            name="email"
                            type="email"
                            placeholder="user@sparta.com"
                            className={cn(
                                'h-11 pl-10 text-sm transition-colors',
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

                {/* 비밀번호 입력 필드 */}
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-gray-700">
                            비밀번호
                        </label>
                        <a
                            href="#"
                            className="text-[11px] font-medium text-blue-600 hover:underline"
                        >
                            비밀번호 찾기
                        </a>
                    </div>
                    <div className="relative">
                        <FiLock className="absolute top-3.5 left-3.5 h-4 w-4 text-gray-400" />
                        <Input
                            name="password"
                            type="password"
                            placeholder="6자리 이상 비밀번호 입력"
                            className={cn(
                                'h-11 pl-10 text-sm transition-colors',
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
                    className="h-11 w-full bg-blue-600 font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700"
                >
                    {isPending ? '로그인 처리 중...' : '로그인'}
                </Button>
            </form>

            <div className="mt-8 border-t border-gray-100 pt-6 text-center text-xs text-gray-500">
                아직 회원이 아니신가요?{' '}
                <Link
                    href="/register"
                    className="font-bold text-blue-600 hover:underline"
                >
                    회원가입
                </Link>
            </div>
        </div>
    );
}
