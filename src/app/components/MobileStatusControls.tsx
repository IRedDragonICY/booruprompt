import React from 'react';
import { useTranslation } from 'react-i18next';

interface MobileStatusControlsProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    statusFilter: 'all' | 'operational' | 'degraded' | 'partial_outage' | 'major_outage';
    setStatusFilter: (filter: 'all' | 'operational' | 'degraded' | 'partial_outage' | 'major_outage') => void;
}

export const MobileStatusControls: React.FC<MobileStatusControlsProps> = ({
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter
}) => {
    const { t } = useTranslation();

    const filters: { id: MobileStatusControlsProps['statusFilter']; label: string; color: string }[] = [
        { id: 'all', label: t('apiStatus.filterAll'), color: 'bg-gray-500' },
        { id: 'operational', label: t('apiStatus.filterOperational'), color: 'bg-green-600' },
        { id: 'degraded', label: t('apiStatus.filterDegraded'), color: 'bg-yellow-600' },
        { id: 'partial_outage', label: t('apiStatus.filterPartialOutage'), color: 'bg-orange-600' },
        { id: 'major_outage', label: t('apiStatus.filterMajorOutage'), color: 'bg-red-600' },
    ];

    return (
        <div className="mt-auto rounded-t-2xl bg-[rgb(var(--color-surface-alt-rgb))] border-t border-[rgb(var(--color-surface-border-rgb))] p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
            {/* Status Filters */}
            <div className="flex justify-between mb-4 overflow-x-auto pb-2 no-scrollbar gap-2">
                {filters.map(filter => (
                    <button
                        key={filter.id}
                        onClick={() => setStatusFilter(filter.id)}
                        className={`flex flex-col items-center min-w-[60px] gap-1 transition-opacity ${statusFilter === filter.id ? 'opacity-100' : 'opacity-50'}`}
                    >
                        <div className={`p-2 rounded-full flex items-center justify-center w-10 h-10 transition-colors ${statusFilter === filter.id ? 'bg-[rgb(var(--color-primary-rgb))]/10 ring-2 ring-[rgb(var(--color-primary-rgb))]' : 'bg-[rgb(var(--color-surface-alt-2-rgb))]'}`}>
                            <div className={`w-4 h-4 rounded-full ${filter.color}`}></div>
                        </div>
                        <span className="text-[10px] font-medium text-[rgb(var(--color-on-surface-rgb))] whitespace-nowrap">{filter.label}</span>
                    </button>
                ))}
            </div>

            {/* Search Input */}
            <div>
                <label className="block text-xs font-bold text-[rgb(var(--color-on-surface-muted-rgb))] mb-2 uppercase tracking-wider">
                    {t('apiStatus.searchPlaceholder')}
                </label>
                <div className="relative">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t('apiStatus.searchPlaceholder')}
                        className="w-full h-12 px-4 pr-10 rounded-xl bg-[rgb(var(--color-surface-alt-2-rgb))] border border-[rgb(var(--color-surface-border-rgb))] text-sm focus:outline-none focus:border-[rgb(var(--color-primary-rgb))] focus:ring-1 focus:ring-[rgb(var(--color-primary-rgb))] placeholder:text-[rgb(var(--color-on-surface-faint-rgb))]"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgb(var(--color-on-surface-muted-rgb))]">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};
