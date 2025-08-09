import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export type StatusType = 'info' | 'error' | 'warning';

export const StatusMessage = React.memo(({ type, children }: { type: StatusType; children: React.ReactNode }) => {
  const typeClasses = useMemo(() => ({
    info: 'border-[rgb(var(--color-info-rgb))] bg-[rgb(var(--color-info-bg-rgb))] text-[rgb(var(--color-info-content-rgb))]',
    error: 'border-[rgb(var(--color-error-rgb))] bg-[rgb(var(--color-error-bg-rgb))] text-[rgb(var(--color-error-rgb))]',
    warning: 'border-yellow-400 bg-yellow-50 text-yellow-700 dark:border-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-300',
  }), []);
  return (
    <motion.div
      className={`rounded-md border-l-4 p-4 ${typeClasses[type]}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <p className={`text-sm font-medium`}>{children}</p>
    </motion.div>
  );
});
StatusMessage.displayName = 'StatusMessage';


