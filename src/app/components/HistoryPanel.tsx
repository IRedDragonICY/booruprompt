import React, { useCallback, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedIcon } from './AnimatedIcon';
import { HistoryIcon, ChevronDownIcon, MagnifyingGlassIcon, XMarkIcon, TrashIcon } from './icons/icons';
import { TooltipWrapper } from './TooltipWrapper';

export interface BaseHistoryPanelProps<T extends { id: string; timestamp: number }> {
  title: string;
  history: T[];
  renderItem: (entry: T) => React.ReactNode;
  filterPredicate: (entry: T, query: string) => boolean;
  searchPlaceholder: string;
  onClearHistory: () => void;
}

export function HistoryPanelBase<T extends { id: string; timestamp: number }>({ title, history, renderItem, filterPredicate, searchPlaceholder, onClearHistory }: BaseHistoryPanelProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const handleClearClick = useCallback(() => { onClearHistory(); setShowClearConfirm(false); setSearchQuery(''); }, [onClearHistory]);
  const handleToggleOpen = useCallback(() => setIsOpen(prev => !prev), []);
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value), []);
  const handleClearSearch = useCallback(() => setSearchQuery(''), []);
  const handleShowConfirm = useCallback(() => setShowClearConfirm(true), []);
  const handleHideConfirm = useCallback(() => setShowClearConfirm(false), []);

  const filteredHistory = useMemo(() => {
    if (!searchQuery.trim()) return history;
    const lowerCaseQuery = searchQuery.toLowerCase();
    return history.filter(entry => filterPredicate(entry, lowerCaseQuery));
  }, [history, searchQuery, filterPredicate]);

  return (
    <div className="mt-6 overflow-hidden md:rounded-lg md:border md:border-[rgb(var(--color-surface-border-rgb))] md:bg-[rgb(var(--color-surface-alt-rgb))]">
      <motion.button whileTap={{ backgroundColor: 'rgba(var(--color-surface-border-rgb), 0.5)' }} transition={{ duration: 0.05 }} onClick={handleToggleOpen} className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-[rgb(var(--color-surface-alt-2-rgb))] focus:outline-hidden focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[rgb(var(--color-primary-rgb))]" aria-expanded={isOpen} aria-controls={`${title.toLowerCase().replace(/\s+/g, '-')}-content`}>
        <div className="flex items-center space-x-2"><AnimatedIcon animation="gentle"><HistoryIcon /></AnimatedIcon><span className="font-semibold text-[rgb(var(--color-on-surface-rgb))]">{title}</span><span className="rounded-full bg-[rgb(var(--color-surface-border-rgb))] px-2 py-0.5 text-xs text-[rgb(var(--color-on-surface-muted-rgb))]">{history.length}</span></div>
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}><ChevronDownIcon /></motion.span>
      </motion.button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div id={`${title.toLowerCase().replace(/\s+/g, '-')}-content`} key="content" initial="collapsed" animate="open" exit="collapsed" variants={{ open: { opacity: 1, height: "auto" }, collapsed: { opacity: 0, height: 0 } }} transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }} className="overflow-hidden">
            <div className="border-t border-[rgb(var(--color-surface-border-rgb))] p-4">
              <div className="relative">
                <input type="text" placeholder={searchPlaceholder} value={searchQuery} onChange={handleSearchChange} className="w-full rounded-lg border border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-alt-2-rgb))] py-2 pl-10 pr-10 text-sm text-[rgb(var(--color-on-surface-rgb))] placeholder:text-[rgb(var(--color-on-surface-faint-rgb))] transition focus:border-[rgb(var(--color-primary-rgb))] focus:outline-none focus:ring-1 focus:ring-[rgb(var(--color-primary-rgb))]" aria-label={`Search ${title}`}/>
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 transform text-[rgb(var(--color-on-surface-faint-rgb))]"><MagnifyingGlassIcon/></span>
                {searchQuery && (<TooltipWrapper tipContent="Clear Search"><motion.button whileTap={{ scale: 0.9 }} onClick={handleClearSearch} className="absolute right-2 top-1/2 -translate-y-1/2 transform rounded-full p-1 text-[rgb(var(--color-on-surface-faint-rgb))] transition-colors hover:bg-[rgb(var(--color-surface-border-rgb))] hover:text-[rgb(var(--color-on-surface-rgb))]" aria-label="Clear search" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }}><XMarkIcon className="h-4 w-4"/></motion.button></TooltipWrapper>)}
              </div>
            </div>
            <div className="max-h-80 space-y-2 overflow-y-auto px-4 pb-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[rgb(var(--color-surface-border-rgb))]">
              <AnimatePresence mode="popLayout">
                {filteredHistory.map(entry => renderItem(entry))}
              </AnimatePresence>
              {filteredHistory.length === 0 && <p className="py-4 text-center text-sm text-[rgb(var(--color-on-surface-muted-rgb))]">No entries match your search.</p>}
            </div>
            <div className="relative border-t border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-alt-2-rgb))] p-3 text-right">
              <AnimatePresence>{showClearConfirm && (<motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} className="absolute right-3 bottom-full z-10 mb-2 flex items-center gap-2 rounded-sm border border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-rgb))] p-2 shadow-lg"><p className="text-xs text-[rgb(var(--color-on-surface-rgb))]">Really clear?</p><motion.button whileTap={{ scale: 0.95 }} onClick={handleClearClick} className="rounded-sm bg-red-500 px-2 py-1 text-xs font-medium text-white transition hover:bg-red-600">Yes, Clear</motion.button><motion.button whileTap={{ scale: 0.95 }} onClick={handleHideConfirm} className="rounded-sm bg-[rgb(var(--color-surface-border-rgb))] px-2 py-1 text-xs font-medium text-[rgb(var(--color-on-surface-rgb))] transition hover:bg-gray-300 dark:hover:bg-gray-500">Cancel</motion.button></motion.div>)}</AnimatePresence>
              <TooltipWrapper tipContent="Clear All History"><motion.button whileTap={{ scale: 0.95 }} onClick={handleShowConfirm} className="inline-flex items-center space-x-1 rounded-md bg-[rgb(var(--color-error-bg-rgb))] px-2.5 py-1 text-xs font-medium text-[rgb(var(--color-error-rgb))] transition hover:bg-red-100 dark:hover:bg-red-900/50" aria-label={`Clear ${title}`}><AnimatedIcon animation="gentle"><TrashIcon /></AnimatedIcon><span>Clear History</span></motion.button></TooltipWrapper>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
HistoryPanelBase.displayName = 'HistoryPanelBase';


