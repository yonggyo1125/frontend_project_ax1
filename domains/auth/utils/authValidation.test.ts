import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { UserProfile } from '../types/auth.types';
import {
    canWritePost,
    validateLoginInput,
    validateRegisterInput,
} from './authValidation';

describe('authValidation 유틸리티 단위 테스트', () => {
    it('유효한 회원가입 입력값일 때 에러 객체가 비어 있어야 한다', () => {
        const errors = validateRegisterInput({
            name: '홍길동',
            email: 'hong@sparta.com',
            password: 'password123!',
            passwordConfirm: 'password123!',
        });
        assert.equal(Object.keys(errors).length, 0);
    });

    it('비밀번호와 비밀번호 확인이 다르면 에러를 반환해야 한다', () => {
        const errors = validateRegisterInput({
            name: '홍길동',
            email: 'hong@sparta.com',
            password: 'password123!',
            passwordConfirm: 'different123!',
        });
        assert.equal(errors.passwordConfirm, '비밀번호가 일치하지 않습니다.');
    });

    it('로그인 입력 시 이메일 형식이 잘못되면 에러를 반환해야 한다', () => {
        const errors = validateLoginInput({
            email: 'invalid-email',
            password: 'password123',
        });
        assert.equal(errors.email, '올바른 이메일 형식이 아닙니다.');
    });

    it('게시판 write_role 권한에 따라 글쓰기 가능 여부를 정확히 판별해야 한다', () => {
        const normalUser: UserProfile = {
            id: 'user-1',
            gid: 'gid-1',
            name: '일반회원',
            role: 'user',
            created_at: '2026-10-18T00:00:00Z',
        };

        // 비로그인 사용자
        assert.equal(canWritePost('all', null, false), true);
        assert.equal(canWritePost('user', null, false), false);
        assert.equal(canWritePost('admin', null, false), false);

        // 일반 로그인 회원
        assert.equal(canWritePost('user', normalUser, false), true);
        assert.equal(canWritePost('admin', normalUser, false), false);

        // 관리자 회원
        assert.equal(
            canWritePost('admin', { ...normalUser, role: 'admin' }, true),
            true,
        );
    });
});
