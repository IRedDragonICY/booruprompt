'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  GlobeAltIcon,
  PhotoIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  ShieldExclamationIcon,
  TrophyIcon,
  ArrowUpRightIcon
} from './icons/icons';

interface BooruData {
  rank: number;
  booru_short_name: string;
  booru_title: string;
  booru_url: string;
  favicon_url: string;
  images: number;
  members: number;
  owner_name: string;
  status_label: string;
  is_safe: boolean;
  scheme: string;
  domain: string;
  booru_subdomain: string;
  hosted_by_booru_org: boolean;
  page_index: number;
}

// Custom debounce hook for performance optimization
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

type SortField = 'rank' | 'images' | 'members';
type SortDirection = 'asc' | 'desc';

export const BooruListPanel: React.FC = () => {
  const [booruData, setBooruData] = useState<BooruData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSafe, setFilterSafe] = useState<'all' | 'sfw' | 'nsfw'>('all');
  const [isMobile, setIsMobile] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [sortField, setSortField] = useState<SortField>('rank');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Debounce search query to reduce filtering operations
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch data from JSON
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/booru_top.json');
        if (!response.ok) {
          throw new Error('Failed to fetch booru data');
        }
        const data = await response.json();
        setBooruData(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter, search, and sort - using debounced search for better performance
  const filteredData = useMemo(() => {
    const filtered = booruData.filter(booru => {
      const matchesSearch =
        booru.booru_title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        booru.booru_short_name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        booru.domain.toLowerCase().includes(debouncedSearchQuery.toLowerCase());

      const matchesFilter =
        filterSafe === 'all' ||
        (filterSafe === 'sfw' && booru.is_safe) ||
        (filterSafe === 'nsfw' && !booru.is_safe);

      return matchesSearch && matchesFilter;
    });

    // Sort the filtered data
    return filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'rank':
          comparison = a.rank - b.rank; // Lower rank number = higher position
          break;
        case 'images':
          comparison = a.images - b.images;
          break;
        case 'members':
          comparison = a.members - b.members;
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [booruData, debouncedSearchQuery, filterSafe, sortField, sortDirection]);

  // Reset to page 1 when search/filter/sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, filterSafe, sortField, sortDirection]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Format number with commas - memoized
  const formatNumber = useCallback((num: number) => {
    return num.toLocaleString('en-US');
  }, []);

  // Memoized event handlers for better performance
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleFilterAll = useCallback(() => {
    setFilterSafe('all');
  }, []);

  const handleFilterSfw = useCallback(() => {
    setFilterSafe('sfw');
  }, []);

  const handleFilterNsfw = useCallback(() => {
    setFilterSafe('nsfw');
  }, []);

  const handleItemsPerPageChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handlePrevPage = useCallback(() => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  }, [totalPages]);

  const handleSortFieldChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortField(e.target.value as SortField);
  }, []);

  const handleSortDirectionToggle = useCallback(() => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  }, []);

  // BooruCard component to handle individual favicon loading - memoized
  const BooruCard = memo(({ booru, index }: { booru: BooruData; index: number }) => {
    const [faviconError, setFaviconError] = useState(false);

    // Use Google's favicon service to avoid CORS issues
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${booru.domain}&sz=64`;

    // Memoize favicon error handler
    const handleFaviconError = useCallback(() => {
      setFaviconError(true);
    }, []);

    return (
      <motion.a
        key={booru.rank}
        href={booru.booru_url}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15, delay: Math.min(index * 0.01, 0.15) }}
        className="group relative rounded-lg bg-[rgb(var(--color-surface-alt-rgb))] border border-[rgb(var(--color-surface-border-rgb))] p-4 shadow-sm hover:shadow-md hover:border-[rgb(var(--color-primary-rgb))]/30 transition-all duration-200"
        style={{ willChange: 'opacity' }}
      >
        {/* Rank Badge */}
        <div className="absolute -top-2 -left-2 w-8 h-8 md:w-10 md:h-10 rounded-full bg-[rgb(var(--color-primary-rgb))] text-white font-bold text-xs md:text-sm flex items-center justify-center shadow-md">
          #{booru.rank}
        </div>

        {/* Status Badge */}
        <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-medium ${
          booru.is_safe
            ? 'bg-[rgb(var(--color-success-rgb))]/10 text-[rgb(var(--color-success-rgb))]'
            : 'bg-[rgb(var(--color-error-rgb))]/10 text-[rgb(var(--color-error-rgb))]'
        }`}>
          {booru.status_label}
        </div>

        {/* Booru Info */}
        <div className="mt-2">
          <div className="flex items-start gap-3 mb-3">
            {/* Favicon */}
            <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-lg bg-[rgb(var(--color-surface-alt-2-rgb))] border border-[rgb(var(--color-surface-border-rgb))] flex items-center justify-center overflow-hidden">
              {!faviconError ? (
                <img
                  src={faviconUrl}
                  alt={booru.booru_title}
                  className="w-6 h-6 md:w-8 md:h-8 object-contain"
                  onError={handleFaviconError}
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <GlobeAltIcon className="h-5 w-5 md:h-6 md:w-6 text-[rgb(var(--color-on-surface-muted-rgb))]" />
              )}
            </div>

            {/* Title and Domain */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-[rgb(var(--color-on-surface-rgb))] text-sm md:text-base mb-1 truncate group-hover:text-[rgb(var(--color-primary-rgb))] transition-colors">
                {booru.booru_title}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-[rgb(var(--color-on-surface-muted-rgb))]">
                <GlobeAltIcon className="h-3 w-3" />
                <span className="truncate">{booru.domain}</span>
              </div>
            </div>

            {/* External Link Icon */}
            <ArrowUpRightIcon className="h-4 w-4 text-[rgb(var(--color-on-surface-muted-rgb))] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 md:gap-3">
            <div className="flex items-center gap-2 px-2 md:px-3 py-1.5 md:py-2 rounded-md bg-[rgb(var(--color-surface-alt-2-rgb))]">
              <PhotoIcon className="h-4 w-4 text-[rgb(var(--color-primary-rgb))]" />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] md:text-xs text-[rgb(var(--color-on-surface-muted-rgb))] leading-none mb-0.5">Images</p>
                <p className="text-xs md:text-sm font-semibold text-[rgb(var(--color-on-surface-rgb))] truncate">{formatNumber(booru.images)}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 px-2 md:px-3 py-1.5 md:py-2 rounded-md bg-[rgb(var(--color-surface-alt-2-rgb))]">
              <UserGroupIcon className="h-4 w-4 text-[rgb(var(--color-secondary-rgb))]" />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] md:text-xs text-[rgb(var(--color-on-surface-muted-rgb))] leading-none mb-0.5">Members</p>
                <p className="text-xs md:text-sm font-semibold text-[rgb(var(--color-on-surface-rgb))] truncate">{formatNumber(booru.members)}</p>
              </div>
            </div>
          </div>

          {/* Owner Info */}
          {booru.owner_name && (
            <div className="mt-2 pt-2 border-t border-[rgb(var(--color-surface-border-rgb))]">
              <p className="text-xs text-[rgb(var(--color-on-surface-muted-rgb))]">
                Owner: <span className="font-medium text-[rgb(var(--color-on-surface-rgb))]">{booru.owner_name}</span>
              </p>
            </div>
          )}
        </div>
      </motion.a>
    );
  });

  // Add display name for better debugging
  BooruCard.displayName = 'BooruCard';

  // Render Search and Filter Controls component
  const renderSearchControls = () => (
    <div className="flex flex-col gap-3">
      {/* Search Input */}
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-[rgb(var(--color-on-surface-muted-rgb))]" />
        <input
          type="text"
          placeholder="Search booru sites..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full pl-9 md:pl-10 pr-3 py-2 md:py-2.5 rounded-lg border border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-alt-2-rgb))] text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary-rgb))]"
        />
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleFilterAll}
          className={`flex-1 md:flex-none px-3 md:px-4 py-2 md:py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            filterSafe === 'all'
              ? 'bg-[rgb(var(--color-primary-rgb))] text-white shadow-sm'
              : 'bg-[rgb(var(--color-surface-alt-2-rgb))] text-[rgb(var(--color-on-surface-muted-rgb))] hover:bg-[rgb(var(--color-surface-border-rgb))]'
          }`}
        >
          All
        </button>
        <button
          onClick={handleFilterSfw}
          className={`flex-1 md:flex-none px-3 md:px-4 py-2 md:py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-1.5 ${
            filterSafe === 'sfw'
              ? 'bg-[rgb(var(--color-success-rgb))] text-white shadow-sm'
              : 'bg-[rgb(var(--color-surface-alt-2-rgb))] text-[rgb(var(--color-on-surface-muted-rgb))] hover:bg-[rgb(var(--color-surface-border-rgb))]'
          }`}
        >
          <ShieldCheckIcon className="h-4 w-4" />
          <span>SFW</span>
        </button>
        <button
          onClick={handleFilterNsfw}
          className={`flex-1 md:flex-none px-3 md:px-4 py-2 md:py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center gap-1.5 ${
            filterSafe === 'nsfw'
              ? 'bg-[rgb(var(--color-error-rgb))] text-white shadow-sm'
              : 'bg-[rgb(var(--color-surface-alt-2-rgb))] text-[rgb(var(--color-on-surface-muted-rgb))] hover:bg-[rgb(var(--color-surface-border-rgb))]'
          }`}
        >
          <ShieldExclamationIcon className="h-4 w-4" />
          <span>NSFW</span>
        </button>
      </div>

      {/* Sort Controls */}
      <div className="flex items-center gap-2 pt-2 border-t border-[rgb(var(--color-surface-border-rgb))]">
        <label htmlFor="sort-by" className="text-xs text-[rgb(var(--color-on-surface-muted-rgb))] whitespace-nowrap">
          Sort by:
        </label>
        <select
          id="sort-by"
          value={sortField}
          onChange={handleSortFieldChange}
          className="flex-1 md:flex-none px-2 py-1 rounded-md border border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-alt-2-rgb))] text-xs focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary-rgb))]"
        >
          <option value="rank">Rank (Top)</option>
          <option value="images">Images Count</option>
          <option value="members">Members Count</option>
        </select>
        <button
          onClick={handleSortDirectionToggle}
          className="px-2 py-1 rounded-md border border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-alt-2-rgb))] text-xs font-medium text-[rgb(var(--color-on-surface-muted-rgb))] hover:bg-[rgb(var(--color-surface-border-rgb))] transition-all duration-200 flex items-center gap-1"
          title={sortDirection === 'asc' ? 'Ascending' : 'Descending'}
        >
          {sortDirection === 'asc' ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z" clipRule="evenodd" />
            </svg>
          )}
          <span className="hidden md:inline">{sortDirection === 'asc' ? 'Asc' : 'Desc'}</span>
        </button>
      </div>

      {/* Items per page selector and Results Count */}
      <div className="flex items-center justify-between gap-3 pt-2 border-t border-[rgb(var(--color-surface-border-rgb))]">
        <div className="flex items-center gap-2">
          <label htmlFor="items-per-page" className="text-xs text-[rgb(var(--color-on-surface-muted-rgb))] whitespace-nowrap">
            Per page:
          </label>
          <select
            id="items-per-page"
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="px-2 py-1 rounded-md border border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-alt-2-rgb))] text-xs focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary-rgb))]"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        {/* Results Count */}
        <p className="text-xs text-[rgb(var(--color-on-surface-muted-rgb))] text-right">
          <span className="font-semibold text-[rgb(var(--color-primary-rgb))]">{startIndex + 1}-{Math.min(endIndex, filteredData.length)}</span> of {filteredData.length}
        </p>
      </div>

      {/* Mobile Pagination Controls */}
      {isMobile && totalPages > 1 && (
        <div className="flex items-center justify-between gap-1.5 pt-2 border-t border-[rgb(var(--color-surface-border-rgb))]">
          {/* Previous Button */}
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap ${
              currentPage === 1
                ? 'bg-[rgb(var(--color-surface-alt-2-rgb))] text-[rgb(var(--color-on-surface-faint-rgb))] cursor-not-allowed'
                : 'bg-[rgb(var(--color-primary-rgb))] text-white hover:bg-[rgb(var(--color-primary-focus-rgb))] shadow-sm'
            }`}
          >
            Prev
          </button>

          {/* Page Numbers */}
          <div className="flex items-center justify-center gap-0.5 flex-1 overflow-x-auto scrollbar-none">
            {(() => {
              const pages: (number | string)[] = [];

              if (totalPages <= 5) {
                // Show all pages if total is 5 or less
                for (let i = 1; i <= totalPages; i++) {
                  pages.push(i);
                }
              } else {
                // Always show first page
                pages.push(1);

                if (currentPage <= 3) {
                  // Near the start: 1 2 3 4 ... last
                  for (let i = 2; i <= 4; i++) {
                    pages.push(i);
                  }
                  pages.push('...');
                  pages.push(totalPages);
                } else if (currentPage >= totalPages - 2) {
                  // Near the end: 1 ... last-3 last-2 last-1 last
                  pages.push('...');
                  for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                  }
                } else {
                  // In the middle: 1 ... current-1 current current+1 ... last
                  pages.push('...');
                  pages.push(currentPage - 1);
                  pages.push(currentPage);
                  pages.push(currentPage + 1);
                  pages.push('...');
                  pages.push(totalPages);
                }
              }

              return pages.map((page, idx) => {
                if (page === '...') {
                  return (
                    <span key={`ellipsis-${idx}`} className="text-[rgb(var(--color-on-surface-muted-rgb))] text-xs px-0.5">
                      ...
                    </span>
                  );
                }

                return (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page as number)}
                    className={`min-w-[26px] h-7 px-1 rounded-md text-xs font-medium transition-all duration-200 ${
                      currentPage === page
                        ? 'bg-[rgb(var(--color-primary-rgb))] text-white shadow-sm'
                        : 'bg-[rgb(var(--color-surface-alt-2-rgb))] text-[rgb(var(--color-on-surface-muted-rgb))]'
                    }`}
                  >
                    {page}
                  </button>
                );
              });
            })()}
          </div>

          {/* Next Button */}
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap ${
              currentPage === totalPages
                ? 'bg-[rgb(var(--color-surface-alt-2-rgb))] text-[rgb(var(--color-on-surface-faint-rgb))] cursor-not-allowed'
                : 'bg-[rgb(var(--color-primary-rgb))] text-white hover:bg-[rgb(var(--color-primary-focus-rgb))] shadow-sm'
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[rgb(var(--color-primary-rgb))] mx-auto mb-4"></div>
          <p className="text-[rgb(var(--color-on-surface-muted-rgb))]">Loading booru data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="text-center max-w-md p-6 rounded-lg bg-[rgb(var(--color-error-rgb))]/10 border border-[rgb(var(--color-error-rgb))]/20">
          <ShieldExclamationIcon className="h-12 w-12 text-[rgb(var(--color-error-rgb))] mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[rgb(var(--color-on-surface-rgb))] mb-2">Error Loading Data</h3>
          <p className="text-sm text-[rgb(var(--color-on-surface-muted-rgb))]">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="h-full flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-lg md:rounded-xl bg-gradient-to-br from-[rgb(var(--color-surface-alt-rgb))] via-[rgb(var(--color-surface-alt-rgb))] to-[rgb(var(--color-surface-alt-2-rgb))] border border-[rgb(var(--color-surface-border-rgb))] p-4 md:p-6 shadow-sm mb-4 md:mb-6"
        >
          <div className="flex items-start gap-3 md:gap-4">
            <div className="rounded-md md:rounded-lg bg-[rgb(var(--color-primary-rgb))]/10 p-2 md:p-3">
              <TrophyIcon className="h-5 w-5 md:h-6 md:w-6 text-[rgb(var(--color-primary-rgb))]" />
            </div>
            <div className="flex-1">
              <h2 className="text-base md:text-xl font-semibold text-[rgb(var(--color-on-surface-rgb))] mb-1 md:mb-2">
                Top Booru Leaderboard
              </h2>
              <p className="text-sm md:text-base text-[rgb(var(--color-on-surface-muted-rgb))] leading-snug md:leading-relaxed">
                <span className="md:hidden">Explore the top booru sites ranked by total images and activity.</span>
                <span className="hidden md:block">Discover the most popular booru sites from across the web. This comprehensive leaderboard ranks sites by total images, member count, and activity. Data is sourced from Booru.org and regularly updated.</span>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Search and Filter Controls - Desktop Only */}
        {!isMobile && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="rounded-lg bg-[rgb(var(--color-surface-alt-rgb))] border border-[rgb(var(--color-surface-border-rgb))] p-3 md:p-4 shadow-sm mb-4 md:mb-6"
          >
            {renderSearchControls()}
          </motion.div>
        )}

        {/* Booru Grid */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <div
            className={`flex-1 overflow-y-auto scrollbar-thin ${isMobile ? 'pb-40' : ''}`}
            style={{ contain: 'layout style paint' }}
          >
            <AnimatePresence mode="popLayout">
              {filteredData.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center h-full min-h-[300px]"
              >
                <div className="text-center">
                  <MagnifyingGlassIcon className="h-12 w-12 text-[rgb(var(--color-on-surface-muted-rgb))] mx-auto mb-4 opacity-50" />
                  <p className="text-[rgb(var(--color-on-surface-muted-rgb))]">No booru sites found</p>
                </div>
              </motion.div>
            ) : (
              <div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 pb-4"
                style={{ contain: 'layout style' }}
              >
                {paginatedData.map((booru, index) => (
                  <BooruCard key={booru.rank} booru={booru} index={index} />
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Pagination Controls - Desktop Only */}
        {!isMobile && totalPages > 1 && (
          <div className="shrink-0 mt-auto border-t border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-rgb))] py-4">
            <div className="flex items-center justify-center gap-4">
              {/* Previous Button */}
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentPage === 1
                    ? 'bg-[rgb(var(--color-surface-alt-2-rgb))] text-[rgb(var(--color-on-surface-faint-rgb))] cursor-not-allowed'
                    : 'bg-[rgb(var(--color-primary-rgb))] text-white hover:bg-[rgb(var(--color-primary-focus-rgb))] shadow-sm'
                }`}
              >
                Previous
              </button>

              {/* Page Numbers */}
              <div className="flex items-center gap-2">
                {(() => {
                  const pages: (number | string)[] = [];

                  if (totalPages <= 7) {
                    // Show all pages if total is 7 or less
                    for (let i = 1; i <= totalPages; i++) {
                      pages.push(i);
                    }
                  } else {
                    // Always show first page
                    pages.push(1);

                    if (currentPage <= 4) {
                      // Near the start: 1 2 3 4 5 ... last
                      for (let i = 2; i <= 5; i++) {
                        pages.push(i);
                      }
                      pages.push('...');
                      pages.push(totalPages);
                    } else if (currentPage >= totalPages - 3) {
                      // Near the end: 1 ... last-4 last-3 last-2 last-1 last
                      pages.push('...');
                      for (let i = totalPages - 4; i <= totalPages; i++) {
                        pages.push(i);
                      }
                    } else {
                      // In the middle: 1 ... current-1 current current+1 ... last
                      pages.push('...');
                      pages.push(currentPage - 1);
                      pages.push(currentPage);
                      pages.push(currentPage + 1);
                      pages.push('...');
                      pages.push(totalPages);
                    }
                  }

                  return pages.map((page, idx) => {
                    if (page === '...') {
                      return (
                        <span key={`ellipsis-${idx}`} className="text-[rgb(var(--color-on-surface-muted-rgb))] px-1">
                          ...
                        </span>
                      );
                    }

                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page as number)}
                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-all duration-200 ${
                          currentPage === page
                            ? 'bg-[rgb(var(--color-primary-rgb))] text-white shadow-sm'
                            : 'bg-[rgb(var(--color-surface-alt-2-rgb))] text-[rgb(var(--color-on-surface-muted-rgb))] hover:bg-[rgb(var(--color-surface-border-rgb))]'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  });
                })()}
              </div>

              {/* Next Button */}
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentPage === totalPages
                    ? 'bg-[rgb(var(--color-surface-alt-2-rgb))] text-[rgb(var(--color-on-surface-faint-rgb))] cursor-not-allowed'
                    : 'bg-[rgb(var(--color-primary-rgb))] text-white hover:bg-[rgb(var(--color-primary-focus-rgb))] shadow-sm'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
      </div>

      {/* Mobile Fixed Search Bar at Bottom */}
      {isMobile && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="fixed left-0 right-0 z-40 md:hidden"
          style={{ bottom: 'var(--mobile-nav-height, 56px)' }}
        >
          <div className="mx-auto max-w-xl rounded-t-2xl border border-b-0 border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-alt-rgb))] p-3 shadow-md">
            {renderSearchControls()}
          </div>
        </motion.div>
      )}
    </>
  );
};

export default BooruListPanel;
