'use client';

import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

import { AnimatedIcon } from './components/AnimatedIcon';
import { SettingsModal } from './components/SettingsModal';
import { SettingsPanel } from './components/SettingsPanel';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ClipboardIcon, CheckCircleIcon, XMarkIcon, ArrowUpOnSquareIcon } from './components/icons/icons';
import { TooltipWrapper } from './components/TooltipWrapper';
import ExtractorHeader from './components/ExtractorHeader';
import FilteredTagsPanel from './components/FilteredTagsPanel';
import PreviewSection from './components/PreviewSection';
import CategoryToggle from './components/CategoryToggle';
import BooruInfoSection from './components/BooruInfoSection';
import BooruListPanel from './components/BooruListPanel';
import { StatusMessage } from './components/StatusMessage';
import StatusView from './components/StatusView';
import ApiTestView from './components/ApiTestView';
import { HistoryPanelBase } from './components/HistoryPanel';
import { ParameterItem } from './components/ParameterItem';
import ErrorPage from './components/ErrorPage';
import DesktopAppShell from './layouts/DesktopAppShell';
import MobileAppShell from './layouts/MobileAppShell';
import { HistoryItem as HistoryItemComponent } from './components/HistoryList';
import { ImageHistoryItem } from './components/ImageHistoryItem';
import { ImageMetadataView } from './components/ImageMetadataView';
import { MobileExtractorControls } from './components/MobileExtractorControls';

import { DEFAULT_TAG_CATEGORIES } from './utils/extractionUtils';
import type { ActiveView } from './types/settings';
import type { HistoryEntry, ImageHistoryEntry } from './types/history';

import { useSettings } from './hooks/useSettings';
import { useHistory } from './hooks/useHistory';
import { useBooruExtraction } from './hooks/useBooruExtraction';
import { useImageAnalysis } from './hooks/useImageAnalysis';

const MotionCard = motion.div;

const HistoryItem = React.memo(HistoryItemComponent);
HistoryItem.displayName = 'HistoryItem';

