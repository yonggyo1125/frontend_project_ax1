export default function AdminDashboardPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-black text-gray-900">대시보드</h1>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                    <p className="text-xs text-gray-400">금일 결제 총액</p>
                    <p className="mt-2 text-2xl font-black text-blue-600">
                        1,250,000원
                    </p>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                    <p className="text-xs text-gray-400">신규 주문</p>
                    <p className="mt-2 text-2xl font-black text-gray-900">
                        18건
                    </p>
                </div>
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                    <p className="text-xs text-gray-400">등록 회원</p>
                    <p className="mt-2 text-2xl font-black text-gray-900">
                        324명
                    </p>
                </div>
            </div>
        </div>
    );
}
