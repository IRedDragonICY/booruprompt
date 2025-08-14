export type ThemePreference = 'system' | 'light' | 'dark';
export type ColorTheme = 'blue' | 'orange' | 'teal' | 'rose' | 'purple' | 'green' | 'custom';
export type FetchMode = 'server' | 'clientProxy';

export interface Settings {
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

export type ActiveView = 'extractor' | 'image' | 'settings';

