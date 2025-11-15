import React, { useCallback, useEffect, useMemo, useState, memo } from 'react';
import { AnimatedIcon } from './AnimatedIcon';
import { TooltipWrapper } from './TooltipWrapper';
import { SunIcon, MoonIcon, ComputerDesktopIcon, BugAntIcon, ServerIcon, CloudArrowDownIcon, PaletteIcon, AutomaticIcon, PreviewIcon, HistorySaveIcon, UnsupportedSitesIcon, HistorySizeIcon } from './icons/icons';
import type { Settings, ThemePreference, ColorTheme, FetchMode } from '../types/settings';
import { AnimatePresence, motion } from 'framer-motion';
import { LanguageSelector } from './LanguageSelector';
import { useTranslation } from '../../i18n/provider';
import type { LocaleCode } from '../../i18n/config';

const DEFAULT_CUSTOM_COLOR_HEX = '#3B82F6';
const REPORT_ISSUE_URL = 'https://github.com/IRedDragonICY/booruprompt/issues';
const DEFAULT_MAX_HISTORY_SIZE = 30;
const DEFAULT_BLACKLIST_KEYWORDS = 'english text, japanese text, chinese text, korean text, copyright, copyright name, character name, signature, watermark, logo, subtitle, subtitles, caption, captions, speech bubble, words, letters, text';

