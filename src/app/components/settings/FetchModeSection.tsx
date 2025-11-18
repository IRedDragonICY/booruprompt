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
    { id: 'thingproxy', label: 'ThingProxy', value: 'https://thingproxy.freeboard.io/fetch/' },
    { id: 'codetabs', label: 'CodeTabs', value: 'https://api.codetabs.com/v1/proxy?quest=' },
];

interface FetchModeSectionProps {
    fetchMode: FetchMode;
    clientProxyUrl: string;
    onFetchModeChange: (mode: FetchMode) => void;
    onProxyUrlChange: (url: string) => void;
}

// Icon map to avoid recreating JSX elements
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
        <div>
            <label className="mb-2 flex items-center text-sm font-medium text-[rgb(var(--color-on-surface-rgb))]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                </svg>
                <span>{t('settings.sections.dataFetch')}</span>
            </label>
            <div className="space-y-2 rounded-xl bg-[rgb(var(--color-surface-alt-2-rgb))] p-2">
                {fetchOptions.map(({ value, label, description }) => {
                    const IconComponent = FETCH_MODE_ICON_MAP[value];

                    return (
                        <div key={value}>
                            <label className={`flex cursor-pointer items-start rounded-lg p-3 transition-all ${fetchMode === value ? 'bg-[rgb(var(--color-surface-rgb))] shadow-sm ring-1 ring-[rgb(var(--color-primary-rgb))]/50' : 'hover:bg-[rgb(var(--color-surface-border-rgb))]'}`}>
                                <input type="radio" name="fetchMode" value={value} checked={fetchMode === value} onChange={handleModeChange} className="peer sr-only" aria-label={label} />
                                <div className={`mr-3 mt-0.5 h-5 w-5 shrink-0 ${fetchMode === value ? 'text-[rgb(var(--color-primary-rgb))]' : 'text-[rgb(var(--color-on-surface-muted-rgb))]'}`}>
                                    <IconComponent />
                                </div>
                                <div className="flex-1">
                                    <span className={`block text-sm font-medium ${fetchMode === value ? 'text-[rgb(var(--color-on-surface-rgb))]' : 'text-[rgb(var(--color-on-surface-muted-rgb))]'}`}>{label}</span>
                                    <span className="mt-0.5 block text-xs text-[rgb(var(--color-on-surface-faint-rgb))]">{description}</span>
                                </div>
                                <div className="ml-3 mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-rgb))] transition-colors peer-checked:border-[rgb(var(--color-primary-rgb))] peer-checked:bg-[rgb(var(--color-primary-rgb))]">
                                    <AnimatePresence>
                                        {fetchMode === value && (
                                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="h-2 w-2 rounded-full bg-[rgb(var(--color-primary-content-rgb))]" />
                                        )}
                                    </AnimatePresence>
                                </div>
                            </label>
                        {value === 'clientProxy' && fetchMode === 'clientProxy' && (
                            <motion.div
                                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                animate={{ opacity: 1, height: 'auto', marginTop: '0.5rem' }}
                                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                transition={{ duration: 0.2 }}
                                className="pl-12 pr-3"
                            >
                                <label htmlFor="clientProxySelect" className="mb-1 block text-xs font-medium text-[rgb(var(--color-on-surface-muted-rgb))]">{t('settings.clientProxy.selectLabel')}</label>
                                <select
                                    id="clientProxySelect"
                                    value={clientProxyUrl}
                                    onChange={handleProxyChange}
                                    className="w-full appearance-none rounded-md border border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-rgb))] px-3 py-1.5 text-sm text-[rgb(var(--color-on-surface-rgb))] transition duration-200 focus:border-[rgb(var(--color-primary-rgb))] focus:outline-none focus:ring-1 focus:ring-[rgb(var(--color-primary-rgb))]"
                                    aria-label={t('settings.clientProxy.ariaLabel')}
                                >
                                    {CLIENT_PROXY_OPTIONS.map(option => (
                                        <option key={option.id} value={option.value} className="bg-[rgb(var(--color-surface-rgb))] text-[rgb(var(--color-on-surface-rgb))]">
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                <p className="mt-1 text-[10px] text-[rgb(var(--color-on-surface-faint-rgb))]">{t('settings.clientProxy.helper')}</p>
                            </motion.div>
                        )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
});
