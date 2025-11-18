import { memo, useCallback, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { TooltipWrapper } from '../TooltipWrapper';

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
        <div className="rounded-xl border border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-rgb))] p-3">
            <label className="flex cursor-pointer select-none items-center justify-between">
                <TooltipWrapper tipContent={t('settings.toggles.blacklist.tooltip')}>
                    <span className="mr-3 text-sm font-medium text-[rgb(var(--color-on-surface-rgb))] flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                            <path d="M12 22.5a10.5 10.5 0 1 0 0-21 10.5 10.5 0 0 0 0 21ZM7.06 6l10.88 10.88A8.999 8.999 0 0 1 7.06 6Zm9.88 12L6.06 7.12A8.999 8.999 0 0 1 16.94 18Z"/>
                        </svg>
                        <span className="ml-2">{t('settings.toggles.blacklist.label')}</span>
                    </span>
                </TooltipWrapper>
                <div className="relative">
                    <input type="checkbox" id="blacklistToggle" className="peer sr-only" checked={enabled} onChange={handleToggle} />
                    <div className="block h-6 w-11 rounded-full bg-[rgb(var(--color-surface-border-rgb))] transition-colors duration-200 peer-checked:bg-[rgb(var(--color-primary-rgb))] peer-focus:ring-2 peer-focus:ring-[rgb(var(--color-primary-rgb))] peer-focus:ring-offset-2 peer-focus:ring-offset-[rgb(var(--color-surface-alt-rgb))]" />
                    <motion.div
                        className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-xs"
                        layout
                        transition={TOGGLE_TRANSITION}
                        initial={false}
                        animate={{ x: enabled ? 20 : 0 }}
                    />
                </div>
            </label>
            <p className="mt-1.5 text-xs text-[rgb(var(--color-on-surface-muted-rgb))]">{t('settings.toggles.blacklist.description')}</p>
            <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: enabled ? 1 : 0, height: enabled ? 'auto' : 0 }}
                className={`mt-2 space-y-2 overflow-hidden ${enabled ? '' : 'pointer-events-none'}`}
            >
                <textarea
                    value={localKeywords}
                    onChange={handleChange}
                    rows={3}
                    className="w-full appearance-none rounded-lg border border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-alt-2-rgb))] px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary-rgb))]"
                    placeholder={t('settings.toggles.blacklist.placeholder')}
                    aria-label={t('settings.toggles.blacklist.ariaLabel')}
                />
                <div className="text-right">
                    <button
                        type="button"
                        onClick={handleReset}
                        className="rounded-md bg-[rgb(var(--color-surface-border-rgb))] px-3 py-1.5 text-xs font-medium text-[rgb(var(--color-on-surface-muted-rgb))] transition hover:bg-gray-300 dark:hover:bg-gray-500 active:scale-95"
                    >
                        {t('settings.toggles.blacklist.reset')}
                    </button>
                </div>
            </motion.div>
        </div>
    );
});
