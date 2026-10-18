export const instant = false;

import { getCategoryProducts } from '@/domains/categories/queries/getCategoryProducts.query';
import ProductGrid from '@/domains/products/components/ProductGrid';
import { Button } from '@/shared/components/ui/button';
import Link from 'next/link';
import { Suspense } from 'react';
import { FiArrowRight } from 'react-icons/fi';
export default async function ShopMainPage() {
    const recommendedProducts = await getCategoryProducts({
        sort: 'priority',
        limit: 4,
    });

    return (
        <div className="space-y-12 pb-16">
            <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-slate-800 to-blue-900 py-16 text-white md:py-24">
                <div className="mx-auto max-w-7xl px-4 md:px-6">
                    <div className="max-w-2xl space-y-4">
                        <span className="inline-block rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-300 backdrop-blur-md">
                            2026 F/W 시즌 컬렉션
                        </span>
                        <h1 className="text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
                            트렌디한 스타일의 완성, <br />
                            스파르타 셀렉션
                        </h1>
                        <p className="text-sm text-gray-300 md:text-base">
                            편안한 착용감과 미니멀한 실루엣의 데일리 아이템을
                            특별 혜택으로 만나보세요.
                        </p>
                        <div className="pt-2">
                            <Button
                                size="lg"
                                className="gap-2 bg-blue-600 font-bold hover:bg-blue-500"
                            >
                                <Link
                                    href="/products"
                                    className="flex items-center gap-2"
                                >
                                    <span>컬렉션 보러가기</span>
                                    <FiArrowRight className="h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 md:px-6">
                <div className="mb-6 flex items-end justify-between">
                    <div>
                        <h2 className="text-xl font-bold tracking-tight text-gray-900 md:text-2xl">
                            지금 가장 주목받는 추천 상품
                        </h2>
                        <p className="mt-1 text-xs text-gray-500">
                            카테고리별 베스트셀러 아이템 모음
                        </p>
                    </div>
                    <Link
                        href="/products"
                        className="text-xs font-semibold text-blue-600 hover:underline"
                    >
                        전체보기
                    </Link>
                </div>
                <Suspense>
                    <ProductGrid products={recommendedProducts} />
                </Suspense>
            </section>
        </div>
    );
}
