import React from 'react';

interface FilteredTagsPanelProps {
  displayedTags: string;
  isMobile: boolean;
  onCopy: () => void;
  copySuccess: boolean;
}

export const FilteredTagsPanel: React.FC<FilteredTagsPanelProps> = ({ displayedTags, isMobile, onCopy, copySuccess }) => {
  return (
    <div className="shrink-0 bg-[rgb(var(--color-surface-alt-rgb))] border-t border-[rgb(var(--color-surface-border-rgb))] p-4 shadow-top-md z-10">
      <div className="space-y-3">
        <div>
          <label htmlFor="tags" className="mb-1.5 block text-sm font-medium">
            Filtered Tags ({displayedTags ? displayedTags.split(',').filter(t => t.trim()).length : 0})
          </label>
          <textarea
            id="tags"
            rows={isMobile ? 3 : 2}
            className="w-full appearance-none rounded-lg border border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-alt-2-rgb))] px-4 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary-rgb))] scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[rgb(var(--color-surface-border-rgb))]"
            readOnly
            value={displayedTags || 'No tags to display.'}
            aria-label="Filtered tags"
          />
        </div>
        <button
          onClick={onCopy}
          disabled={!displayedTags || copySuccess}
          className={`w-full inline-flex items-center justify-center rounded-lg px-5 py-2.5 font-semibold shadow-xs transition-all duration-300 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:shadow-none focus-visible:ring-offset-[rgb(var(--color-surface-alt-rgb))] ${copySuccess ? 'cursor-default bg-[rgb(var(--color-success-rgb))] text-[rgb(var(--color-success-content-rgb))] focus-visible:ring-[rgb(var(--color-success-rgb))] disabled:opacity-100' : 'bg-[rgb(var(--color-on-surface-rgb))] text-[rgb(var(--color-surface-rgb))] hover:opacity-90 focus-visible:ring-[rgb(var(--color-on-surface-muted-rgb))] disabled:cursor-not-allowed disabled:opacity-50 dark:text-[rgb(var(--color-surface-alt-rgb))]'}`}
          aria-label={copySuccess ? 'Copied' : 'Copy Tags'}
        >
          <span className="ml-2">{copySuccess ? 'Copied!' : 'Copy Tags'}</span>
        </button>
      </div>
    </div>
  );
};

export default FilteredTagsPanel;


