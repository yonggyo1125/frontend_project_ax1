import { BoardWriteRole } from '@/domains/boards/types/board.types';
import {
    LoginInput,
    RegisterInput,
    UserProfile,
} from '@/domains/auth/types/auth.types';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLoginInput(input: LoginInput): Record<string, string> {
    const errors: Record<string, string> = {};

    if (!input.email || !input.email.trim()) {
        errors.email = '이메일 주소를 입력해 주세요.';
    } else if (!EMAIL_REGEX.test(input.email.trim())) {
        errors.email = '올바른 이메일 형식이 아닙니다.';
    }

    if (!input.password) {
        errors.password = '비밀번호를 입력해 주세요.';
    } else if (input.password.length < 6) {
        errors.password = '비밀번호는 최소 6자 이상이어야 합니다.';
    }

    return errors;
}

export function validateRegisterInput(
    input: RegisterInput,
): Record<string, string> {
    const errors: Record<string, string> = {};

    if (!input.name || !input.name.trim()) {
        errors.name = '이름(닉네임)을 입력해 주세요.';
    } else if (input.name.trim().length < 2) {
        errors.name = '이름은 최소 2자 이상 입력해야 합니다.';
    }

    if (!input.email || !input.email.trim()) {
        errors.email = '이메일 주소를 입력해 주세요.';
    } else if (!EMAIL_REGEX.test(input.email.trim())) {
        errors.email = '올바른 이메일 형식이 아닙니다.';
    }

    if (!input.password) {
        errors.password = '비밀번호를 입력해 주세요.';
    } else if (input.password.length < 8) {
        errors.password = '비밀번호는 최소 8자 이상이어야 합니다.';
    }

    if (!input.passwordConfirm) {
        errors.passwordConfirm = '비밀번호 확인을 입력해 주세요.';
    } else if (input.password !== input.passwordConfirm) {
        errors.passwordConfirm = '비밀번호가 일치하지 않습니다.';
    }

    return errors;
}

// 게시판 write_role('all' | 'user' | 'admin')에 따른 현재 사용자의 글쓰기 가능 여부 판별
export function canWritePost(
    writeRole: BoardWriteRole,
    user: UserProfile | null,
    isAdmin: boolean,
): boolean {
    if (writeRole === 'all') return true;
    if (!user) return false;
    if (writeRole === 'admin') return isAdmin;
    return true; // writeRole === 'user' 인 경우 로그인한 회원(user 또는 admin) 모두 허용
}
