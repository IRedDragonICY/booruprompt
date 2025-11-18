import { memo, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { HistorySizeIcon } from '../icons/icons';

interface HistorySizeSectionProps {
    saveHistory: boolean;
    maxHistorySize: number;
    onChange: (size: number) => void;
}

const EXPAND_VARIANTS = { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, exit: { opacity: 0, height: 0 } };
const DEFAULT_MAX_HISTORY_SIZE = 30;

export const HistorySizeSection = memo(function HistorySizeSection({
    saveHistory,
    maxHistorySize,
    onChange
}: HistorySizeSectionProps) {
    const { t } = useTranslation();

    const handleChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = parseInt(e.target.value, 10);
        onChange(isNaN(value) ? DEFAULT_MAX_HISTORY_SIZE : value);
    }, [onChange]);

    const sizeOptions = useMemo(() => [
        { value: 10, label: t('settings.historySizeOptions.10') },
        { value: 30, label: t('settings.historySizeOptions.30') },
        { value: 50, label: t('settings.historySizeOptions.50') },
        { value: 100, label: t('settings.historySizeOptions.100') },
        { value: -1, label: t('settings.historySizeOptions.unlimited') },
    ], [t]);

    return (
        <AnimatePresence>
            {saveHistory && (
                <motion.div {...EXPAND_VARIANTS} transition={{ duration: 0.2 }}>
                    <label htmlFor="maxHistorySizeSelect" className="mb-1.5 text-sm font-medium text-[rgb(var(--color-on-surface-rgb))] flex items-center">
                        <HistorySizeIcon />
                        <span className="ml-2">{t('settings.historySize.label')}</span>
                    </label>
                    <div className="relative">
                        <select
                            id="maxHistorySizeSelect"
                            value={maxHistorySize}
                            onChange={handleChange}
                            className="w-full appearance-none rounded-md border border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-alt-2-rgb))] px-3 py-2 text-sm text-[rgb(var(--color-on-surface-rgb))] transition duration-200 focus:border-[rgb(var(--color-primary-rgb))] focus:outline-none focus:ring-1 focus:ring-[rgb(var(--color-primary-rgb))]"
                            aria-label={t('settings.accessibility.historySizeSelect')}
                        >
                            {sizeOptions.map(option => (
                                <option key={option.value} value={option.value} className="bg-[rgb(var(--color-surface-rgb))] text-[rgb(var(--color-on-surface-rgb))]">
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[rgb(var(--color-on-surface-muted-rgb))]">
                            <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
                            </svg>
                        </div>
                    </div>
                    <p className="mt-1.5 text-xs text-[rgb(var(--color-on-surface-muted-rgb))]">{t('settings.historySize.description')}</p>
                </motion.div>
            )}
        </AnimatePresence>
    );
});
