export const instant = false;

import ProfileForm from '@/domains/auth/components/ProfileForm';
import { getCurrentUser } from '@/domains/auth/queries/getCurrentUser.query';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

export default async function ProfilePage() {
    const { user } = await getCurrentUser();

    if (!user) {
        redirect('/login?redirectTo=/profile');
    }

    return (
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
            <Suspense
                fallback={
                    <div className="h-96 w-full max-w-md animate-pulse rounded-3xl bg-gray-100" />
                }
            >
                <ProfileForm user={user} />
            </Suspense>
        </div>
    );
}
