export default function Loading() {
    return (
        <div className="mx-auto max-w-7xl animate-pulse px-4 py-8 md:px-6">
            {/* 상단 브레드크럼/정렬 바 스켈레톤 */}
            <div className="mb-8 flex items-center justify-between">
                <div className="h-4 w-32 rounded bg-gray-200" />
                <div className="h-9 w-28 rounded bg-gray-200" />
            </div>

            {/* 상품 카드 그리드 스켈레톤 */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, idx) => (
                    <div
                        key={idx}
                        className="flex flex-col rounded-2xl border border-gray-100 p-3.5"
                    >
                        <div className="aspect-square w-full rounded-xl bg-gray-200" />
                        <div className="mt-3 space-y-2">
                            <div className="h-4 w-3/4 rounded bg-gray-200" />
                            <div className="h-5 w-1/2 rounded bg-gray-200" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
