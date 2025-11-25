import React, { useCallback, useMemo, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { PaletteIcon, BugAntIcon, AutomaticIcon, PreviewIcon, HistorySaveIcon, UnsupportedSitesIcon } from './icons/icons';
import type { Settings, ThemePreference, ColorTheme, FetchMode } from '../types/settings';
import { LanguageSelector } from './LanguageSelector';
import { ThemeSection } from './settings/ThemeSection';
import { ColorThemeSection } from './settings/ColorThemeSection';
import { FetchModeSection } from './settings/FetchModeSection';
import { ToggleSetting } from './settings/ToggleSetting';
import { HistorySizeSection } from './settings/HistorySizeSection';
import { BlacklistSection } from './settings/BlacklistSection';

const REPORT_ISSUE_URL = 'https://github.com/IRedDragonICY/booruprompt/issues';
const DEFAULT_CUSTOM_COLOR_HEX = '#3B82F6';

interface SettingsPanelProps {
    settings: Settings;
    onSettingsChange: (newSettings: Partial<Settings>) => void;
}

export const SettingsPanel = memo(function SettingsPanel({ settings, onSettingsChange }: SettingsPanelProps) {
    const { t, i18n } = useTranslation();
    const defaultBlacklistKeywords = useMemo(() => i18n.getFixedT('en')('settings.toggles.blacklist.defaultKeywords'), [i18n]);

    // Handlers
    const handleThemeChange = useCallback((theme: ThemePreference) => {
        onSettingsChange({ theme });
    }, [onSettingsChange]);

    const handleColorSectionChange = useCallback((colorTheme: ColorTheme, customColorHex?: string) => {
        const updates: Partial<Settings> = { colorTheme };
        if (customColorHex) {
            updates.customColorHex = customColorHex;
        }
        onSettingsChange(updates);
    }, [onSettingsChange]);

    const handleFetchModeChange = useCallback((fetchMode: FetchMode) => {
        onSettingsChange({ fetchMode });
    }, [onSettingsChange]);

    const handleClientProxyChange = useCallback((clientProxyUrl: string) => {
        onSettingsChange({ clientProxyUrl });
    }, [onSettingsChange]);

    const handleAutoExtractChange = useCallback((autoExtract: boolean) => {
        onSettingsChange({ autoExtract });
    }, [onSettingsChange]);

    const handleImagePreviewsChange = useCallback((enableImagePreviews: boolean) => {
        onSettingsChange({ enableImagePreviews });
    }, [onSettingsChange]);

    const handleSaveHistoryChange = useCallback((saveHistory: boolean) => {
        onSettingsChange({ saveHistory });
    }, [onSettingsChange]);

    const handleMaxHistoryChange = useCallback((maxHistorySize: number) => {
        onSettingsChange({ maxHistorySize });
    }, [onSettingsChange]);

    const handleUnsupportedSitesChange = useCallback((enableUnsupportedSites: boolean) => {
        onSettingsChange({ enableUnsupportedSites });
    }, [onSettingsChange]);

    const handleBlacklistEnabledChange = useCallback((enableBlacklist: boolean) => {
        onSettingsChange({ enableBlacklist });
    }, [onSettingsChange]);

    const handleBlacklistKeywordsChange = useCallback((blacklistKeywords: string) => {
        onSettingsChange({ blacklistKeywords });
    }, [onSettingsChange]);

    return (
        <div className="flex flex-col flex-1 overflow-hidden bg-[rgb(var(--color-surface-rgb))]">
            <div className="sticky top-0 z-10 shrink-0 border-b border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-alt-rgb))] px-6 py-5">
                <h1 className="text-xl font-semibold text-[rgb(var(--color-on-surface-rgb))]">{t('settings.title')}</h1>
            </div>
            <div className="flex-grow overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[rgb(var(--color-surface-border-rgb))]">
                <LanguageSelector />

                {/* Appearance Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-[rgb(var(--color-primary-rgb))]">
                        <PaletteIcon className="h-5 w-5" />
                        <span>{t('settings.sections.appearance')}</span>
                    </div>
                    
                    <ThemeSection
                        theme={settings.theme}
                        onChange={handleThemeChange}
                    />

                    <ColorThemeSection
                        colorTheme={settings.colorTheme}
                        customColorHex={settings.customColorHex || DEFAULT_CUSTOM_COLOR_HEX}
                        onChange={handleColorSectionChange}
                    />
                </div>

                {/* Data Fetch Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-[rgb(var(--color-primary-rgb))]">
                        <AutomaticIcon className="h-5 w-5" />
                        <span>{t('settings.sections.dataFetch')}</span>
                    </div>

                    <FetchModeSection
                        fetchMode={settings.fetchMode}
                        clientProxyUrl={settings.clientProxyUrl || ''}
                        onFetchModeChange={handleFetchModeChange}
                        onProxyUrlChange={handleClientProxyChange}
                    />
                </div>

                {/* Toggles Section */}
                <div className="space-y-4">
                    <ToggleSetting
                        label={t('settings.toggles.autoExtract.label')}
                        description={t('settings.toggles.autoExtract.description')}
                        tooltip={t('settings.toggles.autoExtract.tooltip')}
                        icon={<AutomaticIcon />}
                        checked={settings.autoExtract}
                        onChange={handleAutoExtractChange}
                    />

                    <ToggleSetting
                        label={t('settings.toggles.previews.label')}
                        description={t('settings.toggles.previews.description')}
                        note={t('settings.toggles.previews.note')}
                        tooltip={t('settings.toggles.previews.tooltip')}
                        icon={<PreviewIcon />}
                        checked={settings.enableImagePreviews}
                        onChange={handleImagePreviewsChange}
                    />

                    <ToggleSetting
                        label={t('settings.toggles.saveHistory.label')}
                        description={t('settings.toggles.saveHistory.description')}
                        tooltip={t('settings.toggles.saveHistory.tooltip')}
                        icon={<HistorySaveIcon />}
                        checked={settings.saveHistory}
                        onChange={handleSaveHistoryChange}
                    />

                    <HistorySizeSection
                        saveHistory={settings.saveHistory}
                        maxHistorySize={settings.maxHistorySize}
                        onChange={handleMaxHistoryChange}
                    />

                    <ToggleSetting
                        label={t('settings.toggles.unsupportedSites.label')}
                        description={t('settings.toggles.unsupportedSites.description')}
                        tooltip={t('settings.toggles.unsupportedSites.tooltip')}
                        icon={<UnsupportedSitesIcon />}
                        checked={settings.enableUnsupportedSites}
                        onChange={handleUnsupportedSitesChange}
                    />

                    <BlacklistSection
                        enabled={settings.enableBlacklist}
                        keywords={settings.blacklistKeywords || defaultBlacklistKeywords}
                        defaultKeywords={defaultBlacklistKeywords}
                        onEnabledChange={handleBlacklistEnabledChange}
                        onKeywordsChange={handleBlacklistKeywordsChange}
                    />
                </div>

                {/* Support Section */}
                <div className="space-y-3 border-t border-[rgb(var(--color-surface-border-rgb))] pt-6">
                    <label className="block text-sm font-medium text-[rgb(var(--color-on-surface-rgb))]">{t('settings.support.title')}</label>
                    <a
                        href={REPORT_ISSUE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[rgb(var(--color-surface-alt-rgb))] px-4 py-3 text-sm font-medium text-[rgb(var(--color-on-surface-rgb))] transition-all hover:bg-[rgb(var(--color-surface-hover-rgb))] hover:shadow-sm"
                    >
                        <BugAntIcon className="h-5 w-5 transition-transform group-hover:rotate-12" />
                        <span>{t('settings.support.cta')}</span>
                    </a>
                    <p className="text-center text-xs text-[rgb(var(--color-on-surface-faint-rgb))]">{t('settings.support.description')}</p>
                </div>
            </div>
        </div>
    );
});

export default SettingsPanel;


