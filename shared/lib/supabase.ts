import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabasePublishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

if (!supabaseUrl || !supabasePublishableKey) {
    console.warn(
        'NEXT_PUBLIC_SUPABASE_URL 또는 NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY 환경 변수가 설정되지 않았습니다. .env.local 파일을 확인해 주세요.',
    );
}

// 서버 컴포넌트(RSC), Server Actions, Route Handler에서 호출하는 Supabase 클라이언트 팩토리 함수
export function createServerClient(): SupabaseClient {
    return createClient(supabaseUrl, supabasePublishableKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        },
    });
}

// 클라이언트 컴포넌트에서 참조할 싱글톤 Supabase 인스턴스
export const supabase = createClient(supabaseUrl, supabasePublishableKey);
