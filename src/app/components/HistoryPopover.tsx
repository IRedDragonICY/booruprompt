import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { HistoryIcon, MagnifyingGlassIcon, XMarkIcon, TrashIcon } from './icons/icons';
import { TooltipWrapper } from './TooltipWrapper';
import { AnimatedIcon } from './AnimatedIcon';

interface HistoryPopoverProps<T extends { id: string; timestamp: number }> {
  title: string;
  history: T[];
  renderItem: (entry: T) => React.ReactNode;
  filterPredicate: (entry: T, query: string) => boolean;
  searchPlaceholder: string;
  onClearHistory: () => void;
}

export function HistoryPopover<T extends { id: string; timestamp: number }>({
  title,
  history,
  renderItem,
  filterPredicate,
  searchPlaceholder,
  onClearHistory,
}: HistoryPopoverProps<T>) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const filteredHistory = React.useMemo(() => {
    if (!searchQuery.trim()) return history;
    const lowerCaseQuery = searchQuery.toLowerCase();
    return history.filter(entry => filterPredicate(entry, lowerCaseQuery));
  }, [history, searchQuery, filterPredicate]);

  const handleClearClick = () => {
    onClearHistory();
    setShowClearConfirm(false);
    setSearchQuery('');
  };

  return (
    <div className="relative" ref={containerRef}>
      <TooltipWrapper tipContent={title}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className={`h-12 w-12 inline-flex items-center justify-center rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary-rgb))]/20 ${
            isOpen
              ? 'bg-[rgb(var(--color-primary-rgb))] text-[rgb(var(--color-primary-content-rgb))] border-transparent shadow-md'
              : 'bg-[rgb(var(--color-surface-alt-2-rgb))] text-[rgb(var(--color-on-surface-rgb))] border-[rgb(var(--color-surface-border-rgb))] hover:bg-[rgb(var(--color-surface-border-rgb))]'
          }`}
          aria-label={title}
          aria-expanded={isOpen}
        >
          <HistoryIcon className="h-5 w-5" />
        </motion.button>
      </TooltipWrapper>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute right-0 top-full z-50 mt-2 w-80 sm:w-96 origin-top-right rounded-2xl border border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-alt-rgb))] shadow-2xl backdrop-blur-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[rgb(var(--color-surface-border-rgb))] px-4 py-3">
              <h3 className="font-semibold text-[rgb(var(--color-on-surface-rgb))]">{title}</h3>
              <span className="rounded-full bg-[rgb(var(--color-surface-border-rgb))] px-2 py-0.5 text-xs font-medium text-[rgb(var(--color-on-surface-muted-rgb))]">
                {history.length}
              </span>
            </div>

            {/* Search */}
            <div className="p-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-alt-2-rgb))] py-2 pl-9 pr-8 text-sm text-[rgb(var(--color-on-surface-rgb))] placeholder:text-[rgb(var(--color-on-surface-faint-rgb))] transition-all focus:border-[rgb(var(--color-primary-rgb))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary-rgb))]/20"
                />
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[rgb(var(--color-on-surface-faint-rgb))]" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-[rgb(var(--color-on-surface-faint-rgb))] hover:bg-[rgb(var(--color-surface-border-rgb))] hover:text-[rgb(var(--color-on-surface-rgb))]"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>

            {/* List */}
            <div className="max-h-[400px] overflow-y-auto px-2 pb-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[rgb(var(--color-surface-border-rgb))]">
              {filteredHistory.length > 0 ? (
                <div className="space-y-1">
                  {filteredHistory.map((entry) => (
                    <div key={entry.id} onClick={() => setIsOpen(false)}>
                        {renderItem(entry)}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="mb-2 rounded-full bg-[rgb(var(--color-surface-alt-2-rgb))] p-3">
                    <HistoryIcon className="h-6 w-6 text-[rgb(var(--color-on-surface-faint-rgb))]" />
                  </div>
                  <p className="text-sm text-[rgb(var(--color-on-surface-muted-rgb))]">
                    {searchQuery ? t('extractor.history.emptySearch') : t('extractor.history.empty')}
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            {history.length > 0 && (
              <div className="border-t border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-alt-2-rgb))] p-3 rounded-b-2xl">
                <div className="flex justify-end">
                  <AnimatePresence>
                    {showClearConfirm ? (
                      <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="flex items-center gap-2"
                      >
                        <span className="text-xs text-[rgb(var(--color-on-surface-muted-rgb))]">{t('extractor.history.confirmMessage')}</span>
                        <button
                          onClick={handleClearClick}
                          className="rounded-lg bg-[rgb(var(--color-error-rgb))] px-3 py-1.5 text-xs font-medium text-white hover:bg-[rgb(var(--color-error-rgb))]/90"
                        >
                          {t('extractor.history.confirmYes')}
                        </button>
                        <button
                          onClick={() => setShowClearConfirm(false)}
                          className="rounded-lg bg-[rgb(var(--color-surface-border-rgb))] px-3 py-1.5 text-xs font-medium text-[rgb(var(--color-on-surface-rgb))] hover:bg-[rgb(var(--color-surface-border-rgb))]/80"
                        >
                          {t('extractor.history.confirmCancel')}
                        </button>
                      </motion.div>
                    ) : (
                      <button
                        onClick={() => setShowClearConfirm(true)}
                        className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-[rgb(var(--color-error-rgb))] hover:bg-[rgb(var(--color-error-bg-rgb))]"
                      >
                        <TrashIcon className="h-3.5 w-3.5" />
                        {t('extractor.history.clearAction')}
                      </button>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
