import { AnimatePresence, motion } from 'framer-motion';
import React, { useCallback, useEffect, useMemo, memo } from 'react';
import { XMarkIcon, BugAntIcon, AutomaticIcon, PreviewIcon, HistorySaveIcon, UnsupportedSitesIcon } from './icons/icons';
import { TooltipWrapper } from './TooltipWrapper';
import { LanguageSelector } from './LanguageSelector';
import { useTranslation } from 'react-i18next';
import { ThemeSection } from './settings/ThemeSection';
import { ColorThemeSection } from './settings/ColorThemeSection';
import { FetchModeSection } from './settings/FetchModeSection';
import { ToggleSetting } from './settings/ToggleSetting';
import { BlacklistSection } from './settings/BlacklistSection';
import { HistorySizeSection } from './settings/HistorySizeSection';

type ThemePreference = 'system' | 'light' | 'dark';
type ColorTheme = 'blue' | 'orange' | 'teal' | 'rose' | 'purple' | 'green' | 'custom';
type FetchMode = 'server' | 'clientProxy';

interface Settings {
    theme: ThemePreference;
    autoExtract: boolean;
    colorTheme: ColorTheme;
    customColorHex?: string;
    enableImagePreviews: boolean;
    fetchMode: FetchMode;
    clientProxyUrl: string;
    saveHistory: boolean;
    maxHistorySize: number;
    enableUnsupportedSites: boolean;
    enableBlacklist: boolean;
    blacklistKeywords: string;
}

const REPORT_ISSUE_URL = 'https://github.com/IRedDragonICY/booruprompt/issues';

// Animation variants
const BACKDROP_VARIANTS = { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } };
const MODAL_VARIANTS = { initial: { scale: 0.98, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0.98, opacity: 0 } };
const MODAL_TRANSITION = { type: "spring", damping: 18, stiffness: 200 } as const;

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    settings: Settings;
    onSettingsChange: (newSettings: Partial<Settings>) => void;
}

