import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
    ArrowUpOnSquareIcon,
    XMarkIcon,
    ClipboardIcon,
    CheckCircleIcon,
    PhotoIcon,
    InformationCircleIcon,
    CodeBracketIcon,
    PaletteIcon,
    BoltIcon,
    TagIcon,
    NoSymbolIcon
} from './icons/icons';
import { LoadingSpinner } from './LoadingSpinner';
import { StatusMessage } from './StatusMessage';
import { HistoryPanelBase } from './HistoryPanel';
import { ParameterItem } from './ParameterItem';
import type { ImageMetadata } from '../utils/imageMetadata';
import type { CopyStatus } from '../types/common';
import type { ImageHistoryEntry } from '../types/history';
import type { Settings } from '../types/settings';

interface ImageMetadataViewProps {
    imageFile: File | null;
    imagePreviewUrl: string | null;
    imageData: ImageMetadata | null;
    imageLoading: boolean;
    imageError: string | null;
    isDraggingOverImage: boolean;
    copyStatus: CopyStatus;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    handleClearImage: () => void;
    handleImageDrop: (e: React.DragEvent<HTMLDivElement>) => void;
    handleImageDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
    handleImageDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
    handleImageInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    triggerFileInput: () => void;
    handleMetadataCopy: (type: keyof CopyStatus, text: string | undefined | null) => void;
    imageHistory: ImageHistoryEntry[];
    renderImageHistoryItem: (entry: ImageHistoryEntry) => React.ReactNode;
    imageFilterPredicate: (entry: ImageHistoryEntry, query: string) => boolean;
    handleClearImageHistory: () => void;
    settings: Settings;
    isMobile: boolean;
}

const MetadataSection = React.memo(({ title, icon: Icon, children, className = "" }: { title: string, icon: any, children: React.ReactNode, className?: string }) => (
    <div className={`bg-[rgb(var(--color-surface-alt-rgb))] border border-[rgb(var(--color-surface-border-rgb))] rounded-2xl overflow-hidden ${className}`} style={{ contentVisibility: 'auto', contain: 'content' }}>
        <div className="px-4 py-3 border-b border-[rgb(var(--color-surface-border-rgb))] flex items-center gap-2 bg-[rgb(var(--color-surface-alt-2-rgb))]">
            <Icon className="h-5 w-5 text-[rgb(var(--color-primary-rgb))]" />
            <h3 className="font-semibold text-sm text-[rgb(var(--color-on-surface-rgb))]">{title}</h3>
        </div>
        <div className="p-4">
            {children}
        </div>
    </div>
));
MetadataSection.displayName = 'MetadataSection';

const PromptSection = React.memo(({ 
    title, 
    content, 
    onCopy, 
    isCopied, 
    icon: Icon,
    colorClass = "text-[rgb(var(--color-on-surface-rgb))]"
}: { 
    title: string, 
    content: string, 
    onCopy: () => void, 
    isCopied: boolean,
    icon: any,
    colorClass?: string
}) => (
    <div className="group relative flex flex-col gap-2">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Icon className={`h-4 w-4 ${colorClass}`} />
                <span className="text-xs font-medium uppercase tracking-wider text-[rgb(var(--color-on-surface-muted-rgb))]">{title}</span>
            </div>
            <button
                onClick={onCopy}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-[rgb(var(--color-surface-border-rgb))] text-[rgb(var(--color-on-surface-muted-rgb))] hover:text-[rgb(var(--color-primary-rgb))]"
                title="Copy"
            >
                {isCopied ? <CheckCircleIcon className="h-4 w-4 text-[rgb(var(--color-success-rgb))]" /> : <ClipboardIcon className="h-4 w-4" />}
            </button>
        </div>
        <div 
            className="relative rounded-xl bg-[rgb(var(--color-surface-rgb))] border border-[rgb(var(--color-surface-border-rgb))] p-4 text-sm leading-relaxed whitespace-pre-wrap break-words font-mono max-h-60 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[rgb(var(--color-surface-border-rgb))]"
            style={{ contain: 'content' }}
        >
            {content}
        </div>
    </div>
));
PromptSection.displayName = 'PromptSection';

