import { Button } from '@/shared/components/ui/button';
import Link from 'next/link';
import { FiFileText } from 'react-icons/fi';

export default function NotFound() {
    return (
        <div className="mx-auto flex min-h-112.5 max-w-md flex-col items-center justify-center px-4 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                <FiFileText className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
                상품을 찾을 수 없습니다
            </h2>
            <p className="mt-2 text-sm text-gray-500">
                요청하신 상품이 품절되었거나 존재하지 않는 상품입니다.
            </p>
            <div className="mt-6">
                <Button className="bg-gray-900 hover:bg-gray-800">
                    <Link href="/products">전체 상품 둘러보기</Link>
                </Button>
            </div>
        </div>
    );
}
