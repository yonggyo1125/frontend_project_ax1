import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    /* config options here */
    // 외부 이미지 호스트 허용 (Unsplash 및 목업 플레이스홀더)
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'via.placeholder.com',
            },
        ],
    },
    experimental: {
        agentFeedback: true,
        authInterrupts: true, // unauthorized() 및 forbidden() 인터럽트 함수 사용을 활성화합니다.
    },
    cacheComponents: true,
    partialPrefetching: true,
    turbopack: {
        rules: {
            '*.css': {
                loaders: ['@tailwindcss/turbopack'],
                as: '*.css',
            },
        },
    },
};

export default nextConfig;
