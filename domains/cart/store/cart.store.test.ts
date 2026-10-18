import assert from 'node:assert/strict';
import { beforeEach, describe, it } from 'node:test';
import { calculateCartSummary, useCartStore } from './cart.store';

const SAMPLE_SHIRT = {
    id: 'prod-001',
    name: '오버핏 헤비 코튼 라운드 티셔츠',
    price: 32000,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800',
};

const SAMPLE_OXFORD = {
    id: 'prod-002',
    name: '링클프리 클래식 옥스포드 셔츠',
    price: 49000,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800',
};

const SAMPLE_STAND = {
    id: 'prod-004',
    name: '스탠다드 알루미늄 노트북 거치대',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800',
};

describe('장바구니 스토어(useCartStore) 및 금액 연산 단위 테스트', () => {
    beforeEach(() => {
        // 각 테스트 실행 전 장바구니 상태를 완전히 초기화합니다.
        useCartStore.getState().clearCart();
    });

    it('신규 상품을 장바구니에 담으면 items 배열에 정상 추가되어야 한다.', () => {
        useCartStore.getState().addItem({ ...SAMPLE_SHIRT, quantity: 2 });

        const { items, getSummary } = useCartStore.getState();
        assert.strictEqual(items.length, 1);
        assert.strictEqual(items[0].id, 'prod-001');
        assert.strictEqual(items[0].quantity, 2);
        assert.strictEqual(getSummary().totalCount, 2);
    });

    it('동일한 상품을 중복해서 담으면 새 항목이 추가되지 않고 기존 수량에 누적되어야 한다', () => {
        const store = useCartStore.getState();
        store.addItem({ ...SAMPLE_SHIRT, quantity: 1 });
        store.addItem({ ...SAMPLE_SHIRT, quantity: 3 });

        const { items, getSummary } = useCartStore.getState();
        assert.strictEqual(items.length, 1);
        assert.strictEqual(items[0].quantity, 4);
        assert.strictEqual(getSummary().totalCount, 4);
        assert.strictEqual(getSummary().itemsTotalAmount, 32000 * 4);
    });

    it('수량 증감(increaseQuantity, decreaseQuantity) 시 최소 수량 1개 이상이 보장되어야 한다', () => {
        const store = useCartStore.getState();
        store.addItem({ ...SAMPLE_SHIRT, quantity: 1 });

        // 1개에서 감소 시도 -> 1개 유지 검증
        store.decreaseQuantity('prod-001');
        assert.strictEqual(useCartStore.getState().items[0].quantity, 1);

        // 1개에서 증가 시도 -> 2개 변경 검증
        store.increaseQuantity('prod-001');
        assert.strictEqual(useCartStore.getState().items[0].quantity, 2);

        // updateQuantity에 0 이하의 값을 전달해도 1개로 방어되어야 함
        store.updateQuantity('prod-001', 0);
        assert.strictEqual(useCartStore.getState().items[0].quantity, 1);
    });

    it('상품 총액이 50,000원 미만일 때는 배송비 3,000원이 부과되어야 한다', () => {
        const store = useCartStore.getState();
        store.addItem({ ...SAMPLE_SHIRT, quantity: 1 }); // 32,000원

        const summary = useCartStore.getState().getSummary();
        assert.strictEqual(summary.itemsTotalAmount, 32000);
        assert.strictEqual(summary.shippingFee, 3000);
        assert.strictEqual(summary.totalAmount, 35000);
    });

    it('상품 총액이 50,000원 이상일 때는 무료배송(배송비 0원)이 적용되어야 한다', () => {
        const store = useCartStore.getState();
        store.addItem({ ...SAMPLE_SHIRT, quantity: 1 }); // 32,000원
        store.addItem({ ...SAMPLE_OXFORD, quantity: 1 }); // 49,000원 (합계 81,000원)

        const summary = useCartStore.getState().getSummary();
        assert.strictEqual(summary.totalCount, 2);
        assert.strictEqual(summary.itemsTotalAmount, 81000);
        assert.strictEqual(summary.shippingFee, 0);
        assert.strictEqual(summary.totalAmount, 81000);
    });

    it('개별 상품 삭제(removeItem) 및 전체 비우기(clearCart) 시 금액과 배송비가 즉시 재계산되어야 한다', () => {
        const store = useCartStore.getState();
        store.addItem({ ...SAMPLE_SHIRT, quantity: 1 }); // 32,000원
        store.addItem({ ...SAMPLE_STAND, quantity: 2 }); // 30,000원 (합계 62,000원 -> 배송비 0원)

        assert.strictEqual(useCartStore.getState().getSummary().shippingFee, 0);

        // 30,000원 품목 삭제 -> 남은 금액 32,000원 -> 배송비 3,000원 부과 전환 확인
        store.removeItem('prod-004');
        const afterRemove = useCartStore.getState().getSummary();
        assert.strictEqual(afterRemove.itemsTotalAmount, 32000);
        assert.strictEqual(afterRemove.shippingFee, 3000);
        assert.strictEqual(afterRemove.totalAmount, 35000);

        // 장바구니 전체 비우기 -> 모든 금액 및 배송비 0원 확인
        store.clearCart();
        const afterClear = calculateCartSummary(useCartStore.getState().items);
        assert.strictEqual(afterClear.totalCount, 0);
        assert.strictEqual(afterClear.itemsTotalAmount, 0);
        assert.strictEqual(afterClear.shippingFee, 0);
        assert.strictEqual(afterClear.totalAmount, 0);
    });
});
