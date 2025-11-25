import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { HistorySizeIcon } from '../icons/icons';

interface HistorySizeSectionProps {
    saveHistory: boolean;
    maxHistorySize: number;
    onChange: (size: number) => void;
}

const EXPAND_VARIANTS = { initial: { opacity: 0, height: 0, marginTop: 0 }, animate: { opacity: 1, height: 'auto', marginTop: 16 }, exit: { opacity: 0, height: 0, marginTop: 0 } };

export const HistorySizeSection = memo(function HistorySizeSection({
    saveHistory,
    maxHistorySize,
    onChange
}: HistorySizeSectionProps) {
    const { t } = useTranslation();

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
                <motion.div {...EXPAND_VARIANTS} transition={{ duration: 0.2 }} className="overflow-hidden">
                    <div className="rounded-2xl bg-[rgb(var(--color-surface-alt-rgb))] p-4">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgb(var(--color-surface-rgb))] text-[rgb(var(--color-primary-rgb))]">
                                <HistorySizeIcon className="h-6 w-6" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-base font-medium text-[rgb(var(--color-on-surface-rgb))]">
                                    {t('settings.historySize.label')}
                                </span>
                                <span className="text-sm text-[rgb(var(--color-on-surface-muted-rgb))]">
                                    {t('settings.historySize.description')}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {sizeOptions.map((option) => {
                                const isSelected = maxHistorySize === option.value;
                                return (
                                    <button
                                        key={option.value}
                                        onClick={() => onChange(option.value)}
                                        className={`
                                            relative flex h-10 min-w-[3rem] items-center justify-center rounded-lg px-4 text-sm font-medium transition-all
                                            ${isSelected
                                                ? 'bg-[rgb(var(--color-primary-rgb))] text-white shadow-md'
                                                : 'bg-[rgb(var(--color-surface-rgb))] text-[rgb(var(--color-on-surface-rgb))] hover:bg-[rgb(var(--color-surface-hover-rgb))]'
                                            }
                                        `}
                                    >
                                        {option.label}
                                        {isSelected && (
                                            <motion.div
                                                layoutId="historySizeIndicator"
                                                className="absolute inset-0 rounded-lg ring-2 ring-[rgb(var(--color-primary-rgb))] ring-offset-2 ring-offset-[rgb(var(--color-surface-alt-rgb))]"
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
});
