'use client';

import FileUpload from '@/domains/files/components/FileUpload';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { ActionState, INITIAL_ACTION_STATE } from '@/shared/types/action.types';
import { cn } from '@/shared/utils/cn';
import Link from 'next/link';
import { useActionState } from 'react';
import { FiAlertCircle, FiCheck, FiLock, FiMail, FiUser } from 'react-icons/fi';

async function registerAction(
    prevState: ActionState,
    formData: FormData,
): Promise<ActionState> {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const passwordConfirm = formData.get('passwordConfirm') as string;
    const errors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || name.trim().length < 2) {
        errors.name = '이름은 최소 2글자 이상 입력해야 합니다.';
    }
    if (!email || !emailRegex.test(email)) {
        errors.email = '유효한 이메일 형식을 입력해 주세요.';
    }
    if (!password || password.length < 8) {
        errors.password = '비밀번호는 영문/숫자 포함 8자 이상이어야 합니다.';
    }
    if (!passwordConfirm || password !== passwordConfirm) {
        errors.passwordConfirm = '비밀번호가 일치하지 않습니다.';
    }

    if (Object.keys(errors).length > 0) {
        return { success: false, errors };
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
    return { success: true, message: `${name}님, 회원가입이 완료되었습니다!` };
}

export default function RegisterForm() {
    const [state, formAction, isPending] = useActionState(
        registerAction,
        INITIAL_ACTION_STATE,
    );

    return (
        <div className="mx-auto w-full max-w-lg rounded-3xl border border-gray-100 bg-white p-8 shadow-xl shadow-gray-100/50">
            <div className="mb-6 text-center">
                <h1 className="text-2xl font-black text-gray-900">회원가입</h1>
                <p className="mt-1 text-xs text-gray-500">
                    기본 정보 입력 후 쇼핑몰의 모든 서비스를 이용해 보세요.
                </p>
            </div>
            {state.message && (
                <div
                    className={cn(
                        'mb-4 rounded-2xl p-3.5 text-center text-xs font-bold',
                        state.success
                            ? 'bg-blue-50 text-blue-600'
                            : 'bg-red-50 text-red-600',
                    )}
                >
                    {state.message}
                </div>
            )}

            <form action={formAction} noValidate className="space-y-4">
                {/* 프로필 이미지 업로더 연동 */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">
                        프로필 사진 (선택)
                    </label>
                    <FileUpload
                        gid="profile-temp-gid"
                        location="profile"
                        multiple={false}
                    />
                </div>

                {/* 이름 */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">
                        이름
                    </label>
                    <div className="relative">
                        <FiUser className="absolute top-3.5 left-3.5 h-4 w-4 text-gray-400" />
                        <Input
                            name="name"
                            placeholder="홍길동"
                            className={cn(
                                'h-11 pl-10',
                                state.errors?.name &&
                                    'border-red-500 bg-red-50/20',
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
                {/* 이메일 */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">
                        이메일
                    </label>
                    <div className="relative">
                        <FiMail className="absolute top-3.5 left-3.5 h-4 w-4 text-gray-400" />
                        <Input
                            name="email"
                            type="email"
                            placeholder="user@sparta.com"
                            className={cn(
                                'h-11 pl-10',
                                state.errors?.email &&
                                    'border-red-500 bg-red-50/20',
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

                {/* 비밀번호 */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">
                        비밀번호
                    </label>
                    <div className="relative">
                        <FiLock className="absolute top-3.5 left-3.5 h-4 w-4 text-gray-400" />
                        <Input
                            name="password"
                            type="password"
                            placeholder="영문, 숫자 포함 8자리 이상"
                            className={cn(
                                'h-11 pl-10',
                                state.errors?.password &&
                                    'border-red-500 bg-red-50/20',
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
                {/* 비밀번호 확인 */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">
                        비밀번호 확인
                    </label>
                    <div className="relative">
                        <FiCheck className="absolute top-3.5 left-3.5 h-4 w-4 text-gray-400" />
                        <Input
                            name="passwordConfirm"
                            type="password"
                            placeholder="비밀번호 재입력"
                            className={cn(
                                'h-11 pl-10',
                                state.errors?.passwordConfirm &&
                                    'border-red-500 bg-red-50/20',
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
                <Button
                    type="submit"
                    disabled={isPending}
                    className="mt-2 h-11 w-full bg-blue-600 font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700"
                >
                    {isPending ? '가입 처리 중...' : '회원가입 완료'}
                </Button>
            </form>
            <div className="mt-6 border-t border-gray-100 pt-4 text-center text-xs text-gray-500">
                이미 계정이 있으신가요?{' '}
                <Link
                    href="/login"
                    className="font-bold text-blue-600 hover:underline"
                >
                    로그인으로 이동
                </Link>
            </div>
        </div>
    );
}
