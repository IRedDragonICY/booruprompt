'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface SiteStatus {
    name: string;
    status: 'operational' | 'degraded' | 'partial_outage' | 'major_outage';
    responseTime: number;
    lastChecked: string;
    error?: string;
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
            return 'text-green-600';
        case 'degraded':
            return 'text-yellow-600';
        case 'partial_outage':
            return 'text-orange-600';
        case 'major_outage':
            return 'text-red-600';
    }
};

const getStatusBgColor = (status: SiteStatus['status']) => {
    switch (status) {
        case 'operational':
            return 'bg-green-100';
        case 'degraded':
            return 'bg-yellow-100';
        case 'partial_outage':
            return 'bg-orange-100';
        case 'major_outage':
            return 'bg-red-100';
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

// Uptime data (90 days) - shows gray for untracked days and current status for today
const generateUptimeData = (status: SiteStatus['status']): { fill: string; title: string }[] => {
    const days = 90;
    const data: { fill: string; title: string }[] = [];

    for (let i = 0; i < days; i++) {
        const daysAgo = days - i - 1;
        const date = new Date();
        date.setDate(date.getDate() - daysAgo);

        let fill: string;
        let statusText: string;

        // Only show real status for today (last day), rest is no data
        if (i === days - 1) {
            // Today - show actual status
            switch (status) {
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
            }
        } else {
            // Previous days - no data yet
            fill = '#d1d5db'; // gray - no data
            statusText = 'No data';
        }

        data.push({
            fill,
            title: `${date.toLocaleDateString()}: ${statusText}`
        });
    }

    return data;
};

export default function StatusView() {
    const { t } = useTranslation();
    const [statusData, setStatusData] = useState<StatusResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | SiteStatus['status']>('all');

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                setLoading(true);

                // Fetch from cached API endpoint
                const response = await fetch('/api/status');

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const data: StatusResponse = await response.json();
                setStatusData(data);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch status:', err);
                setError(err instanceof Error ? err.message : 'Failed to fetch status');
            } finally {
                setLoading(false);
            }
        };

        fetchStatus();

        // Refresh every hour (data is updated hourly by cron, or daily on Hobby plan)
        const interval = setInterval(fetchStatus, 60 * 60 * 1000);

        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[rgb(var(--color-primary-rgb))]"></div>
                    <p className="mt-4 text-[rgb(var(--color-on-surface-muted-rgb))]">{t('apiStatus.loading')}</p>
                </div>
            </div>
        );
    }

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
        <div className="h-full overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[rgb(var(--color-surface-border-rgb))]">
            <div className="max-w-6xl mx-auto px-6 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[rgb(var(--color-on-surface-rgb))] mb-6">
                        {t('apiStatus.title')}
                    </h1>

                    {statusData && (
                        <div className="bg-[rgb(var(--color-surface-alt-rgb))] rounded-xl p-6 border border-[rgb(var(--color-surface-border-rgb))]">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-[rgb(var(--color-on-surface-muted-rgb))] mb-1">
                                        {t('apiStatus.overallStatus')}
                                    </p>
                                    <p className={`text-2xl font-semibold ${getStatusColor(statusData.overall.status)}`}>
                                        {getStatusText(statusData.overall.status, t)}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-[rgb(var(--color-on-surface-muted-rgb))] mb-1">
                                        {t('apiStatus.uptime')}
                                    </p>
                                    <p className="text-2xl font-semibold text-[rgb(var(--color-on-surface-rgb))]">
                                        {statusData.overall.uptimePercentage}%
                                    </p>
                                </div>
                            </div>
                            <div className="mt-4 text-sm text-[rgb(var(--color-on-surface-muted-rgb))]">
                                {t('apiStatus.servicesOperational', {
                                    count: statusData.overall.operationalCount,
                                    total: statusData.overall.totalCount
                                })}
                            </div>
                        </div>
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

                {/* Search and Filter */}
                {statusData && (
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
                    {(() => {
                        const filteredSites = statusData?.sites.filter((site) => {
                            // Filter by search query
                            const matchesSearch = site.name.toLowerCase().includes(searchQuery.toLowerCase());

                            // Filter by status
                            const matchesStatus = statusFilter === 'all' || site.status === statusFilter;

                            return matchesSearch && matchesStatus;
                        }) || [];

                        return (
                            <>
                                {/* Results count */}
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
                                    filteredSites.map((site) => {
                        const uptimeData = generateUptimeData(site.status);

                        return (
                            <motion.div
                                key={site.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-[rgb(var(--color-surface-alt-rgb))] rounded-xl p-6 border border-[rgb(var(--color-surface-border-rgb))]"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-[rgb(var(--color-on-surface-rgb))] mb-1">
                                            {site.name}
                                        </h3>
                                        {site.error && (
                                            <p className="text-sm text-red-600 mt-1">
                                                {site.error}
                                            </p>
                                        )}
                                    </div>

                                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${getStatusBgColor(site.status)}`}>
                                        <StatusIcon status={site.status} />
                                        <span className={`text-sm font-medium ${getStatusColor(site.status)}`}>
                                            {getStatusText(site.status, t)}
                                        </span>
                                    </div>
                                </div>

                                {/* Uptime visualization */}
                                <div className="mt-4">
                                    <svg
                                        className="w-full"
                                        height="34"
                                        viewBox="0 0 448 34"
                                        preserveAspectRatio="none"
                                    >
                                        {uptimeData.map((day, index) => (
                                            <rect
                                                key={index}
                                                height="34"
                                                width="3"
                                                x={index * 5}
                                                y="0"
                                                fill={day.fill}
                                                className="hover:opacity-80 cursor-pointer"
                                            >
                                                <title>{day.title}</title>
                                            </rect>
                                        ))}
                                    </svg>

                                    <div className="flex items-center justify-between mt-2 text-xs text-[rgb(var(--color-on-surface-muted-rgb))]">
                                        <span>{t('apiStatus.daysAgo')}</span>
                                        <span className="font-semibold">
                                            {t('apiStatus.uptimeToday', {
                                                percent: site.status === 'operational' ? '100.00' : site.status === 'degraded' ? '99.00' : site.status === 'partial_outage' ? '95.00' : '0.00'
                                            })}
                                        </span>
                                        <span>{t('apiStatus.today')}</span>
                                    </div>
                                </div>

                                {/* Response time */}
                                <div className="mt-4 text-sm text-[rgb(var(--color-on-surface-muted-rgb))]"
                                    dangerouslySetInnerHTML={{
                                        __html: t('apiStatus.responseTime', { time: site.responseTime })
                                    }}
                                />
                            </motion.div>
                        );
                    })
                                )}
                            </>
                        );
                    })()}
                </div>

                {/* Legend */}
                <div className="mt-8 p-6 bg-[rgb(var(--color-surface-alt-rgb))] rounded-xl border border-[rgb(var(--color-surface-border-rgb))]">
                    <h3 className="text-sm font-semibold text-[rgb(var(--color-on-surface-rgb))] mb-3">
                        {t('apiStatus.legendTitle')}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-green-600"></div>
                            <span className="text-sm text-[rgb(var(--color-on-surface-muted-rgb))]">{t('apiStatus.statusOperational')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-yellow-600"></div>
                            <span className="text-sm text-[rgb(var(--color-on-surface-muted-rgb))]">{t('apiStatus.statusDegraded')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-orange-600"></div>
                            <span className="text-sm text-[rgb(var(--color-on-surface-muted-rgb))]">{t('apiStatus.statusPartialOutage')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-red-600"></div>
                            <span className="text-sm text-[rgb(var(--color-on-surface-muted-rgb))]">{t('apiStatus.statusMajorOutage')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-gray-300"></div>
                            <span className="text-sm text-[rgb(var(--color-on-surface-muted-rgb))]">{t('apiStatus.legendNoData')}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