interface ClientProxyOption { id: string; label: string; value: string; }
const CLIENT_PROXY_OPTIONS: ClientProxyOption[] = [
    { id: 'allorigins', label: 'allorigins', value: 'https://api.allorigins.win/get?url=' },
    { id: 'thingproxy', label: 'thingproxy', value: 'https://thingproxy.freeboard.io/fetch/' },
    { id: 'codetabs', label: 'codetabs', value: 'https://api.codetabs.com/v1/proxy?quest=' },
];

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
    const { t, setLocale } = useTranslation();
    const [currentCustomHex, setCurrentCustomHex] = useState(settings.customColorHex || DEFAULT_CUSTOM_COLOR_HEX);
    const [localBlacklist, setLocalBlacklist] = useState<string>(settings.blacklistKeywords || DEFAULT_BLACKLIST_KEYWORDS);

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
    const handleBlacklistReset = useCallback(() => { setLocalBlacklist(DEFAULT_BLACKLIST_KEYWORDS); onSettingsChange({ blacklistKeywords: DEFAULT_BLACKLIST_KEYWORDS }); }, [onSettingsChange]);
    const handleMaxHistoryChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => { const value = parseInt(e.target.value, 10); onSettingsChange({ maxHistorySize: isNaN(value) ? DEFAULT_MAX_HISTORY_SIZE : value }); }, [onSettingsChange]);
    const handleLanguageChange = useCallback((locale: LocaleCode) => { setLocale(locale); onSettingsChange({ language: locale }); }, [setLocale, onSettingsChange]);

    const themeOptions = useMemo(() => [
        { value: 'system' as ThemePreference, label: t('settings.appearance.system'), icon: <ComputerDesktopIcon />, animation: 'gentle' as const },
        { value: 'light' as ThemePreference, label: t('settings.appearance.light'), icon: <SunIcon />, animation: 'spin' as const },
        { value: 'dark' as ThemePreference, label: t('settings.appearance.dark'), icon: <MoonIcon />, animation: 'default' as const },
    ], [t]);
    const colorThemeOptions = useMemo(() => [
        { value: 'blue' as ColorTheme, label: t('settings.colorTheme.blue'), colorClass: 'bg-[#3B82F6] dark:bg-[#60A5FA]' },
        { value: 'orange' as ColorTheme, label: t('settings.colorTheme.orange'), colorClass: 'bg-[#F97316] dark:bg-[#FB923C]' },
        { value: 'teal' as ColorTheme, label: t('settings.colorTheme.teal'), colorClass: 'bg-[#0D9488] dark:bg-[#2DD4BF]' },
        { value: 'rose' as ColorTheme, label: t('settings.colorTheme.rose'), colorClass: 'bg-[#E11D48] dark:bg-[#FB7185]' },
        { value: 'purple' as ColorTheme, label: t('settings.colorTheme.purple'), colorClass: 'bg-[#8B5CF6] dark:bg-[#A78BFA]' },
        { value: 'green' as ColorTheme, label: t('settings.colorTheme.green'), colorClass: 'bg-[#16A34A] dark:bg-[#4ADE80]' },
    ], [t]);
    const fetchModeOptions = useMemo(() => [
        { value: 'server' as FetchMode, label: t('settings.fetchMethod.serverProxy'), icon: <ServerIcon />, description: t('settings.fetchMethod.serverProxyDesc') },
        { value: 'clientProxy' as FetchMode, label: t('settings.fetchMethod.clientProxy'), icon: <CloudArrowDownIcon />, description: t('settings.fetchMethod.clientProxyDesc') },
    ], [t]);
    const historySizeOptions = useMemo(() => [
        { label: t('settings.historySize.entries10'), value: 10 },
        { label: t('settings.historySize.entries30'), value: 30 },
        { label: t('settings.historySize.entries50'), value: 50 },
        { label: t('settings.historySize.entries100'), value: 100 },
        { label: t('settings.historySize.unlimited'), value: -1 },
    ], [t]);
    const isValidHex = useMemo(() => /^#[0-9a-fA-F]{6}$/.test(currentCustomHex), [currentCustomHex]);

    return (
        <div className="flex flex-col flex-1 overflow-hidden">
            <div className="sticky top-0 z-10 shrink-0 border-b border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-alt-rgb))] px-6 py-5">
                <h1 className="text-xl font-semibold">{t('settings.title')}</h1>
            </div>
            <div className="flex-grow overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[rgb(var(--color-surface-border-rgb))]">
                <div>
                    <label className="mb-2 flex items-center text-sm font-medium text-[rgb(var(--color-on-surface-rgb))]"><span className="mr-2"><PaletteIcon /></span><span>{t('settings.appearance.title')}</span></label>
                    <div className="flex items-center space-x-2 rounded-xl bg-[rgb(var(--color-surface-alt-2-rgb))] p-1">
                        {themeOptions.map(({ value, label, icon, animation }) => (
                            <label key={value} className={`flex flex-1 cursor-pointer items-center justify-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${settings.theme === value ? 'bg-[rgb(var(--color-surface-rgb))] text-[rgb(var(--color-primary-rgb))] shadow-sm ring-1 ring-[rgb(var(--color-primary-rgb))]/30' : 'text-[rgb(var(--color-on-surface-muted-rgb))] hover:bg-[rgb(var(--color-surface-border-rgb))]'}`}>
                                <input type="radio" name="theme" value={value} checked={settings.theme === value} onChange={handleThemeChange} className="sr-only" aria-label={t('accessibility.themeLabel', { label })} />
                                <AnimatedIcon isActive={settings.theme === value} animation={animation}>{icon}</AnimatedIcon>
                                <span>{label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="mb-2 flex items-center text-sm font-medium text-[rgb(var(--color-on-surface-rgb))]"><span className="mr-2"><PaletteIcon /></span><span>{t('settings.colorTheme.title')}</span></label>
                    <div className="grid grid-cols-3 gap-2 rounded-xl bg-[rgb(var(--color-surface-alt-2-rgb))] p-2">
                        {colorThemeOptions.map(({ value, label, colorClass }) => (
                            <TooltipWrapper key={value} tipContent={label}>
                                <label className={`relative flex cursor-pointer items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition-all hover:scale-[1.02] ${settings.colorTheme === value ? 'bg-[rgb(var(--color-surface-rgb))] shadow-sm ring-2 ring-[rgb(var(--color-primary-rgb))] ring-offset-1 ring-offset-[rgb(var(--color-surface-alt-2-rgb))]' : 'hover:bg-[rgb(var(--color-surface-border-rgb))]'}`}>
                                    <input type="radio" name="colorTheme" value={value} checked={settings.colorTheme === value} onChange={handleColorThemeRadioChange} className="sr-only" aria-label={t('accessibility.colorThemeLabel', { label })} />
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
                        <TooltipWrapper tipContent={t('settings.colorTheme.customColor')}>
                            <label className={`relative flex cursor-pointer items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium transition-all hover:scale-[1.02] ${settings.colorTheme === 'custom' ? 'bg-[rgb(var(--color-surface-rgb))] shadow-sm ring-2 ring-[rgb(var(--color-primary-rgb))] ring-offset-1 ring-offset-[rgb(var(--color-surface-alt-2-rgb))]' : 'hover:bg-[rgb(var(--color-surface-border-rgb))]'}`}>
                                <input type="radio" name="colorTheme" value="custom" checked={settings.colorTheme === 'custom'} onChange={handleColorThemeRadioChange} className="sr-only" aria-label={t('accessibility.colorThemeLabel', { label: t('settings.colorTheme.custom') })} />
                                <span className="block h-5 w-5 rounded-full border border-gray-400 dark:border-gray-600" style={{ backgroundColor: isValidHex ? currentCustomHex : '#ffffff' }}></span>
                                <AnimatePresence>
                                    {settings.colorTheme === 'custom' && (
                                        <motion.div className="absolute inset-0 flex items-center justify-center" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} transition={{ duration: 0.15 }}>
                                            <svg className="h-3 w-3 text-[rgb(var(--color-primary-content-rgb))] dark:text-gray-900" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                <span className="sr-only">{t('settings.colorTheme.custom')}</span>
                            </label>
                        </TooltipWrapper>
                    </div>
                    {settings.colorTheme === 'custom' && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-3 flex items-center space-x-3 rounded-lg bg-[rgb(var(--color-surface-alt-2-rgb))] p-3">
                            <input type="color" value={isValidHex ? currentCustomHex : '#ffffff'} onChange={handleCustomColorInputChange} className="h-8 w-8 cursor-pointer appearance-none rounded-sm border border-[rgb(var(--color-surface-border-rgb))] bg-transparent p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-sm [&::-webkit-color-swatch]:border-none" aria-label={t('accessibility.customColorPicker')} />
                            <input type="text" value={currentCustomHex} onChange={handleCustomColorTextChange} maxLength={7} className="flex-1 appearance-none rounded-md border border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-rgb))] px-2 py-1 font-mono text-sm text-[rgb(var(--color-on-surface-rgb))] placeholder:text-[rgb(var(--color-on-surface-faint-rgb))] transition duration-200 focus:border-transparent focus:outline-hidden focus:ring-1 focus:ring-[rgb(var(--color-primary-rgb))]" placeholder={t('inputs.hexColorPlaceholder')} aria-label={t('accessibility.customColorHex')} pattern="^#?([a-fA-F0-9]{6})$" />
                        </motion.div>
                    )}
                </div>

                <div>
                    <label className="mb-2 flex items-center text-sm font-medium text-[rgb(var(--color-on-surface-rgb))]">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 mr-2">
                            <path d="M21.721 12.752a9.711 9.711 0 00-.945-5.003 12.754 12.754 0 01-4.339 2.708 18.991 18.991 0 01-.214 4.772 17.165 17.165 0 005.498-2.477zM14.634 15.55a17.324 17.324 0 00.332-4.647c-.952.227-1.945.347-2.966.347-1.021 0-2.014-.12-2.966-.347a17.515 17.515 0 00.332 4.647 17.385 17.385 0 005.268 0zM9.772 17.119a18.963 18.963 0 004.456 0A17.182 17.182 0 0112 21.724a17.18 17.18 0 01-2.228-4.605zM7.777 15.23a18.87 18.87 0 01-.214-4.774 12.753 12.753 0 01-4.34-2.708 9.711 9.711 0 00-.944 5.004 17.165 17.165 0 005.498 2.477zM21.356 14.752a9.765 9.765 0 01-7.478 6.817 18.64 18.64 0 001.988-4.718 18.627 18.627 0 005.49-2.098zM2.644 14.752c1.682.971 3.53 1.688 5.49 2.099a18.64 18.64 0 001.988 4.718 9.765 9.765 0 01-7.478-6.816zM13.878 2.43a9.755 9.755 0 016.116 3.986 11.267 11.267 0 01-3.746 2.504 18.63 18.63 0 00-2.37-6.49zM12 2.276a17.152 17.152 0 012.805 7.121c-.897.23-1.837.353-2.805.353-.968 0-1.908-.122-2.805-.353A17.151 17.151 0 0112 2.276zM10.122 2.43a18.629 18.629 0 00-2.37 6.49 11.266 11.266 0 01-3.746-2.504 9.754 9.754 0 016.116-3.985z" />
                        </svg>
                        <span>{t('settings.language.title')}</span>
                    </label>
                    <p className="mb-3 text-xs text-[rgb(var(--color-on-surface-muted-rgb))]">
                        {t('settings.language.description')}
                    </p>
                    <LanguageSelector
                        currentLanguage={settings.language}
                        onLanguageChange={handleLanguageChange}
                    />
                </div>

                <div>
                    <label className="mb-2 flex items-center text-sm font-medium text-[rgb(var(--color-on-surface-rgb))]"><span>{t('settings.fetchMethod.title')}</span></label>
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
                                        <label htmlFor="clientProxySelect" className="mb-1 block text-xs font-medium text-[rgb(var(--color-on-surface-muted-rgb))]">{t('settings.fetchMethod.selectProxyService')}</label>
                                        <select id="clientProxySelect" value={settings.clientProxyUrl} onChange={handleClientProxyChange} className="w-full appearance-none rounded-md border border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-rgb))] px-3 py-1.5 text-sm text-[rgb(var(--color-on-surface-rgb))] transition duration-200 focus:border-[rgb(var(--color-primary-rgb))] focus:outline-none focus:ring-1 focus:ring-[rgb(var(--color-primary-rgb))]" aria-label={t('accessibility.clientProxySelector')}>
                                            {CLIENT_PROXY_OPTIONS.map(option => (<option key={option.id} value={option.value} className="bg-[rgb(var(--color-surface-rgb))] text-[rgb(var(--color-on-surface-rgb))]">{t(`settings.fetchMethod.${option.label}`)}</option>))}
                                        </select>
                                        <p className="mt-1 text-[10px] text-[rgb(var(--color-on-surface-faint-rgb))]">{t('settings.fetchMethod.proxyPerformanceNote')}</p>
                                    </motion.div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-xl border border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-rgb))] p-3">
                    <label className="flex cursor-pointer select-none items-center justify-between">
                        <TooltipWrapper tipContent={t('settings.features.autoExtractTooltip')}><span className="mr-3 text-sm font-medium text-[rgb(var(--color-on-surface-rgb))] flex items-center"><AutomaticIcon /><span className="ml-2">{t('settings.features.autoExtract')}</span></span></TooltipWrapper>
                        <div className="relative">
                            <input type="checkbox" className="peer sr-only" checked={settings.autoExtract} onChange={handleAutoExtractChange} />
                            <div className="block h-6 w-11 rounded-full bg-[rgb(var(--color-surface-border-rgb))] transition-colors duration-200 peer-checked:bg-[rgb(var(--color-primary-rgb))]"></div>
                            <motion.div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-xs" layout transition={{ type: 'spring', stiffness: 700, damping: 30 }} initial={false} animate={{ x: settings.autoExtract ? 20 : 0 }} />
                        </div>
                    </label>
                    <p className="mt-1.5 text-xs text-[rgb(var(--color-on-surface-muted-rgb))]">{t('settings.features.autoExtractDesc')}</p>
                </div>

                <div className="rounded-xl border border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-rgb))] p-3">
                    <label className="flex cursor-pointer select-none items-center justify-between"><TooltipWrapper tipContent={t('settings.features.enablePreviewsTooltip')}><span className="mr-3 text-sm font-medium text-[rgb(var(--color-on-surface-rgb))] flex items-center"><PreviewIcon /><span className="ml-2">{t('settings.features.enablePreviews')}</span></span></TooltipWrapper>
                        <div className="relative"><input type="checkbox" className="peer sr-only" checked={settings.enableImagePreviews} onChange={handleImagePreviewsChange} /><div className="block h-6 w-11 rounded-full bg-[rgb(var(--color-surface-border-rgb))] transition-colors duration-200 peer-checked:bg-[rgb(var(--color-primary-rgb))]"></div><motion.div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-xs" layout transition={{ type: 'spring', stiffness: 700, damping: 30 }} initial={false} animate={{ x: settings.enableImagePreviews ? 20 : 0 }} /></div>
                    </label>
                    <p className="mt-1.5 text-xs text-[rgb(var(--color-on-surface-muted-rgb))]">{t('settings.features.enablePreviewsDesc')}</p>
                </div>

                <div className="rounded-xl border border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-rgb))] p-3">
                    <label className="flex cursor-pointer select-none items-center justify-between"><TooltipWrapper tipContent={t('settings.features.saveHistoryTooltip')}><span className="mr-3 text-sm font-medium text-[rgb(var(--color-on-surface-rgb))] flex items-center"><HistorySaveIcon /><span className="ml-2">{t('settings.features.saveHistory')}</span></span></TooltipWrapper>
                        <div className="relative"><input type="checkbox" className="peer sr-only" checked={settings.saveHistory} onChange={handleSaveHistoryChange} /><div className="block h-6 w-11 rounded-full bg-[rgb(var(--color-surface-border-rgb))] transition-colors duration-200 peer-checked:bg-[rgb(var(--color-primary-rgb))]"></div><motion.div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-xs" layout transition={{ type: 'spring', stiffness: 700, damping: 30 }} initial={false} animate={{ x: settings.saveHistory ? 20 : 0 }} /></div>
                    </label>
                    <p className="mt-1.5 text-xs text-[rgb(var(--color-on-surface-muted-rgb))]">{t('settings.features.saveHistoryDesc')}</p>
                </div>

                <div className="rounded-xl border border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-rgb))] p-3">
                    <label className="flex cursor-pointer select-none items-center justify-between"><TooltipWrapper tipContent={t('settings.features.unsupportedSitesTooltip')}><span className="mr-3 text-sm font-medium text-[rgb(var(--color-on-surface-rgb))] flex items-center"><UnsupportedSitesIcon /><span className="ml-2">{t('settings.features.unsupportedSites')}</span></span></TooltipWrapper>
                        <div className="relative"><input type="checkbox" className="peer sr-only" checked={settings.enableUnsupportedSites} onChange={handleUnsupportedSitesChange} /><div className="block h-6 w-11 rounded-full bg-[rgb(var(--color-surface-border-rgb))] transition-colors duration-200 peer-checked:bg-[rgb(var(--color-primary-rgb))]"></div><motion.div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-xs" layout transition={{ type: 'spring', stiffness: 700, damping: 30 }} initial={false} animate={{ x: settings.enableUnsupportedSites ? 20 : 0 }} /></div>
                    </label>
                    <p className="mt-1.5 text-xs text-[rgb(var(--color-on-surface-muted-rgb))]">{t('settings.features.unsupportedSitesDesc')}</p>
                </div>

                <div className="rounded-xl border border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-rgb))] p-3">
                    <label className="flex cursor-pointer select-none items-center justify-between"><span className="mr-3 text-sm font-medium text-[rgb(var(--color-on-surface-rgb))] flex items-center"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M12 22.5a10.5 10.5 0 1 0 0-21 10.5 10.5 0 0 0 0 21ZM7.06 6l10.88 10.88A8.999 8.999 0 0 1 7.06 6Zm9.88 12L6.06 7.12A8.999 8.999 0 0 1 16.94 18Z"/></svg><span className="ml-2">{t('settings.features.keywordBlacklist')}</span></span>
                        <div className="relative"><input type="checkbox" className="peer sr-only" checked={settings.enableBlacklist} onChange={handleBlacklistToggle} /><div className="block h-6 w-11 rounded-full bg-[rgb(var(--color-surface-border-rgb))] transition-colors duration-200 peer-checked:bg-[rgb(var(--color-primary-rgb))]"></div><motion.div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-xs" layout transition={{ type: 'spring', stiffness: 700, damping: 30 }} initial={false} animate={{ x: settings.enableBlacklist ? 20 : 0 }} /></div>
                    </label>
                    <p className="mt-1.5 text-xs text-[rgb(var(--color-on-surface-muted-rgb))]">{t('settings.features.keywordBlacklistDesc')}</p>
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: settings.enableBlacklist ? 1 : 0, height: settings.enableBlacklist ? 'auto' : 0 }} className={`mt-2 space-y-2 overflow-hidden ${settings.enableBlacklist ? '' : 'pointer-events-none'}`}>
                        <textarea value={localBlacklist} onChange={handleBlacklistChange} rows={3} className="w-full appearance-none rounded-lg border border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-alt-2-rgb))] px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary-rgb))]" placeholder={DEFAULT_BLACKLIST_KEYWORDS} aria-label={t('accessibility.blacklistKeywords')} />
                        <div className="text-right"><button type="button" onClick={handleBlacklistReset} className="rounded-md bg-[rgb(var(--color-surface-border-rgb))] px-3 py-1.5 text-xs font-medium text-[rgb(var(--color-on-surface-muted-rgb))] transition hover:bg-gray-300 dark:hover:bg-gray-500 active:scale-95">{t('buttons.resetToDefault')}</button></div>
                    </motion.div>
                </div>

                <AnimatePresence>
                    {settings.saveHistory && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}>
                            <label htmlFor="maxHistorySizeSelect" className="mb-1.5 text-sm font-medium text-[rgb(var(--color-on-surface-rgb))] flex items-center"><HistorySizeIcon /><span className="ml-2">{t('settings.historySize.title')}</span></label>
                            <div className="relative">
                                <select id="maxHistorySizeSelect" value={settings.maxHistorySize} onChange={handleMaxHistoryChange} className="w-full appearance-none rounded-md border border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-alt-2-rgb))] px-3 py-2 text-sm text-[rgb(var(--color-on-surface-rgb))] transition duration-200 focus:border-[rgb(var(--color-primary-rgb))] focus:outline-none focus:ring-1 focus:ring-[rgb(var(--color-primary-rgb))]" aria-label={t('accessibility.maxHistorySize')}>
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
                        <BugAntIcon /><span>{t('buttons.reportIssue')}</span>
                    </a>
                    <p className="text-center text-xs text-[rgb(var(--color-on-surface-faint-rgb))]">{t('settings.support.description')}</p>
                </div>
            </div>
        </div>
    );
});

export default SettingsPanel;


