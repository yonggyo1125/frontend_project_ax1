import { BoardSetting } from '@/domains/boards/types/board.types';
import { Category } from '@/domains/categories/types/category.types';
import { FileInfo } from '@/domains/files/types/file.types';

// 중첩 카테고리 트리 Mock Data
export const MOCK_CATEGORIES: Category[] = [
    {
        id: 'cat-fashion',
        parent_id: null,
        name: '패션의류',
        depth: 1,
        sort_order: 1,
        children: [
            {
                id: 'cat-fashion-top',
                parent_id: 'cat-fashion',
                name: '상의',
                depth: 2,
                sort_order: 1,
                children: [
                    {
                        id: 'cat-fashion-top-tshirt',
                        parent_id: 'cat-fashion-top',
                        name: '티셔츠',
                        depth: 3,
                        sort_order: 1,
                    },
                    {
                        id: 'cat-fashion-top-shirt',
                        parent_id: 'cat-fashion-top',
                        name: '셔츠/블라우스',
                        depth: 3,
                        sort_order: 2,
                    },
                ],
            },
            {
                id: 'cat-fashion-bottom',
                parent_id: 'cat-fashion',
                name: '하의',
                depth: 2,
                sort_order: 2,
                children: [
                    {
                        id: 'cat-fashion-bottom-denim',
                        parent_id: 'cat-fashion-bottom',
                        name: '데님팬츠',
                        depth: 3,
                        sort_order: 1,
                    },
                    {
                        id: 'cat-fashion-bottom-slacks',
                        parent_id: 'cat-fashion-bottom',
                        name: '슬랙스',
                        depth: 3,
                        sort_order: 2,
                    },
                ],
            },
        ],
    },
    {
        id: 'cat-digital',
        parent_id: null,
        name: '디지털/가전',
        depth: 1,
        sort_order: 2,
        children: [
            {
                id: 'cat-digital-pc',
                parent_id: 'cat-digital',
                name: '노트북/PC',
                depth: 2,
                sort_order: 1,
            },
            {
                id: 'cat-digital-acc',
                parent_id: 'cat-digital',
                name: '모바일 주변기기',
                depth: 2,
                sort_order: 2,
            },
        ],
    },
    {
        id: 'cat-living',
        parent_id: null,
        name: '홈/리빙',
        depth: 1,
        sort_order: 3,
        children: [
            {
                id: 'cat-living-furniture',
                parent_id: 'cat-living',
                name: '가구/인테리어',
                depth: 2,
                sort_order: 1,
            },
        ],
    },
];

// 게시판 설정 Mock Data
export const MOCK_BOARDS: BoardSetting[] = [
    {
        id: 'notice',
        name: '공지사항',
        description: '쇼핑몰 공지 및 이벤트 안내',
        write_role: 'admin',
        created_at: '2026-10-13T00:00:00Z',
    },
    {
        id: 'qna',
        name: '상품 Q&A',
        description: '상품 및 배송 관련 질문 게시판',
        write_role: 'user',
        created_at: '2026-10-13T00:00:00Z',
    },
    {
        id: 'review',
        name: '구매 후기',
        description: '실제 구매 고객 리뷰 게시판',
        write_role: 'user',
        created_at: '2026-10-13T00:00:00Z',
    },
];

// 범용 파일 메타데이터 Mock Data
export const MOCK_FILES: FileInfo[] = [
    {
        id: 1,
        gid: 'product-mock-1',
        location: 'product_main',
        original_name: 'sample_product.jpg',
        content_type: 'image/jpeg',
        extension: 'jpg',
        file_size: 102400,
        done: true,
        seq: 0,
        created_at: '2026-10-13T00:00:00Z',
        url: '/files/1',
    },
];

import { Product } from '@/domains/products/types/product.types';

export const MOCK_PRODUCTS: Product[] = [
    {
        id: 'prod-001',
        gid: 'product-mock-1',
        categoryId: 'cat-fashion-top-tshirt',
        name: '오버핏 헤비 코튼 라운드 티셔츠',
        price: 32000,
        description:
            '20수 고밀도 원사로 편직하여 비침이 적고 세탁 후 변형을 최소화한 베이직 오버핏 반팔 티셔츠입니다.',
        images: [
            'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800',
            'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800',
            'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800',
        ],
        isDisplayed: true,
        displayPriority: 1,
        createdAt: '2026-10-14T09:00:00Z',
    },
    {
        id: 'prod-002',
        gid: 'product-mock-2',
        categoryId: 'cat-fashion-top-shirt',
        name: '링클프리 클래식 옥스포드 셔츠',
        price: 49000,
        description:
            '구김 방지 가공으로 다림질 없이 깔끔하게 착용 가능한 프리미엄 옥스포드 셔츠입니다.',
        images: [
            'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800',
            'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800',
        ],
        isDisplayed: true,
        displayPriority: 2,
        createdAt: '2026-10-14T10:00:00Z',
    },
    {
        id: 'prod-003',
        gid: 'product-mock-3',
        categoryId: 'cat-fashion-bottom-denim',
        name: '와이드 스트레이트 인디고 데님 팬츠',
        price: 58000,
        description:
            '자연스러운 틴 워싱과 편안한 밑위 길이로 트렌디한 실루엣을 완성하는 와이드 데님입니다.',
        images: [
            'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800',
            'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800',
        ],
        isDisplayed: true,
        displayPriority: 3,
        createdAt: '2026-10-14T11:00:00Z',
    },
    {
        id: 'prod-004',
        gid: 'product-mock-4',
        categoryId: 'cat-digital-pc',
        name: '스탠다드 알루미늄 노트북 거치대',
        price: 27500,
        description:
            '인체공학적 각도 조절과 알루미늄 합금 바디로 안정적인 거치와 발열 해소를 돕습니다.',
        images: [
            'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800',
            'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800',
        ],
        isDisplayed: true,
        displayPriority: 4,
        createdAt: '2026-10-14T12:00:00Z',
    },
];
