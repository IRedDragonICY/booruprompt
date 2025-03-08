'use client';

import React, { useState, useCallback, useEffect } from 'react';

// Types
type TagCategory = 'copyright' | 'character' | 'general' | 'meta' | 'other';

type TagCategoryOption = {
    id: TagCategory;
    label: string;
    enabled: boolean;
    color: string;
};

interface ExtractedTag {
    name: string;
    category: TagCategory;
}

interface ExtractionResult {
    tags: ExtractedTag[];
    imageUrl?: string;
    title?: string;
}

// Utility functions for tag extraction
const utils = {
    getCategoryFromClassList: (element: Element): TagCategory => {
        const classList = element.classList;

        if (classList.contains('tag-type-copyright')) return 'copyright';
        if (classList.contains('tag-type-character')) return 'character';
        if (classList.contains('tag-type-general')) return 'general';
        if (classList.contains('tag-type-metadata')) return 'meta';
        if (classList.contains('tag-type-artist')) return 'other';

        return 'general';
    },

    getCategoryFromHeader: (text: string): TagCategory => {
        const normalized = text.toLowerCase().trim();

        if (normalized.includes('copyright')) return 'copyright';
        if (normalized.includes('character')) return 'character';
        if (normalized.includes('general')) return 'general';
        if (normalized.includes('meta')) return 'meta';

        return 'other';
    },

    cleanTagName: (tagName: string): string => {
        return tagName.replace(/ \(\d+\.?\d*[kM]?\)$/, '').trim();
    },

    extractTagsByClass: (doc: Document, selectors: { container: string, tag: string }): ExtractedTag[] => {
        const tags: ExtractedTag[] = [];
        const elements = doc.querySelectorAll(selectors.container);

        elements.forEach(element => {
            const tagElement = element.querySelector(selectors.tag);
            const tagName = tagElement?.textContent?.trim() || '';

            if (tagName) {
                const category = utils.getCategoryFromClassList(element);
                const cleanName = utils.cleanTagName(tagName);
                tags.push({ name: cleanName, category });
            }
        });

        return tags;
    },

    extractTagsBySection: (doc: Document, selector: string, tagLinkSelector: string): ExtractedTag[] => {
        const tags: ExtractedTag[] = [];
        let currentCategory: TagCategory = 'other';

        const container = doc.querySelector(selector);
        if (!container) return [];

        Array.from(container.children).forEach(child => {
            // Check if it's a header element
            if (child.tagName === 'LI' && child.querySelector('h6')) {
                currentCategory = utils.getCategoryFromHeader(child.textContent || '');
                return;
            }

            // Check if it's a tag element
            if (child.classList.contains('tag')) {
                const tagElement = child.querySelector(tagLinkSelector);
                const tagName = tagElement?.textContent?.trim() || '';

                if (tagName) {
                    tags.push({ name: tagName, category: currentCategory });
                }
            }
        });

        return tags;
    },

    extractImageUrl: (doc: Document, selector: string): string | undefined => {
        const imgElement = doc.querySelector(selector) as HTMLImageElement;
        return imgElement?.src || imgElement?.getAttribute('data-src') || undefined;
    },

    extractTitle: (doc: Document, selector: string): string | undefined => {
        const titleElement = doc.querySelector(selector);
        return titleElement?.textContent?.trim() || undefined;
    }
};

// Extraction strategies for different booru sites
const extractionStrategies = {
    danbooru: (doc: Document): ExtractionResult => ({
        tags: utils.extractTagsByClass(doc, {
            container: '#tag-list li.flex',
            tag: 'a.search-tag'
        }),
        imageUrl: utils.extractImageUrl(doc, '#image'),
        title: utils.extractTitle(doc, 'h1.post-info')
    }),

    safebooru: (doc: Document): ExtractionResult => ({
        tags: utils.extractTagsBySection(doc, '#tag-sidebar', 'a:nth-of-type(2)'),
        imageUrl: utils.extractImageUrl(doc, '#image'),
        title: utils.extractTitle(doc, 'title')
    }),

    gelbooru: (doc: Document): ExtractionResult => ({
        tags: utils.extractTagsByClass(doc, {
            container: '.tag-list-container li',
            tag: 'a'
        }),
        imageUrl: utils.extractImageUrl(doc, '#image'),
        title: utils.extractTitle(doc, 'title')
    }),

    rule34: (doc: Document): ExtractionResult => ({
        tags: utils.extractTagsBySection(doc, '#tag-sidebar', 'a:nth-child(2)'),
        imageUrl: utils.extractImageUrl(doc, '#image'),
        title: utils.extractTitle(doc, 'title')
    }),

    e621: (doc: Document): ExtractionResult => ({
        tags: utils.extractTagsByClass(doc, {
            container: '.tag-list .tag-type-*',
            tag: '.tag-name'
        }),
        imageUrl: utils.extractImageUrl(doc, '#image'),
        title: utils.extractTitle(doc, '.post-info h1')
    })
};

