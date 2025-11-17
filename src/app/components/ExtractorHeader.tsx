import React from 'react';
import { useTranslation } from 'react-i18next';
import { BOORU_SITES } from '../utils/extractionUtils';
import { LoadingSpinner } from './LoadingSpinner';

interface ExtractorHeaderProps {
  activeSite: string | null;
  url: string;
  onUrlChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onExtract: () => void;
  onReset: () => void;
  loading: boolean;
}

export const ExtractorHeader: React.FC<ExtractorHeaderProps> = ({ activeSite, url, onUrlChange, onExtract, onReset, loading }) => {
  const { t } = useTranslation(['extractor', 'common']);

  return (
    <div className="shrink-0 bg-[rgb(var(--color-surface-alt-rgb))] border-b border-[rgb(var(--color-surface-border-rgb))]/50 px-6 py-6">
      {/* Header with Title */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[rgb(var(--color-primary-rgb))] to-[rgb(var(--color-primary-focus-rgb))] p-2 shadow-sm">
            <svg className="h-full w-full text-[rgb(var(--color-primary-content-rgb))]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7v10c0 5.55 3.84 9.739 9 11 5.16-1.261 9-5.45 9-11V7l-10-5z"/>
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[rgb(var(--color-on-surface-rgb))]">{t('extractor:header.title')}</h1>
            <p className="text-sm text-[rgb(var(--color-on-surface-muted-rgb))]">{t('extractor:header.subtitle')}</p>
          </div>
        </div>
        <span className="inline-flex items-center rounded-lg bg-[rgb(var(--color-surface-alt-2-rgb))] px-3 py-1.5 text-sm font-medium text-[rgb(var(--color-on-surface-muted-rgb))] md:hidden">
          {activeSite || t('extractor:header.activePlaceholder')}
        </span>
      </div>

      {/* Supported Sites */}
      <div className="mb-6 hidden md:block">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-[rgb(var(--color-on-surface-rgb))]">{t('extractor:header.supported')}</span>
          <div className="flex flex-wrap gap-2">
            {BOORU_SITES.map(s => (
              <span
                key={s.name}
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-all duration-200 ${
                  activeSite === s.name
                    ? 'bg-[rgb(var(--color-primary-rgb))] text-[rgb(var(--color-primary-content-rgb))] shadow-sm'
                    : 'bg-[rgb(var(--color-surface-alt-2-rgb))] text-[rgb(var(--color-on-surface-muted-rgb))] hover:bg-[rgb(var(--color-surface-border-rgb))]'
                }`}
              >
                {s.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* URL Input Section */}
      <div className="hidden md:block space-y-4">
        <div className="relative">
          <label htmlFor="url" className="block text-sm font-medium text-[rgb(var(--color-on-surface-rgb))] mb-2">
            {t('extractor:header.urlLabel')}
          </label>
          <div className="relative">
            <input 
              id="url" 
              type="url" 
              className="w-full h-12 px-4 pr-12 text-base bg-[rgb(var(--color-surface-alt-2-rgb))] border border-[rgb(var(--color-surface-border-rgb))] rounded-xl transition-all duration-200 placeholder:text-[rgb(var(--color-on-surface-faint-rgb))] focus:border-[rgb(var(--color-primary-rgb))] focus:ring-2 focus:ring-[rgb(var(--color-primary-rgb))]/20 focus:outline-none" 
              placeholder={t('extractor:header.urlPlaceholder')} 
              value={url} 
              onChange={onUrlChange} 
              aria-label={t('extractor:header.urlLabel')} 
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <svg className="h-5 w-5 text-[rgb(var(--color-on-surface-faint-rgb))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button 
            onClick={onExtract} 
            disabled={loading || !url.trim()} 
            className="flex-1 h-12 inline-flex items-center justify-center gap-2 rounded-xl bg-[rgb(var(--color-primary-rgb))] px-6 text-base font-semibold text-[rgb(var(--color-primary-content-rgb))] shadow-sm transition-all duration-200 hover:bg-[rgb(var(--color-primary-focus-rgb))] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary-rgb))]/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
          >
            {loading ? <LoadingSpinner /> : (
              <>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                {t('extractor:header.manualButton')}
              </>
            )}
          </button>
          <button 
            onClick={onReset} 
            className="h-12 inline-flex items-center justify-center gap-2 px-6 rounded-xl bg-[rgb(var(--color-surface-alt-2-rgb))] text-base font-medium text-[rgb(var(--color-on-surface-rgb))] border border-[rgb(var(--color-surface-border-rgb))] transition-all duration-200 hover:bg-[rgb(var(--color-surface-border-rgb))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-on-surface-muted-rgb))]/20"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {t('extractor:header.resetButton')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExtractorHeader;


