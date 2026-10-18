'use client';

import { updateProfileAction } from '@/domains/auth/actions/updateProfile.action';
import { withdrawAccountAction } from '@/domains/auth/actions/withdrawAccount.action';
import { UserProfile } from '@/domains/auth/types/auth.types';
import FileUpload from '@/domains/files/components/FileUpload';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { INITIAL_ACTION_STATE } from '@/shared/types/action.types';
import { cn } from '@/shared/utils/cn';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';
import {
    FiAlertCircle,
    FiCheckCircle,
    FiShield,
    FiTrash2,
    FiUser,
} from 'react-icons/fi';

interface ProfileFormProps {
    user: UserProfile;
}

export default function ProfileForm({ user }: ProfileFormProps) {
    const router = useRouter();
    const [isWithdrawing, setIsWithdrawing] = useState(false);

    const [state, formAction, isPending] = useActionState(
        updateProfileAction,
        INITIAL_ACTION_STATE,
    );

    useEffect(() => {
        if (state.success) {
            router.refresh();
        }
    }, [state.success, router]);

    const handleWithdraw = async () => {
        const confirmed = confirm(
            '정말로 회원 탈퇴하시겠습니까?\n탈퇴 시 계정이 비활성화 처리되며 다시 로그인할 수 없습니다.',
        );
        if (!confirmed) return;

        setIsWithdrawing(true);
        const result = await withdrawAccountAction();

        if (result.success) {
            alert(result.message);
            router.push('/');
            router.refresh();
        } else {
            alert(result.message || '회원 탈퇴 처리에 실패했습니다.');
            setIsWithdrawing(false);
        }
    };

    return (
        <div className="mx-auto max-w-2xl space-y-8">
            {/* 상단 프로필 요약 카드 */}
            <div className="flex flex-col items-start justify-between gap-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:flex-row sm:items-center md:p-8">
                <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-gray-100 text-xl font-black text-gray-600">
                        {user.avatar_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                                src={user.avatar_url}
                                alt={user.name}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            user.name.slice(0, 1)
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-black text-gray-900">
                                {user.name}
                            </h1>
                            <span
                                className={cn(
                                    'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase',
                                    user.role === 'admin'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700',
                                )}
                            >
                                <FiShield className="h-3 w-3" />
                                {user.role === 'admin'
                                    ? ' 관리자 (Admin)'
                                    : ' 일반 회원 (User)'}
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                            {user.email}
                        </p>
                        <p className="mt-0.5 font-mono text-[11px] text-gray-400">
                            가입일:{' '}
                            {new Date(user.created_at).toLocaleDateString(
                                'ko-KR',
                            )}
                        </p>
                    </div>
                </div>
            </div>

            {/* 프로필 정보 수정 폼 */}
            <form
                action={formAction}
                noValidate
                className="space-y-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm md:p-8"
            >
                <input type="hidden" name="gid" value={user.gid} />

                <div className="border-b border-gray-100 pb-4">
                    <h2 className="text-lg font-black text-gray-900">
                        내 프로필 수정
                    </h2>
                    <p className="mt-1 text-xs text-gray-500">
                        Supabase RLS 정책(auth.uid() = id)에 의해 본인만 수정할
                        수 있습니다.
                    </p>
                </div>

                {state.message && (
                    <div
                        className={cn(
                            'flex items-center gap-2 rounded-2xl border p-3.5 text-xs font-medium',
                            state.success
                                ? 'border-green-200 bg-green-50 text-green-700'
                                : 'border-red-200 bg-red-50 text-red-600',
                        )}
                    >
                        {state.success ? (
                            <FiCheckCircle className="h-4 w-4 shrink-0" />
                        ) : (
                            <FiAlertCircle className="h-4 w-4 shrink-0" />
                        )}
                        <span>{state.message}</span>
                    </div>
                )}

                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700">
                            이메일 계정 (변경 불가)
                        </label>
                        <Input
                            type="email"
                            value={user.email || ''}
                            disabled
                            className="h-11 bg-gray-50 text-gray-500"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700">
                            이름 (닉네임)
                        </label>
                        <div className="relative">
                            <FiUser className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <Input
                                type="text"
                                name="name"
                                defaultValue={user.name}
                                placeholder="이름을 입력하세요"
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

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700">
                            프로필 이미지 변경 (GID: {user.gid})
                        </label>
                        <FileUpload
                            gid={user.gid}
                            location="profile"
                            multiple={false}
                        />
                    </div>
                </div>

                <div className="flex justify-end pt-2">
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="h-11 bg-gray-900 px-6 text-xs font-bold text-white hover:bg-gray-800"
                    >
                        {isPending ? '저장 중...' : '프로필 저장'}
                    </Button>
                </div>
            </form>

            {/* 회원 탈퇴 (Soft Delete) 영역 */}
            <div className="flex flex-col items-start justify-between gap-4 rounded-3xl border border-red-100 bg-red-50/30 p-6 sm:flex-row sm:items-center">
                <div>
                    <h3 className="text-sm font-bold text-red-700">
                        회원 탈퇴 (Soft Delete)
                    </h3>
                    <p className="mt-1 text-xs text-red-600/80">
                        탈퇴 시 profiles.deleted_at 컬럼에 탈퇴 일시가 기록되며
                        즉시 로그아웃됩니다.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={handleWithdraw}
                    disabled={isWithdrawing}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-xs font-bold text-red-600 shadow-sm hover:bg-red-50 disabled:opacity-50"
                >
                    <FiTrash2 className="h-3.5 w-3.5" />
                    <span>
                        {isWithdrawing ? '탈퇴 처리 중...' : '회원 탈퇴'}
                    </span>
                </button>
            </div>
        </div>
    );
}
