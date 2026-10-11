export interface Product {
    id: string;
    gid: string;
    categoryId: string;
    name: string;
    price: number;
    description: string;
    images: string[];
    isDisplayed: boolean;
    displayPriority: number;
    createdAt: string;
}
