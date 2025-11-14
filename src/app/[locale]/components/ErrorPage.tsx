'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface ErrorPageProps {
  error: string;
  retryCount: number;
  isRetrying: boolean;
  onReportBug: () => void;
  onRetryAgain: () => void;
}

export const ErrorPage: React.FC<ErrorPageProps> = ({
  error,
  retryCount,
  isRetrying,
  onReportBug,
  onRetryAgain,
}) => {
  const t = useTranslations('errors');
  const maxRetries = 3;
  const maxRetryReached = retryCount >= maxRetries;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center px-4 py-6 md:py-8"
    >
      {/* Error Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 10 }}
        className="mb-4 md:mb-6"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-[rgb(var(--color-error-rgb))]/10 rounded-full blur-xl"></div>
          <div className="relative flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-[rgb(var(--color-error-bg-rgb))] border-4 border-[rgb(var(--color-error-rgb))]/20">
            <svg
              className="w-6 h-6 md:w-8 md:h-8 text-[rgb(var(--color-error-rgb))]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>
      </motion.div>

      {/* Error Title */}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-lg md:text-xl font-bold text-[rgb(var(--color-on-surface-rgb))] mb-3 md:mb-4 text-center"
      >
        {isRetrying ? t('retrying') : t('connectionFailed')}
      </motion.h2>

      {/* Error Description - Simple and Clean */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="max-w-md w-full mb-4 md:mb-6"
      >
        <div className="rounded-lg bg-[rgb(var(--color-error-bg-rgb))] border border-[rgb(var(--color-error-rgb))]/20 p-3 md:p-4">
          <p className="text-xs md:text-sm text-[rgb(var(--color-on-surface-muted-rgb))] text-center break-words">
            {error}
          </p>
        </div>
      </motion.div>

      {/* Retry Status */}
      {isRetrying && retryCount > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-4 flex items-center gap-2 text-[rgb(var(--color-on-surface-muted-rgb))] text-sm"
        >
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{t('tryingAgain', { count: retryCount })}</span>
        </motion.div>
      )}

      {/* Max Retry Reached Message */}
      {maxRetryReached && !isRetrying && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-4 max-w-md w-full"
        >
          <div className="rounded-lg bg-[rgb(var(--color-error-bg-rgb))] border border-[rgb(var(--color-error-rgb))]/30 p-3 md:p-4">
            <p className="text-xs md:text-sm text-[rgb(var(--color-error-rgb))] font-semibold text-center">
              {t('maxRetryReached')}
            </p>
          </div>
        </motion.div>
      )}

      {/* Action Buttons - Only show after max retry reached */}
      {maxRetryReached && !isRetrying && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-3 w-full max-w-md"
        >
          {/* Retry Again Button */}
          <button
            onClick={onRetryAgain}
            className="flex-1 h-11 md:h-12 inline-flex items-center justify-center gap-2 rounded-lg bg-[rgb(var(--color-primary-rgb))] px-4 text-sm font-semibold text-[rgb(var(--color-primary-content-rgb))] shadow-sm transition-all duration-200 hover:bg-[rgb(var(--color-primary-focus-rgb))] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary-rgb))]/20"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {t('retryAgain')}
          </button>

          {/* Report Bug Button */}
          <button
            onClick={onReportBug}
            className="flex-1 h-11 md:h-12 inline-flex items-center justify-center gap-2 rounded-lg bg-[rgb(var(--color-surface-alt-rgb))] px-4 text-sm font-semibold text-[rgb(var(--color-on-surface-rgb))] border-2 border-[rgb(var(--color-surface-border-rgb))] shadow-sm transition-all duration-200 hover:bg-[rgb(var(--color-surface-alt-2-rgb))] hover:border-[rgb(var(--color-primary-rgb))] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary-rgb))]/20"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {t('reportBug')}
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ErrorPage;
