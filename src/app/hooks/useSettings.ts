import { useState, useEffect, useCallback } from 'react';
import { hexToRgb, getContrastColor, adjustRgb } from '../utils/colors';
import i18n from '@/lib/i18n';
import type { Settings, ThemePreference, ColorTheme, FetchMode } from '../types/settings';
import {
    THEME_STORAGE_KEY,
    COLOR_THEME_STORAGE_KEY,
    CUSTOM_COLOR_HEX_STORAGE_KEY,
    AUTO_EXTRACT_STORAGE_KEY,
    IMAGE_PREVIEWS_STORAGE_KEY,
    FETCH_MODE_STORAGE_KEY,
    CLIENT_PROXY_URL_STORAGE_KEY,
    SAVE_HISTORY_STORAGE_KEY,
    MAX_HISTORY_SIZE_STORAGE_KEY,
    UNSUPPORTED_SITES_STORAGE_KEY,
    BLACKLIST_ENABLED_STORAGE_KEY,
    BLACKLIST_KEYWORDS_STORAGE_KEY,
    DEFAULT_COLOR_THEME,
    DEFAULT_CUSTOM_COLOR_HEX,
    DEFAULT_FETCH_MODE,
    DEFAULT_MAX_HISTORY_SIZE,
    DEFAULT_BLACKLIST_ENABLED,
    DEFAULT_CLIENT_PROXY_URL
} from '../constants';

