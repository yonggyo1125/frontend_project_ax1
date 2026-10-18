import {
    createBrowserClient,
    createServerClient as createSSRServerClient,
} from '@supabase/ssr';
import { SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabasePublishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

if (!supabaseUrl || !supabasePublishableKey) {
    console.warn(
        'NEXT_PUBLIC_SUPABASE_URL 또는 NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY 환경 변수가 설정되지 않았습니다. .env.local 파일을 확인해 주세요.',
    );
}

// 서버 컴포넌트(RSC), Server Actions, Route Handler에서 호출하는 쿠키 연동 Supabase 클라이언트 팩토리 함수
export function createServerClient(): SupabaseClient {
    return createSSRServerClient(supabaseUrl, supabasePublishableKey, {
        cookies: {
            async getAll() {
                const { cookies } = await import('next/headers');
                const cookieStore = await cookies();
                return cookieStore.getAll();
            },
            async setAll(cookiesToSet) {
                try {
                    const { cookies } = await import('next/headers');
                    const cookieStore = await cookies();
                    cookiesToSet.forEach(({ name, value, options }) => {
                        cookieStore.set(name, value, options);
                    });
                } catch {
                    // 서버 컴포넌트(RSC) 렌더링 중 쿠키 쓰기 시도는 무시하고
                    // Server Actions 및 Middleware에서 쿠키 갱신을 처리합니다.
                }
            },
        },
    });
}

// 클라이언트 컴포넌트에서 참조할 싱글톤 브라우저 Supabase 인스턴스
export const supabase = createBrowserClient(
    supabaseUrl,
    supabasePublishableKey,
);
