import React, { useCallback, useEffect, useMemo, useState, memo } from 'react';
import { AnimatedIcon } from './AnimatedIcon';
import { TooltipWrapper } from './TooltipWrapper';
import { LanguageSelector } from './LanguageSelector';
import { SunIcon, MoonIcon, ComputerDesktopIcon, BugAntIcon, ServerIcon, CloudArrowDownIcon, PaletteIcon, AutomaticIcon, PreviewIcon, HistorySaveIcon, UnsupportedSitesIcon, HistorySizeIcon } from './icons/icons';
import type { Settings, ThemePreference, ColorTheme, FetchMode } from '../types/settings';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const DEFAULT_CUSTOM_COLOR_HEX = '#3B82F6';
const REPORT_ISSUE_URL = 'https://github.com/IRedDragonICY/booruprompt/issues';
const DEFAULT_MAX_HISTORY_SIZE = 30;

interface ClientProxyOption { id: string; label: string; value: string; }
const CLIENT_PROXY_OPTIONS: ClientProxyOption[] = [
    { id: 'allorigins', label: 'AllOrigins', value: 'https://api.allorigins.win/get?url=' },
    { id: 'thingproxy', label: 'ThingProxy', value: 'https://thingproxy.freeboard.io/fetch/' },
    { id: 'codetabs', label: 'CodeTabs', value: 'https://api.codetabs.com/v1/proxy?quest=' },
];

const HISTORY_SIZE_VALUES = [10, 30, 50, 100, -1] as const;

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
}

interface SettingsPanelProps { settings: Settings; onSettingsChange: (newSettings: Partial<Settings>) => void; }

