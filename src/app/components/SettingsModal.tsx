import { AnimatePresence, motion } from 'framer-motion';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { SunIcon, MoonIcon, ComputerDesktopIcon, XMarkIcon, BugAntIcon, ServerIcon, CloudArrowDownIcon } from './icons/icons';
import { TooltipWrapper } from './TooltipWrapper';
import { AnimatedIcon } from './AnimatedIcon';

type ThemePreference = 'system' | 'light' | 'dark';
type ColorTheme = 'blue' | 'orange' | 'teal' | 'rose' | 'purple' | 'green' | 'custom';
type FetchMode = 'server' | 'clientProxy';

interface ClientProxyOption {
    id: string;
    label: string;
    value: string;
}

interface Settings {
    theme: ThemePreference;
    autoExtract: boolean;
    colorTheme: ColorTheme;
    customColorHex?: string;
    enableImagePreviews: boolean;
    fetchMode: FetchMode;
    clientProxyUrl: string;
    saveHistory: boolean;
}

const DEFAULT_CUSTOM_COLOR_HEX = '#3B82F6';
const REPORT_ISSUE_URL = 'https://github.com/IRedDragonICY/booruprompt/issues';

const CLIENT_PROXY_OPTIONS: ClientProxyOption[] = [
    { id: 'allorigins', label: 'AllOrigins', value: 'https://api.allorigins.win/get?url=' },
    { id: 'thingproxy', label: 'ThingProxy', value: 'https://thingproxy.freeboard.io/fetch/' },
    { id: 'codetabs', label: 'CodeTabs', value: 'https://api.codetabs.com/v1/proxy?quest=' },
];

