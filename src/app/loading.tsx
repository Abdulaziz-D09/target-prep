export default function Loading() {
    return (
        <div className="flex h-full w-full items-center justify-center min-h-screen">
            <div className="flex flex-col items-center gap-4 text-slate-500">
                <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-slate-300 border-t-blue-600" />
                <p className="text-sm font-semibold tracking-wide animate-pulse">Loading...</p>
            </div>
        </div>
    );
}