const BooruTagExtractor = () => {
    const { t } = useTranslation();
    const pathname = usePathname();
    const router = useRouter();

    const getViewFromPath = useCallback((path: string | null): ActiveView => {
        if (!path) return 'extractor';
        if (path === '/image-metadata') return 'image';
        if (path === '/booru-list') return 'booru-list';
        if (path === '/status') return 'status';
        if (path === '/api-test') return 'api-test';
        if (path === '/settings') return 'settings';
        return 'extractor';
    }, []);

    const [activeView, setActiveView] = useState<ActiveView>(() => getViewFromPath(pathname));
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [showHistoryMobile, setShowHistoryMobile] = useState<boolean>(false);

    // Hooks
    const { settings, showSettings, handleSettingsChange, handleOpenSettings, handleCloseSettings } = useSettings();
    const { history, imageHistory, addHistoryEntry, addImageHistoryEntry, handleDeleteHistoryEntry, handleClearHistory, handleDeleteImageHistoryEntry, handleClearImageHistory } = useHistory(settings);
    
    const {
        url, imageUrl, imageTitle, displayedTags, loading, error, activeSite, retryCount, isRetrying, showFullErrorPage, tagCategories, copySuccess, isDraggingOver, cardBodyRef,
        tagCounts, totalExtractedTagCount, areAllCategoriesEnabled, areAllCategoriesDisabled, selectedProxyLabel,
        setUrl, handleUrlChange, handleManualExtract, handleReset, handleRetryAgain, handleReportBug, toggleTagCategory, toggleAllCategories, handleCopy, handleLoadHistoryEntry, handleDragOver, handleDragLeave, handleDrop
    } = useBooruExtraction({ settings, activeView, addHistoryEntry });

    const {
        imageFile, imagePreviewUrl, imageData, imageLoading, imageError, isDraggingOverImage, copyStatus, fileInputRef,
        handleClearImage, handleImageDrop, handleImageDragOver, handleImageDragLeave, handleImageInputChange, triggerFileInput, handleMetadataCopy, handleLoadImageHistoryEntry
    } = useImageAnalysis({ settings, addImageHistoryEntry });

    const imageCardBodyRef = useRef<HTMLDivElement>(null);
    const previousViewRef = useRef<ActiveView>('extractor');

    useEffect(() => {
        if (activeView !== 'settings') {
            previousViewRef.current = activeView;
        }
    }, [activeView]);

    // Effects
    useEffect(() => {
        const newView = getViewFromPath(pathname);
        if (newView !== activeView) {
            setActiveView(newView);
        }
    }, [pathname, getViewFromPath]);

    useEffect(() => {
        const currentPath = pathname;
        let targetPath: string;

        if (activeView === 'extractor') targetPath = '/booru-tag';
        else if (activeView === 'image') targetPath = '/image-metadata';
        else if (activeView === 'booru-list') targetPath = '/booru-list';
        else if (activeView === 'status') targetPath = '/status';
        else if (activeView === 'api-test') targetPath = '/api-test';
        else targetPath = '/settings';

        if (currentPath !== targetPath) {
             window.history.replaceState(null, '', targetPath);
        }
    }, [activeView, pathname]);

    useEffect(() => {
        if (activeView === 'settings' && !isMobile) {
            handleOpenSettings();
        }
    }, [activeView, handleOpenSettings, isMobile]);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Helpers
    const translateCategoryLabel = useCallback(
        (categoryId: string, fallback?: string) => t(`extractor.categories.items.${categoryId}`, { defaultValue: fallback ?? categoryId }),
        [t]
    );

    const shouldShowPreviewSection = useMemo(() => activeView !== 'image' && activeView !== 'settings' && settings.enableImagePreviews && (!!imageUrl || (loading && !imageUrl && !error)), [activeView, settings.enableImagePreviews, imageUrl, loading, error]);
    const hasResults = useMemo(() => totalExtractedTagCount > 0 || !!imageUrl, [totalExtractedTagCount, imageUrl]);

    const extractionFilterPredicate = useCallback((entry: HistoryEntry, query: string): boolean =>
        entry.title?.toLowerCase().includes(query) ||
        entry.url.toLowerCase().includes(query) ||
        entry.siteName?.toLowerCase().includes(query) ||
        (entry.tags && Object.values(entry.tags).flat().some((tag: string) => tag.toLowerCase().includes(query)))
    , []);

    const imageFilterPredicate = useCallback((entry: ImageHistoryEntry, query: string): boolean =>
        entry.fileName.toLowerCase().includes(query) ||
        !!entry.imageData.positivePrompt?.toLowerCase().includes(query) ||
        !!entry.imageData.negativePrompt?.toLowerCase().includes(query) ||
        !!(entry.imageData.parameters && Object.entries(entry.imageData.parameters).some(([k, v]: [string, string]) => k.toLowerCase().includes(query) || v.toLowerCase().includes(query)))
    , []);

    const renderHistoryItem = useCallback((entry: HistoryEntry) => (
        <HistoryItem key={entry.id} entry={entry} onLoad={handleLoadHistoryEntry} onDelete={handleDeleteHistoryEntry} enableImagePreviews={settings.enableImagePreviews} />
    ), [handleLoadHistoryEntry, handleDeleteHistoryEntry, settings.enableImagePreviews]);

    const renderImageHistoryItem = useCallback((entry: ImageHistoryEntry) => (
        <ImageHistoryItem key={entry.id} entry={entry} onLoad={handleLoadImageHistoryEntry} onDelete={handleDeleteImageHistoryEntry} />
    ), [handleLoadImageHistoryEntry, handleDeleteImageHistoryEntry]);

    const historySizeDisplay = useMemo(() => {
        if (settings.maxHistorySize === -1) return t('common.statusBar.historyUnlimited');
        return t('common.statusBar.historyEntries', { count: settings.maxHistorySize });
    }, [settings.maxHistorySize, t]);

    const fetchStatusText = useMemo(() => settings.fetchMode === 'server'
        ? t('common.statusBar.serverProxy')
        : t('common.statusBar.clientProxy', { proxy: selectedProxyLabel })
    , [selectedProxyLabel, settings.fetchMode, t]);

    const historyStatusText = useMemo(() => settings.saveHistory
        ? t('common.statusBar.historyEnabled', { size: historySizeDisplay })
        : t('common.statusBar.historyDisabled')
    , [historySizeDisplay, settings.saveHistory, t]);

    const formatParametersForCopy = useCallback((p?: Record<string, string>): string => !p ? '' : Object.entries(p).map(([k, v]) => `${k}: ${v}`).join('\n'), []);

    const mainContent = (
        <AnimatePresence mode="wait">
            {activeView === 'extractor' ? (
                <motion.div key="extractor-view" className="flex flex-col flex-1 overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2, ease: "easeOut" }}>
                        <ExtractorHeader 
                            activeSite={activeSite} 
                            url={url} 
                            onUrlChange={handleUrlChange} 
                            onExtract={handleManualExtract} 
                            onReset={handleReset} 
                            loading={loading}
                            history={settings.saveHistory ? history : undefined}
                            renderHistoryItem={renderHistoryItem}
                            historyFilterPredicate={extractionFilterPredicate}
                            onClearHistory={handleClearHistory}
                        />
                    <div ref={cardBodyRef} className={`flex-grow flex flex-col p-6 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[rgb(var(--color-surface-border-rgb))] ${isMobile ? 'space-y-6 overflow-y-auto pb-40' : 'overflow-hidden gap-6'}`}>
                        <AnimatePresence mode='wait'>
                            {error && showFullErrorPage && (
                                <ErrorPage
                                    error={error}
                                    retryCount={retryCount}
                                    isRetrying={isRetrying}
                                    onReportBug={handleReportBug}
                                    onRetryAgain={handleRetryAgain}
                                />
                            )}
                            {error && !showFullErrorPage && (error.toLowerCase().includes('warning') ? <StatusMessage type="warning">{error}</StatusMessage> : <StatusMessage type="error">{error}</StatusMessage>)}
                        </AnimatePresence>
                        {isMobile && !loading && !hasResults && !error && <BooruInfoSection />}
                        
                        {isMobile && activeView === 'extractor' && (
                            <MobileExtractorControls
                                url={url}
                                onUrlChange={handleUrlChange}
                                onExtract={handleManualExtract}
                                onReset={handleReset}
                                loading={loading}
                                tagCategories={tagCategories}
                                toggleTagCategory={toggleTagCategory}
                                onOpenHistory={() => setShowHistoryMobile(true)}
                            />
                        )}

                        {isMobile && (
                            <PreviewSection title={t('extractor.preview.title')} show={shouldShowPreviewSection} imageUrl={imageUrl} imageTitle={imageTitle} loading={loading} error={error || undefined} />
                        )}

                        {isMobile && hasResults && !loading && (
                            <div className="flex flex-col gap-4">
                                {/* Filter Categories */}
                                <div className="rounded-lg border border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-alt-2-rgb))] p-3">
                                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                                        <h3 className="text-sm font-semibold">{t('extractor.categories.title')}</h3>
                                        <div className="flex shrink-0 space-x-2">
                                            <button onClick={() => toggleAllCategories(false)} className="rounded-md bg-[rgb(var(--color-surface-border-rgb))] px-2 py-0.5 text-xs font-medium text-[rgb(var(--color-on-surface-muted-rgb))] hover:bg-gray-300 dark:hover:bg-gray-500">{t('extractor.categories.disableAll')}</button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-5 gap-2">
                                        {DEFAULT_TAG_CATEGORIES.map(catDef => {
                                            const catOpt = tagCategories.find(c => c.id === catDef.id) ?? catDef;
                                            const count = tagCounts[catOpt.id] || 0;
                                            const active = catOpt.enabled;
                                            const label = translateCategoryLabel(catOpt.id, catOpt.label);
                                            return (
                                                <button key={catOpt.id} onClick={() => toggleTagCategory(catOpt.id)} className={`group relative flex flex-col items-center justify-center rounded-lg px-2 py-1.5 transition ${active ? 'bg-[rgba(var(--color-primary-rgb),0.15)] ring-1 ring-[rgb(var(--color-primary-rgb))]/40' : 'bg-[rgb(var(--color-surface-alt-rgb))] hover:bg-[rgb(var(--color-surface-border-rgb))]'}`} aria-pressed={active} title={`${label} • ${count}`}>
                                                    <span className="mb-1 grid h-6 w-6 place-items-center rounded-md" style={{ backgroundColor: active ? `rgba(var(--color-primary-rgb),0.2)` : 'transparent' }}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`h-4 w-4 ${active ? 'text-[rgb(var(--color-primary-rgb))]' : 'text-[rgb(var(--color-on-surface-muted-rgb))]'}`}>
                                                            {catOpt.id === 'copyright' && <g><rect x="4" y="9" width="10" height="8" rx="2"/><rect x="10" y="5" width="10" height="8" rx="2" opacity="0.65"/></g>}
                                                            {catOpt.id === 'character' && <path d="M12 2.25c-2.9 0-5.25 2.35-5.25 5.25S9.1 12.75 12 12.75 17.25 10.4 17.25 7.5 14.9 2.25 12 2.25zm0 12c-3.45 0-6.75 1.77-6.75 4.5V21h13.5v-2.25c0-2.73-3.3-4.5-6.75-4.5z"/>}
                                                            {catOpt.id === 'general' && <path d="M4.5 5.25h15a.75.75 0 010 1.5h-15a.75.75 0 010-1.5zm0 6h15a.75.75 0 010 1.5h-15a.75.75 0 010-1.5zm0 6h15a.75.75 0 010 1.5h-15a.75.75 0 010-1.5z"/>}
                                                            {catOpt.id === 'meta' && <path d="M4.5 6.75A2.25 2.25 0 016.75 4.5h10.5A2.25 2.25 0 0119.5 6.75v10.5A2.25 2.25 0 0117.25 19.5H6.75A2.25 2.25 0 014.5 17.25V6.75zm3 1.5a.75.75 0 000 1.5h8.25a.75.75 0 000-1.5H7.5zM7.5 12a.75.75 0 000 1.5h8.25a.75.75 0 000-1.5H7.5zm0 3.75a.75.75 0 000 1.5H12a.75.75 0 000-1.5H7.5z"/>}
                                                            {catOpt.id === 'other' && <g><rect x="4" y="4" width="6" height="6" rx="1.5"/><rect x="14" y="4" width="6" height="6" rx="1.5"/><rect x="4" y="14" width="6" height="6" rx="1.5"/><rect x="14" y="14" width="6" height="6" rx="1.5"/></g>}
                                                        </svg>
                                                    </span>
                                                    <span className={`text-xs font-medium ${active ? 'text-[rgb(var(--color-primary-rgb))]' : 'text-[rgb(var(--color-on-surface-muted-rgb))]'}`}>{label}</span>
                                                    <span className={`text-[10px] ${active ? 'text-[rgb(var(--color-primary-rgb))]/70' : 'text-[rgb(var(--color-on-surface-faint-rgb))]'}`}>{count}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Filtered Tags Panel */}
                                <FilteredTagsPanel displayedTags={displayedTags} onCopy={handleCopy} copySuccess={copySuccess} />
                            </div>
                        )}

                        {!isMobile && hasResults && !loading && (
                            <div className="flex-1 flex flex-col gap-4 overflow-hidden min-h-0">
                                <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 overflow-hidden min-h-0">
                                    {/* Left Column */}
                                    <div className="space-y-4 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[rgb(var(--color-surface-border-rgb))] pr-2">
                                        {/* Preview */}
                                        <div className="space-y-2">
                                            <h3 className="text-sm font-medium text-[rgb(var(--color-on-surface-muted-rgb))]">{t('extractor.preview.title')}</h3>
                                            <div className="relative h-64 w-full overflow-hidden rounded-lg bg-[rgb(var(--color-surface-alt-2-rgb))] shadow-xs group">
                                                {imageUrl ? (
                                                    <>
                                                        <button type="button" onClick={() => window.open(imageUrl, '_blank')} className="absolute inset-0 z-10 cursor-zoom-in" aria-label="Open full-size preview"></button>
                                                        <img alt={imageTitle || 'Preview'} loading="lazy" decoding="async" className="object-contain w-full h-full transition-opacity duration-300 opacity-100" src={imageUrl} />
                                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent p-3 text-sm text-white pointer-events-none">
                                                            <p className="truncate">{imageTitle || t('extractor.preview.noTitle')}</p>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center text-[rgb(var(--color-on-surface-muted-rgb))]">
                                                        <span className="text-sm">{t('extractor.preview.noImage')}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Filter Categories */}
                                        <div className="rounded-lg border border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-alt-2-rgb))] p-3">
                                            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                                                <h3 className="text-sm font-semibold">{t('extractor.categories.title')}</h3>
                                                <div className="flex shrink-0 space-x-2">
                                                    <button onClick={() => toggleAllCategories(false)} className="rounded-md bg-[rgb(var(--color-surface-border-rgb))] px-2 py-0.5 text-xs font-medium text-[rgb(var(--color-on-surface-muted-rgb))] hover:bg-gray-300 dark:hover:bg-gray-500">{t('extractor.categories.disableAll')}</button>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-5 gap-2">
                                                {DEFAULT_TAG_CATEGORIES.map(catDef => {
                                                    const catOpt = tagCategories.find(c => c.id === catDef.id) ?? catDef;
                                                    const count = tagCounts[catOpt.id] || 0;
                                                    const active = catOpt.enabled;
                                                    const label = translateCategoryLabel(catOpt.id, catOpt.label);
                                                    return (
                                                        <button key={catOpt.id} onClick={() => toggleTagCategory(catOpt.id)} className={`group relative flex flex-col items-center justify-center rounded-lg px-2 py-1.5 transition ${active ? 'bg-[rgba(var(--color-primary-rgb),0.15)] ring-1 ring-[rgb(var(--color-primary-rgb))]/40' : 'bg-[rgb(var(--color-surface-alt-rgb))] hover:bg-[rgb(var(--color-surface-border-rgb))]'}`} aria-pressed={active} title={`${label} • ${count}`}>
                                                            <span className="mb-1 grid h-6 w-6 place-items-center rounded-md" style={{ backgroundColor: active ? `rgba(var(--color-primary-rgb),0.2)` : 'transparent' }}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`h-4 w-4 ${active ? 'text-[rgb(var(--color-primary-rgb))]' : 'text-[rgb(var(--color-on-surface-muted-rgb))]'}`}>
                                                                    {catOpt.id === 'copyright' && <g><rect x="4" y="9" width="10" height="8" rx="2"/><rect x="10" y="5" width="10" height="8" rx="2" opacity="0.65"/></g>}
                                                                    {catOpt.id === 'character' && <path d="M12 2.25c-2.9 0-5.25 2.35-5.25 5.25S9.1 12.75 12 12.75 17.25 10.4 17.25 7.5 14.9 2.25 12 2.25zm0 12c-3.45 0-6.75 1.77-6.75 4.5V21h13.5v-2.25c0-2.73-3.3-4.5-6.75-4.5z"/>}
                                                                    {catOpt.id === 'general' && <path d="M4.5 5.25h15a.75.75 0 010 1.5h-15a.75.75 0 010-1.5zm0 6h15a.75.75 0 010 1.5h-15a.75.75 0 010-1.5zm0 6h15a.75.75 0 010 1.5h-15a.75.75 0 010-1.5z"/>}
                                                                    {catOpt.id === 'meta' && <path d="M4.5 6.75A2.25 2.25 0 016.75 4.5h10.5A2.25 2.25 0 0119.5 6.75v10.5A2.25 2.25 0 0117.25 19.5H6.75A2.25 2.25 0 014.5 17.25V6.75zm3 1.5a.75.75 0 000 1.5h8.25a.75.75 0 000-1.5H7.5zM7.5 12a.75.75 0 000 1.5h8.25a.75.75 0 000-1.5H7.5zm0 3.75a.75.75 0 000 1.5H12a.75.75 0 000-1.5H7.5z"/>}
                                                                    {catOpt.id === 'other' && <g><rect x="4" y="4" width="6" height="6" rx="1.5"/><rect x="14" y="4" width="6" height="6" rx="1.5"/><rect x="4" y="14" width="6" height="6" rx="1.5"/><rect x="14" y="14" width="6" height="6" rx="1.5"/></g>}
                                                                </svg>
                                                            </span>
                                                            <span className={`text-xs font-medium ${active ? 'text-[rgb(var(--color-primary-rgb))]' : 'text-[rgb(var(--color-on-surface-muted-rgb))]'}`}>{label}</span>
                                                            <span className={`text-[10px] ${active ? 'text-[rgb(var(--color-primary-rgb))]/70' : 'text-[rgb(var(--color-on-surface-faint-rgb))]'}`}>{count}</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column (Tags) */}
                                    <div className="flex flex-col overflow-hidden">
                                        <div className="h-full">
                                            <div className="flex flex-col h-full bg-[rgb(var(--color-surface-alt-rgb))] border border-[rgb(var(--color-surface-border-rgb))] rounded-lg p-3 shadow-sm">
                                                <div className="flex flex-col h-full space-y-2">
                                                    <div className="flex-1 flex flex-col min-h-0">
                                                        <label htmlFor="tags" className="mb-1 block text-sm font-medium">{t('extractor.filteredTags.label')} ({displayedTags.split(',').filter(Boolean).length})</label>
                                                        <textarea id="tags" className="flex-1 w-full min-h-[200px] appearance-none rounded-lg border border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-alt-2-rgb))] px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary-rgb))] scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[rgb(var(--color-surface-border-rgb))] resize-none" readOnly value={displayedTags} aria-label="Filtered tags" />
                                                    </div>
                                                    <button onClick={handleCopy} disabled={!displayedTags} className={`w-full inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold shadow-xs transition-all duration-300 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:shadow-none focus-visible:ring-offset-[rgb(var(--color-surface-alt-rgb))] ${copySuccess ? 'bg-[rgb(var(--color-success-rgb))] text-[rgb(var(--color-success-content-rgb))]' : 'bg-[rgb(var(--color-on-surface-rgb))] text-[rgb(var(--color-surface-rgb))] hover:opacity-90'} disabled:cursor-not-allowed disabled:opacity-50`} aria-label={t('extractor.filteredTags.copy')}>
                                                        <span>{copySuccess ? t('extractor.filteredTags.copied') : t('extractor.filteredTags.copy')}</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            ) : activeView === 'image' ? (
                <ImageMetadataView
                    imageFile={imageFile}
                    imagePreviewUrl={imagePreviewUrl}
                    imageData={imageData}
                    imageLoading={imageLoading}
                    imageError={imageError}
                    isDraggingOverImage={isDraggingOverImage}
                    copyStatus={copyStatus}
                    fileInputRef={fileInputRef}
                    handleClearImage={handleClearImage}
                    handleImageDrop={handleImageDrop}
                    handleImageDragOver={handleImageDragOver}
                    handleImageDragLeave={handleImageDragLeave}
                    handleImageInputChange={handleImageInputChange}
                    triggerFileInput={triggerFileInput}
                    handleMetadataCopy={handleMetadataCopy}
                    imageHistory={imageHistory}
                    renderImageHistoryItem={renderImageHistoryItem}
                    imageFilterPredicate={imageFilterPredicate}
                    handleClearImageHistory={handleClearImageHistory}
                    settings={settings}
                    isMobile={isMobile}
                />
            ) : activeView === 'booru-list' ? (
                <motion.div key="booru-list-view" className="flex flex-col h-full overflow-hidden" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }} transition={{ duration: 0.3, ease: "easeOut" }}>
                    <div className="flex-grow overflow-y-auto p-6 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[rgb(var(--color-surface-border-rgb))]">
                        <BooruListPanel />
                    </div>
                </motion.div>
            ) : activeView === 'status' ? (
                <motion.div key="status-view" className="flex flex-col h-full overflow-hidden" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }} transition={{ duration: 0.3, ease: "easeOut" }}>
                    <StatusView isMobile={isMobile} />
                </motion.div>
            ) : activeView === 'api-test' ? (
                <motion.div key="api-test-view" className="flex flex-col h-full overflow-hidden" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }} transition={{ duration: 0.3, ease: "easeOut" }}>
                    <ApiTestView />
                </motion.div>
            ) : activeView === 'settings' && isMobile ? (
                <motion.div key="settings-view" className="flex flex-col h-full overflow-hidden" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }} transition={{ duration: 0.3, ease: "easeOut" }}>
                    <SettingsPanel settings={settings} onSettingsChange={handleSettingsChange} />
                </motion.div>
            ) : null}
        </AnimatePresence>
    );

    return (
        <div className="flex h-screen items-start justify-center bg-[rgb(var(--color-surface-rgb))] text-[rgb(var(--color-on-surface-rgb))] transition-colors duration-300">
            {isMobile ? (
                <MobileAppShell
                    active={activeView}
                    selectExtractor={() => setActiveView('extractor')}
                    selectImage={() => setActiveView('image')}
                    selectBooruList={() => setActiveView('booru-list')}
                    selectStatus={() => setActiveView('status')}
                    selectApiTest={() => setActiveView('api-test')}
                    openSettings={() => setActiveView('settings')}
                    highlightSettings={showSettings}
                    isDraggingOverExtractor={isDraggingOver}
                    isDraggingOverImage={isDraggingOverImage}
                    onExtractorDragOver={handleDragOver}
                    onExtractorDragLeave={handleDragLeave}
                    onExtractorDrop={handleDrop}
                    onImageDragOver={handleImageDragOver}
                    onImageDragLeave={handleImageDragLeave}
                    onImageDrop={handleImageDrop}
                >
                    {mainContent}
                </MobileAppShell>
            ) : (
                <DesktopAppShell
                    active={activeView}
                    selectExtractor={() => setActiveView('extractor')}
                    selectImage={() => setActiveView('image')}
                    selectBooruList={() => setActiveView('booru-list')}
                    selectStatus={() => setActiveView('status')}
                    selectApiTest={() => setActiveView('api-test')}
                    openSettings={() => setActiveView('settings')}
                    highlightSettings={showSettings}
                    isDraggingOverExtractor={isDraggingOver}
                    isDraggingOverImage={isDraggingOverImage}
                    onExtractorDragOver={handleDragOver}
                    onExtractorDragLeave={handleDragLeave}
                    onExtractorDrop={handleDrop}
                    onImageDragOver={handleImageDragOver}
                    onImageDragLeave={handleImageDragLeave}
                    onImageDrop={handleImageDrop}
                >
                    {mainContent}
                </DesktopAppShell>
            )}
            {isMobile && showHistoryMobile && (
              <div className="fixed inset-0 z-[9997]" onClick={() => setShowHistoryMobile(false)}>
                <div className="absolute inset-0 bg-black/60" />
                <div className="absolute bottom-[calc(var(--mobile-nav-height,56px))] left-0 right-0 px-3" onClick={(e) => e.stopPropagation()}>
                  <motion.div drag="y" dragConstraints={{ top: 0, bottom: 0 }} dragElastic={0.2} onDragEnd={(e, info) => { if (info.offset.y > 80) setShowHistoryMobile(false); }} initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} className="mx-auto max-w-xl rounded-t-2xl border border-b-0 border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-alt-rgb))] p-3 shadow-2xl">
                    <div className="mb-2 flex items-center justify-center">
                      <div className="h-1.5 w-12 rounded-full bg-[rgb(var(--color-on-surface-faint-rgb))]" />
                    </div>
                                        <HistoryPanelBase
                                            noToggle
                                            className="rounded-t-2xl"
                                            title={t('extractor.history.extractionTitle')}
                                            history={history}
                                            renderItem={renderHistoryItem}
                                            filterPredicate={extractionFilterPredicate}
                                            searchPlaceholder={t('extractor.history.searchExtraction')}
                                            onClearHistory={handleClearHistory}
                                        />
                  </motion.div>
                 </div>
            </div>
            )}
            <SettingsModal 
                isOpen={showSettings && !isMobile} 
                onClose={() => {
                    handleCloseSettings();
                    if (activeView === 'settings') {
                        setActiveView(previousViewRef.current);
                    }
                }} 
                settings={settings} 
                onSettingsChange={handleSettingsChange} 
            />
        </div>
    );
};
export default BooruTagExtractor;
