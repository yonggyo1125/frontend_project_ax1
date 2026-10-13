import { FileInfo } from "../types/file.types";

export function resolveFileUrl(
    file: Pick<FileInfo, 'id' | 'original_name' | 'url'>
): string {
    if (file.url) {
        return file.url;
    }

    if (
        file.original_name.startsWith('http://') ||
        file.original_name.startsWith('https://')
    ) {
        return file.original_name;
    }
    return `/files/${file.id}`;
}