interface SettingsModalProps { isOpen: boolean; onClose: () => void; settings: Settings; onSettingsChange: (newSettings: Partial<Settings>) => void; }
export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onSettingsChange }) => {
    const [currentCustomHex, setCurrentCustomHex] = useState(settings.customColorHex || DEFAULT_CUSTOM_COLOR_HEX);

    useEffect(() => {
        setCurrentCustomHex(settings.customColorHex || DEFAULT_CUSTOM_COLOR_HEX);
    }, [settings.customColorHex]);

    const handleThemeChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => onSettingsChange({ theme: event.target.value as ThemePreference }), [onSettingsChange]);

    const handleColorThemeRadioChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value as ColorTheme;
        if (value === 'custom') {
            const validHex = /^#[0-9a-fA-F]{6}$/.test(currentCustomHex) ? currentCustomHex : DEFAULT_CUSTOM_COLOR_HEX;
            onSettingsChange({ colorTheme: 'custom', customColorHex: validHex });
            setCurrentCustomHex(validHex);
        } else {
            onSettingsChange({ colorTheme: value });
        }
    }, [onSettingsChange, currentCustomHex]);

    const handleCustomColorInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const newHex = event.target.value;
        setCurrentCustomHex(newHex);
        onSettingsChange({ colorTheme: 'custom', customColorHex: newHex });
    }, [onSettingsChange]);

    const handleCustomColorTextChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const newHex = event.target.value;
        const cleanHex = newHex.startsWith('#') ? newHex : `#${newHex}`;
        setCurrentCustomHex(cleanHex);
        if (/^#?[0-9a-fA-F]{6}$/.test(cleanHex)) {
            const finalHex = cleanHex.startsWith('#') ? cleanHex : '#' + cleanHex;
            if(finalHex.length === 7){
                onSettingsChange({ colorTheme: 'custom', customColorHex: finalHex });
            }
        }
    }, [onSettingsChange]);

    const handleAutoExtractChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => onSettingsChange({ autoExtract: event.target.checked }), [onSettingsChange]);
    const handleImagePreviewsChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => onSettingsChange({ enableImagePreviews: event.target.checked }), [onSettingsChange]);
    const handleFetchModeChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => onSettingsChange({ fetchMode: event.target.value as FetchMode }), [onSettingsChange]);
    const handleClientProxyChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => onSettingsChange({ clientProxyUrl: event.target.value }), [onSettingsChange]);
    const handleSaveHistoryChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => onSettingsChange({ saveHistory: event.target.checked }), [onSettingsChange]);

    const themeOptions = useMemo(() => [
        { value: 'system' as ThemePreference, label: 'System', icon: <ComputerDesktopIcon />, animation: "gentle" as const },
        { value: 'light' as ThemePreference, label: 'Light', icon: <SunIcon />, animation: "spin" as const },
        { value: 'dark' as ThemePreference, label: 'Dark', icon: <MoonIcon />, animation: "default" as const },
    ], []);

    const colorThemeOptions = useMemo(() => [
        { value: 'blue' as ColorTheme, label: 'Blue', colorClass: 'bg-[#3B82F6] dark:bg-[#60A5FA]' },
        { value: 'orange' as ColorTheme, label: 'Orange', colorClass: 'bg-[#F97316] dark:bg-[#FB923C]' },
        { value: 'teal' as ColorTheme, label: 'Teal', colorClass: 'bg-[#0D9488] dark:bg-[#2DD4BF]' },
        { value: 'rose' as ColorTheme, label: 'Rose', colorClass: 'bg-[#E11D48] dark:bg-[#FB7185]' },
        { value: 'purple' as ColorTheme, label: 'Purple', colorClass: 'bg-[#8B5CF6] dark:bg-[#A78BFA]' },
        { value: 'green' as ColorTheme, label: 'Green', colorClass: 'bg-[#16A34A] dark:bg-[#4ADE80]' },
    ], []);

    const fetchModeOptions = useMemo(() => [
        { value: 'server' as FetchMode, label: 'Server Proxy', icon: <ServerIcon />, description: 'Uses this application\'s server to fetch data. Recommended, more reliable.' },
        { value: 'clientProxy' as FetchMode, label: 'Client-Side Proxy', icon: <CloudArrowDownIcon />, description: 'Uses a public CORS proxy in your browser. May be less reliable or rate-limited.' },
    ], []);

    const isValidHex = useMemo(() => /^#[0-9a-fA-F]{6}$/.test(currentCustomHex), [currentCustomHex]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="settings-title">
                    <motion.div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-xl bg-[rgb(var(--color-surface-alt-rgb))] p-6 shadow-xl scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[rgb(var(--color-surface-border-rgb))]" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} transition={{ type: "spring", damping: 15, stiffness: 150 }} onClick={(e) => e.stopPropagation()}>
                        <div className="mb-6 flex items-center justify-between border-b border-[rgb(var(--color-surface-border-rgb))] pb-4">
                            <h2 id="settings-title" className="text-xl font-semibold text-[rgb(var(--color-on-surface-rgb))]">Settings</h2>
                            <TooltipWrapper tipContent="Close Settings">
                                <motion.button whileTap={{ scale: 0.9 }} whileHover={{ rotate: 90, scale: 1.1 }} onClick={onClose} className="-mr-2 rounded-full p-1 text-[rgb(var(--color-on-surface-muted-rgb))] transition-colors hover:text-[rgb(var(--color-on-surface-rgb))] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[rgb(var(--color-primary-rgb))] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--color-surface-alt-rgb))]" aria-label="Close Settings">
                                    <XMarkIcon className="h-6 w-6" />
                                </motion.button>
                            </TooltipWrapper>
                        </div>
                        <div className="space-y-6">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-[rgb(var(--color-on-surface-rgb))]">Appearance</label>
                                <div className="flex items-center space-x-2 rounded-lg bg-[rgb(var(--color-surface-alt-2-rgb))] p-1">
                                    {themeOptions.map(({ value, label, icon, animation }) => (
                                        <label key={value} className={`flex flex-1 cursor-pointer items-center justify-center space-x-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${settings.theme === value ? 'bg-[rgb(var(--color-surface-rgb))] text-[rgb(var(--color-primary-rgb))] shadow-sm' : 'text-[rgb(var(--color-on-surface-muted-rgb))] hover:bg-[rgb(var(--color-surface-border-rgb))]'}`}>
                                            <input type="radio" name="theme" value={value} checked={settings.theme === value} onChange={handleThemeChange} className="sr-only" aria-label={`Theme ${label}`} />
                                            <AnimatedIcon isActive={settings.theme === value} animation={animation}>
                                                {icon}
                                            </AnimatedIcon>
                                            <span>{label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-[rgb(var(--color-on-surface-rgb))]">Color Theme</label>
                                <div className="grid grid-cols-3 gap-2 rounded-lg bg-[rgb(var(--color-surface-alt-2-rgb))] p-1">
                                    {colorThemeOptions.map(({ value, label, colorClass }) => (
                                        <TooltipWrapper key={value} tipContent={label}>
                                            <motion.label whileHover={{ scale: 1.05 }} className={`relative flex cursor-pointer items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium transition-all ${settings.colorTheme === value ? 'bg-[rgb(var(--color-surface-rgb))] shadow-sm ring-2 ring-[rgb(var(--color-primary-rgb))] ring-offset-1 ring-offset-[rgb(var(--color-surface-alt-2-rgb))]' : 'hover:bg-[rgb(var(--color-surface-border-rgb))]'}`}>
                                                <input type="radio" name="colorTheme" value={value} checked={settings.colorTheme === value} onChange={handleColorThemeRadioChange} className="sr-only" aria-label={`Color Theme ${label}`} />
                                                <span className={`block h-5 w-5 rounded-full ${colorClass}`}></span>
                                                <AnimatePresence>
                                                    {settings.colorTheme === value && (
                                                        <motion.div className="absolute inset-0 flex items-center justify-center" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: 'spring', stiffness: 500, damping: 20 }} >
                                                            <svg className="h-3 w-3 text-[rgb(var(--color-primary-content-rgb))] dark:text-gray-900" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                                <span className="sr-only">{label}</span>
                                            </motion.label>
                                        </TooltipWrapper>
                                    ))}
                                    <TooltipWrapper tipContent="Custom Color">
                                        <motion.label whileHover={{ scale: 1.05 }} className={`relative flex cursor-pointer items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium transition-all ${settings.colorTheme === 'custom' ? 'bg-[rgb(var(--color-surface-rgb))] shadow-sm ring-2 ring-[rgb(var(--color-primary-rgb))] ring-offset-1 ring-offset-[rgb(var(--color-surface-alt-2-rgb))]' : 'hover:bg-[rgb(var(--color-surface-border-rgb))]'}`}>
                                            <input type="radio" name="colorTheme" value="custom" checked={settings.colorTheme === 'custom'} onChange={handleColorThemeRadioChange} className="sr-only" aria-label="Custom Color Theme" />
                                            <span className="block h-5 w-5 rounded-full border border-gray-400 dark:border-gray-600" style={{ backgroundColor: isValidHex ? currentCustomHex : '#ffffff' }}></span>
                                            <AnimatePresence>
                                                {settings.colorTheme === 'custom' && (
                                                    <motion.div className="absolute inset-0 flex items-center justify-center" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: 'spring', stiffness: 500, damping: 20 }} >
                                                        <svg className="h-3 w-3 text-[rgb(var(--color-primary-content-rgb))] dark:text-gray-900" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                            <span className="sr-only">Custom</span>
                                        </motion.label>
                                    </TooltipWrapper>
                                </div>
                                {settings.colorTheme === 'custom' && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mt-3 flex items-center space-x-3 rounded-lg bg-[rgb(var(--color-surface-alt-2-rgb))] p-3"
                                    >
                                        <input
                                            type="color"
                                            value={isValidHex ? currentCustomHex : '#ffffff'}
                                            onChange={handleCustomColorInputChange}
                                            className="h-8 w-8 cursor-pointer appearance-none rounded-sm border border-[rgb(var(--color-surface-border-rgb))] bg-transparent p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-sm [&::-webkit-color-swatch]:border-none"
                                            aria-label="Custom color picker"
                                        />
                                        <input
                                            type="text"
                                            value={currentCustomHex}
                                            onChange={handleCustomColorTextChange}
                                            maxLength={7}
                                            className="flex-1 appearance-none rounded-md border border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-rgb))] px-2 py-1 font-mono text-sm text-[rgb(var(--color-on-surface-rgb))] placeholder:text-[rgb(var(--color-on-surface-faint-rgb))] transition duration-200 focus:border-transparent focus:outline-hidden focus:ring-1 focus:ring-[rgb(var(--color-primary-rgb))]"
                                            placeholder="#rrggbb"
                                            aria-label="Custom color hex code"
                                            pattern="^#?([a-fA-F0-9]{6})$"
                                        />
                                    </motion.div>
                                )}
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-[rgb(var(--color-on-surface-rgb))]">Data Fetching Method</label>
                                <div className="space-y-2 rounded-lg bg-[rgb(var(--color-surface-alt-2-rgb))] p-2">
                                    {fetchModeOptions.map(({ value, label, icon, description }) => (
                                        <div key={value}>
                                            <label className={`flex cursor-pointer items-start rounded-md p-3 transition-all ${settings.fetchMode === value ? 'bg-[rgb(var(--color-surface-rgb))] shadow-sm ring-1 ring-[rgb(var(--color-primary-rgb))]/50' : 'hover:bg-[rgb(var(--color-surface-border-rgb))]'}`}>
                                                <input type="radio" name="fetchMode" value={value} checked={settings.fetchMode === value} onChange={handleFetchModeChange} className="peer sr-only" aria-label={label} />
                                                <div className={`mr-3 mt-0.5 h-5 w-5 shrink-0 ${settings.fetchMode === value ? 'text-[rgb(var(--color-primary-rgb))]' : 'text-[rgb(var(--color-on-surface-muted-rgb))]'}`}>
                                                    {icon}
                                                </div>
                                                <div className="flex-1">
                                                    <span className={`block text-sm font-medium ${settings.fetchMode === value ? 'text-[rgb(var(--color-on-surface-rgb))]' : 'text-[rgb(var(--color-on-surface-muted-rgb))]'}`}>{label}</span>
                                                    <span className="mt-0.5 block text-xs text-[rgb(var(--color-on-surface-faint-rgb))]">{description}</span>
                                                </div>
                                                <div className="ml-3 mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-rgb))] transition-colors peer-checked:border-[rgb(var(--color-primary-rgb))] peer-checked:bg-[rgb(var(--color-primary-rgb))]">
                                                    <AnimatePresence>
                                                        {settings.fetchMode === value && (
                                                            <motion.div
                                                                initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                                                                className="h-2 w-2 rounded-full bg-[rgb(var(--color-primary-content-rgb))]"
                                                            />
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            </label>
                                            {value === 'clientProxy' && settings.fetchMode === 'clientProxy' && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                                    animate={{ opacity: 1, height: 'auto', marginTop: '0.5rem' }}
                                                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="pl-12 pr-3"
                                                >
                                                    <label htmlFor="clientProxySelect" className="mb-1 block text-xs font-medium text-[rgb(var(--color-on-surface-muted-rgb))]">Select Client Proxy Service:</label>
                                                    <select
                                                        id="clientProxySelect"
                                                        value={settings.clientProxyUrl}
                                                        onChange={handleClientProxyChange}
                                                        className="w-full appearance-none rounded-md border border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-rgb))] px-3 py-1.5 text-sm text-[rgb(var(--color-on-surface-rgb))] transition duration-200 focus:border-[rgb(var(--color-primary-rgb))] focus:outline-none focus:ring-1 focus:ring-[rgb(var(--color-primary-rgb))]"
                                                        aria-label="Client Proxy Service Selector"
                                                    >
                                                        {CLIENT_PROXY_OPTIONS.map(option => (
                                                            <option key={option.id} value={option.value} className="bg-[rgb(var(--color-surface-rgb))] text-[rgb(var(--color-on-surface-rgb))]">
                                                                {option.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <p className="mt-1 text-[10px] text-[rgb(var(--color-on-surface-faint-rgb))]">Performance and reliability vary between proxies.</p>
                                                </motion.div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                             <div>
                                <label className="flex cursor-pointer select-none items-center justify-between">
                                    <TooltipWrapper tipContent="Enable or disable automatic tag extraction upon pasting/typing a valid URL">
                                        <span className="mr-3 text-sm font-medium text-[rgb(var(--color-on-surface-rgb))]">Automatic Extraction</span>
                                    </TooltipWrapper>
                                    <div className="relative">
                                        <input type="checkbox" id="autoExtractToggle" className="peer sr-only" checked={settings.autoExtract} onChange={handleAutoExtractChange} />
                                        <div className="block h-6 w-11 rounded-full bg-[rgb(var(--color-surface-border-rgb))] transition-colors duration-200 peer-checked:bg-[rgb(var(--color-primary-rgb))] peer-focus:ring-2 peer-focus:ring-[rgb(var(--color-primary-rgb))] peer-focus:ring-offset-2 peer-focus:ring-offset-[rgb(var(--color-surface-alt-rgb))]"></div>
                                        <motion.div
                                            className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-xs"
                                            layout
                                            transition={{ type: "spring", stiffness: 700, damping: 30 }}
                                            initial={false}
                                            animate={{ x: settings.autoExtract ? 20 : 0 }}
                                        ></motion.div>
                                    </div>
                                </label>
                                <p className="mt-1.5 text-xs text-[rgb(var(--color-on-surface-muted-rgb))]">Extract tags automatically after pasting/typing a valid URL.</p>
                            </div>
                            <div>
                                <label className="flex cursor-pointer select-none items-center justify-between">
                                    <TooltipWrapper tipContent="Enable or disable image/video previews to save bandwidth or avoid potential issues">
                                        <span className="mr-3 text-sm font-medium text-[rgb(var(--color-on-surface-rgb))]">Enable Previews</span>
                                    </TooltipWrapper>
                                    <div className="relative">
                                        <input type="checkbox" id="imagePreviewsToggle" className="peer sr-only" checked={settings.enableImagePreviews} onChange={handleImagePreviewsChange} />
                                        <div className="block h-6 w-11 rounded-full bg-[rgb(var(--color-surface-border-rgb))] transition-colors duration-200 peer-checked:bg-[rgb(var(--color-primary-rgb))] peer-focus:ring-2 peer-focus:ring-[rgb(var(--color-primary-rgb))] peer-focus:ring-offset-2 peer-focus:ring-offset-[rgb(var(--color-surface-alt-rgb))]"></div>
                                        <motion.div
                                            className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-xs"
                                            layout
                                            transition={{ type: "spring", stiffness: 700, damping: 30 }}
                                            initial={false}
                                            animate={{ x: settings.enableImagePreviews ? 20 : 0 }}
                                        ></motion.div>
                                    </div>
                                </label>
                                <p className="mt-1.5 text-xs text-[rgb(var(--color-on-surface-muted-rgb))]">Show image/video previews during extraction and in history. Images are always fetched via the Server Proxy.</p>
                            </div>
                            <div>
                                <label className="flex cursor-pointer select-none items-center justify-between">
                                    <TooltipWrapper tipContent="Enable or disable saving extraction history to your browser's local storage">
                                        <span className="mr-3 text-sm font-medium text-[rgb(var(--color-on-surface-rgb))]">Save History</span>
                                    </TooltipWrapper>
                                    <div className="relative">
                                        <input type="checkbox" id="saveHistoryToggle" className="peer sr-only" checked={settings.saveHistory} onChange={handleSaveHistoryChange} />
                                        <div className="block h-6 w-11 rounded-full bg-[rgb(var(--color-surface-border-rgb))] transition-colors duration-200 peer-checked:bg-[rgb(var(--color-primary-rgb))] peer-focus:ring-2 peer-focus:ring-[rgb(var(--color-primary-rgb))] peer-focus:ring-offset-2 peer-focus:ring-offset-[rgb(var(--color-surface-alt-rgb))]"></div>
                                        <motion.div
                                            className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-xs"
                                            layout
                                            transition={{ type: "spring", stiffness: 700, damping: 30 }}
                                            initial={false}
                                            animate={{ x: settings.saveHistory ? 20 : 0 }}
                                        ></motion.div>
                                    </div>
                                </label>
                                <p className="mt-1.5 text-xs text-[rgb(var(--color-on-surface-muted-rgb))]">Store successful extractions locally in your browser.</p>
                            </div>
                        </div>

                        <div className="mt-6 space-y-3 border-t border-[rgb(var(--color-surface-border-rgb))] pt-4">
                            <label className="block text-sm font-medium text-[rgb(var(--color-on-surface-rgb))]">Support & Feedback</label>
                            <a
                                href={REPORT_ISSUE_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex w-full items-center justify-center space-x-2 rounded-lg border border-[rgb(var(--color-surface-border-rgb))] px-4 py-2.5 text-sm font-medium text-[rgb(var(--color-on-surface-rgb))] transition-colors duration-200 hover:bg-[rgb(var(--color-surface-alt-2-rgb))] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[rgb(var(--color-primary-rgb))] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--color-surface-alt-rgb))]"
                            >
                                <BugAntIcon />
                                <span>Report an Issue on GitHub</span>
                            </a>
                            <p className="text-center text-xs text-[rgb(var(--color-on-surface-faint-rgb))]">Found a bug or have a suggestion? Let us know!</p>
                        </div>

                        <div className="mt-6 border-t border-[rgb(var(--color-surface-border-rgb))] pt-4 text-right">
                            <motion.button whileTap={{ scale: 0.95 }} onClick={onClose} className="rounded-lg bg-[rgb(var(--color-primary-rgb))] px-5 py-2 font-medium text-[rgb(var(--color-primary-content-rgb))] transition-colors duration-200 hover:bg-[rgb(var(--color-primary-focus-rgb))] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[rgb(var(--color-primary-rgb))] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--color-surface-alt-rgb))]">Done</motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
SettingsModal.displayName = 'SettingsModal';