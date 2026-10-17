export const FREE_SHIPPING_THRESHOLD = 50000;
export const DEFAULT_SHIPPING_FEE = 3000;

export interface CartItem {
    id: string; // 상품 UUID (products.id)
    name: string; // 상품명 (products.name)
    price: number; // 상품 단가 (products.price)
    image: string; // 대표 썸네일 이미지 URL
    quantity: number; // 담은 수량 (최소 1 이상)
}

export type AddCartItemInput = Omit<CartItem, 'quantity'> & {
    quantity?: number;
};

export interface CartSummaryInfo {
    totalCount: number; // 장바구니에 담긴 총 상품 개수 (수량 합산)
    itemsTotalAmount: number; // 순수 상품 총액
    shippingFee: number; // 배송비 (50,000원 이상 또는 상품 0원일 때 0원, 그 외 3,000원)
    totalAmount: number; // 최종 결제 예정 금액 (itemsTotalAmount + shippingFee)
}

export interface CartState {
    items: CartItem[];
}

export interface CartActions {
    addItem: (item: AddCartItemInput) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    increaseQuantity: (productId: string) => void;
    decreaseQuantity: (productId: string) => void;
    clearCart: () => void;
    getSummary: () => CartSummaryInfo;
}

export type CartStore = CartState & CartActions;
