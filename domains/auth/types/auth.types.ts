export type UserRole = 'user' | 'admin';

export interface UserProfile {
    id: string;
    gid: string;
    name: string;
    email?: string;
    role: UserRole;
    avatar_url?: string | null;
    created_at: string;
    updated_at?: string;
    deleted_at?: string | null;
}

export interface LoginInput {
    email: string;
    password: string;
}

export interface RegisterInput {
    name: string;
    email: string;
    password: string;
    passwordConfirm: string;
    gid?: string;
}