export const SettingsPanel = memo(function SettingsPanel({ settings, onSettingsChange }: SettingsPanelProps) {
    const { t } = useTranslation();
    const defaultBlacklistKeywords = useMemo(() => t('settings.toggles.blacklist.defaultKeywords'), [t]);
    const [currentCustomHex, setCurrentCustomHex] = useState(settings.customColorHex || DEFAULT_CUSTOM_COLOR_HEX);
    const [localBlacklist, setLocalBlacklist] = useState<string>(settings.blacklistKeywords || defaultBlacklistKeywords);

    useEffect(() => { setCurrentCustomHex(settings.customColorHex || DEFAULT_CUSTOM_COLOR_HEX); }, [settings.customColorHex]);

    // Debounce custom color hex to prevent excessive updates
    const debouncedCustomHex = useDebounce(currentCustomHex, 300);

    useEffect(() => {
        if (/^#[0-9a-fA-F]{6}$/.test(debouncedCustomHex) && settings.colorTheme === 'custom') {
            onSettingsChange({ customColorHex: debouncedCustomHex });
        }
    }, [debouncedCustomHex, onSettingsChange, settings.colorTheme]);

    const handleThemeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => onSettingsChange({ theme: e.target.value as ThemePreference }), [onSettingsChange]);
    const handleColorThemeRadioChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value as ColorTheme;
        if (value === 'custom') {
            const validHex = /^#[0-9a-fA-F]{6}$/.test(currentCustomHex) ? currentCustomHex : DEFAULT_CUSTOM_COLOR_HEX;
            onSettingsChange({ colorTheme: 'custom', customColorHex: validHex });
            setCurrentCustomHex(validHex);
        } else {
            onSettingsChange({ colorTheme: value });
        }
    }, [onSettingsChange, currentCustomHex]);
    const handleCustomColorInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const v = e.target.value;
        setCurrentCustomHex(v);
        if (settings.colorTheme !== 'custom') {
            onSettingsChange({ colorTheme: 'custom' });
        }
    }, [onSettingsChange, settings.colorTheme]);
    const handleCustomColorTextChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newHex = e.target.value;
        const cleanHex = newHex.startsWith('#') ? newHex : `#${newHex}`;
        setCurrentCustomHex(cleanHex);
        if (settings.colorTheme !== 'custom') {
            onSettingsChange({ colorTheme: 'custom' });
        }
    }, [onSettingsChange, settings.colorTheme]);

    const handleAutoExtractChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => onSettingsChange({ autoExtract: e.target.checked }), [onSettingsChange]);
    const handleImagePreviewsChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => onSettingsChange({ enableImagePreviews: e.target.checked }), [onSettingsChange]);
    const handleFetchModeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => onSettingsChange({ fetchMode: e.target.value as FetchMode }), [onSettingsChange]);
    const handleClientProxyChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => onSettingsChange({ clientProxyUrl: e.target.value }), [onSettingsChange]);
    const handleSaveHistoryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => onSettingsChange({ saveHistory: e.target.checked }), [onSettingsChange]);
    const handleUnsupportedSitesChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => onSettingsChange({ enableUnsupportedSites: e.target.checked }), [onSettingsChange]);
    const handleBlacklistToggle = useCallback((e: React.ChangeEvent<HTMLInputElement>) => onSettingsChange({ enableBlacklist: e.target.checked }), [onSettingsChange]);
    const handleBlacklistChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => { setLocalBlacklist(e.target.value); onSettingsChange({ blacklistKeywords: e.target.value }); }, [onSettingsChange]);
    const handleBlacklistReset = useCallback(() => { setLocalBlacklist(defaultBlacklistKeywords); onSettingsChange({ blacklistKeywords: defaultBlacklistKeywords }); }, [onSettingsChange, defaultBlacklistKeywords]);
    const handleMaxHistoryChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => { const value = parseInt(e.target.value, 10); onSettingsChange({ maxHistorySize: isNaN(value) ? DEFAULT_MAX_HISTORY_SIZE : value }); }, [onSettingsChange]);

    const themeOptions = useMemo(() => [
        { value: 'system' as ThemePreference, label: t('settings.themeOptions.system'), icon: <ComputerDesktopIcon />, animation: 'gentle' as const },
        { value: 'light' as ThemePreference, label: t('settings.themeOptions.light'), icon: <SunIcon />, animation: 'spin' as const },
        { value: 'dark' as ThemePreference, label: t('settings.themeOptions.dark'), icon: <MoonIcon />, animation: 'default' as const },
    ], [t]);
    const colorThemeOptions = useMemo(() => [
        { value: 'blue' as ColorTheme, label: t('settings.colorThemes.blue'), colorClass: 'bg-[#3B82F6] dark:bg-[#60A5FA]' },
        { value: 'orange' as ColorTheme, label: t('settings.colorThemes.orange'), colorClass: 'bg-[#F97316] dark:bg-[#FB923C]' },
        { value: 'teal' as ColorTheme, label: t('settings.colorThemes.teal'), colorClass: 'bg-[#0D9488] dark:bg-[#2DD4BF]' },
        { value: 'rose' as ColorTheme, label: t('settings.colorThemes.rose'), colorClass: 'bg-[#E11D48] dark:bg-[#FB7185]' },
        { value: 'purple' as ColorTheme, label: t('settings.colorThemes.purple'), colorClass: 'bg-[#8B5CF6] dark:bg-[#A78BFA]' },
        { value: 'green' as ColorTheme, label: t('settings.colorThemes.green'), colorClass: 'bg-[#16A34A] dark:bg-[#4ADE80]' },
    ], [t]);
    const fetchModeOptions = useMemo(() => [
        { value: 'server' as FetchMode, label: t('settings.fetchModes.server.label'), icon: <ServerIcon />, description: t('settings.fetchModes.server.description') },
        { value: 'clientProxy' as FetchMode, label: t('settings.fetchModes.clientProxy.label'), icon: <CloudArrowDownIcon />, description: t('settings.fetchModes.clientProxy.description') },
    ], [t]);
    const historySizeOptions = useMemo(() => [
        { value: 10, label: t('settings.historySizeOptions.10') },
        { value: 30, label: t('settings.historySizeOptions.30') },
        { value: 50, label: t('settings.historySizeOptions.50') },
        { value: 100, label: t('settings.historySizeOptions.100') },
        { value: -1, label: t('settings.historySizeOptions.unlimited') },
    ], [t]);
    const isValidHex = useMemo(() => /^#[0-9a-fA-F]{6}$/.test(currentCustomHex), [currentCustomHex]);

    return (
        <div className="flex flex-col flex-1 overflow-hidden">
            <div className="sticky top-0 z-10 shrink-0 border-b border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-alt-rgb))] px-6 py-5">
                <h1 className="text-xl font-semibold">{t('settings.title')}</h1>
            </div>
            <div className="flex-grow overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[rgb(var(--color-surface-border-rgb))]">
                <LanguageSelector />

                <div>
                    <label className="mb-2 flex items-center text-sm font-medium text-[rgb(var(--color-on-surface-rgb))]"><span className="mr-2"><PaletteIcon /></span><span>{t('settings.sections.appearance')}</span></label>
                    <div className="flex items-center space-x-2 rounded-xl bg-[rgb(var(--color-surface-alt-2-rgb))] p-1">
                        {themeOptions.map(({ value, label, icon, animation }) => (
                            <label key={value} className={`flex flex-1 cursor-pointer items-center justify-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${settings.theme === value ? 'bg-[rgb(var(--color-surface-rgb))] text-[rgb(var(--color-primary-rgb))] shadow-sm ring-1 ring-[rgb(var(--color-primary-rgb))]/30' : 'text-[rgb(var(--color-on-surface-muted-rgb))] hover:bg-[rgb(var(--color-surface-border-rgb))]'}`}>
                                <input type="radio" name="theme" value={value} checked={settings.theme === value} onChange={handleThemeChange} className="sr-only" aria-label={t('settings.accessibility.themeOption', { label })} />
                                <AnimatedIcon isActive={settings.theme === value} animation={animation}>{icon}</AnimatedIcon>
                                <span>{label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="mb-2 flex items-center text-sm font-medium text-[rgb(var(--color-on-surface-rgb))]"><span className="mr-2"><PaletteIcon /></span><span>{t('settings.sections.colorTheme')}</span></label>
                    <div className="grid grid-cols-3 gap-2 rounded-xl bg-[rgb(var(--color-surface-alt-2-rgb))] p-2">
                        {colorThemeOptions.map(({ value, label, colorClass }) => (
                            <TooltipWrapper key={value} tipContent={label}>
                                <label className={`relative flex cursor-pointer items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition-all hover:scale-[1.02] ${settings.colorTheme === value ? 'bg-[rgb(var(--color-surface-rgb))] shadow-sm ring-2 ring-[rgb(var(--color-primary-rgb))] ring-offset-1 ring-offset-[rgb(var(--color-surface-alt-2-rgb))]' : 'hover:bg-[rgb(var(--color-surface-border-rgb))]'}`}>
                                    <input type="radio" name="colorTheme" value={value} checked={settings.colorTheme === value} onChange={handleColorThemeRadioChange} className="sr-only" aria-label={t('settings.accessibility.colorThemeOption', { label })} />
                                    <span className={`block h-5 w-5 rounded-full ${colorClass}`}></span>
                                    <AnimatePresence>
                                        {settings.colorTheme === value && (
                                            <motion.div className="absolute inset-0 flex items-center justify-center" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} transition={{ duration: 0.15 }}>
                                                <svg className="h-3 w-3 text-[rgb(var(--color-primary-content-rgb))] dark:text-gray-900" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                    <span className="sr-only">{label}</span>
                                </label>
                            </TooltipWrapper>
                        ))}
                        <TooltipWrapper tipContent={t('settings.customColor.label')}>
                            <label className={`relative flex cursor-pointer items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium transition-all hover:scale-[1.02] ${settings.colorTheme === 'custom' ? 'bg-[rgb(var(--color-surface-rgb))] shadow-sm ring-2 ring-[rgb(var(--color-primary-rgb))] ring-offset-1 ring-offset-[rgb(var(--color-surface-alt-2-rgb))]' : 'hover:bg-[rgb(var(--color-surface-border-rgb))]'}`}>
                                <input type="radio" name="colorTheme" value="custom" checked={settings.colorTheme === 'custom'} onChange={handleColorThemeRadioChange} className="sr-only" aria-label={t('settings.customColor.label')} />
                                <span className="block h-5 w-5 rounded-full border border-gray-400 dark:border-gray-600" style={{ backgroundColor: isValidHex ? currentCustomHex : '#ffffff' }}></span>
                                <AnimatePresence>
                                    {settings.colorTheme === 'custom' && (
                                        <motion.div className="absolute inset-0 flex items-center justify-center" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} transition={{ duration: 0.15 }}>
                                            <svg className="h-3 w-3 text-[rgb(var(--color-primary-content-rgb))] dark:text-gray-900" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                <span className="sr-only">{t('settings.customColor.label')}</span>
                            </label>
                        </TooltipWrapper>
                    </div>
                    {settings.colorTheme === 'custom' && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-3 flex items-center space-x-3 rounded-lg bg-[rgb(var(--color-surface-alt-2-rgb))] p-3">
                            <input type="color" value={isValidHex ? currentCustomHex : '#ffffff'} onChange={handleCustomColorInputChange} className="h-8 w-8 cursor-pointer appearance-none rounded-sm border border-[rgb(var(--color-surface-border-rgb))] bg-transparent p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-sm [&::-webkit-color-swatch]:border-none" aria-label={t('settings.customColor.pickerLabel')} />
                            <input type="text" value={currentCustomHex} onChange={handleCustomColorTextChange} maxLength={7} className="flex-1 appearance-none rounded-md border border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-rgb))] px-2 py-1 font-mono text-sm text-[rgb(var(--color-on-surface-rgb))] placeholder:text-[rgb(var(--color-on-surface-faint-rgb))] transition duration-200 focus:border-transparent focus:outline-hidden focus:ring-1 focus:ring-[rgb(var(--color-primary-rgb))]" placeholder={t('settings.customColor.placeholder')} aria-label={t('settings.customColor.inputLabel')} pattern="^#?([a-fA-F0-9]{6})$" />
                        </motion.div>
                    )}
                </div>

                <div>
                    <label className="mb-2 flex items-center text-sm font-medium text-[rgb(var(--color-on-surface-rgb))]"><span>{t('settings.sections.dataFetch')}</span></label>
                    <div className="space-y-2 rounded-xl bg-[rgb(var(--color-surface-alt-2-rgb))] p-2">
                        {fetchModeOptions.map(({ value, label, icon, description }) => (
                            <div key={value}>
                                <label className={`flex cursor-pointer items-start rounded-lg p-3 transition-all ${settings.fetchMode === value ? 'bg-[rgb(var(--color-surface-rgb))] shadow-sm ring-1 ring-[rgb(var(--color-primary-rgb))]/50' : 'hover:bg-[rgb(var(--color-surface-border-rgb))]'}`}>
                                    <input type="radio" name="fetchMode" value={value} checked={settings.fetchMode === value} onChange={handleFetchModeChange} className="peer sr-only" aria-label={label} />
                                    <div className={`mr-3 mt-0.5 h-5 w-5 shrink-0 ${settings.fetchMode === value ? 'text-[rgb(var(--color-primary-rgb))]' : 'text-[rgb(var(--color-on-surface-muted-rgb))]'}`}>{icon}</div>
                                    <div className="flex-1"><span className={`block text-sm font-medium ${settings.fetchMode === value ? 'text-[rgb(var(--color-on-surface-rgb))]' : 'text-[rgb(var(--color-on-surface-muted-rgb))]'}`}>{label}</span><span className="mt-0.5 block text-xs text-[rgb(var(--color-on-surface-faint-rgb))]">{description}</span></div>
                                    <div className="ml-3 mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-rgb))] transition-colors peer-checked:border-[rgb(var(--color-primary-rgb))] peer-checked:bg-[rgb(var(--color-primary-rgb))]">
                                        <AnimatePresence>{settings.fetchMode === value && (<motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="h-2 w-2 rounded-full bg-[rgb(var(--color-primary-content-rgb))]" />)}</AnimatePresence>
                                    </div>
                                </label>
                                {value === 'clientProxy' && settings.fetchMode === 'clientProxy' && (
                                    <motion.div initial={{ opacity: 0, height: 0, marginTop: 0 }} animate={{ opacity: 1, height: 'auto', marginTop: '0.5rem' }} exit={{ opacity: 0, height: 0, marginTop: 0 }} transition={{ duration: 0.2 }} className="pl-12 pr-3">
                                        <label htmlFor="clientProxySelect" className="mb-1 block text-xs font-medium text-[rgb(var(--color-on-surface-muted-rgb))]">{t('settings.clientProxy.selectLabel')}</label>
                                        <select id="clientProxySelect" value={settings.clientProxyUrl} onChange={handleClientProxyChange} className="w-full appearance-none rounded-md border border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-rgb))] px-3 py-1.5 text-sm text-[rgb(var(--color-on-surface-rgb))] transition duration-200 focus:border-[rgb(var(--color-primary-rgb))] focus:outline-none focus:ring-1 focus:ring-[rgb(var(--color-primary-rgb))]" aria-label={t('settings.clientProxy.ariaLabel')}>
                                            {CLIENT_PROXY_OPTIONS.map(option => (<option key={option.id} value={option.value} className="bg-[rgb(var(--color-surface-rgb))] text-[rgb(var(--color-on-surface-rgb))]">{option.label}</option>))}
                                        </select>
                                        <p className="mt-1 text-[10px] text-[rgb(var(--color-on-surface-faint-rgb))]">{t('settings.clientProxy.helper')}</p>
                                    </motion.div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-xl border border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-rgb))] p-3">
                    <label className="flex cursor-pointer select-none items-center justify-between">
                        <TooltipWrapper tipContent={t('settings.toggles.autoExtract.tooltip')}><span className="mr-3 text-sm font-medium text-[rgb(var(--color-on-surface-rgb))] flex items-center"><AutomaticIcon /><span className="ml-2">{t('settings.toggles.autoExtract.label')}</span></span></TooltipWrapper>
                        <div className="relative">
                            <input type="checkbox" className="peer sr-only" checked={settings.autoExtract} onChange={handleAutoExtractChange} />
                            <div className="block h-6 w-11 rounded-full bg-[rgb(var(--color-surface-border-rgb))] transition-colors duration-200 peer-checked:bg-[rgb(var(--color-primary-rgb))]"></div>
                            <motion.div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-xs" layout transition={{ type: 'spring', stiffness: 700, damping: 30 }} initial={false} animate={{ x: settings.autoExtract ? 20 : 0 }} />
                        </div>
                    </label>
                    <p className="mt-1.5 text-xs text-[rgb(var(--color-on-surface-muted-rgb))]">{t('settings.toggles.autoExtract.description')}</p>
                </div>

                <div className="rounded-xl border border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-rgb))] p-3">
                    <label className="flex cursor-pointer select-none items-center justify-between"><TooltipWrapper tipContent={t('settings.toggles.previews.tooltip')}><span className="mr-3 text-sm font-medium text-[rgb(var(--color-on-surface-rgb))] flex items-center"><PreviewIcon /><span className="ml-2">{t('settings.toggles.previews.label')}</span></span></TooltipWrapper>
                        <div className="relative"><input type="checkbox" className="peer sr-only" checked={settings.enableImagePreviews} onChange={handleImagePreviewsChange} /><div className="block h-6 w-11 rounded-full bg-[rgb(var(--color-surface-border-rgb))] transition-colors duration-200 peer-checked:bg-[rgb(var(--color-primary-rgb))]"></div><motion.div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-xs" layout transition={{ type: 'spring', stiffness: 700, damping: 30 }} initial={false} animate={{ x: settings.enableImagePreviews ? 20 : 0 }} /></div>
                    </label>
                    <p className="mt-1.5 text-xs text-[rgb(var(--color-on-surface-muted-rgb))]">
                        {t('settings.toggles.previews.description')}
                        <span className="block">{t('settings.toggles.previews.note')}</span>
                    </p>
                </div>

                <div className="rounded-xl border border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-rgb))] p-3">
                    <label className="flex cursor-pointer select-none items-center justify-between"><TooltipWrapper tipContent={t('settings.toggles.saveHistory.tooltip')}><span className="mr-3 text-sm font-medium text-[rgb(var(--color-on-surface-rgb))] flex items-center"><HistorySaveIcon /><span className="ml-2">{t('settings.toggles.saveHistory.label')}</span></span></TooltipWrapper>
                        <div className="relative"><input type="checkbox" className="peer sr-only" checked={settings.saveHistory} onChange={handleSaveHistoryChange} /><div className="block h-6 w-11 rounded-full bg-[rgb(var(--color-surface-border-rgb))] transition-colors duration-200 peer-checked:bg-[rgb(var(--color-primary-rgb))]"></div><motion.div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-xs" layout transition={{ type: 'spring', stiffness: 700, damping: 30 }} initial={false} animate={{ x: settings.saveHistory ? 20 : 0 }} /></div>
                    </label>
                    <p className="mt-1.5 text-xs text-[rgb(var(--color-on-surface-muted-rgb))]">{t('settings.toggles.saveHistory.description')}</p>
                </div>

                <div className="rounded-xl border border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-rgb))] p-3">
                    <label className="flex cursor-pointer select-none items-center justify-between"><TooltipWrapper tipContent={t('settings.toggles.unsupportedSites.tooltip')}><span className="mr-3 text-sm font-medium text-[rgb(var(--color-on-surface-rgb))] flex items-center"><UnsupportedSitesIcon /><span className="ml-2">{t('settings.toggles.unsupportedSites.label')}</span></span></TooltipWrapper>
                        <div className="relative"><input type="checkbox" className="peer sr-only" checked={settings.enableUnsupportedSites} onChange={handleUnsupportedSitesChange} /><div className="block h-6 w-11 rounded-full bg-[rgb(var(--color-surface-border-rgb))] transition-colors duration-200 peer-checked:bg-[rgb(var(--color-primary-rgb))]"></div><motion.div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-xs" layout transition={{ type: 'spring', stiffness: 700, damping: 30 }} initial={false} animate={{ x: settings.enableUnsupportedSites ? 20 : 0 }} /></div>
                    </label>
                    <p className="mt-1.5 text-xs text-[rgb(var(--color-on-surface-muted-rgb))]">{t('settings.toggles.unsupportedSites.description')}</p>
                </div>

                <div className="rounded-xl border border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-rgb))] p-3">
                    <label className="flex cursor-pointer select-none items-center justify-between"><span className="mr-3 text-sm font-medium text-[rgb(var(--color-on-surface-rgb))] flex items-center"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M12 22.5a10.5 10.5 0 1 0 0-21 10.5 10.5 0 0 0 0 21ZM7.06 6l10.88 10.88A8.999 8.999 0 0 1 7.06 6Zm9.88 12L6.06 7.12A8.999 8.999 0 0 1 16.94 18Z"/></svg><span className="ml-2">{t('settings.toggles.blacklist.label')}</span></span>
                        <div className="relative"><input type="checkbox" className="peer sr-only" checked={settings.enableBlacklist} onChange={handleBlacklistToggle} /><div className="block h-6 w-11 rounded-full bg-[rgb(var(--color-surface-border-rgb))] transition-colors duration-200 peer-checked:bg-[rgb(var(--color-primary-rgb))]"></div><motion.div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-xs" layout transition={{ type: 'spring', stiffness: 700, damping: 30 }} initial={false} animate={{ x: settings.enableBlacklist ? 20 : 0 }} /></div>
                    </label>
                    <p className="mt-1.5 text-xs text-[rgb(var(--color-on-surface-muted-rgb))]">{t('settings.toggles.blacklist.description')}</p>
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: settings.enableBlacklist ? 1 : 0, height: settings.enableBlacklist ? 'auto' : 0 }} className={`mt-2 space-y-2 overflow-hidden ${settings.enableBlacklist ? '' : 'pointer-events-none'}`}>
                        <textarea value={localBlacklist} onChange={handleBlacklistChange} rows={3} className="w-full appearance-none rounded-lg border border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-alt-2-rgb))] px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary-rgb))]" placeholder={t('settings.toggles.blacklist.placeholder')} aria-label={t('settings.toggles.blacklist.ariaLabel')} />
                        <div className="text-right"><button type="button" onClick={handleBlacklistReset} className="rounded-md bg-[rgb(var(--color-surface-border-rgb))] px-3 py-1.5 text-xs font-medium text-[rgb(var(--color-on-surface-muted-rgb))] transition hover:bg-gray-300 dark:hover:bg-gray-500 active:scale-95">{t('settings.toggles.blacklist.reset')}</button></div>
                    </motion.div>
                </div>

                <AnimatePresence>
                    {settings.saveHistory && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}>
                            <label htmlFor="maxHistorySizeSelect" className="mb-1.5 text-sm font-medium text-[rgb(var(--color-on-surface-rgb))] flex items-center"><HistorySizeIcon /><span className="ml-2">{t('settings.historySize.label')}</span></label>
                            <div className="relative">
                                        <select id="maxHistorySizeSelect" value={settings.maxHistorySize} onChange={handleMaxHistoryChange} className="w-full appearance-none rounded-md border border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-alt-2-rgb))] px-3 py-2 text-sm text-[rgb(var(--color-on-surface-rgb))] transition duration-200 focus:border-[rgb(var(--color-primary-rgb))] focus:outline-none focus:ring-1 focus:ring-[rgb(var(--color-primary-rgb))]" aria-label={t('settings.accessibility.historySizeSelect')}>
                                            {historySizeOptions.map(option => (<option key={option.value} value={option.value} className="bg-[rgb(var(--color-surface-rgb))] text-[rgb(var(--color-on-surface-rgb))]">{option.label}</option>))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[rgb(var(--color-on-surface-muted-rgb))]"><svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg></div>
                            </div>
                            <p className="mt-1.5 text-xs text-[rgb(var(--color-on-surface-muted-rgb))]">{t('settings.historySize.description')}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="space-y-3 border-t border-[rgb(var(--color-surface-border-rgb))] pt-4">
                    <label className="block text-sm font-medium text-[rgb(var(--color-on-surface-rgb))]">{t('settings.support.title')}</label>
                    <a href={REPORT_ISSUE_URL} target="_blank" rel="noopener noreferrer" className="inline-flex w-full items-center justify-center space-x-2 rounded-lg border border-[rgb(var(--color-surface-border-rgb))] px-4 py-2.5 text-sm font-medium text-[rgb(var(--color-on-surface-rgb))] transition-colors duration-200 hover:bg-[rgb(var(--color-surface-alt-2-rgb))]">
                        <BugAntIcon /><span>{t('settings.support.cta')}</span>
                    </a>
                    <p className="text-center text-xs text-[rgb(var(--color-on-surface-faint-rgb))]">{t('settings.support.description')}</p>
                </div>
            </div>
        </div>
    );
});

export default SettingsPanel;


