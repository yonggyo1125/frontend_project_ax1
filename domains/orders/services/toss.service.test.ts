import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
    encodeTossBasicAuth,
    formatOrderName,
    verifyOrderBeforeConfirm,
} from './toss.service';

describe('toss.service 결제 승인 검증 및 유틸리티 단위 테스트', () => {
    it('시크릿 키 뒤에 콜론(:)을 붙여 Base64 Basic Auth 헤더를 정확히 생성해야 한다', () => {
        const header = encodeTossBasicAuth('test_sk_12345');
        const expectedBase64 = Buffer.from('test_sk_12345:').toString('base64');
        assert.strictEqual(header, `Basic ${expectedBase64}`);
    });

    it('단일 상품 및 복수 상품에 대해 토스 결제창 주문명(orderName)을 올바르게 포맷팅해야 한다', () => {
        assert.strictEqual(
            formatOrderName([{ name: '오버핏 헤비 코튼 라운드 티셔츠' }]),
            '오버핏 헤비 코튼 라운드 티셔츠',
        );

        assert.strictEqual(
            formatOrderName([
                { name: '오버핏 헤비 코튼 라운드 티셔츠' },
                { name: '링클프리 클래식 옥스포드 셔츠' },
                { name: '스탠다드 알루미늄 노트북 거치대' },
            ]),
            '오버핏 헤비 코튼 라운드 티셔츠 외 2건',
        );
    });

    it('DB 가주문 금액(total_amount)과 토스 콜백 금액(amount)이 일치하면 검증을 통과해야 한다', () => {
        const result = verifyOrderBeforeConfirm(
            {
                id: '550e8400-e29b-41d4-a716-446655440099',
                status: 'PENDING',
                total_amount: 81000,
            },
            {
                paymentKey: 'tgen_20261023_key',
                orderId: '550e8400-e29b-41d4-a716-446655440099',
                amount: 81000,
            },
        );

        assert.strictEqual(result.valid, true);
        assert.strictEqual(result.alreadyPaid, false);
    });

    it('콜백의 amount 쿼리 파라미터가 DB 가주문 금액과 다르면 위·변조로 차단해야 한다', () => {
        const result = verifyOrderBeforeConfirm(
            {
                id: '550e8400-e29b-41d4-a716-446655440099',
                status: 'PENDING',
                total_amount: 81000,
            },
            {
                paymentKey: 'tgen_20261023_key',
                orderId: '550e8400-e29b-41d4-a716-446655440099',
                amount: 100, // URL 쿼리 조작 시도
            },
        );

        assert.strictEqual(result.valid, false);
        assert.ok(result.message?.includes('일치하지 않습니다'));
    });

    it('이미 PAID 처리된 주문에 대해 중복 승인 요청이 들어오면 alreadyPaid 플래그를 반환해야 한다', () => {
        const result = verifyOrderBeforeConfirm(
            {
                id: '550e8400-e29b-41d4-a716-446655440099',
                status: 'PAID',
                total_amount: 81000,
            },
            {
                paymentKey: 'tgen_20261023_key',
                orderId: '550e8400-e29b-41d4-a716-446655440099',
                amount: 81000,
            },
        );

        assert.strictEqual(result.valid, true);
        assert.strictEqual(result.alreadyPaid, true);
    });
});
