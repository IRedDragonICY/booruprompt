'use client';

import React, { useState, useEffect, useMemo } from 'react';
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

export const BooruListPanel: React.FC = () => {
  const [booruData, setBooruData] = useState<BooruData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSafe, setFilterSafe] = useState<'all' | 'sfw' | 'nsfw'>('all');
  const [isMobile, setIsMobile] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

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

  // Filter and search
  const filteredData = useMemo(() => {
    return booruData.filter(booru => {
      const matchesSearch =
        booru.booru_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booru.booru_short_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booru.domain.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter =
        filterSafe === 'all' ||
        (filterSafe === 'sfw' && booru.is_safe) ||
        (filterSafe === 'nsfw' && !booru.is_safe);

      return matchesSearch && matchesFilter;
    });
  }, [booruData, searchQuery, filterSafe]);

  // Reset to page 1 when search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterSafe]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Format number with commas
  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US');
  };

  // BooruCard component to handle individual favicon loading
  const BooruCard = ({ booru, index }: { booru: BooruData; index: number }) => {
    const [faviconError, setFaviconError] = useState(false);

    // Use Google's favicon service to avoid CORS issues
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${booru.domain}&sz=64`;

    return (
      <motion.a
        key={booru.rank}
        href={booru.booru_url}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2, delay: Math.min(index * 0.02, 0.3) }}
        className="group relative rounded-lg bg-[rgb(var(--color-surface-alt-rgb))] border border-[rgb(var(--color-surface-border-rgb))] p-4 shadow-sm hover:shadow-md hover:border-[rgb(var(--color-primary-rgb))]/30 transition-all duration-200"
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
                  onError={() => setFaviconError(true)}
                  loading="lazy"
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
  };

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
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 md:pl-10 pr-3 py-2 md:py-2.5 rounded-lg border border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-alt-2-rgb))] text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary-rgb))]"
        />
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilterSafe('all')}
          className={`flex-1 md:flex-none px-3 md:px-4 py-2 md:py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            filterSafe === 'all'
              ? 'bg-[rgb(var(--color-primary-rgb))] text-white shadow-sm'
              : 'bg-[rgb(var(--color-surface-alt-2-rgb))] text-[rgb(var(--color-on-surface-muted-rgb))] hover:bg-[rgb(var(--color-surface-border-rgb))]'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilterSafe('sfw')}
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
          onClick={() => setFilterSafe('nsfw')}
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

      {/* Items per page selector and Results Count */}
      <div className="flex items-center justify-between gap-3 pt-2 border-t border-[rgb(var(--color-surface-border-rgb))]">
        <div className="flex items-center gap-2">
          <label htmlFor="items-per-page" className="text-xs text-[rgb(var(--color-on-surface-muted-rgb))] whitespace-nowrap">
            Per page:
          </label>
          <select
            id="items-per-page"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
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
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-[rgb(var(--color-surface-border-rgb))]">
          {/* Previous Button */}
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
              currentPage === 1
                ? 'bg-[rgb(var(--color-surface-alt-2-rgb))] text-[rgb(var(--color-on-surface-faint-rgb))] cursor-not-allowed'
                : 'bg-[rgb(var(--color-primary-rgb))] text-white hover:bg-[rgb(var(--color-primary-focus-rgb))] shadow-sm'
            }`}
          >
            Prev
          </button>

          {/* Page Info */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-[rgb(var(--color-on-surface-muted-rgb))]">
              Page
            </span>
            <span className="px-2 py-1 rounded-md bg-[rgb(var(--color-primary-rgb))]/10 text-xs font-semibold text-[rgb(var(--color-primary-rgb))]">
              {currentPage}
            </span>
            <span className="text-xs text-[rgb(var(--color-on-surface-muted-rgb))]">
              of {totalPages}
            </span>
          </div>

          {/* Next Button */}
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
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
      <div className="h-full flex flex-col space-y-4 md:space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-lg md:rounded-xl bg-gradient-to-br from-[rgb(var(--color-surface-alt-rgb))] via-[rgb(var(--color-surface-alt-rgb))] to-[rgb(var(--color-surface-alt-2-rgb))] border border-[rgb(var(--color-surface-border-rgb))] p-4 md:p-6 shadow-sm"
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
            className="rounded-lg bg-[rgb(var(--color-surface-alt-rgb))] border border-[rgb(var(--color-surface-border-rgb))] p-3 md:p-4 shadow-sm"
          >
            {renderSearchControls()}
          </motion.div>
        )}

        {/* Booru Grid */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className={`flex-1 overflow-y-auto scrollbar-thin ${isMobile ? 'pb-40' : ''}`}>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 pb-4">
                {paginatedData.map((booru, index) => (
                  <BooruCard key={booru.rank} booru={booru} index={index} />
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="shrink-0 border-t border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-alt-rgb))] p-3 md:p-4">
            <div className="flex items-center justify-between gap-4">
              {/* Previous Button */}
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
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
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-all duration-200 ${
                        currentPage === pageNum
                          ? 'bg-[rgb(var(--color-primary-rgb))] text-white shadow-sm'
                          : 'bg-[rgb(var(--color-surface-alt-2-rgb))] text-[rgb(var(--color-on-surface-muted-rgb))] hover:bg-[rgb(var(--color-surface-border-rgb))]'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <>
                    <span className="text-[rgb(var(--color-on-surface-muted-rgb))]">...</span>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      className="w-8 h-8 rounded-lg text-sm font-medium bg-[rgb(var(--color-surface-alt-2-rgb))] text-[rgb(var(--color-on-surface-muted-rgb))] hover:bg-[rgb(var(--color-surface-border-rgb))] transition-all duration-200"
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </div>

              {/* Next Button */}
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
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

            {/* Page Info */}
            <div className="mt-2 text-center text-xs text-[rgb(var(--color-on-surface-muted-rgb))]">
              Page {currentPage} of {totalPages}
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
