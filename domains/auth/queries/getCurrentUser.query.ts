import { UserProfile } from '@/domains/auth/types/auth.types';
import { createServerClient } from '@/shared/lib/supabase';
import { cache } from 'react';

export interface CurrentUserSession {
    user: UserProfile | null;
    isAdmin: boolean;
}

export const getCurrentUser = cache(async (): Promise<CurrentUserSession> => {
    const supabase = createServerClient();

    const {
        data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) {
        return { user: null, isAdmin: false };
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('id, gid, name, role, created_at')
        .eq('id', authUser.id)
        .is('deleted_at', null)
        .single();

    if (!profile) {
        return {
            user: {
                id: authUser.id,
                gid: '',
                name: authUser.email?.split('@')[0] || '사용자',
                role: 'user',
                created_at: authUser.created_at,
            },
            isAdmin: false,
        };
    }

    return {
        user: profile as UserProfile,
        isAdmin: profile.role === 'admin',
    };
});
