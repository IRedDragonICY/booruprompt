import type { ColorTheme, FetchMode } from './types/settings';

export const THEME_STORAGE_KEY = 'booruExtractorThemePref';
export const COLOR_THEME_STORAGE_KEY = 'booruExtractorColorThemePref';
export const CUSTOM_COLOR_HEX_STORAGE_KEY = 'booruExtractorCustomColorHexPref';
export const AUTO_EXTRACT_STORAGE_KEY = 'booruExtractorAutoExtractPref';
export const IMAGE_PREVIEWS_STORAGE_KEY = 'booruExtractorImagePreviewsPref';
export const FETCH_MODE_STORAGE_KEY = 'booruExtractorFetchModePref';
export const CLIENT_PROXY_URL_STORAGE_KEY = 'booruExtractorClientProxyUrlPref';
export const SAVE_HISTORY_STORAGE_KEY = 'booruExtractorSaveHistoryPref';
export const MAX_HISTORY_SIZE_STORAGE_KEY = 'booruExtractorMaxHistorySizePref';
export const UNSUPPORTED_SITES_STORAGE_KEY = 'booruExtractorUnsupportedSitesPref';
export const BLACKLIST_ENABLED_STORAGE_KEY = 'booruExtractorBlacklistEnabledPref';
export const BLACKLIST_KEYWORDS_STORAGE_KEY = 'booruExtractorBlacklistKeywordsPref';
export const HISTORY_STORAGE_KEY = 'booruExtractorHistory';
export const IMAGE_HISTORY_STORAGE_KEY = 'booruExtractorImageHistory';

export const DEFAULT_COLOR_THEME: ColorTheme = 'blue';
export const DEFAULT_CUSTOM_COLOR_HEX = '#3B82F6';
export const DEFAULT_FETCH_MODE: FetchMode = 'server';
export const DEFAULT_MAX_HISTORY_SIZE = 30;
export const DEFAULT_BLACKLIST_ENABLED = true;
export const FETCH_TIMEOUT_MS = 25000;
export const THUMBNAIL_SIZE = 40;

export const CLIENT_PROXY_OPTIONS = [
    { id: 'allorigins', label: 'AllOrigins', value: 'https://api.allorigins.win/get?url=' },
    { id: 'codetabs', label: 'CodeTabs', value: 'https://api.codetabs.com/v1/proxy?quest=' },
];
export const DEFAULT_CLIENT_PROXY_URL = CLIENT_PROXY_OPTIONS[0].value;
