'use client';

import SlideBanner from '@/shared/components/SlideBanner';
import { Suspense } from 'react';
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

const MOCK_BANNERS = [
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800',
    'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800',
    'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800',
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800',
    'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800',
    'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800',
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800',
    'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800',
    'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800',
];
export default function TestPage() {
    return (
        <Suspense fallback={<div>로딩중...</div>}>
            <SlideBanner banners={MOCK_BANNERS} width="full" height={400} navIcons={[FaAngleLeft, FaAngleRight]}/>
        </Suspense>
    );
}
