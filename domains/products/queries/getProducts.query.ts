import {
    getCategoryProducts,
    GetCategoryProductsParams,
} from '@/domains/categories/queries/getCategoryProducts.query';
import { Product } from '@/domains/products/types/product.types';

export async function getProducts(
    params: GetCategoryProductsParams = {},
): Promise<Product[]> {
    return getCategoryProducts(params);
}