// Supported booru sites configuration
const BOORU_SITES = [
    { name: 'Danbooru', urlPattern: /danbooru\.donmai\.us/i, extractTags: extractionStrategies.danbooru },
    { name: 'Safebooru', urlPattern: /safebooru\.org/i, extractTags: extractionStrategies.safebooru },
    { name: 'Gelbooru', urlPattern: /gelbooru\.com/i, extractTags: extractionStrategies.gelbooru },
    { name: 'Rule34', urlPattern: /rule34\.xxx/i, extractTags: extractionStrategies.rule34 },
    { name: 'e621', urlPattern: /e621\.net/i, extractTags: extractionStrategies.e621 }
];

// Default tag category configuration
const DEFAULT_TAG_CATEGORIES: TagCategoryOption[] = [
    { id: 'copyright', label: 'Copyright', enabled: true, color: 'bg-pink-500' },
    { id: 'character', label: 'Character', enabled: true, color: 'bg-indigo-500' },
    { id: 'general', label: 'General', enabled: true, color: 'bg-blue-500' },
    { id: 'meta', label: 'Meta', enabled: true, color: 'bg-emerald-500' },
    { id: 'other', label: 'Other', enabled: true, color: 'bg-amber-500' }
];

// UI Components
const CategoryToggle = ({
                            category,
                            count,
                            onToggle
                        }: {
    category: TagCategoryOption;
    count: number;
    onToggle: () => void;
}) => (
    <div className="flex items-center justify-between bg-gray-800 p-3 rounded-md shadow-sm transform hover:-translate-y-1 transition-all duration-300 hover:shadow-md">
        <div className="flex items-center space-x-2">
            <span className={`inline-block w-3 h-3 rounded-full ${category.color} animate-pulse`}></span>
            <span>{category.label}</span>
            {count > 0 && (
                <span className="text-xs bg-gray-700 px-2 py-0.5 rounded-full text-gray-300">
          {count}
        </span>
            )}
        </div>
        <label className="inline-flex items-center cursor-pointer">
            <input
                type="checkbox"
                className="sr-only"
                checked={category.enabled}
                onChange={onToggle}
            />
            <div className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${category.enabled ? category.color : 'bg-gray-600'}`}>
                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ease-in-out ${category.enabled ? 'transform translate-x-5' : ''}`}></div>
            </div>
        </label>
    </div>
);

const StatusMessage = ({
                           type,
                           children
                       }: {
    type: 'info' | 'error',
    children: React.ReactNode
}) => (
    <div className={`bg-gray-700 border-l-4 ${type === 'info' ? 'border-blue-500' : 'border-red-500'} p-4 rounded animate-fadeIn`}>
        <p className={`text-sm ${type === 'info' ? 'text-blue-300' : 'text-red-300'}`}>
            {children}
        </p>
    </div>
);

const LoadingSpinner = () => (
    <span className="flex items-center justify-center">
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    Extracting...
  </span>
);

const ImagePreview = ({
                          url,
                          title,
                          isLoading
                      }: {
    url?: string;
    title?: string;
    isLoading: boolean;
}) => {
    const [imgLoading, setImgLoading] = useState(true);
    const [imgError, setImgError] = useState(false);

    if (isLoading) {
        return (
            <div className="w-full h-60 flex items-center justify-center bg-gray-800 rounded-md animate-pulse">
                <div className="text-gray-500">Loading image...</div>
            </div>
        );
    }

    if (!url || imgError) {
        return (
            <div className="w-full h-60 flex items-center justify-center bg-gray-800 rounded-md">
                <div className="text-gray-500">No image available</div>
            </div>
        );
    }

    return (
        <div className="relative w-full h-60 group">
            {imgLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800 rounded-md animate-pulse">
                    <div className="text-gray-500">Loading image...</div>
                </div>
            )}

            <div className="relative w-full h-full overflow-hidden rounded-md bg-gray-800">
                {/* eslint-disable-next-line */}
                <img
                    src={url}
                    alt={title || "Booru image"}
                    className={`w-full h-full object-contain transition-all duration-300 ${imgLoading ? 'opacity-0' : 'opacity-100'}`}
                    onLoad={() => setImgLoading(false)}
                    onError={() => {
                        setImgLoading(false);
                        setImgError(true);
                    }}
                />

                {title && !imgLoading && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {title}
                    </div>
                )}
            </div>
        </div>
    );
};

