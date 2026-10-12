export interface UserProfile {
    id: string;
    gid: string;
    name: string;
    role: 'user' | 'admin';
    created_at: string;
}
