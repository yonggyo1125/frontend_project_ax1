import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { validateOrderAmount } from './validateOrderAmount';

const SERVER_PRODUCTS = [
    {
        id: '550e8400-e29b-41d4-a716-446655440001',
        name: '오버핏 헤비 코튼 라운드 티셔츠',
        price: 32000,
    },
    {
        id: '550e8400-e29b-41d4-a716-446655440002',
        name: '링클프리 클래식 옥스포드 셔츠',
        price: 49000,
    },
];

describe('validateOrderAmount 주문 금액 및 배송비 무결성 검증 단위 테스트', () => {
    it('50,000원 미만 주문 시 배송비 3,000원이 포함된 금액과 일치하면 검증을 통과하고 스냅샷을 반환해야 한다', () => {
        const result = validateOrderAmount({
            clientItems: [
                {
                    productId: '550e8400-e29b-41d4-a716-446655440001',
                    name: '오버핏 헤비 코튼 라운드 티셔츠',
                    price: 32000,
                    quantity: 1,
                },
            ],
            serverProducts: SERVER_PRODUCTS,
            clientItemsTotalAmount: 32000,
            clientShippingFee: 3000,
            clientTotalAmount: 35000,
        });

        assert.strictEqual(result.valid, true);
        assert.strictEqual(result.serverItemsTotalAmount, 32000);
        assert.strictEqual(result.serverShippingFee, 3000);
        assert.strictEqual(result.serverTotalAmount, 35000);
        assert.strictEqual(result.snapshotItems.length, 1);
        assert.strictEqual(
            result.snapshotItems[0].product_name,
            '오버핏 헤비 코튼 라운드 티셔츠',
        );
    });

    it('50,000원 이상 주문 시 무료배송(0원)이 적용된 금액과 일치하면 검증을 통과해야 한다', () => {
        const result = validateOrderAmount({
            clientItems: [
                {
                    productId: '550e8400-e29b-41d4-a716-446655440001',
                    name: '오버핏 헤비 코튼 라운드 티셔츠',
                    price: 32000,
                    quantity: 1,
                },
                {
                    productId: '550e8400-e29b-41d4-a716-446655440002',
                    name: '링클프리 클래식 옥스포드 셔츠',
                    price: 49000,
                    quantity: 1,
                },
            ],
            serverProducts: SERVER_PRODUCTS,
            clientItemsTotalAmount: 81000,
            clientShippingFee: 0,
            clientTotalAmount: 81000,
        });

        assert.strictEqual(result.valid, true);
        assert.strictEqual(result.serverItemsTotalAmount, 81000);
        assert.strictEqual(result.serverShippingFee, 0);
        assert.strictEqual(result.serverTotalAmount, 81000);
        assert.strictEqual(result.snapshotItems.length, 2);
    });

    it('클라이언트가 상품 단가(price)를 임의로 낮춰서 요청하면 위·변조로 탐지하고 차단해야 한다', () => {
        const result = validateOrderAmount({
            clientItems: [
                {
                    productId: '550e8400-e29b-41d4-a716-446655440001',
                    name: '오버핏 헤비 코튼 라운드 티셔츠',
                    price: 100, // 32,000원짜리 상품을 100원으로 조작
                    quantity: 1,
                },
            ],
            serverProducts: SERVER_PRODUCTS,
            clientItemsTotalAmount: 100,
            clientShippingFee: 3000,
            clientTotalAmount: 3100,
        });

        assert.strictEqual(result.valid, false);
        assert.ok(result.message?.includes('위·변조'));
    });

    it('50,000원 미만 주문임에도 클라이언트가 배송비를 0원으로 조작하면 검증에 실패해야 한다', () => {
        const result = validateOrderAmount({
            clientItems: [
                {
                    productId: '550e8400-e29b-41d4-a716-446655440001',
                    name: '오버핏 헤비 코튼 라운드 티셔츠',
                    price: 32000,
                    quantity: 1,
                },
            ],
            serverProducts: SERVER_PRODUCTS,
            clientItemsTotalAmount: 32000,
            clientShippingFee: 0, // 배송비 0원 조작
            clientTotalAmount: 32000,
        });

        assert.strictEqual(result.valid, false);
        assert.ok(result.message?.includes('배송비'));
    });

    it('존재하지 않는 상품 ID로 주문을 시도하면 검증에 실패해야 한다', () => {
        const result = validateOrderAmount({
            clientItems: [
                {
                    productId: '550e8400-e29b-41d4-a716-999999999999',
                    name: '삭제된 상품',
                    price: 10000,
                    quantity: 1,
                },
            ],
            serverProducts: SERVER_PRODUCTS,
            clientItemsTotalAmount: 10000,
            clientShippingFee: 3000,
            clientTotalAmount: 13000,
        });

        assert.strictEqual(result.valid, false);
        assert.ok(result.message?.includes('존재하지 않거나'));
    });
});