// Main component
const BooruTagExtractor = () => {
    // State
    const [url, setUrl] = useState('');
    const [allExtractedTags, setAllExtractedTags] = useState<ExtractedTag[]>([]);
    const [imageUrl, setImageUrl] = useState<string | undefined>();
    const [imageTitle, setImageTitle] = useState<string | undefined>();
    const [displayedTags, setDisplayedTags] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [activeSite, setActiveSite] = useState<string | null>(null);
    const [tagCategories, setTagCategories] = useState<TagCategoryOption[]>(DEFAULT_TAG_CATEGORIES);
    const [isMobile, setIsMobile] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);

    // Check device size
    useEffect(() => {
        const checkIfMobile = () => setIsMobile(window.innerWidth < 640);
        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);
        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    // Filter tags based on selected categories
    useEffect(() => {
        if (allExtractedTags.length > 0) {
            const enabledCategories = new Set(
                tagCategories.filter(cat => cat.enabled).map(cat => cat.id)
            );

            const filteredTags = allExtractedTags
                .filter(tag => enabledCategories.has(tag.category))
                .map(tag => tag.name);

            setDisplayedTags(filteredTags.join(', '));
        }
    }, [allExtractedTags, tagCategories]);

    // Calculate tag counts
    const tagCounts = allExtractedTags.reduce((acc, tag) => {
        acc[tag.category] = (acc[tag.category] || 0) + 1;
        return acc;
    }, {} as Record<TagCategory, number>);

    // Actions
    const toggleTagCategory = (categoryId: TagCategory) => {
        setTagCategories(prev =>
            prev.map(cat => cat.id === categoryId ? { ...cat, enabled: !cat.enabled } : cat)
        );
    };

    const toggleAllCategories = (enabled: boolean) => {
        setTagCategories(prev => prev.map(cat => ({ ...cat, enabled })));
    };

    const handleReset = () => {
        setUrl('');
        setAllExtractedTags([]);
        setImageUrl(undefined);
        setImageTitle(undefined);
        setDisplayedTags('');
        setError('');
        setActiveSite(null);
        setTagCategories(DEFAULT_TAG_CATEGORIES);
        setCopySuccess(false);
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(displayedTags);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
            console.error('Failed to copy to clipboard:', err);
        }
    };

    // Extract tags from URL
    const extractTags = useCallback(async () => {
        if (!url) {
            setError('Please enter a valid URL');
            return;
        }

        setLoading(true);
        setError('');
        setAllExtractedTags([]);
        setImageUrl(undefined);
        setImageTitle(undefined);
        setDisplayedTags('');
        setActiveSite(null);
        setCopySuccess(false);

        try {
            // Find matching site
            const site = BOORU_SITES.find(site => site.urlPattern.test(url));
            if (!site) {
                setError('Unsupported site. Please use one of the supported booru sites.');
                return;
            }

            setActiveSite(site.name);

            // Fetch with AllOrigins proxy
            const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;

            const response = await fetch(proxyUrl);
            if (!response.ok) {
                throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
            }

            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // Extract tags and image using site-specific strategy
            const extractionResult = site.extractTags(doc);

            if (extractionResult.tags.length === 0) {
                setError('No tags found. The page structure might have changed or content was blocked.');
                return;
            }

            setAllExtractedTags(extractionResult.tags);
            setImageUrl(extractionResult.imageUrl);
            setImageTitle(extractionResult.title);

        } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            setError(`Failed to extract tags: ${message}`);
            console.error('Error extracting tags:', err);
        } finally {
            setLoading(false);
        }
    }, [url]);

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800 via-gray-900 to-black">
            <div className="w-full max-w-lg bg-gray-800 rounded-lg overflow-hidden border border-gray-700 shadow-xl transform transition-all duration-500 hover:shadow-2xl animate-fadeIn">
                {/* Header with animated gradient */}
                <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 animate-gradient-x"></div>
                    <h1 className="text-2xl font-bold text-white relative z-10 animate-fadeSlideDown">Booru Tag Extractor</h1>
                    <p className="text-sm text-gray-300 mt-1 relative z-10 animate-fadeSlideDown animation-delay-100">
                        Supports: {BOORU_SITES.map(site => site.name).join(', ')}
                    </p>
                </div>

                {/* Main content */}
                <div className="p-6 space-y-6 animate-fadeIn animation-delay-200">
                    {/* URL input */}
                    <div className="transform transition-all duration-300 hover:scale-[1.01]">
                        <label htmlFor="url" className="block text-sm font-medium text-gray-300 mb-2">
                            Booru Post URL
                        </label>
                        <input
                            id="url"
                            type="url"
                            className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 focus:scale-[1.01]"
                            placeholder="https://safebooru.org/index.php?page=post&s=view&id=..."
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                        />
                    </div>

                    {/* Action buttons with animations */}
                    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 animate-fadeSlideUp animation-delay-300">
                        <button
                            onClick={extractTags}
                            disabled={loading}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 transition-all duration-300 transform hover:scale-105 active:scale-95 hover:shadow-lg"
                        >
                            {loading ? <LoadingSpinner /> : 'Extract Tags'}
                        </button>

                        <button
                            onClick={handleReset}
                            className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-300 transform hover:scale-105 active:scale-95"
                        >
                            Reset
                        </button>
                    </div>

                    {/* Status messages with animations */}
                    {activeSite && !error && (
                        <div className="animate-fadeIn animation-delay-400">
                            <StatusMessage type="info">
                                Detected site: <span className="font-medium">{activeSite}</span>
                            </StatusMessage>
                        </div>
                    )}

                    {error && (
                        <div className="animate-shakeX">
                            <StatusMessage type="error">{error}</StatusMessage>
                        </div>
                    )}

                    {/* Image Preview */}
                    {(imageUrl || loading) && (
                        <div className="animate-fadeIn animation-delay-400">
                            <h3 className="text-md font-medium text-white mb-2">Image Preview</h3>
                            <ImagePreview
                                url={imageUrl}
                                title={imageTitle}
                                isLoading={loading}
                            />
                        </div>
                    )}

                    {/* Tag category filters with staggered animations */}
                    {allExtractedTags.length > 0 && (
                        <div className="space-y-4 animate-fadeIn animation-delay-500">
                            <div className="bg-gray-750 p-4 rounded-md shadow-inner backdrop-blur-sm bg-opacity-60">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-md font-medium text-white">Tag Categories</h3>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => toggleAllCategories(true)}
                                            className="text-xs bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded transition-colors duration-300 transform hover:scale-105 active:scale-95"
                                        >
                                            Select All
                                        </button>
                                        <button
                                            onClick={() => toggleAllCategories(false)}
                                            className="text-xs bg-gray-600 hover:bg-gray-700 px-2 py-1 rounded transition-colors duration-300 transform hover:scale-105 active:scale-95"
                                        >
                                            Clear All
                                        </button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {tagCategories.map((category, idx) => (
                                        <div key={category.id} className={`animate-fadeSlideUp animation-delay-${600 + idx * 100}`}>
                                            <CategoryToggle
                                                category={category}
                                                count={tagCounts[category.id] || 0}
                                                onToggle={() => toggleTagCategory(category.id)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Results with animations */}
                    {displayedTags && (
                        <div className="space-y-4 animate-fadeIn animation-delay-700">
                            <div className="transform transition-all duration-300 hover:scale-[1.01]">
                                <label htmlFor="tags" className="block text-sm font-medium text-gray-300 mb-2">
                                    Extracted Tags
                                </label>
                                <textarea
                                    id="tags"
                                    rows={isMobile ? 6 : 4}
                                    className="w-full bg-gray-700 border border-gray-600 rounded-md p-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 focus:shadow-lg"
                                    readOnly
                                    value={displayedTags}
                                />
                            </div>

                            <button
                                onClick={handleCopy}
                                className={`w-full font-medium py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-500 transform hover:scale-105 active:scale-95 hover:shadow-lg ${
                                    copySuccess
                                        ? 'bg-green-700 text-white animate-pulse'
                                        : 'bg-green-600 hover:bg-green-700 text-white'
                                }`}
                            >
                                {copySuccess ? 'Copied!' : 'Copy Tags'}
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer with animated border */}
                <div className="border-t border-gray-700 p-4 bg-gray-750 text-gray-400 text-xs relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 animate-pulse"></div>
                    <p className="relative z-10">Last updated: 2025-03-08 09:45:56 | Created with <span className="animate-heartBeat inline-block">❤️</span> by <a href="https://x.com/ireddragonicy" className="underline hover:text-blue-400 transition-colors">IRedDragonICY</a></p>
                </div>
            </div>
        </div>
    );
};

export default BooruTagExtractor;