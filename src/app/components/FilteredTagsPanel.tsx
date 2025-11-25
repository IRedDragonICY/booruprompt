import React from 'react';

interface FilteredTagsPanelProps {
  displayedTags: string;
  onCopy: () => void;
  copySuccess: boolean;
}

export const FilteredTagsPanel: React.FC<FilteredTagsPanelProps> = ({ displayedTags, onCopy, copySuccess }) => {
  return (
    <div className="flex flex-col bg-[rgb(var(--color-surface-alt-rgb))] border border-[rgb(var(--color-surface-border-rgb))] rounded-lg p-2.5 md:p-3 shadow-sm">
      <div className="flex flex-col space-y-1.5 md:space-y-2">
        <div className="flex flex-col min-h-0">
          <label htmlFor="tags" className="mb-1 block text-xs md:text-sm font-medium">
            Filtered Tags ({displayedTags ? displayedTags.split(',').filter(t => t.trim()).length : 0})
          </label>
          <textarea
            id="tags"
            className="w-full min-h-[80px] md:min-h-[200px] max-h-[100px] md:max-h-none appearance-none rounded-lg border border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-alt-2-rgb))] px-2.5 py-2 text-xs md:text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary-rgb))] scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[rgb(var(--color-surface-border-rgb))] resize-none"
            readOnly
            value={displayedTags || 'No tags to display.'}
            aria-label="Filtered tags"
          />
        </div>
        <button
          onClick={onCopy}
          disabled={!displayedTags || copySuccess}
          className={`w-full inline-flex items-center justify-center rounded-lg px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-semibold shadow-xs transition-all duration-300 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:shadow-none focus-visible:ring-offset-[rgb(var(--color-surface-alt-rgb))] ${copySuccess ? 'cursor-default bg-[rgb(var(--color-success-rgb))] text-[rgb(var(--color-success-content-rgb))] focus-visible:ring-[rgb(var(--color-success-rgb))] disabled:opacity-100' : 'bg-[rgb(var(--color-on-surface-rgb))] text-[rgb(var(--color-surface-rgb))] hover:opacity-90 focus-visible:ring-[rgb(var(--color-on-surface-muted-rgb))] disabled:cursor-not-allowed disabled:opacity-50 dark:text-[rgb(var(--color-surface-alt-rgb))]'}`}
          aria-label={copySuccess ? 'Copied' : 'Copy Tags'}
        >
          <span>{copySuccess ? 'Copied!' : 'Copy Tags'}</span>
        </button>
      </div>
    </div>
  );
};

export default FilteredTagsPanel;


