import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface Meta {
    current_page: number;
    last_page: number;
    from: number;
    to: number;
    total: number;
}

interface Props {
    meta: Meta;
    onPageChange: (url: string | null) => void;
}

export default function DataTablePagination({ meta, onPageChange }: Props) {
    if (meta.total === 0) return null;

    return (
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 px-4 py-3">
            <span className="text-xs text-slate-500">
                {meta.from}-{meta.to} of {meta.total} results
            </span>

            <div className="flex items-center gap-1">
                <button
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent"
                    disabled={meta.current_page === 1}
                    onClick={() => onPageChange('?page=1')}
                    title="First page"
                >
                    <ChevronsLeft size={14} />
                </button>
                <button
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent"
                    disabled={meta.current_page === 1}
                    onClick={() => onPageChange(`?page=${meta.current_page - 1}`)}
                    title="Previous page"
                >
                    <ChevronLeft size={14} />
                </button>

                <div className="flex items-center gap-1 mx-1">
                    {Array.from({ length: Math.min(meta.last_page, 7) }, (_, i) => {
                        const page = i + 1;
                        const isActive = meta.current_page === page;

                        return (
                            <button
                                key={page}
                                className={`flex h-8 min-w-[32px] items-center justify-center rounded-lg border px-2 text-xs font-medium transition-all ${
                                    isActive
                                        ? 'border-blue-600 bg-blue-600 text-white'
                                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                                }`}
                                onClick={() => onPageChange(`?page=${page}`)}
                            >
                                {page}
                            </button>
                        );
                    })}
                </div>

                <button
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent"
                    disabled={meta.current_page === meta.last_page}
                    onClick={() => onPageChange(`?page=${meta.current_page + 1}`)}
                    title="Next page"
                >
                    <ChevronRight size={14} />
                </button>
                <button
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-transparent"
                    disabled={meta.current_page === meta.last_page}
                    onClick={() => onPageChange(`?page=${meta.last_page}`)}
                    title="Last page"
                >
                    <ChevronsRight size={14} />
                </button>
            </div>
        </div>
    );
}
