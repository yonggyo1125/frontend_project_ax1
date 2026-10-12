'use client';

import { Category } from '@/domains/categories/types/category.types';
import { MOCK_CATEGORIES } from '@/shared/mocks/mockData';
import { useState } from 'react';
import { FiChevronRight, FiFolder, FiPlus } from 'react-icons/fi';

export default function CategoryTreeManager() {
    const [categories] = useState<Category[]>(MOCK_CATEGORIES);

    return (
        <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                    <h2 className="text-lg font-black text-gray-900">
                        다중 중첩 카테고리 구조
                    </h2>
                    <p className="text-xs text-gray-500">
                        쇼핑몰 상단 GNB에 노출되는 1~3차 계층 카테고리를
                        편집합니다.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => alert('최상위 카테고리 추가 팝업')}
                    className="flex items-center gap-1 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-blue-700"
                >
                    <FiPlus className="h-4 w-4" />
                    <span>최상위 카테고리 추가</span>
                </button>
            </div>

            <div className="space-y-3">
                {categories.map((cat) => (
                    <div
                        key={cat.id}
                        className="rounded-2xl border border-gray-100 bg-gray-50/50 p-4"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <FiFolder className="h-4 w-4 text-blue-600" />
                                <span className="font-bold text-gray-900">
                                    {cat.name}
                                </span>
                                <span className="font-mono text-[10px] text-gray-400">
                                    ({cat.id})
                                </span>
                            </div>
                            <button className="text-xs text-red-500 hover:underline">
                                삭제
                            </button>
                        </div>

                        {cat.children && (
                            <div className="mt-3 space-y-2 pl-6">
                                {cat.children.map((sub) => (
                                    <div
                                        key={sub.id}
                                        className="flex items-center justify-between rounded-xl bg-white p-2.5 text-xs shadow-sm"
                                    >
                                        <div className="flex items-center gap-2">
                                            <FiChevronRight className="h-3 w-3 text-gray-400" />
                                            <span className="font-medium text-gray-700">
                                                {sub.name}
                                            </span>
                                        </div>
                                        <button className="text-[11px] text-gray-400 hover:text-red-500">
                                            삭제
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
