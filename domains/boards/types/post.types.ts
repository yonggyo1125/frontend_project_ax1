import { FileInfo } from '@/domains/files/types/file.types';

export interface Post {
    id: string;
    gid: string;
    board_id: string;
    user_id: string | null;
    author_name: string;
    title: string;
    content: string;
    created_at: string;
    updated_at: string;
    attachments?: FileInfo[];
}
