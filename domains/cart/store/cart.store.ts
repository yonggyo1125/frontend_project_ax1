import {
    AddCartItemInput,
    CartItem,
    CartStore,
    CartSummaryInfo,
    DEFAULT_SHIPPING_FEE,
    FREE_SHIPPING_THRESHOLD,
} from '@/domains/cart/types/cart.types';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// 장바구니 품목 배열을 기반으로 총 수량, 상품 합계, 배송비, 최종 결제 금액을 계산합니다
export function calculateCartSummary(items: CartItem[]): CartSummaryInfo {
    const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const itemsTotalAmount = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
    );

    const shippingFee =
        itemsTotalAmount === 0 || itemsTotalAmount >= FREE_SHIPPING_THRESHOLD
            ? 0
            : DEFAULT_SHIPPING_FEE;

    const totalAmount = itemsTotalAmount + shippingFee;

    return {
        totalCount,
        itemsTotalAmount,
        shippingFee,
        totalAmount,
    };
}

// SSR 및 Node.js 단위 테스트(node:test) 환경을 위한 안전한 스토리지 어댑터
const memoryStorage = new Map<string, string>();
const safeLocalStorage = {
    getItem: (name: string): string | null => {
        if (typeof window !== 'undefined' && window.localStorage) {
            return window.localStorage.getItem(name);
        }
        return memoryStorage.get(name) ?? null;
    },
    setItem: (name: string, value: string): void => {
        if (typeof window !== 'undefined' && window.localStorage) {
            window.localStorage.setItem(name, value);
            return;
        }
        memoryStorage.set(name, value);
    },
    removeItem: (name: string): void => {
        if (typeof window !== 'undefined' && window.localStorage) {
            window.localStorage.removeItem(name);
            return;
        }
        memoryStorage.delete(name);
    },
};

export const useCartStore = create<CartStore>()(
    persist(
        immer((set, get) => ({
            items: [],
            _hasHydrated: false,
            setHasHydrated: (state: boolean) => {
                set((s) => {
                    s._hasHydrated = state;
                });
            },

            // 장바구니 담기 (동일 상품이 이미 존재하면 수량 누적, 없으면 신규 추가)
            addItem: (input: AddCartItemInput) => {
                const quantityToAdd = Math.max(1, input.quantity ?? 1);

                set((state) => {
                    const existingItem = state.items.find(
                        (item) => item.id === input.id,
                    );

                    if (existingItem) {
                        existingItem.quantity += quantityToAdd;
                    } else {
                        state.items.push({
                            id: input.id,
                            name: input.name,
                            price: input.price,
                            image: input.image,
                            quantity: quantityToAdd,
                        });
                    }
                });
            },

            // 특정 상품 삭제
            removeItem: (productId: string) => {
                set((state) => {
                    state.items = state.items.filter(
                        (item) => item.id !== productId,
                    );
                });
            },

            // 특정 상품 수량 직접 지정 (최소 수량 1개 보장)
            updateQuantity: (productId: string, quantity: number) => {
                const safeQuantity = Math.max(1, Math.floor(quantity));

                set((state) => {
                    const target = state.items.find(
                        (item) => item.id === productId,
                    );
                    if (target) {
                        target.quantity = safeQuantity;
                    }
                });
            },

            // 특정 상품 수량 1 증가
            increaseQuantity: (productId: string) => {
                set((state) => {
                    const target = state.items.find(
                        (item) => item.id === productId,
                    );
                    if (target) {
                        target.quantity += 1;
                    }
                });
            },

            // 특정 상품 수량 1 감소 (1개 미만으로 내려가지 않도록 방어)
            decreaseQuantity: (productId: string) => {
                set((state) => {
                    const target = state.items.find(
                        (item) => item.id === productId,
                    );
                    if (target && target.quantity > 1) {
                        target.quantity -= 1;
                    }
                });
            },

            // 장바구니 전체 비우기 (주문/결제 완료 후 또는 사용자 초기화 시 호출)
            clearCart: () => {
                set((state) => {
                    state.items = [];
                });
            },

            // 현재 장바구니 요약 정보 반환
            getSummary: () => {
                return calculateCartSummary(get().items);
            },
        })),
        {
            name: 'sparta-cart-storage',
            storage: createJSONStorage(() => safeLocalStorage),
            // items 필드만 로컬 스토리지에 저장 (_hasHydrated 등 불필요한 상태 제외)
            partialize: (state) => ({ items: state.items }),
            // 스토리지 복원 완료 시 하이드레이션 플래그 true로 변경
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
        },
    ),
);