export const ImageMetadataView: React.FC<ImageMetadataViewProps> = ({
    imageFile,
    imagePreviewUrl,
    imageData,
    imageLoading,
    imageError,
    isDraggingOverImage,
    copyStatus,
    fileInputRef,
    handleClearImage,
    handleImageDrop,
    handleImageDragOver,
    handleImageDragLeave,
    handleImageInputChange,
    triggerFileInput,
    handleMetadataCopy,
    imageHistory,
    renderImageHistoryItem,
    imageFilterPredicate,
    handleClearImageHistory,
    settings,
    isMobile
}) => {
    const { t } = useTranslation();
    const [showRaw, setShowRaw] = useState(false);

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const hasImage = !!imagePreviewUrl;

    return (
        <motion.div 
            key="image-view" 
            className="flex flex-col flex-1 overflow-hidden" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            transition={{ duration: 0.2, ease: "easeOut" }}
        >
            <div className={`flex-grow flex flex-col ${hasImage ? 'p-4 md:p-8 overflow-y-auto' : 'p-4'} scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[rgb(var(--color-surface-border-rgb))]`}>
                <div className={`mx-auto w-full flex flex-col ${hasImage ? 'max-w-7xl gap-8' : 'h-full'}`}>
                    
                    {/* Drop Zone / Image Preview */}
                    <div
                        className={`relative flex flex-col items-center rounded-3xl border-2 border-dashed transition-colors duration-300 overflow-hidden 
                        ${hasImage 
                            ? 'min-h-[300px] justify-center border-[rgb(var(--color-surface-border-rgb))] hover:border-[rgb(var(--color-primary-rgb))]/50 hover:bg-[rgb(var(--color-surface-alt-rgb))]' 
                            : 'flex-1 border-[rgb(var(--color-surface-border-rgb))] hover:border-[rgb(var(--color-primary-rgb))]/50 bg-[rgb(var(--color-surface-alt-rgb))]/30'
                        }
                        ${isDraggingOverImage ? '!border-[rgb(var(--color-primary-rgb))] !bg-[rgb(var(--color-primary-rgb))]/5 scale-[1.01] transition-transform' : ''}
                        ${hasImage ? 'bg-[rgb(var(--color-surface-alt-2-rgb))] border-transparent' : ''}
                        `}
                        onDragOver={handleImageDragOver}
                        onDragLeave={handleImageDragLeave}
                        onDrop={handleImageDrop}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageInputChange}
                            accept="image/png, image/jpeg, image/webp"
                            className="hidden"
                        />
                        
                        {imageLoading ? (
                            <div className="flex flex-col items-center space-y-4 z-10 justify-center h-full">
                                <LoadingSpinner size="lg" />
                                <p className="text-sm font-medium text-[rgb(var(--color-on-surface-muted-rgb))] animate-pulse">{t('imageTool.statusProcessing')}</p>
                            </div>
                        ) : imagePreviewUrl ? (
                            <div className="relative w-full h-full flex items-center justify-center p-4 group">
                                <div className="relative max-h-[600px] w-full h-full flex items-center justify-center">
                                    <Image
                                        src={imagePreviewUrl}
                                        alt="Preview"
                                        width={0}
                                        height={0}
                                        sizes="(max-width: 768px) 100vw, 1200px"
                                        className="object-contain max-h-[600px] w-auto h-auto rounded-lg shadow-lg"
                                        priority
                                    />
                                </div>
                                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <button
                                        onClick={handleClearImage}
                                        className="rounded-full bg-black/60 p-2 text-white hover:bg-red-500/90 transition-colors shadow-lg"
                                        title="Clear Image"
                                    >
                                        <XMarkIcon className="h-5 w-5" />
                                    </button>
                                </div>
                                <div className="absolute bottom-4 left-4 right-4 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                                    <div className="bg-black/60 rounded-full px-4 py-2 text-xs text-white font-mono shadow-lg">
                                        {imageFile?.name} ({imageFile ? formatFileSize(imageFile.size) : ''})
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center w-full h-full relative">
                                <div className="flex-1 flex flex-col items-center justify-center space-y-6 text-center p-8 pointer-events-none z-10">
                                    <div className="rounded-full bg-[rgb(var(--color-surface-alt-2-rgb))] p-6 shadow-inner">
                                        <PhotoIcon className="h-12 w-12 text-[rgb(var(--color-primary-rgb))]" />
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-xl font-semibold text-[rgb(var(--color-on-surface-rgb))]">{t('imageTool.dropCtaTitle')}</p>
                                        <p className="text-sm text-[rgb(var(--color-on-surface-muted-rgb))] max-w-xs mx-auto">{t('imageTool.dropCtaSubtitle')}</p>
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); triggerFileInput(); }}
                                        className="pointer-events-auto rounded-xl bg-[rgb(var(--color-primary-rgb))] px-6 py-3 text-sm font-semibold text-[rgb(var(--color-primary-content-rgb))] shadow-lg shadow-[rgb(var(--color-primary-rgb))]/20 hover:shadow-xl hover:shadow-[rgb(var(--color-primary-rgb))]/30 hover:-translate-y-0.5 transition-all active:translate-y-0 active:shadow-sm"
                                    >
                                        {t('imageTool.selectButton')}
                                    </button>
                                </div>

                                {!isMobile && settings.saveHistory && imageHistory.length > 0 && (
                                    <div className="w-full max-w-2xl px-6 pb-6 pointer-events-auto z-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                        <HistoryPanelBase
                                            title={t('imageTool.historyTitle')}
                                            history={imageHistory}
                                            renderItem={renderImageHistoryItem}
                                            filterPredicate={imageFilterPredicate}
                                            searchPlaceholder={t('imageTool.historySearch')}
                                            onClearHistory={handleClearImageHistory}
                                            className="mt-0 shadow-lg border-[rgb(var(--color-surface-border-rgb))]"
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <AnimatePresence>
                        {imageError && (
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                                <StatusMessage type="error" className="w-full shadow-md">
                                    {imageError}
                                </StatusMessage>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {imageData && (
                        <motion.div 
                            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            {/* Left Column: Prompts */}
                            <div className="lg:col-span-2 space-y-6">
                                <MetadataSection title="Generation Prompts" icon={CodeBracketIcon}>
                                    <div className="space-y-6">
                                        {imageData.positivePrompt ? (
                                            <PromptSection
                                                title={t('imageTool.positivePrompt')}
                                                content={imageData.positivePrompt}
                                                onCopy={() => handleMetadataCopy('positive', imageData.positivePrompt)}
                                                isCopied={!!copyStatus.positive}
                                                icon={TagIcon}
                                                colorClass="text-[rgb(var(--color-success-rgb))]"
                                            />
                                        ) : (
                                            <div className="text-center py-8 text-[rgb(var(--color-on-surface-muted-rgb))] italic bg-[rgb(var(--color-surface-rgb))] rounded-xl border border-dashed border-[rgb(var(--color-surface-border-rgb))]">
                                                No positive prompt found
                                            </div>
                                        )}

                                        {imageData.negativePrompt && (
                                            <PromptSection
                                                title={t('imageTool.negativePrompt')}
                                                content={imageData.negativePrompt}
                                                onCopy={() => handleMetadataCopy('negative', imageData.negativePrompt)}
                                                isCopied={!!copyStatus.negative}
                                                icon={NoSymbolIcon}
                                                colorClass="text-[rgb(var(--color-error-rgb))]"
                                            />
                                        )}
                                    </div>
                                </MetadataSection>

                                {imageData.parameters && Object.keys(imageData.parameters).length > 0 && (
                                    <MetadataSection title={t('imageTool.parameters')} icon={BoltIcon}>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                                            {Object.entries(imageData.parameters)
                                                .sort(([keyA], [keyB]) => {
                                                    const order = ['Model', 'VAE', 'Size', 'Seed', 'Steps', 'CFG scale', 'Sampler', 'Scheduler', 'Denoise'];
                                                    const idxA = order.indexOf(keyA);
                                                    const idxB = order.indexOf(keyB);
                                                    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
                                                    if (idxA !== -1) return -1;
                                                    if (idxB !== -1) return 1;
                                                    return keyA.localeCompare(keyB);
                                                })
                                                .map(([key, value]) => (
                                                <ParameterItem key={key} label={key} value={value} />
                                            ))}
                                        </div>
                                        <div className="mt-4 flex justify-end">
                                            <button
                                                onClick={() => {
                                                    const text = imageData.parameters ? Object.entries(imageData.parameters).map(([k, v]) => `${k}: ${v}`).join('\n') : '';
                                                    handleMetadataCopy('parameters', text);
                                                }}
                                                className="text-xs font-medium text-[rgb(var(--color-primary-rgb))] hover:underline flex items-center gap-1"
                                            >
                                                {copyStatus.parameters ? <CheckCircleIcon className="h-3 w-3" /> : <ClipboardIcon className="h-3 w-3" />}
                                                {copyStatus.parameters ? t('common.copied') : t('common.copyAll')}
                                            </button>
                                        </div>
                                    </MetadataSection>
                                )}
                            </div>

                            {/* Right Column: Image Info & Raw Data */}
                            <div className="space-y-6">
                                <MetadataSection title="Image Information" icon={InformationCircleIcon}>
                                    <div className="space-y-0">
                                        {imageData.width && imageData.height && (
                                            <ParameterItem label="Dimensions" value={`${imageData.width} x ${imageData.height}`} />
                                        )}
                                        {imageData.width && imageData.height && (
                                            <ParameterItem label="Megapixels" value={`${(imageData.width * imageData.height / 1000000).toFixed(1)} MP`} />
                                        )}
                                        {imageData.bitDepth && (
                                            <ParameterItem label="Bit Depth" value={`${imageData.bitDepth}-bit`} />
                                        )}
                                        {imageData.colorType && (
                                            <ParameterItem label="Color Type" value={imageData.colorType} />
                                        )}
                                        {imageData.compression && (
                                            <ParameterItem label="Compression" value={imageData.compression} />
                                        )}
                                        {imageData.filter && (
                                            <ParameterItem label="Filter" value={imageData.filter} />
                                        )}
                                        {imageData.interlace && (
                                            <ParameterItem label="Interlace" value={imageData.interlace} />
                                        )}
                                        <ParameterItem label="File Type" value={imageFile?.type ? imageFile.type.split('/')[1].toUpperCase() : 'UNKNOWN'} />
                                    </div>
                                </MetadataSection>

                                {imageData.exif && Object.keys(imageData.exif).length > 0 && (
                                    <MetadataSection title="EXIF Data" icon={InformationCircleIcon}>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {Object.entries(imageData.exif).map(([key, value]) => (
                                                <div key={key} className={`flex flex-col ${value.length > 50 ? 'sm:col-span-2' : ''}`}>
                                                    <span className="text-xs font-medium text-[rgb(var(--color-on-surface-muted-rgb))] uppercase tracking-wider mb-1">{key}</span>
                                                    <div className="text-sm text-[rgb(var(--color-on-surface-rgb))] break-words whitespace-pre-wrap font-mono bg-[rgb(var(--color-surface-rgb))] p-2.5 rounded-lg border border-[rgb(var(--color-surface-border-rgb))]">
                                                        {value}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </MetadataSection>
                                )}

                                {(imageData.raw || imageData.comfy || (imageData.exif && Object.keys(imageData.exif).length > 0)) && (
                                    <div className="bg-[rgb(var(--color-surface-alt-rgb))] border border-[rgb(var(--color-surface-border-rgb))] rounded-2xl overflow-hidden shadow-sm">
                                        <button 
                                            onClick={() => setShowRaw(!showRaw)}
                                            className="w-full px-4 py-3 border-b border-[rgb(var(--color-surface-border-rgb))] flex items-center justify-between bg-[rgb(var(--color-surface-alt-2-rgb))] hover:bg-[rgb(var(--color-surface-border-rgb))] transition-colors"
                                        >
                                            <div className="flex items-center gap-2">
                                                <CodeBracketIcon className="h-5 w-5 text-[rgb(var(--color-primary-rgb))]" />
                                                <h3 className="font-semibold text-sm text-[rgb(var(--color-on-surface-rgb))]">Raw Metadata</h3>
                                            </div>
                                            <span className="text-xs text-[rgb(var(--color-on-surface-muted-rgb))]">{showRaw ? 'Hide' : 'Show'}</span>
                                        </button>
                                        <AnimatePresence>
                                            {showRaw && (
                                                <motion.div 
                                                    initial={{ height: 0 }} 
                                                    animate={{ height: 'auto' }} 
                                                    exit={{ height: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="p-4 bg-[rgb(var(--color-surface-rgb))] overflow-x-auto">
                                                        <pre className="text-xs font-mono text-[rgb(var(--color-on-surface-rgb))] whitespace-pre-wrap break-all">
                                                            {JSON.stringify({ 
                                                                ...imageData.raw, 
                                                                exif: imageData.exif,
                                                                comfy: imageData.comfy 
                                                            }, null, 2)}
                                                        </pre>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {!isMobile && settings.saveHistory && imageHistory.length > 0 && hasImage && (
                        <div className="mt-8">
                            <HistoryPanelBase
                                title={t('imageTool.historyTitle')}
                                history={imageHistory}
                                renderItem={renderImageHistoryItem}
                                filterPredicate={imageFilterPredicate}
                                searchPlaceholder={t('imageTool.historySearch')}
                                onClearHistory={handleClearImageHistory}
                            />
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};
