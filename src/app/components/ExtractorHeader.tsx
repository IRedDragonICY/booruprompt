import React from 'react';
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
  return (
    <div className="shrink-0 border-b border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-alt-rgb))] px-6 py-5">
      <h1 className="text-xl font-semibold sm:text-2xl">Booru Tag Extractor</h1>
      <div className="mt-2">
        <span className="mr-2 text-sm text-[rgb(var(--color-on-surface-muted-rgb))]">Supports:</span>
        {BOORU_SITES.map(s => (
          <span
            key={s.name}
            className={`mb-1.5 mr-1.5 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors duration-150 ${
              activeSite === s.name
                ? 'bg-[rgb(var(--color-primary-rgb))]/10 text-[rgb(var(--color-primary-rgb))] dark:bg-[rgb(var(--color-primary-rgb))]/20'
                : 'bg-[rgb(var(--color-surface-alt-2-rgb))] text-[rgb(var(--color-on-surface-muted-rgb))]'
            }`}
          >
            {s.name}
          </span>
        ))}
      </div>
      <div className="mt-4">
        <label htmlFor="url" className="mb-1.5 block text-sm font-medium">
          Booru Post URL
        </label>
        <input
          id="url"
          type="url"
          className="w-full appearance-none rounded-lg border border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-alt-2-rgb))] px-4 py-2.5 placeholder:text-[rgb(var(--color-on-surface-faint-rgb))] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary-rgb))]"
          placeholder="Paste URL or Drag & Drop..."
          value={url}
          onChange={onUrlChange}
          aria-label="Booru Post URL"
        />
      </div>
      <div className="mt-4 flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
        <button
          onClick={onExtract}
          disabled={loading || !url.trim()}
          className="flex-1 inline-flex items-center justify-center rounded-lg bg-[rgb(var(--color-primary-rgb))] px-5 py-2.5 font-semibold text-[rgb(var(--color-primary-content-rgb))] shadow-xs transition hover:bg-[rgb(var(--color-primary-focus-rgb))] hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--color-primary-rgb))] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none focus-visible:ring-offset-[rgb(var(--color-surface-alt-rgb))]"
          aria-label="Extract Tags"
        >
          {loading ? <LoadingSpinner /> : 'Extract Manually'}
        </button>
        <button
          onClick={onReset}
          className="inline-flex items-center justify-center rounded-lg bg-[rgb(var(--color-surface-alt-2-rgb))] px-5 py-2.5 font-semibold transition hover:bg-[rgb(var(--color-surface-border-rgb))] focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--color-on-surface-muted-rgb))] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--color-surface-alt-rgb))]"
          aria-label="Reset"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default ExtractorHeader;


