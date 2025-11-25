import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useAnimation, PanInfo } from 'framer-motion';
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

const CategoryIcon: React.FC<{ id: string }> = ({ id }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
        {id === 'copyright' && <g><rect x="4" y="9" width="10" height="8" rx="2"/><rect x="10" y="5" width="10" height="8" rx="2" opacity="0.65"/></g>}
        {id === 'character' && <path d="M12 2.25c-2.9 0-5.25 2.35-5.25 5.25S9.1 12.75 12 12.75 17.25 10.4 17.25 7.5 14.9 2.25 12 2.25zm0 12c-3.45 0-6.75 1.77-6.75 4.5V21h13.5v-2.25c0-2.73-3.3-4.5-6.75-4.5z"/>}
        {id === 'general' && <path d="M4.5 5.25h15a.75.75 0 010 1.5h-15a.75.75 0 010-1.5zm0 6h15a.75.75 0 010 1.5h-15a.75.75 0 010-1.5zm0 6h15a.75.75 0 010 1.5h-15a.75.75 0 010-1.5z"/>}
        {id === 'meta' && <path d="M4.5 6.75A2.25 2.25 0 016.75 4.5h10.5A2.25 2.25 0 0119.5 6.75v10.5A2.25 2.25 0 0117.25 19.5H6.75A2.25 2.25 0 014.5 17.25V6.75zm3 1.5a.75.75 0 000 1.5h8.25a.75.75 0 000-1.5H7.5zM7.5 12a.75.75 0 000 1.5h8.25a.75.75 0 000-1.5H7.5zm0 3.75a.75.75 0 000 1.5H12a.75.75 0 000-1.5H7.5z"/>}
        {id === 'other' && <g><rect x="4" y="4" width="6" height="6" rx="1.5"/><rect x="14" y="4" width="6" height="6" rx="1.5"/><rect x="4" y="14" width="6" height="6" rx="1.5"/><rect x="14" y="14" width="6" height="6" rx="1.5"/></g>}
    </svg>
);

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
    const [isMinimized, setIsMinimized] = useState(false);
    const controls = useAnimation();

    const handleDragEnd = useCallback((_: any, info: PanInfo) => {
        if (info.offset.y > 60) {
            setIsMinimized(true);
            controls.start({ y: 'calc(100% - 20px)' });
        } else {
            setIsMinimized(false);
            controls.start({ y: 0 });
        }
    }, [controls]);

    const handleExpand = useCallback(() => {
        if (isMinimized) {
            setIsMinimized(false);
            controls.start({ y: 0 });
        }
    }, [controls, isMinimized]);

    return (
        <motion.div
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.12}
            onDragEnd={handleDragEnd}
            animate={controls}
            initial={{ y: 0 }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            className="fixed bottom-[var(--mobile-nav-height,56px)] left-0 right-0 z-20 px-3"
        >
            <div className="rounded-t-2xl bg-[rgb(var(--color-surface-alt-rgb))]/95 backdrop-blur-xl border border-[rgb(var(--color-surface-border-rgb))]/50 shadow-2xl shadow-black/25">
                {/* Drag Handle */}
                <div className="flex justify-center pt-2 pb-1 cursor-grab active:cursor-grabbing" onClick={handleExpand}>
                    <div className="w-9 h-1 rounded-full bg-[rgb(var(--color-on-surface-faint-rgb))]/40" />
                </div>
                
                <div className="px-4 pb-4">
                    {/* Categories - Compact Grid */}
                    <div className="flex justify-between gap-1 mb-3">
                        {tagCategories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => toggleTagCategory(cat.id)}
                                className={`flex flex-col items-center flex-1 py-1.5 rounded-xl transition-all duration-200 ${cat.enabled ? 'bg-[rgb(var(--color-primary-rgb))]/15' : 'opacity-50'}`}
                            >
                                <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-1 transition-all duration-200 ${cat.enabled ? 'bg-[rgb(var(--color-primary-rgb))] text-white shadow-md shadow-[rgb(var(--color-primary-rgb))]/30' : 'bg-[rgb(var(--color-surface-alt-2-rgb))] text-[rgb(var(--color-on-surface-muted-rgb))]'}`}>
                                    <CategoryIcon id={cat.id} />
                                </div>
                                <span className={`text-[9px] font-semibold ${cat.enabled ? 'text-[rgb(var(--color-primary-rgb))]' : 'text-[rgb(var(--color-on-surface-muted-rgb))]'}`}>
                                    {t(`extractor.categories.items.${cat.id}`, { defaultValue: cat.label })}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* URL Input */}
                    <div className="mb-3">
                        <div className="relative">
                            <input
                                type="url"
                                value={url}
                                onChange={onUrlChange}
                                placeholder={t('extractor.header.urlPlaceholder')}
                                className="w-full h-11 pl-4 pr-10 rounded-xl bg-[rgb(var(--color-surface-alt-2-rgb))]/80 border border-[rgb(var(--color-surface-border-rgb))]/50 text-sm focus:outline-none focus:border-[rgb(var(--color-primary-rgb))]/60 focus:ring-2 focus:ring-[rgb(var(--color-primary-rgb))]/20 placeholder:text-[rgb(var(--color-on-surface-faint-rgb))] transition-all"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgb(var(--color-on-surface-muted-rgb))]/50">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                        <button
                            onClick={onOpenHistory}
                            className="w-11 h-11 flex items-center justify-center rounded-xl bg-[rgb(var(--color-surface-alt-2-rgb))]/60 border border-[rgb(var(--color-surface-border-rgb))]/30 text-[rgb(var(--color-on-surface-muted-rgb))] hover:bg-[rgb(var(--color-surface-border-rgb))] active:scale-95 transition-all"
                        >
                            <HistoryIcon className="w-5 h-5" />
                        </button>
                        <button
                            onClick={onExtract}
                            disabled={loading || !url}
                            className="flex-1 h-11 rounded-xl bg-[rgb(var(--color-primary-rgb))] text-white font-semibold text-sm shadow-lg shadow-[rgb(var(--color-primary-rgb))]/25 disabled:opacity-40 disabled:shadow-none hover:shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? <LoadingSpinner /> : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" /></svg>
                                    {t('extractor.header.manualButton')}
                                </>
                            )}
                        </button>
                        <button
                            onClick={onReset}
                            className="h-11 px-4 rounded-xl bg-[rgb(var(--color-surface-alt-2-rgb))]/60 border border-[rgb(var(--color-surface-border-rgb))]/30 text-[rgb(var(--color-on-surface-rgb))] font-medium text-sm hover:bg-[rgb(var(--color-surface-border-rgb))] active:scale-95 transition-all"
                        >
                            {t('extractor.header.resetButton')}
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
