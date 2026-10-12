import Footer from '@/shared/components/Footer';
import Header from '@/shared/components/Header';
import React from 'react';

export default function ShopLayout({
    children,
    modal,
}: {
    children: React.ReactNode;
    modal: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col">
            {/* 쇼핑몰 전용 헤더 */}
            <Header />
            {/* 쇼핑몰 메인 컨텐츠 영역 */}
            <main className="w-full flex-1">{children}</main>

            {/* @modal 슬롯 병렬 렌더링 영역 */}
            {modal}

            {/* 쇼핑몰 전용 푸터 */}
            <Footer />
        </div>
    );
}
