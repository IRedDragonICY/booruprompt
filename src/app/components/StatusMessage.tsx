import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export type StatusType = 'info' | 'error' | 'warning';

interface StatusMessageProps {
  type: StatusType;
  children: React.ReactNode;
  onRetry?: () => void;
  retryCount?: number;
  maxRetries?: number;
  showGitHubReport?: boolean;
}

export const StatusMessage = React.memo(({
  type,
  children,
  onRetry,
  retryCount = 0,
  maxRetries = 3,
  showGitHubReport = false
}: StatusMessageProps) => {
  const typeClasses = useMemo(() => ({
    info: 'border-[rgb(var(--color-info-rgb))] bg-[rgb(var(--color-info-bg-rgb))] text-[rgb(var(--color-info-content-rgb))]',
    error: 'border-[rgb(var(--color-error-rgb))] bg-[rgb(var(--color-error-bg-rgb))] text-[rgb(var(--color-error-rgb))]',
    warning: 'border-yellow-400 bg-yellow-50 text-yellow-700 dark:border-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-300',
  }), []);

  const handleGitHubReport = () => {
    const issueUrl = 'https://github.com/IRedDragonICY/booruprompt/issues/new';
    window.open(issueUrl, '_blank', 'noopener,noreferrer');
  };

  const canRetry = type === 'error' && onRetry && retryCount < maxRetries;
  const shouldShowGitHubReport = showGitHubReport || (type === 'error' && retryCount >= maxRetries);

  return (
    <motion.div
      className={`rounded-md border-l-4 p-4 ${typeClasses[type]}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col gap-3">
        <p className={`text-sm font-medium`}>{children}</p>

        {(canRetry || shouldShowGitHubReport) && (
          <div className="flex flex-wrap gap-2 items-center">
            {canRetry && (
              <button
                onClick={onRetry}
                className="px-3 py-1.5 text-xs font-medium rounded-md bg-[rgb(var(--color-error-rgb))] text-white hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[rgb(var(--color-error-rgb))]"
                aria-label="Retry request"
              >
                🔄 Retry ({retryCount}/{maxRetries})
              </button>
            )}

            {shouldShowGitHubReport && (
              <button
                onClick={handleGitHubReport}
                className="px-3 py-1.5 text-xs font-medium rounded-md border border-[rgb(var(--color-error-rgb))] text-[rgb(var(--color-error-rgb))] hover:bg-[rgb(var(--color-error-rgb))] hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[rgb(var(--color-error-rgb))]"
                aria-label="Report bug on GitHub"
              >
                📝 Report to GitHub
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
});
StatusMessage.displayName = 'StatusMessage';


