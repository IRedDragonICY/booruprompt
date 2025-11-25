import { memo, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { ServerIcon, CloudArrowDownIcon } from '../icons/icons';

type FetchMode = 'server' | 'clientProxy';

interface ClientProxyOption {
    id: string;
    label: string;
    value: string;
}

const CLIENT_PROXY_OPTIONS: ClientProxyOption[] = [
    { id: 'allorigins', label: 'AllOrigins', value: 'https://api.allorigins.win/get?url=' },
    { id: 'codetabs', label: 'CodeTabs', value: 'https://api.codetabs.com/v1/proxy?quest=' },
];

interface FetchModeSectionProps {
    fetchMode: FetchMode;
    clientProxyUrl: string;
    onFetchModeChange: (mode: FetchMode) => void;
    onProxyUrlChange: (url: string) => void;
}

const FETCH_MODE_ICON_MAP = {
    server: ServerIcon,
    clientProxy: CloudArrowDownIcon,
} as const;

export const FetchModeSection = memo(function FetchModeSection({
    fetchMode,
    clientProxyUrl,
    onFetchModeChange,
    onProxyUrlChange
}: FetchModeSectionProps) {
    const { t } = useTranslation();

    const handleModeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        onFetchModeChange(e.target.value as FetchMode);
    }, [onFetchModeChange]);

    const handleProxyChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        onProxyUrlChange(e.target.value);
    }, [onProxyUrlChange]);

    const fetchOptions = useMemo(() => [
        { value: 'server' as FetchMode, label: t('settings.fetchModes.server.label'), description: t('settings.fetchModes.server.description') },
        { value: 'clientProxy' as FetchMode, label: t('settings.fetchModes.clientProxy.label'), description: t('settings.fetchModes.clientProxy.description') },
    ], [t]);

    return (
        <div className="rounded-2xl bg-[rgb(var(--color-surface-alt-rgb))] p-4">
            <label className="mb-3 flex items-center text-base font-medium text-[rgb(var(--color-on-surface-rgb))]">
                <span className="mr-3 text-[rgb(var(--color-primary-rgb))]"><CloudArrowDownIcon /></span>
                <span>{t('settings.sections.dataFetch')}</span>
            </label>
            <div className="space-y-2">
                {fetchOptions.map(({ value, label, description }) => {
                    const IconComponent = FETCH_MODE_ICON_MAP[value];
                    const isSelected = fetchMode === value;

                    return (
                        <div key={value} className={`overflow-hidden rounded-xl transition-all ${isSelected ? 'bg-[rgb(var(--color-surface-rgb))] shadow-sm ring-1 ring-[rgb(var(--color-primary-rgb))]/30' : 'hover:bg-[rgb(var(--color-surface-alt-2-rgb))]'}`}>
                            <label className="flex cursor-pointer items-start p-4">
                                <input type="radio" name="fetchMode" value={value} checked={isSelected} onChange={handleModeChange} className="peer sr-only" aria-label={label} />
                                <div className={`mr-4 mt-0.5 h-6 w-6 shrink-0 ${isSelected ? 'text-[rgb(var(--color-primary-rgb))]' : 'text-[rgb(var(--color-on-surface-muted-rgb))]'}`}>
                                    <IconComponent />
                                </div>
                                <div className="flex-1">
                                    <span className={`block text-base font-medium ${isSelected ? 'text-[rgb(var(--color-on-surface-rgb))]' : 'text-[rgb(var(--color-on-surface-muted-rgb))]'}`}>{label}</span>
                                    <span className="mt-1 block text-sm text-[rgb(var(--color-on-surface-muted-rgb))] leading-relaxed">{description}</span>
                                </div>
                                <div className="ml-4 mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-[rgb(var(--color-surface-border-rgb))] bg-transparent transition-colors peer-checked:border-[rgb(var(--color-primary-rgb))] peer-checked:bg-[rgb(var(--color-primary-rgb))]">
                                    <AnimatePresence>
                                        {isSelected && (
                                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="h-2 w-2 rounded-full bg-white" />
                                        )}
                                    </AnimatePresence>
                                </div>
                            </label>
                            {value === 'clientProxy' && isSelected && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="border-t border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-alt-2-rgb))]/50 px-4 py-3"
                                >
                                    <label htmlFor="clientProxySelect" className="mb-2 block text-xs font-medium uppercase tracking-wider text-[rgb(var(--color-on-surface-muted-rgb))]">{t('settings.clientProxy.selectLabel')}</label>
                                    <div className="relative">
                                        <select
                                            id="clientProxySelect"
                                            value={clientProxyUrl}
                                            onChange={handleProxyChange}
                                            className="w-full appearance-none rounded-lg border-0 bg-[rgb(var(--color-surface-rgb))] px-4 py-2.5 text-sm text-[rgb(var(--color-on-surface-rgb))] shadow-sm ring-1 ring-inset ring-[rgb(var(--color-surface-border-rgb))] transition focus:ring-2 focus:ring-inset focus:ring-[rgb(var(--color-primary-rgb))]"
                                            aria-label={t('settings.clientProxy.ariaLabel')}
                                        >
                                            {CLIENT_PROXY_OPTIONS.map(option => (
                                                <option key={option.id} value={option.value} className="bg-[rgb(var(--color-surface-rgb))] text-[rgb(var(--color-on-surface-rgb))]">
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[rgb(var(--color-on-surface-muted-rgb))]">
                                            <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                                        </div>
                                    </div>
                                    <p className="mt-2 text-xs text-[rgb(var(--color-on-surface-faint-rgb))]">{t('settings.clientProxy.helper')}</p>
                                </motion.div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
});
