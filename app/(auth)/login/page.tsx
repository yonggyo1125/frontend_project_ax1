export const instant = false;

import LoginForm from '@/domains/auth/components/LoginForm';
import { getCurrentUser } from '@/domains/auth/queries/getCurrentUser.query';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

export default async function LoginPage() {
    const { user } = await getCurrentUser();

    if (user) {
        redirect('/');
    }

    return (
        <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
            <Suspense
                fallback={
                    <div className="h-96 w-full max-w-md animate-pulse rounded-3xl bg-gray-100" />
                }
            >
                <LoginForm />
            </Suspense>
        </div>
    );
}