export const SettingsModal = memo(function SettingsModal({ isOpen, onClose, settings, onSettingsChange }: SettingsModalProps) {
    const { t, i18n } = useTranslation();

    const defaultBlacklistKeywords = useMemo(
        () => i18n.getFixedT('en')('settings.toggles.blacklist.defaultKeywords'),
        [i18n]
    );

    // Lock background scroll when modal is open
    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (isOpen) {
            const prevHtmlOverflow = document.documentElement.style.overflow;
            const prevBodyOverflow = document.body.style.overflow;
            document.documentElement.style.overflow = 'hidden';
            document.body.style.overflow = 'hidden';
            return () => {
                document.documentElement.style.overflow = prevHtmlOverflow;
                document.body.style.overflow = prevBodyOverflow;
            };
        }
    }, [isOpen]);

    // Optimized callbacks
    const handleThemeChange = useCallback(
        (theme: ThemePreference) => onSettingsChange({ theme }),
        [onSettingsChange]
    );

    const handleColorThemeChange = useCallback(
        (colorTheme: ColorTheme, customColorHex?: string) => {
            onSettingsChange({ colorTheme, ...(customColorHex && { customColorHex }) });
        },
        [onSettingsChange]
    );

    const handleFetchModeChange = useCallback(
        (fetchMode: FetchMode) => onSettingsChange({ fetchMode }),
        [onSettingsChange]
    );

    const handleClientProxyUrlChange = useCallback(
        (clientProxyUrl: string) => onSettingsChange({ clientProxyUrl }),
        [onSettingsChange]
    );

    const handleAutoExtractChange = useCallback(
        (autoExtract: boolean) => onSettingsChange({ autoExtract }),
        [onSettingsChange]
    );

    const handleImagePreviewsChange = useCallback(
        (enableImagePreviews: boolean) => onSettingsChange({ enableImagePreviews }),
        [onSettingsChange]
    );

    const handleSaveHistoryChange = useCallback(
        (saveHistory: boolean) => onSettingsChange({ saveHistory }),
        [onSettingsChange]
    );

    const handleUnsupportedSitesChange = useCallback(
        (enableUnsupportedSites: boolean) => onSettingsChange({ enableUnsupportedSites }),
        [onSettingsChange]
    );

    const handleBlacklistEnabledChange = useCallback(
        (enableBlacklist: boolean) => onSettingsChange({ enableBlacklist }),
        [onSettingsChange]
    );

    const handleBlacklistKeywordsChange = useCallback(
        (blacklistKeywords: string) => onSettingsChange({ blacklistKeywords }),
        [onSettingsChange]
    );

    const handleHistorySizeChange = useCallback(
        (maxHistorySize: number) => onSettingsChange({ maxHistorySize }),
        [onSettingsChange]
    );

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/60 p-0 md:p-4 backdrop-blur-xs overflow-hidden"
                    {...BACKDROP_VARIANTS}
                    onClick={onClose}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="settings-title"
                >
                    <motion.div
                        className="w-full h-[100dvh] md:h-[90vh] md:max-w-md rounded-none md:rounded-xl bg-[rgb(var(--color-surface-alt-rgb))] p-0 md:p-6 shadow-2xl overflow-hidden"
                        {...MODAL_VARIANTS}
                        transition={MODAL_TRANSITION}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div
                            className="h-full overflow-y-auto overflow-x-hidden overscroll-contain scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[rgb(var(--color-surface-border-rgb))]"
                            style={{ WebkitOverflowScrolling: 'touch' }}
                        >
                            {/* Header */}
                            <div
                                className="sticky top-0 z-10 mb-4 md:mb-6 flex items-center justify-between border-b border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-alt-rgb))] px-4 md:px-0 pb-3 md:pb-4 pt-3"
                                style={{ paddingTop: 'env(safe-area-inset-top)' }}
                            >
                                <h2 id="settings-title" className="text-xl font-semibold text-[rgb(var(--color-on-surface-rgb))]">
                                    {t('settings.title')}
                                </h2>
                                <TooltipWrapper tipContent={t('settings.modal.close')}>
                                    <button
                                        onClick={onClose}
                                        className="-mr-2 rounded-full p-1 text-[rgb(var(--color-on-surface-muted-rgb))] transition-all hover:text-[rgb(var(--color-on-surface-rgb))] hover:rotate-90 active:scale-90 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[rgb(var(--color-primary-rgb))] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--color-surface-alt-rgb))]"
                                        aria-label={t('settings.modal.close')}
                                    >
                                        <XMarkIcon className="h-6 w-6" />
                                    </button>
                                </TooltipWrapper>
                            </div>

                            {/* Content */}
                            <div className="space-y-6 px-4 md:px-0 pb-4 md:pb-0">
                                <LanguageSelector />

                                <ThemeSection theme={settings.theme} onChange={handleThemeChange} />

                                <ColorThemeSection
                                    colorTheme={settings.colorTheme}
                                    customColorHex={settings.customColorHex}
                                    onChange={handleColorThemeChange}
                                />

                                <FetchModeSection
                                    fetchMode={settings.fetchMode}
                                    clientProxyUrl={settings.clientProxyUrl}
                                    onFetchModeChange={handleFetchModeChange}
                                    onProxyUrlChange={handleClientProxyUrlChange}
                                />

                                <ToggleSetting
                                    id="autoExtractToggle"
                                    label={t('settings.toggles.autoExtract.label')}
                                    description={t('settings.toggles.autoExtract.description')}
                                    tooltip={t('settings.toggles.autoExtract.tooltip')}
                                    checked={settings.autoExtract}
                                    onChange={handleAutoExtractChange}
                                    icon={<AutomaticIcon />}
                                />

                                <ToggleSetting
                                    id="imagePreviewsToggle"
                                    label={t('settings.toggles.previews.label')}
                                    description={t('settings.toggles.previews.description')}
                                    tooltip={t('settings.toggles.previews.tooltip')}
                                    checked={settings.enableImagePreviews}
                                    onChange={handleImagePreviewsChange}
                                    icon={<PreviewIcon />}
                                    note={t('settings.toggles.previews.note')}
                                />

                                <ToggleSetting
                                    id="saveHistoryToggle"
                                    label={t('settings.toggles.saveHistory.label')}
                                    description={t('settings.toggles.saveHistory.description')}
                                    tooltip={t('settings.toggles.saveHistory.tooltip')}
                                    checked={settings.saveHistory}
                                    onChange={handleSaveHistoryChange}
                                    icon={<HistorySaveIcon />}
                                />

                                <ToggleSetting
                                    id="unsupportedSitesToggle"
                                    label={t('settings.toggles.unsupportedSites.label')}
                                    description={t('settings.toggles.unsupportedSites.description')}
                                    tooltip={t('settings.toggles.unsupportedSites.tooltip')}
                                    checked={settings.enableUnsupportedSites}
                                    onChange={handleUnsupportedSitesChange}
                                    icon={<UnsupportedSitesIcon />}
                                />

                                <BlacklistSection
                                    enabled={settings.enableBlacklist}
                                    keywords={settings.blacklistKeywords}
                                    defaultKeywords={defaultBlacklistKeywords}
                                    onEnabledChange={handleBlacklistEnabledChange}
                                    onKeywordsChange={handleBlacklistKeywordsChange}
                                />

                                <HistorySizeSection
                                    saveHistory={settings.saveHistory}
                                    maxHistorySize={settings.maxHistorySize}
                                    onChange={handleHistorySizeChange}
                                />
                            </div>

                            {/* Support Section */}
                            <div className="mt-6 space-y-3 border-t border-[rgb(var(--color-surface-border-rgb))] pt-4 px-4 md:px-0 pb-safe">
                                <label className="block text-sm font-medium text-[rgb(var(--color-on-surface-rgb))]">
                                    {t('settings.support.title')}
                                </label>
                                <a
                                    href={REPORT_ISSUE_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex w-full items-center justify-center space-x-2 rounded-lg border border-[rgb(var(--color-surface-border-rgb))] px-4 py-2.5 text-sm font-medium text-[rgb(var(--color-on-surface-rgb))] transition-colors duration-200 hover:bg-[rgb(var(--color-surface-alt-2-rgb))] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[rgb(var(--color-primary-rgb))] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--color-surface-alt-rgb))]"
                                >
                                    <BugAntIcon />
                                    <span>{t('settings.support.cta')}</span>
                                </a>
                                <p className="text-center text-xs text-[rgb(var(--color-on-surface-faint-rgb))]">
                                    {t('settings.support.description')}
                                </p>
                            </div>

                            {/* Footer Button */}
                            <div className="mt-6 border-t border-[rgb(var(--color-surface-border-rgb))] pt-4 text-right px-4 md:px-0 pb-4 md:pb-0 hidden md:block">
                                <button
                                    onClick={onClose}
                                    className="rounded-full bg-[rgb(var(--color-primary-rgb))] px-5 py-2 font-medium text-[rgb(var(--color-primary-content-rgb))] shadow-sm transition-all duration-200 hover:bg-[rgb(var(--color-primary-focus-rgb))] active:scale-95 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[rgb(var(--color-primary-rgb))] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--color-surface-alt-rgb))]"
                                >
                                    {t('common.actions.done')}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
});
