import { FileInfo, FileLocation } from '../types/file.types';
import { getFilesByGid } from './getFilesByGid.query';

export async function getSingleFile(
    gid: string,
    location?: FileLocation,
): Promise<FileInfo | null> {
    const files = await getFilesByGid(gid, location);
    return files.length > 0 ? files[0] : null;
}