export function useSettings() {
    const [showSettings, setShowSettings] = useState(false);
    const [settings, setSettings] = useState<Settings>({
        theme: 'system',
        autoExtract: true,
        colorTheme: DEFAULT_COLOR_THEME,
        customColorHex: DEFAULT_CUSTOM_COLOR_HEX,
        enableImagePreviews: true,
        fetchMode: DEFAULT_FETCH_MODE,
        clientProxyUrl: DEFAULT_CLIENT_PROXY_URL,
        saveHistory: false,
        maxHistorySize: DEFAULT_MAX_HISTORY_SIZE,
        enableUnsupportedSites: false,
        enableBlacklist: DEFAULT_BLACKLIST_ENABLED,
        blacklistKeywords: ''
    });

    function loadStoredItem<T>(key: string, defaultValue: T, validator?: (item: unknown) => boolean): T {
        if (typeof window === 'undefined') return defaultValue;
        const item = localStorage.getItem(key);
        if (item === null) return defaultValue;
        try {
            const parsed = JSON.parse(item);
            return validator ? (validator(parsed) ? parsed : defaultValue) : parsed;
        } catch {
            return defaultValue;
        }
    }

    useEffect(() => {
        const isValidMaxHistorySize = (i: unknown): i is number => typeof i === 'number' && (i === -1 || (Number.isInteger(i) && i >= 0));

        setSettings({
            theme: loadStoredItem<ThemePreference>(THEME_STORAGE_KEY, 'system'),
            colorTheme: loadStoredItem<ColorTheme>(COLOR_THEME_STORAGE_KEY, DEFAULT_COLOR_THEME),
            customColorHex: loadStoredItem<string | undefined>(CUSTOM_COLOR_HEX_STORAGE_KEY, DEFAULT_CUSTOM_COLOR_HEX),
            autoExtract: loadStoredItem<boolean>(AUTO_EXTRACT_STORAGE_KEY, true),
            enableImagePreviews: loadStoredItem<boolean>(IMAGE_PREVIEWS_STORAGE_KEY, true),
            fetchMode: loadStoredItem<FetchMode>(FETCH_MODE_STORAGE_KEY, DEFAULT_FETCH_MODE),
            clientProxyUrl: loadStoredItem<string>(CLIENT_PROXY_URL_STORAGE_KEY, DEFAULT_CLIENT_PROXY_URL),
            saveHistory: loadStoredItem<boolean>(SAVE_HISTORY_STORAGE_KEY, false),
            maxHistorySize: loadStoredItem<number>(MAX_HISTORY_SIZE_STORAGE_KEY, DEFAULT_MAX_HISTORY_SIZE, isValidMaxHistorySize),
            enableUnsupportedSites: loadStoredItem<boolean>(UNSUPPORTED_SITES_STORAGE_KEY, false),
            enableBlacklist: loadStoredItem<boolean>(BLACKLIST_ENABLED_STORAGE_KEY, DEFAULT_BLACKLIST_ENABLED),
            blacklistKeywords: loadStoredItem<string>(BLACKLIST_KEYWORDS_STORAGE_KEY, i18n.getFixedT('en')('settings.toggles.blacklist.defaultKeywords')),
        });
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const root = window.document.documentElement;
        const isDark = settings.theme === 'dark' || (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
        root.classList.toggle('dark', isDark);
        root.dataset.colorTheme = settings.colorTheme;

        if (settings.colorTheme === 'custom' && settings.customColorHex) {
            const rgb = hexToRgb(settings.customColorHex);
            if (rgb) {
                const p = `${rgb.r} ${rgb.g} ${rgb.b}`;
                const f = isDark ? 1.2 : 0.85;
                const focus = adjustRgb(rgb.r, rgb.g, rgb.b, f);
                const content = getContrastColor(rgb.r, rgb.g, rgb.b);
                root.style.setProperty('--custom-primary-rgb', p);
                root.style.setProperty('--custom-primary-focus-rgb', focus);
                root.style.setProperty('--custom-primary-content-rgb', content);
            } else {
                ['--custom-primary-rgb', '--custom-primary-focus-rgb', '--custom-primary-content-rgb'].forEach(p => root.style.removeProperty(p));
            }
        } else {
            ['--custom-primary-rgb', '--custom-primary-focus-rgb', '--custom-primary-content-rgb'].forEach(p => root.style.removeProperty(p));
        }

        Object.entries(settings).forEach(([key, value]) => {
            const storageKeyMap: Record<string, string> = {
                theme: THEME_STORAGE_KEY,
                colorTheme: COLOR_THEME_STORAGE_KEY,
                customColorHex: CUSTOM_COLOR_HEX_STORAGE_KEY,
                autoExtract: AUTO_EXTRACT_STORAGE_KEY,
                enableImagePreviews: IMAGE_PREVIEWS_STORAGE_KEY,
                fetchMode: FETCH_MODE_STORAGE_KEY,
                clientProxyUrl: CLIENT_PROXY_URL_STORAGE_KEY,
                saveHistory: SAVE_HISTORY_STORAGE_KEY,
                maxHistorySize: MAX_HISTORY_SIZE_STORAGE_KEY,
                enableUnsupportedSites: UNSUPPORTED_SITES_STORAGE_KEY,
                enableBlacklist: BLACKLIST_ENABLED_STORAGE_KEY,
                blacklistKeywords: BLACKLIST_KEYWORDS_STORAGE_KEY
            };
            const storageKey = storageKeyMap[key];
            if (storageKey) {
                if (key === 'customColorHex' && !value) localStorage.removeItem(storageKey);
                else localStorage.setItem(storageKey, JSON.stringify(value));
            }
        });

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e: MediaQueryListEvent) => {
            if (settings.theme === 'system') {
                const sysDark = e.matches;
                root.classList.toggle('dark', sysDark);
                if (settings.colorTheme === 'custom' && settings.customColorHex) {
                    const rgb = hexToRgb(settings.customColorHex);
                    if (rgb) {
                        const f = sysDark ? 1.2 : 0.85;
                        const focus = adjustRgb(rgb.r, rgb.g, rgb.b, f);
                        const content = getContrastColor(rgb.r, rgb.g, rgb.b);
                        root.style.setProperty('--custom-primary-focus-rgb', focus);
                        root.style.setProperty('--custom-primary-content-rgb', content);
                    }
                }
            }
        };
        if (settings.theme === 'system') mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [settings]);

    const handleSettingsChange = useCallback((newSettings: Partial<Settings>) => setSettings(prev => ({ ...prev, ...newSettings })), []);
    const handleOpenSettings = useCallback(() => setShowSettings(true), []);
    const handleCloseSettings = useCallback(() => setShowSettings(false), []);

    return {
        settings,
        showSettings,
        handleSettingsChange,
        handleOpenSettings,
        handleCloseSettings
    };
}
