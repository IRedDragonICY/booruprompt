import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useAnimation, PanInfo } from 'framer-motion';

interface MobileStatusControlsProps {
    searchQuery: string;
    setSearchQuery: (value: string) => void;
    statusFilter: string;
    setStatusFilter: (value: string) => void;
}

type StatusType = 'all' | 'operational' | 'degraded' | 'partial_outage' | 'major_outage';

const STATUS_CONFIG: Record<StatusType, { color: string; bg: string; label: string }> = {
    all: { color: 'text-[rgb(var(--color-on-surface-rgb))]', bg: 'bg-[rgb(var(--color-primary-rgb))]', label: 'All' },
    operational: { color: 'text-emerald-500', bg: 'bg-emerald-500', label: 'Up' },
    degraded: { color: 'text-amber-500', bg: 'bg-amber-500', label: 'Slow' },
    partial_outage: { color: 'text-orange-500', bg: 'bg-orange-500', label: 'Part' },
    major_outage: { color: 'text-red-500', bg: 'bg-red-500', label: 'Down' }
};

const StatusIcon: React.FC<{ status: StatusType; className?: string }> = ({ status, className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} strokeWidth={2.5}>
        {status === 'all' && (
            <path fillRule="evenodd" d="M3 6a3 3 0 013-3h12a3 3 0 013 3v12a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm4.5 7.5a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0v-2.25a.75.75 0 01.75-.75zm3.75-1.5a.75.75 0 00-1.5 0v4.5a.75.75 0 001.5 0V12zm2.25-3a.75.75 0 01.75.75v6.75a.75.75 0 01-1.5 0V9.75a.75.75 0 01.75-.75zm3.75-1.5a.75.75 0 00-1.5 0v9a.75.75 0 001.5 0v-9z" clipRule="evenodd" />
        )}
        {status === 'operational' && (
            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
        )}
        {status === 'degraded' && (
            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
        )}
        {status === 'partial_outage' && (
            <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
        )}
        {status === 'major_outage' && (
            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />
        )}
    </svg>
);

export const MobileStatusControls: React.FC<MobileStatusControlsProps> = ({
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter
}) => {
    const { t } = useTranslation();
    const [isMinimized, setIsMinimized] = useState(false);
    const controls = useAnimation();

    const handleDragEnd = useCallback((_: any, info: PanInfo) => {
        if (info.offset.y > 60) {
            setIsMinimized(true);
            controls.start({ y: 'calc(100% - 20px)' });
        } else {
            setIsMinimized(false);
            controls.start({ y: 0 });
        }
    }, [controls]);

    const handleExpand = useCallback(() => {
        if (isMinimized) {
            setIsMinimized(false);
            controls.start({ y: 0 });
        }
    }, [controls, isMinimized]);

    const statuses = Object.keys(STATUS_CONFIG) as StatusType[];

    return (
        <motion.div
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.12}
            onDragEnd={handleDragEnd}
            animate={controls}
            initial={{ y: 0 }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            className="fixed bottom-[var(--mobile-nav-height,56px)] left-0 right-0 z-20 px-3"
        >
            <div className="rounded-t-2xl bg-[rgb(var(--color-surface-alt-rgb))]/95 backdrop-blur-xl border border-[rgb(var(--color-surface-border-rgb))]/50 shadow-2xl shadow-black/25">
                {/* Drag Handle */}
                <div className="flex justify-center pt-2 pb-1 cursor-grab active:cursor-grabbing" onClick={handleExpand}>
                    <div className="w-9 h-1 rounded-full bg-[rgb(var(--color-on-surface-faint-rgb))]/40" />
                </div>
                
                <div className="px-4 pb-4">
                    {/* Status Filters */}
                    <div className="flex justify-between gap-1 mb-3">
                        {statuses.map(status => {
                            const config = STATUS_CONFIG[status];
                            const isActive = statusFilter === status;
                            
                            return (
                                <button
                                    key={status}
                                    onClick={() => setStatusFilter(status)}
                                    className={`flex flex-col items-center flex-1 py-1.5 rounded-xl transition-all duration-200 ${isActive ? 'bg-[rgb(var(--color-primary-rgb))]/15' : 'opacity-50'}`}
                                >
                                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-1 transition-all duration-200 ${isActive ? config.bg + ' text-white shadow-md' : 'bg-[rgb(var(--color-surface-alt-2-rgb))] text-[rgb(var(--color-on-surface-muted-rgb))]'}`}>
                                        <StatusIcon status={status} />
                                    </div>
                                    <span className={`text-[9px] font-semibold transition-colors duration-200 ${isActive ? config.color : 'text-[rgb(var(--color-on-surface-muted-rgb))]'}`}>
                                        {config.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Search Input */}
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--color-on-surface-muted-rgb))]/50">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={t('status.searchPlaceholder', 'Search boorus...')}
                            className="w-full h-11 pl-10 pr-4 rounded-xl bg-[rgb(var(--color-surface-alt-2-rgb))]/80 border border-[rgb(var(--color-surface-border-rgb))]/50 text-sm focus:outline-none focus:border-[rgb(var(--color-primary-rgb))]/60 focus:ring-2 focus:ring-[rgb(var(--color-primary-rgb))]/20 placeholder:text-[rgb(var(--color-on-surface-faint-rgb))] transition-all"
                        />
                        {searchQuery && (
                            <button 
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgb(var(--color-on-surface-muted-rgb))]/50 hover:text-[rgb(var(--color-on-surface-rgb))] transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
