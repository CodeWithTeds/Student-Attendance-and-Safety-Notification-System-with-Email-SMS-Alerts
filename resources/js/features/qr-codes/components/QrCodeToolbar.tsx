import { Download, QrCode, Search, X } from 'lucide-react';
import type { QrCodeFilters } from '../types';

interface QrCodeToolbarProps {
    filters: QrCodeFilters;
    selectedCount: number;
    onFilterChange: (filters: QrCodeFilters) => void;
    onClear: () => void;
    onExport: () => void;
}

export function QrCodeToolbar({
    filters,
    selectedCount,
    onFilterChange,
    onClear,
    onExport,
}: QrCodeToolbarProps) {
    return (
        <div className="border-b border-[var(--border)] bg-[var(--background)] p-4">
            <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div>
                    <h1 className="text-xl font-bold text-[var(--foreground)]">
                        QR Code Management
                    </h1>
                    <p className="text-sm text-[var(--muted-foreground)]">
                        Generate, view, print, and reset approved student QR codes.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={onExport}
                    disabled={selectedCount === 0}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--primary-foreground)] transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <Download size={16} />
                    Export Selected
                </button>
            </div>

            <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_190px_auto]">
                <label className="relative">
                    <Search
                        size={16}
                        className="absolute top-1/2 left-3 -translate-y-1/2 text-[var(--muted-foreground)]"
                    />
                    <input
                        type="search"
                        value={filters.search ?? ''}
                        onChange={(event) =>
                            onFilterChange({ ...filters, search: event.target.value })
                        }
                        placeholder="Search student, email, or number"
                        className="h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] pr-3 pl-9 text-sm outline-none transition focus:border-[var(--primary)]"
                    />
                </label>

                <label className="relative">
                    <QrCode
                        size={16}
                        className="absolute top-1/2 left-3 -translate-y-1/2 text-[var(--muted-foreground)]"
                    />
                    <select
                        value={filters.qr_status ?? ''}
                        onChange={(event) =>
                            onFilterChange({
                                ...filters,
                                qr_status: event.target.value as QrCodeFilters['qr_status'],
                            })
                        }
                        className="h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--background)] pr-3 pl-9 text-sm outline-none transition focus:border-[var(--primary)]"
                    >
                        <option value="">All QR status</option>
                        <option value="generated">Generated</option>
                        <option value="missing">Missing</option>
                    </select>
                </label>

                <button
                    type="button"
                    onClick={onClear}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[var(--border)] px-3 text-sm font-semibold text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                >
                    <X size={15} />
                    Clear
                </button>
            </div>
        </div>
    );
}
