import React from 'react';
import { motion } from 'framer-motion';

interface ErrorPageProps {
  error: string;
  onRetry: () => void;
  retryCount: number;
  isRetrying: boolean;
  onReportBug: () => void;
}

export const ErrorPage: React.FC<ErrorPageProps> = ({
  error,
  onRetry,
  retryCount,
  isRetrying,
  onReportBug,
}) => {
  const maxRetries = 3;
  const canRetry = retryCount < maxRetries;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center min-h-[60vh] md:min-h-[70vh] px-4 py-8 md:py-12"
    >
      {/* Error Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 10 }}
        className="mb-6 md:mb-8"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-[rgb(var(--color-error-rgb))]/10 rounded-full blur-xl"></div>
          <div className="relative flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-[rgb(var(--color-error-bg-rgb))] border-4 border-[rgb(var(--color-error-rgb))]/20">
            <svg
              className="w-8 h-8 md:w-10 md:h-10 text-[rgb(var(--color-error-rgb))]"
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
        className="text-xl md:text-2xl lg:text-3xl font-bold text-[rgb(var(--color-on-surface-rgb))] mb-3 md:mb-4 text-center"
      >
        Connection Failed
      </motion.h2>

      {/* Error Description */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="max-w-lg md:max-w-xl w-full mb-6 md:mb-8"
      >
        <div className="rounded-xl bg-[rgb(var(--color-error-bg-rgb))] border border-[rgb(var(--color-error-rgb))]/20 p-4 md:p-6">
          <p className="text-sm md:text-base text-[rgb(var(--color-error-rgb))] font-medium mb-2">
            Error Details:
          </p>
          <p className="text-xs md:text-sm text-[rgb(var(--color-on-surface-muted-rgb))] break-words">
            {error}
          </p>
          {retryCount > 0 && (
            <p className="text-xs md:text-sm text-[rgb(var(--color-on-surface-faint-rgb))] mt-3">
              Retry attempt: {retryCount} of {maxRetries}
            </p>
          )}
        </div>
      </motion.div>

      {/* What is Booru Tag Extractor */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="max-w-lg md:max-w-xl w-full mb-6 md:mb-8"
      >
        <div className="rounded-xl bg-[rgb(var(--color-surface-alt-rgb))] border border-[rgb(var(--color-surface-border-rgb))] p-4 md:p-6">
          <h3 className="text-base md:text-lg font-bold text-[rgb(var(--color-on-surface-rgb))] mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-[rgb(var(--color-primary-rgb))]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7v10c0 5.55 3.84 9.739 9 11 5.16-1.261 9-5.45 9-11V7l-10-5z"/>
            </svg>
            What is Booru Tag Extractor?
          </h3>
          <p className="text-xs md:text-sm text-[rgb(var(--color-on-surface-muted-rgb))] mb-4 leading-relaxed">
            A powerful web tool that extracts and organizes tags from booru image boards. Perfect for AI artists, researchers, and content creators who need clean, categorized tags for their workflows.
          </p>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[rgb(var(--color-primary-rgb))]/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-[rgb(var(--color-primary-rgb))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <div>
                <p className="text-xs md:text-sm font-medium text-[rgb(var(--color-on-surface-rgb))]">Smart Tag Extraction</p>
                <p className="text-xs text-[rgb(var(--color-on-surface-muted-rgb))]">Automatically extracts and categorizes tags with intelligent filtering</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[rgb(var(--color-primary-rgb))]/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-[rgb(var(--color-primary-rgb))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
              <div>
                <p className="text-xs md:text-sm font-medium text-[rgb(var(--color-on-surface-rgb))]">Multi-Platform Support</p>
                <p className="text-xs text-[rgb(var(--color-on-surface-muted-rgb))]">Works with Danbooru, Safebooru, Gelbooru, Rule34, e621, and more</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[rgb(var(--color-primary-rgb))]/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-[rgb(var(--color-primary-rgb))]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-xs md:text-sm font-medium text-[rgb(var(--color-on-surface-rgb))]">One-Click Copy</p>
                <p className="text-xs text-[rgb(var(--color-on-surface-muted-rgb))]">Copy filtered tags instantly for AI art generation workflows</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full max-w-lg md:max-w-xl"
      >
        {/* Retry Button */}
        <button
          onClick={onRetry}
          disabled={!canRetry || isRetrying}
          className="flex-1 h-12 md:h-14 inline-flex items-center justify-center gap-2 rounded-xl bg-[rgb(var(--color-primary-rgb))] px-6 text-sm md:text-base font-semibold text-[rgb(var(--color-primary-content-rgb))] shadow-sm transition-all duration-200 hover:bg-[rgb(var(--color-primary-focus-rgb))] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary-rgb))]/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {isRetrying ? (
            <>
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Retrying...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {canRetry ? `Retry${retryCount > 0 ? ` (${maxRetries - retryCount} left)` : ''}` : 'Max Retries Reached'}
            </>
          )}
        </button>

        {/* Report Bug Button */}
        <button
          onClick={onReportBug}
          className="flex-1 h-12 md:h-14 inline-flex items-center justify-center gap-2 rounded-xl bg-[rgb(var(--color-surface-alt-rgb))] px-6 text-sm md:text-base font-semibold text-[rgb(var(--color-on-surface-rgb))] border-2 border-[rgb(var(--color-surface-border-rgb))] shadow-sm transition-all duration-200 hover:bg-[rgb(var(--color-surface-alt-2-rgb))] hover:border-[rgb(var(--color-primary-rgb))] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary-rgb))]/20"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Report Bug
        </button>
      </motion.div>

      {/* Quick Start Guide Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-6 md:mt-8 text-center"
      >
        <p className="text-xs md:text-sm text-[rgb(var(--color-on-surface-faint-rgb))]">
          Having issues? Try switching fetch mode in settings or report the issue on GitHub
        </p>
      </motion.div>
    </motion.div>
  );
};

export default ErrorPage;
