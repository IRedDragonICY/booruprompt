'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { PageHeader } from './PageHeader';
import {
    MagnifyingGlassIcon,
    ChartBarIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    XCircleIcon,
} from './icons/icons';

interface SiteStatus {
    name: string;
    status: 'operational' | 'degraded' | 'partial_outage' | 'major_outage';
    responseTime: number;
    lastChecked: string;
    error?: string;
    url?: string;
    rank?: number;
}

interface OverallStatus {
    uptimePercentage: string;
    operationalCount: number;
    totalCount: number;
    status: 'operational' | 'degraded' | 'major_outage';
}

interface StatusResponse {
    overall: OverallStatus;
    sites: SiteStatus[];
    lastUpdated: string;
}

interface StatusViewProps {
    isMobile?: boolean;
}

const StatusIcon: React.FC<{ status: SiteStatus['status'] }> = ({ status }) => {
    const iconClass = "h-5 w-5";

    switch (status) {
        case 'operational':
            return (
                <svg className={iconClass} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
            );
        case 'degraded':
            return (
                <svg className={iconClass} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
            );
        case 'partial_outage':
        case 'major_outage':
            return (
                <svg className={iconClass} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
            );
    }
};

const getStatusColor = (status: SiteStatus['status']) => {
    switch (status) {
        case 'operational':
            return 'text-emerald-500';
        case 'degraded':
            return 'text-amber-500';
        case 'partial_outage':
            return 'text-orange-500';
        case 'major_outage':
            return 'text-red-500';
    }
};

const getStatusBgColor = (status: SiteStatus['status']) => {
    switch (status) {
        case 'operational':
            return 'bg-emerald-500/10 border-emerald-500/20';
        case 'degraded':
            return 'bg-amber-500/10 border-amber-500/20';
        case 'partial_outage':
            return 'bg-orange-500/10 border-orange-500/20';
        case 'major_outage':
            return 'bg-red-500/10 border-red-500/20';
    }
};

const getStatusDotColor = (status: SiteStatus['status']) => {
    switch (status) {
        case 'operational':
            return 'bg-emerald-500 shadow-emerald-500/50';
        case 'degraded':
            return 'bg-amber-500 shadow-amber-500/50';
        case 'partial_outage':
            return 'bg-orange-500 shadow-orange-500/50';
        case 'major_outage':
            return 'bg-red-500 shadow-red-500/50';
    }
};

const getStatusText = (status: SiteStatus['status'], t: any) => {
    switch (status) {
        case 'operational':
            return t('apiStatus.statusOperational');
        case 'degraded':
            return t('apiStatus.statusDegraded');
        case 'partial_outage':
            return t('apiStatus.statusPartialOutage');
        case 'major_outage':
            return t('apiStatus.statusMajorOutage');
    }
};

interface StatusHistoryEntry {
    timestamp: number;
    status: SiteStatus['status'];
}

// Uptime data (60 minutes) - shows real history from local storage
const generateUptimeData = (siteName: string, currentStatus: SiteStatus['status'], history: Record<string, StatusHistoryEntry[]>): { fill: string; title: string }[] => {
    const maxPoints = 60;
    const siteHistory = history[siteName] || [];
    const data: { fill: string; title: string }[] = [];

    // Pad with "no data" at the beginning if history is short
    const paddingCount = Math.max(0, maxPoints - siteHistory.length);
    
    for (let i = 0; i < paddingCount; i++) {
        data.push({
            fill: '#d1d5db', // gray - no data
            title: 'No data'
        });
    }

    // Add history points
    siteHistory.forEach(entry => {
        let fill: string;
        let statusText: string;

        switch (entry.status) {
            case 'operational':
                fill = '#76ad2a'; // green
                statusText = 'Operational';
                break;
            case 'degraded':
                fill = '#d1a92a'; // yellow
                statusText = 'Degraded Performance';
                break;
            case 'partial_outage':
                fill = '#e7a82a'; // orange
                statusText = 'Partial Outage';
                break;
            case 'major_outage':
                fill = '#e04343'; // red
                statusText = 'Major Outage';
                break;
            default:
                fill = '#d1d5db';
                statusText = 'Unknown';
        }

        data.push({
            fill,
            title: `${new Date(entry.timestamp).toLocaleTimeString()}: ${statusText}`
        });
    });

    return data;
};

