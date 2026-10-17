import { UserProfile } from '@/domains/auth/types/auth.types';
import { getSingleFile } from '@/domains/files/queries/getSingleFile.query';
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
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !authUser) {
        return { user: null, isAdmin: false };
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('id, gid, name, role, created_at, updated_at, deleted_at')
        .eq('id', authUser.id)
        .is('deleted_at', null)
        .single();

    if (!profile) {
        return { user: null, isAdmin: false };
    }

    // 프로필 이미지(file_info) 단건 조회 연동
    const avatarFile = profile.gid
        ? await getSingleFile(profile.gid, 'profile')
        : null;

    return {
        user: {
            id: profile.id,
            gid: profile.gid,
            name: profile.name,
            email: authUser.email,
            role: profile.role as UserProfile['role'],
            avatar_url: avatarFile?.url || null,
            created_at: profile.created_at,
            updated_at: profile.updated_at,
            deleted_at: profile.deleted_at,
        },
        isAdmin: profile.role === 'admin',
    };
});
