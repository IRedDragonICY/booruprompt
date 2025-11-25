import { memo, useCallback, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { NoSymbolIcon } from '../icons/icons';

interface BlacklistSectionProps {
    enabled: boolean;
    keywords: string;
    defaultKeywords: string;
    onEnabledChange: (enabled: boolean) => void;
    onKeywordsChange: (keywords: string) => void;
}

const TOGGLE_TRANSITION = { type: "spring", stiffness: 700, damping: 30 };

export const BlacklistSection = memo(function BlacklistSection({
    enabled,
    keywords,
    defaultKeywords,
    onEnabledChange,
    onKeywordsChange
}: BlacklistSectionProps) {
    const { t } = useTranslation();
    const [localKeywords, setLocalKeywords] = useState(keywords);

    useEffect(() => {
        setLocalKeywords(keywords);
    }, [keywords]);

    const handleToggle = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        onEnabledChange(e.target.checked);
    }, [onEnabledChange]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setLocalKeywords(e.target.value);
        onKeywordsChange(e.target.value);
    }, [onKeywordsChange]);

    const handleReset = useCallback(() => {
        setLocalKeywords(defaultKeywords);
        onKeywordsChange(defaultKeywords);
    }, [defaultKeywords, onKeywordsChange]);

    return (
        <div className="rounded-2xl bg-[rgb(var(--color-surface-alt-rgb))] p-4 transition-colors duration-200">
            <label className="flex cursor-pointer select-none items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgb(var(--color-surface-rgb))] text-[rgb(var(--color-primary-rgb))]">
                        <NoSymbolIcon className="h-6 w-6" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-base font-medium text-[rgb(var(--color-on-surface-rgb))]">
                            {t('settings.toggles.blacklist.label')}
                        </span>
                        <span className="text-sm text-[rgb(var(--color-on-surface-muted-rgb))]">
                            {t('settings.toggles.blacklist.description')}
                        </span>
                    </div>
                </div>
                <div className="relative ml-4">
                    <input
                        type="checkbox"
                        className="peer sr-only"
                        checked={enabled}
                        onChange={handleToggle}
                    />
                    <div className="h-7 w-12 rounded-full bg-[rgb(var(--color-surface-border-rgb))] transition-colors duration-200 peer-checked:bg-[rgb(var(--color-primary-rgb))]" />
                    <motion.div
                        className="absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow-sm"
                        layout
                        transition={TOGGLE_TRANSITION}
                        initial={false}
                        animate={{ x: enabled ? 20 : 0 }}
                    />
                </div>
            </label>

            <AnimatePresence>
                {enabled && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="relative">
                            <textarea
                                value={localKeywords}
                                onChange={handleChange}
                                rows={4}
                                className="w-full resize-y rounded-xl border-0 bg-[rgb(var(--color-surface-rgb))] p-3 text-sm text-[rgb(var(--color-on-surface-rgb))] placeholder-[rgb(var(--color-on-surface-muted-rgb))] ring-1 ring-inset ring-[rgb(var(--color-surface-border-rgb))] focus:ring-2 focus:ring-inset focus:ring-[rgb(var(--color-primary-rgb))]"
                                placeholder={t('settings.toggles.blacklist.placeholder')}
                                aria-label={t('settings.toggles.blacklist.ariaLabel')}
                            />
                            <div className="mt-2 flex justify-end">
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="rounded-lg bg-[rgb(var(--color-surface-rgb))] px-3 py-1.5 text-xs font-medium text-[rgb(var(--color-on-surface-muted-rgb))] ring-1 ring-inset ring-[rgb(var(--color-surface-border-rgb))] transition hover:bg-[rgb(var(--color-surface-hover-rgb))] hover:text-[rgb(var(--color-on-surface-rgb))]"
                                >
                                    {t('settings.toggles.blacklist.reset')}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
});