export default function StatusView({ isMobile = false }: StatusViewProps) {
    const { t } = useTranslation();
    const [statusData, setStatusData] = useState<StatusResponse | null>(null);
    const [history, setHistory] = useState<Record<string, StatusHistoryEntry[]>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | SiteStatus['status']>('all');
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const itemsPerPageOptions = [10, 20, 50];

    useEffect(() => {
        const CACHE_KEY = 'booru_status_cache';
        const HISTORY_KEY = 'booru_status_history_v1';
        const CACHE_DURATION = 60 * 1000; // 1 minute

        // Load history from local storage
        try {
            const savedHistory = localStorage.getItem(HISTORY_KEY);
            if (savedHistory) {
                setHistory(JSON.parse(savedHistory));
            }
        } catch (e) {
            console.error('Failed to load history:', e);
        }

        const fetchStatus = async () => {
            try {
                const response = await fetch('/api/status');

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const data: StatusResponse = await response.json();
                setStatusData(data);
                setError(null);
                
                // Update history
                setHistory(prevHistory => {
                    const newHistory = { ...prevHistory };
                    const now = Date.now();
                    
                    data.sites.forEach(site => {
                        if (!newHistory[site.name]) {
                            newHistory[site.name] = [];
                        }
                        
                        // Add new entry if it's newer than the last one (by at least 50 seconds)
                        const lastEntry = newHistory[site.name][newHistory[site.name].length - 1];
                        if (!lastEntry || (now - lastEntry.timestamp > 50 * 1000)) {
                            newHistory[site.name].push({
                                timestamp: now,
                                status: site.status
                            });
                            
                            // Keep last 60 entries
                            if (newHistory[site.name].length > 60) {
                                newHistory[site.name] = newHistory[site.name].slice(-60);
                            }
                        }
                    });
                    
                    // Save to local storage
                    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
                    
                    return newHistory;
                });
                
                // Cache the successful response
                localStorage.setItem(CACHE_KEY, JSON.stringify({
                    data,
                    timestamp: Date.now()
                }));
            } catch (err) {
                console.error('Failed to fetch status:', err);
                // Only set error state if we don't have any cached data to show
                if (!localStorage.getItem(CACHE_KEY)) {
                    setError(err instanceof Error ? err.message : 'Failed to fetch status');
                }
            } finally {
                setLoading(false);
            }
        };

        // 1. Try to load from cache immediately
        const cached = localStorage.getItem(CACHE_KEY);
        let shouldFetchImmediately = true;

        if (cached) {
            try {
                const { data, timestamp } = JSON.parse(cached);
                if (data) {
                    setStatusData(data);
                    setLoading(false); // Show cached data immediately
                    
                    // Check if cache is fresh
                    if (Date.now() - timestamp < CACHE_DURATION) {
                        shouldFetchImmediately = false;
                    }
                }
            } catch (e) {
                console.error('Failed to parse cached status:', e);
            }
        }

        // 2. Fetch fresh data if cache is missing or stale
        if (shouldFetchImmediately) {
            fetchStatus();
        }

        // 3. Set up polling interval (every minute)
        const interval = setInterval(fetchStatus, CACHE_DURATION);

        return () => clearInterval(interval);
    }, []);

    // Premium Shimmer Skeleton - simple pulse animation
    const ShimmerBox = ({ className }: { className: string }) => (
        <div className={`animate-pulse bg-[rgb(var(--color-surface-border-rgb))]/60 ${className}`} />
    );

    const HeaderSkeleton = () => (
        <div className="bg-gradient-to-br from-[rgb(var(--color-surface-alt-rgb))] to-[rgb(var(--color-surface-alt-2-rgb))]/50 rounded-2xl p-6 border border-[rgb(var(--color-surface-border-rgb))]/50">
            <div className="flex items-center justify-between">
                <div>
                    <ShimmerBox className="h-3 w-24 rounded mb-3" />
                    <div className="flex items-center gap-3">
                        <ShimmerBox className="w-4 h-4 rounded-full" />
                        <ShimmerBox className="h-7 w-36 rounded-lg" />
                    </div>
                </div>
                <div className="text-right flex flex-col items-end">
                    <ShimmerBox className="h-3 w-16 rounded mb-3" />
                    <ShimmerBox className="h-10 w-24 rounded-lg" />
                </div>
            </div>
            <div className="mt-5 pt-4 border-t border-[rgb(var(--color-surface-border-rgb))]/30">
                <div className="flex items-center gap-4">
                    <ShimmerBox className="h-8 w-20 rounded-lg" />
                    <div className="flex-1">
                        <ShimmerBox className="h-3 w-full rounded-full" />
                    </div>
                    <ShimmerBox className="h-4 w-20 rounded" />
                </div>
            </div>
        </div>
    );

    const CardSkeleton = () => (
        <div className="bg-[rgb(var(--color-surface-alt-rgb))]/80 rounded-2xl border border-[rgb(var(--color-surface-border-rgb))]/50 overflow-hidden">
            {/* Header */}
            <div className="p-5 pb-4">
                <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                            <ShimmerBox className="h-[22px] w-24 rounded" />
                        </div>
                        <div className="flex items-center gap-1.5">
                            <ShimmerBox className="w-3 h-3 rounded shrink-0" />
                            <ShimmerBox className="h-3 w-44 rounded" />
                        </div>
                    </div>
                    <ShimmerBox className="h-[34px] w-[105px] rounded-xl shrink-0" />
                </div>
            </div>
            {/* Uptime Bar */}
            <div className="px-5 pb-2">
                <ShimmerBox className="h-8 w-full rounded-lg" />
                <div className="flex items-center justify-between mt-2 px-0.5">
                    <ShimmerBox className="h-[10px] w-14 rounded" />
                    <ShimmerBox className="h-[10px] w-28 rounded" />
                    <ShimmerBox className="h-[10px] w-6 rounded" />
                </div>
            </div>
            {/* Footer */}
            <div className="px-5 py-3 bg-[rgb(var(--color-surface-alt-2-rgb))]/30 border-t border-[rgb(var(--color-surface-border-rgb))]/30">
                <div className="flex items-center gap-2">
                    <ShimmerBox className="w-3.5 h-3.5 rounded shrink-0" />
                    <ShimmerBox className="h-3 w-28 rounded" />
                </div>
            </div>
        </div>
    );

    const StatusSkeleton = ({ count = 4 }: { count?: number }) => (
        <div className="space-y-4">
            {Array.from({ length: count }).map((_, i) => (
                <CardSkeleton key={i} />
            ))}
        </div>
    );

    if (error) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600">{t('apiStatus.error', { message: error })}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-[rgb(var(--color-primary-rgb))] text-white rounded-lg"
                    >
                        {t('apiStatus.retry')}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            {/* Shared Header */}
            <PageHeader
                icon={
                    <svg className="h-6 w-6 md:h-7 md:w-7 text-[rgb(var(--color-primary-rgb))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                }
                title={t('apiStatus.title')}
                subtitle={t('apiStatus.subtitle')}
            />
            <div className={`flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[rgb(var(--color-surface-border-rgb))] ${isMobile ? 'pb-64' : ''}`}>
                <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 md:py-8">
                    {/* Overall Status Card */}
                    <div className="mb-6 md:mb-8">

                        {statusData ? (
                            <div className="bg-gradient-to-br from-[rgb(var(--color-surface-alt-rgb))] to-[rgb(var(--color-surface-alt-2-rgb))]/50 rounded-2xl p-6 border border-[rgb(var(--color-surface-border-rgb))]/50 shadow-xl shadow-black/5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-medium text-[rgb(var(--color-on-surface-muted-rgb))]/60 uppercase tracking-wider mb-2">
                                            {t('apiStatus.overallStatus')}
                                        </p>
                                        <div className="flex items-center gap-3">
                                            <div className={`w-3.5 h-3.5 rounded-full shadow-lg ${getStatusDotColor(statusData.overall.status)}`} />
                                            <p className={`text-2xl font-bold ${getStatusColor(statusData.overall.status)}`}>
                                                {getStatusText(statusData.overall.status, t)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-medium text-[rgb(var(--color-on-surface-muted-rgb))]/60 uppercase tracking-wider mb-2">
                                            {t('apiStatus.uptime')}
                                        </p>
                                        <p className="text-3xl font-black text-[rgb(var(--color-on-surface-rgb))]">
                                            {statusData.overall.uptimePercentage}<span className="text-lg font-semibold text-[rgb(var(--color-on-surface-muted-rgb))]">%</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-5 pt-4 border-t border-[rgb(var(--color-surface-border-rgb))]/30">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl font-bold text-[rgb(var(--color-on-surface-rgb))]">
                                                {statusData.overall.operationalCount}
                                            </span>
                                            <span className="text-sm text-[rgb(var(--color-on-surface-muted-rgb))]">
                                                of {statusData.overall.totalCount}
                                            </span>
                                        </div>
                                        <div className="flex-1">
                                            <div className="h-2.5 bg-[rgb(var(--color-surface-alt-2-rgb))] rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500"
                                                    style={{ width: `${(statusData.overall.operationalCount / statusData.overall.totalCount) * 100}%` }}
                                                />
                                            </div>
                                        </div>
                                        <span className="text-xs font-medium text-[rgb(var(--color-on-surface-muted-rgb))]">
                                            operational
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <HeaderSkeleton />
                        )}
                    </div>

                    {/* Last updated */}
                    {statusData && (
                        <div className="mb-6 text-center">
                            <p className="text-sm text-[rgb(var(--color-on-surface-muted-rgb))]">
                                {t('apiStatus.lastUpdated', { time: new Date(statusData.lastUpdated).toLocaleString() })}
                            </p>
                        </div>
                    )}

                    {/* Search and Filter - Desktop Only */}
                    {!isMobile && (
                        <div className="mb-6 flex flex-col md:flex-row gap-4">
                            {/* Search input */}
                            <div className="flex-1">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={t('apiStatus.searchPlaceholder')}
                                    className="w-full px-4 py-2 bg-[rgb(var(--color-surface-alt-rgb))] border border-[rgb(var(--color-surface-border-rgb))] rounded-lg text-[rgb(var(--color-on-surface-rgb))] placeholder-[rgb(var(--color-on-surface-muted-rgb))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary-rgb))]"
                                />
                            </div>

                            {/* Status filter */}
                            <div>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                                    className="w-full md:w-auto px-4 py-2 bg-[rgb(var(--color-surface-alt-rgb))] border border-[rgb(var(--color-surface-border-rgb))] rounded-lg text-[rgb(var(--color-on-surface-rgb))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary-rgb))]"
                                >
                                    <option value="all">{t('apiStatus.filterAll')}</option>
                                    <option value="operational">{t('apiStatus.filterOperational')}</option>
                                    <option value="degraded">{t('apiStatus.filterDegraded')}</option>
                                    <option value="partial_outage">{t('apiStatus.filterPartialOutage')}</option>
                                    <option value="major_outage">{t('apiStatus.filterMajorOutage')}</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Services Status */}
                    <div className="space-y-4">
                        {loading && !statusData ? (
                            <StatusSkeleton count={isMobile ? 3 : 5} />
                        ) : (
                            (() => {
                                const filteredSites = statusData?.sites.filter((site) => {
                                    // Filter by search query
                                    const matchesSearch = site.name.toLowerCase().includes(searchQuery.toLowerCase());

                                    // Filter by status
                                    const matchesStatus = statusFilter === 'all' || site.status === statusFilter;

                                    return matchesSearch && matchesStatus;
                                }) || [];
                                
                                // Pagination calculations
                                const totalPages = Math.ceil(filteredSites.length / itemsPerPage);
                                const startIndex = (currentPage - 1) * itemsPerPage;
                                const endIndex = startIndex + itemsPerPage;
                                const paginatedSites = filteredSites.slice(startIndex, endIndex);

                                // Generate page numbers
                                const getPageNumbers = () => {
                                    const pages: (number | string)[] = [];
                                    if (totalPages <= 5) {
                                        for (let i = 1; i <= totalPages; i++) pages.push(i);
                                    } else {
                                        pages.push(1);
                                        if (currentPage > 3) pages.push('...');
                                        for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
                                            if (!pages.includes(i)) pages.push(i);
                                        }
                                        if (currentPage < totalPages - 2) pages.push('...');
                                        if (!pages.includes(totalPages)) pages.push(totalPages);
                                    }
                                    return pages;
                                };

                                return (
                                    <>
                                        {/* Results count */}
                                        {!isMobile && (
                                            <div className="mb-4 flex items-center justify-between">
                                                <p className="text-sm text-[rgb(var(--color-on-surface-muted-rgb))]"
                                                    dangerouslySetInnerHTML={{
                                                        __html: t('apiStatus.showingResults', {
                                                            count: filteredSites.length,
                                                            total: statusData?.sites.length || 0
                                                        })
                                                    }}
                                                />
                                                <p className="text-sm text-[rgb(var(--color-on-surface-muted-rgb))]"
                                                    dangerouslySetInnerHTML={{ __html: t('apiStatus.uptimePeriod') }}
                                                />
                                            </div>
                                        )}

                                        {filteredSites.length === 0 ? (
                                            <div className="bg-[rgb(var(--color-surface-alt-rgb))] rounded-xl p-12 border border-[rgb(var(--color-surface-border-rgb))] text-center">
                                                <p className="text-[rgb(var(--color-on-surface-muted-rgb))] text-lg">
                                                    {t('apiStatus.noResults')}
                                                </p>
                                                <button
                                                    onClick={() => {
                                                        setSearchQuery('');
                                                        setStatusFilter('all');
                                                    }}
                                                    className="mt-4 px-4 py-2 bg-[rgb(var(--color-primary-rgb))] text-white rounded-lg hover:opacity-90 transition-opacity"
                                                >
                                                    {t('apiStatus.clearFilters')}
                                                </button>
                                            </div>
                                        ) : (
                                            paginatedSites.map((site) => {
                                const uptimeData = generateUptimeData(site.name, site.status, history);
                                const uptimePercent = site.status === 'operational' ? '100.00' : site.status === 'degraded' ? '99.00' : site.status === 'partial_outage' ? '95.00' : '0.00';

                                return (
                                    <motion.div
                                        key={site.name}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="group bg-[rgb(var(--color-surface-alt-rgb))]/80 backdrop-blur-sm rounded-2xl border border-[rgb(var(--color-surface-border-rgb))]/50 overflow-hidden hover:border-[rgb(var(--color-primary-rgb))]/30 transition-all duration-300 hover:shadow-lg hover:shadow-black/5"
                                    >
                                        {/* Card Header */}
                                        <div className="p-5 pb-4">
                                            <div className="flex items-start gap-4">
                                                {/* Left - Site Info */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h3 className="text-lg font-bold text-[rgb(var(--color-on-surface-rgb))] truncate">
                                                            {site.name}
                                                        </h3>
                                                        {site.rank != null && site.rank > 0 && (
                                                            <span className="shrink-0 px-2 py-0.5 text-[10px] font-bold bg-[rgb(var(--color-primary-rgb))]/10 text-[rgb(var(--color-primary-rgb))] rounded-md">
                                                                #{site.rank}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {site.url && (
                                                        <a 
                                                            href={site.url} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer" 
                                                            className="inline-flex items-center gap-1.5 text-xs text-[rgb(var(--color-primary-rgb))]/80 hover:text-[rgb(var(--color-primary-rgb))] transition-colors truncate max-w-full"
                                                        >
                                                            <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                                            </svg>
                                                            <span className="truncate">{site.url}</span>
                                                        </a>
                                                    )}
                                                    {site.error && (
                                                        <div className="mt-2 flex items-center gap-1.5 text-xs text-red-500">
                                                            <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                            </svg>
                                                            <span className="truncate">{site.error}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Right - Status Badge */}
                                                <div className={`shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl border ${getStatusBgColor(site.status)}`}>
                                                    <div className={`w-2.5 h-2.5 rounded-full shadow-md ${getStatusDotColor(site.status)}`} />
                                                    <span className={`text-xs font-semibold whitespace-nowrap ${getStatusColor(site.status)}`}>
                                                        {getStatusText(site.status, t)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Uptime Visualization */}
                                        <div className="px-5 pb-2">
                                            <div className="relative h-8 bg-[rgb(var(--color-surface-alt-2-rgb))]/50 rounded-lg overflow-hidden">
                                                <svg
                                                    className="w-full h-full"
                                                    viewBox="0 0 300 32"
                                                    preserveAspectRatio="none"
                                                >
                                                    {uptimeData.map((day, index) => (
                                                        <rect
                                                            key={index}
                                                            height="32"
                                                            width="4"
                                                            x={index * 5}
                                                            y="0"
                                                            rx="1"
                                                            fill={day.fill}
                                                            className="transition-opacity hover:opacity-70 cursor-pointer"
                                                        >
                                                            <title>{day.title}</title>
                                                        </rect>
                                                    ))}
                                                </svg>
                                            </div>
                                            <div className="flex items-center justify-between mt-2 px-0.5">
                                                <span className="text-[10px] text-[rgb(var(--color-on-surface-muted-rgb))]/60">{t('apiStatus.daysAgo')}</span>
                                                <span className="text-[10px] font-medium text-[rgb(var(--color-on-surface-muted-rgb))]">
                                                    {uptimePercent}% uptime (recent)
                                                </span>
                                                <span className="text-[10px] text-[rgb(var(--color-on-surface-muted-rgb))]/60">{t('apiStatus.today')}</span>
                                            </div>
                                        </div>

                                        {/* Response Time Footer */}
                                        <div className="px-5 py-3 bg-[rgb(var(--color-surface-alt-2-rgb))]/30 border-t border-[rgb(var(--color-surface-border-rgb))]/30">
                                            <div className="flex items-center gap-2 text-xs text-[rgb(var(--color-on-surface-muted-rgb))]">
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span>Response time:</span>
                                                <span className={`font-bold ${site.responseTime < 500 ? 'text-emerald-500' : site.responseTime < 2000 ? 'text-amber-500' : 'text-red-500'}`}>
                                                    {site.responseTime}ms
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })
                                        )}

                                        {/* Desktop Pagination Controls */}
                                        {!isMobile && totalPages > 1 && (
                                            <div className="shrink-0 mt-6 border-t border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-rgb))] py-4">
                                                <div className="flex items-center justify-center gap-4">
                                                    <button
                                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                                        disabled={currentPage === 1}
                                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                                                            currentPage === 1
                                                                ? 'bg-[rgb(var(--color-surface-alt-2-rgb))] text-[rgb(var(--color-on-surface-faint-rgb))] cursor-not-allowed'
                                                                : 'bg-[rgb(var(--color-primary-rgb))] text-white hover:bg-[rgb(var(--color-primary-focus-rgb))] shadow-sm'
                                                        }`}
                                                    >
                                                        {t('booruList.pagination.previous')}
                                                    </button>

                                                    <div className="flex items-center gap-2">
                                                        {getPageNumbers().map((page, idx) => (
                                                            typeof page === 'number' ? (
                                                                <button
                                                                    key={idx}
                                                                    onClick={() => setCurrentPage(page)}
                                                                    className={`min-w-[32px] h-8 px-2 rounded-md text-sm font-medium transition-all duration-200 ${
                                                                        currentPage === page
                                                                            ? 'bg-[rgb(var(--color-primary-rgb))] text-white shadow-sm'
                                                                            : 'bg-[rgb(var(--color-surface-alt-2-rgb))] text-[rgb(var(--color-on-surface-muted-rgb))] hover:bg-[rgb(var(--color-surface-border-rgb))]'
                                                                    }`}
                                                                >
                                                                    {page}
                                                                </button>
                                                            ) : (
                                                                <span key={idx} className="text-[rgb(var(--color-on-surface-muted-rgb))]">...</span>
                                                            )
                                                        ))}
                                                    </div>

                                                    <button
                                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                                        disabled={currentPage === totalPages}
                                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                                                            currentPage === totalPages
                                                                ? 'bg-[rgb(var(--color-surface-alt-2-rgb))] text-[rgb(var(--color-on-surface-faint-rgb))] cursor-not-allowed'
                                                                : 'bg-[rgb(var(--color-primary-rgb))] text-white hover:bg-[rgb(var(--color-primary-focus-rgb))] shadow-sm'
                                                        }`}
                                                    >
                                                        {t('booruList.pagination.next')}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                );
                            })()
                        )}
                    </div>

                    {/* Legend */}
                    <div className="mt-8 p-5 bg-[rgb(var(--color-surface-alt-rgb))]/60 backdrop-blur-sm rounded-2xl border border-[rgb(var(--color-surface-border-rgb))]/50">
                        <h3 className="text-xs font-bold text-[rgb(var(--color-on-surface-rgb))]/60 uppercase tracking-wider mb-4">
                            {t('apiStatus.legendTitle')}
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            <div className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-[rgb(var(--color-surface-alt-2-rgb))]/50 transition-colors">
                                <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-md shadow-emerald-500/30"></div>
                                <span className="text-xs font-medium text-[rgb(var(--color-on-surface-muted-rgb))]">{t('apiStatus.statusOperational')}</span>
                            </div>
                            <div className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-[rgb(var(--color-surface-alt-2-rgb))]/50 transition-colors">
                                <div className="w-3 h-3 rounded-full bg-amber-500 shadow-md shadow-amber-500/30"></div>
                                <span className="text-xs font-medium text-[rgb(var(--color-on-surface-muted-rgb))]">{t('apiStatus.statusDegraded')}</span>
                            </div>
                            <div className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-[rgb(var(--color-surface-alt-2-rgb))]/50 transition-colors">
                                <div className="w-3 h-3 rounded-full bg-orange-500 shadow-md shadow-orange-500/30"></div>
                                <span className="text-xs font-medium text-[rgb(var(--color-on-surface-muted-rgb))]">{t('apiStatus.statusPartialOutage')}</span>
                            </div>
                            <div className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-[rgb(var(--color-surface-alt-2-rgb))]/50 transition-colors">
                                <div className="w-3 h-3 rounded-full bg-red-500 shadow-md shadow-red-500/30"></div>
                                <span className="text-xs font-medium text-[rgb(var(--color-on-surface-muted-rgb))]">{t('apiStatus.statusMajorOutage')}</span>
                            </div>
                            <div className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-[rgb(var(--color-surface-alt-2-rgb))]/50 transition-colors">
                                <div className="w-3 h-3 rounded-full bg-gray-400/50"></div>
                                <span className="text-xs font-medium text-[rgb(var(--color-on-surface-muted-rgb))]">{t('apiStatus.legendNoData')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Controls Card */}
            {isMobile && (
                <div 
                    className="fixed left-0 right-0 z-40 md:hidden rounded-t-2xl border border-b-0 border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-alt-rgb))] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]"
                    style={{ bottom: 'var(--mobile-nav-height, 56px)' }}
                >
                    <div className="mx-auto max-w-xl p-3">
                        {/* Drag Handle */}
                        <div className="flex justify-center mb-3">
                            <div className="w-12 h-1.5 rounded-full bg-[rgb(var(--color-on-surface-faint-rgb))]"></div>
                        </div>

                        <div className="flex flex-col gap-3">
                            {/* Search */}
                            <div className="relative">
                                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[rgb(var(--color-on-surface-muted-rgb))]" />
                                <input
                                    placeholder={t('apiStatus.searchPlaceholder')}
                                    value={searchQuery}
                                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-alt-2-rgb))] text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary-rgb))]"
                                    type="text"
                                />
                            </div>

                            {/* Status Filter Buttons */}
                            <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
                                {[
                                    { value: 'all', label: t('apiStatus.filterAll'), icon: ChartBarIcon },
                                    { value: 'operational', label: 'Up', icon: CheckCircleIcon },
                                    { value: 'degraded', label: 'Slow', icon: ExclamationTriangleIcon },
                                    { value: 'partial_outage', label: 'Part', icon: ExclamationTriangleIcon },
                                    { value: 'major_outage', label: 'Down', icon: XCircleIcon },
                                ].map(({ value, label, icon: Icon }) => (
                                    <button
                                        key={value}
                                        onClick={() => { setStatusFilter(value as typeof statusFilter); setCurrentPage(1); }}
                                        className={`flex-1 min-w-[60px] px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 flex flex-col items-center justify-center gap-1 ${
                                            statusFilter === value
                                                ? 'bg-[rgb(var(--color-primary-rgb))] text-white shadow-sm'
                                                : 'bg-[rgb(var(--color-surface-alt-2-rgb))] text-[rgb(var(--color-on-surface-muted-rgb))] hover:bg-[rgb(var(--color-surface-border-rgb))]'
                                        }`}
                                    >
                                        <Icon className="h-5 w-5" />
                                        <span>{label}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Per page & Results info */}
                            <div className="flex items-center justify-between gap-3 pt-2 border-t border-[rgb(var(--color-surface-border-rgb))]">
                                <div className="flex items-center gap-2">
                                    <label className="text-xs text-[rgb(var(--color-on-surface-muted-rgb))] whitespace-nowrap">Per page:</label>
                                    <select
                                        value={itemsPerPage}
                                        onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                                        className="px-2 py-1 rounded-md border border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-alt-2-rgb))] text-xs focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary-rgb))]"
                                    >
                                        {itemsPerPageOptions.map(opt => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                </div>
                                <p className="text-xs text-[rgb(var(--color-on-surface-muted-rgb))] text-right">
                                    <span className="font-semibold text-[rgb(var(--color-primary-rgb))]">
                                        {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, statusData?.sites.filter(s => 
                                            s.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
                                            (statusFilter === 'all' || s.status === statusFilter)
                                        ).length || 0)}
                                    </span> of {statusData?.sites.filter(s => 
                                        s.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
                                        (statusFilter === 'all' || s.status === statusFilter)
                                    ).length || 0}
                                </p>
                            </div>

                            {/* Pagination */}
                            {(() => {
                                const filteredCount = statusData?.sites.filter(s => 
                                    s.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
                                    (statusFilter === 'all' || s.status === statusFilter)
                                ).length || 0;
                                const totalPages = Math.ceil(filteredCount / itemsPerPage);
                                
                                if (totalPages <= 1) return null;
                                
                                const getPageNumbers = () => {
                                    const pages: (number | string)[] = [];
                                    if (totalPages <= 5) {
                                        for (let i = 1; i <= totalPages; i++) pages.push(i);
                                    } else {
                                        pages.push(1);
                                        if (currentPage > 3) pages.push('...');
                                        for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
                                            if (!pages.includes(i)) pages.push(i);
                                        }
                                        if (currentPage < totalPages - 2) pages.push('...');
                                        if (!pages.includes(totalPages)) pages.push(totalPages);
                                    }
                                    return pages;
                                };

                                return (
                                    <div className="flex items-center justify-between gap-1.5 pt-2 border-t border-[rgb(var(--color-surface-border-rgb))]">
                                        <button
                                            disabled={currentPage === 1}
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                                                currentPage === 1
                                                    ? 'bg-[rgb(var(--color-surface-alt-2-rgb))] text-[rgb(var(--color-on-surface-faint-rgb))] cursor-not-allowed'
                                                    : 'bg-[rgb(var(--color-primary-rgb))] text-white hover:bg-[rgb(var(--color-primary-focus-rgb))] shadow-sm'
                                            }`}
                                        >
                                            Prev
                                        </button>
                                        
                                        <div className="flex items-center justify-center gap-0.5 flex-1 overflow-x-auto scrollbar-none">
                                            {getPageNumbers().map((page, idx) => (
                                                typeof page === 'number' ? (
                                                    <button
                                                        key={idx}
                                                        onClick={() => setCurrentPage(page)}
                                                        className={`min-w-[26px] h-7 px-1 rounded-md text-xs font-medium transition-all duration-200 ${
                                                            currentPage === page
                                                                ? 'bg-[rgb(var(--color-primary-rgb))] text-white shadow-sm'
                                                                : 'bg-[rgb(var(--color-surface-alt-2-rgb))] text-[rgb(var(--color-on-surface-muted-rgb))]'
                                                        }`}
                                                    >
                                                        {page}
                                                    </button>
                                                ) : (
                                                    <span key={idx} className="text-[rgb(var(--color-on-surface-muted-rgb))] text-xs px-0.5">...</span>
                                                )
                                            ))}
                                        </div>

                                        <button
                                            disabled={currentPage === totalPages}
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                                                currentPage === totalPages
                                                    ? 'bg-[rgb(var(--color-surface-alt-2-rgb))] text-[rgb(var(--color-on-surface-faint-rgb))] cursor-not-allowed'
                                                    : 'bg-[rgb(var(--color-primary-rgb))] text-white hover:bg-[rgb(var(--color-primary-focus-rgb))] shadow-sm'
                                            }`}
                                        >
                                            Next
                                        </button>
                                    </div>
                                );
                            })()}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
