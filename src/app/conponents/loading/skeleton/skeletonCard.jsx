export default function SkeletonCard() {
    return (
        <div className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-4 animate-pulse">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-100" />
                <div className="flex-1 space-y-2">
                    <div className="h-3.5 bg-gray-100 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/3" />
                </div>
            </div>
            <div className="h-8 bg-gray-100 rounded-lg" />
            <div className="h-px bg-gray-100" />
            <div className="flex gap-2">
                <div className="flex-1 h-8 bg-gray-100 rounded-xl" />
                <div className="flex-1 h-8 bg-gray-100 rounded-xl" />
            </div>
        </div>
    );
}
