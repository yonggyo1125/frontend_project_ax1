import React from 'react';

export default function ShopLayout({
    children,
    modal,
}: {
    children: React.ReactNode;
    modal: React.ReactNode;
}) {
    return (
        <div className="relative min-h-screen">
            {/* 기본 화면 영역 */}
            {children}

            {/* @modal 슬롯 병렬 렌더링 영역 */}
            {modal}
        </div>
    );
}
