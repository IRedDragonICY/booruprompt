import React from 'react';
import { useTranslation } from 'react-i18next';
import { LoadingSpinner } from './LoadingSpinner';
import { HistoryIcon } from './icons/icons';
import { TagCategoryOption, TagCategory } from '../utils/extractionUtils';

interface MobileExtractorControlsProps {
    url: string;
    onUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onExtract: () => void;
    onReset: () => void;
    loading: boolean;
    tagCategories: TagCategoryOption[];
    toggleTagCategory: (id: TagCategory) => void;
    onOpenHistory: () => void;
}

export const MobileExtractorControls: React.FC<MobileExtractorControlsProps> = ({
    url,
    onUrlChange,
    onExtract,
    onReset,
    loading,
    tagCategories,
    toggleTagCategory,
    onOpenHistory
}) => {
    const { t } = useTranslation();

    return (
        <div className="mt-auto rounded-t-2xl bg-[rgb(var(--color-surface-alt-rgb))] border-t border-[rgb(var(--color-surface-border-rgb))] p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
            {/* Categories */}
            <div className="flex justify-between mb-4 overflow-x-auto pb-2 no-scrollbar gap-2">
                {tagCategories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => toggleTagCategory(cat.id)}
                        className={`flex flex-col items-center min-w-[60px] gap-1 transition-opacity ${cat.enabled ? 'opacity-100' : 'opacity-50'}`}
                    >
                        <div className={`p-2 rounded-full flex items-center justify-center w-10 h-10 transition-colors ${cat.enabled ? 'bg-[rgb(var(--color-primary-rgb))]/10 text-[rgb(var(--color-primary-rgb))]' : 'bg-[rgb(var(--color-surface-alt-2-rgb))] text-[rgb(var(--color-on-surface-muted-rgb))]'}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                {cat.id === 'copyright' && <g><rect x="4" y="9" width="10" height="8" rx="2"/><rect x="10" y="5" width="10" height="8" rx="2" opacity="0.65"/></g>}
                                {cat.id === 'character' && <path d="M12 2.25c-2.9 0-5.25 2.35-5.25 5.25S9.1 12.75 12 12.75 17.25 10.4 17.25 7.5 14.9 2.25 12 2.25zm0 12c-3.45 0-6.75 1.77-6.75 4.5V21h13.5v-2.25c0-2.73-3.3-4.5-6.75-4.5z"/>}
                                {cat.id === 'general' && <path d="M4.5 5.25h15a.75.75 0 010 1.5h-15a.75.75 0 010-1.5zm0 6h15a.75.75 0 010 1.5h-15a.75.75 0 010-1.5zm0 6h15a.75.75 0 010 1.5h-15a.75.75 0 010-1.5z"/>}
                                {cat.id === 'meta' && <path d="M4.5 6.75A2.25 2.25 0 016.75 4.5h10.5A2.25 2.25 0 0119.5 6.75v10.5A2.25 2.25 0 0117.25 19.5H6.75A2.25 2.25 0 014.5 17.25V6.75zm3 1.5a.75.75 0 000 1.5h8.25a.75.75 0 000-1.5H7.5zM7.5 12a.75.75 0 000 1.5h8.25a.75.75 0 000-1.5H7.5zm0 3.75a.75.75 0 000 1.5H12a.75.75 0 000-1.5H7.5z"/>}
                                {cat.id === 'other' && <g><rect x="4" y="4" width="6" height="6" rx="1.5"/><rect x="14" y="4" width="6" height="6" rx="1.5"/><rect x="4" y="14" width="6" height="6" rx="1.5"/><rect x="14" y="14" width="6" height="6" rx="1.5"/></g>}
                            </svg>
                        </div>
                        <span className="text-[10px] font-medium text-[rgb(var(--color-on-surface-rgb))]">{t(`extractor.categories.items.${cat.id}`, { defaultValue: cat.label })}</span>
                    </button>
                ))}
            </div>

            {/* URL Input */}
            <div className="mb-4">
                <label className="block text-xs font-bold text-[rgb(var(--color-on-surface-muted-rgb))] mb-2 uppercase tracking-wider">
                    {t('extractor.header.urlLabel')}
                </label>
                <div className="relative">
                    <input
                        type="url"
                        value={url}
                        onChange={onUrlChange}
                        placeholder={t('extractor.header.urlPlaceholder')}
                        className="w-full h-12 px-4 pr-10 rounded-xl bg-[rgb(var(--color-surface-alt-2-rgb))] border border-[rgb(var(--color-surface-border-rgb))] text-sm focus:outline-none focus:border-[rgb(var(--color-primary-rgb))] focus:ring-1 focus:ring-[rgb(var(--color-primary-rgb))] placeholder:text-[rgb(var(--color-on-surface-faint-rgb))]"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgb(var(--color-on-surface-muted-rgb))]">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
                <button
                    onClick={onOpenHistory}
                    className="h-12 w-12 flex items-center justify-center rounded-xl bg-[rgb(var(--color-surface-alt-2-rgb))] border border-[rgb(var(--color-surface-border-rgb))] text-[rgb(var(--color-on-surface-rgb))] hover:bg-[rgb(var(--color-surface-border-rgb))] transition-colors"
                >
                    <HistoryIcon className="w-6 h-6" />
                </button>
                <button
                    onClick={onExtract}
                    disabled={loading || !url}
                    className="flex-1 h-12 rounded-xl bg-[rgb(var(--color-primary-rgb))] text-[rgb(var(--color-primary-content-rgb))] font-semibold text-sm shadow-sm disabled:opacity-50 hover:bg-[rgb(var(--color-primary-focus-rgb))] transition-colors flex items-center justify-center gap-2"
                >
                    {loading ? <LoadingSpinner /> : (
                        <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" /></svg>
                            {t('extractor.header.manualButton')}
                        </>
                    )}
                </button>
                <button
                    onClick={onReset}
                    className="h-12 px-4 rounded-xl bg-[rgb(var(--color-surface-alt-2-rgb))] border border-[rgb(var(--color-surface-border-rgb))] text-[rgb(var(--color-on-surface-rgb))] font-medium text-sm hover:bg-[rgb(var(--color-surface-border-rgb))] transition-colors"
                >
                    {t('extractor.header.resetButton')}
                </button>
            </div>
        </div>
    );
};
