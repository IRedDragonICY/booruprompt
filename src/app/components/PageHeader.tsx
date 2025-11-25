'use client';

import React from 'react';

interface PageHeaderProps {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
  badge?: string;
  rightContent?: React.ReactNode;
  /** Show subtitle on mobile (default: false) */
  showSubtitleOnMobile?: boolean;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  icon,
  title,
  subtitle,
  badge,
  rightContent,
  showSubtitleOnMobile = false
}) => {
  return (
    <div className="shrink-0 bg-[rgb(var(--color-surface-alt-rgb))] border-b border-[rgb(var(--color-surface-border-rgb))]/50 px-4 py-3 md:px-6 md:py-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-3">
          {icon && (
            <div className="h-7 w-7 md:h-9 md:w-9 flex items-center justify-center">
              {icon}
            </div>
          )}
          <div>
            <h1 className="text-lg md:text-xl font-bold text-[rgb(var(--color-on-surface-rgb))]">
              {title}
            </h1>
            {subtitle && (
              <p className={`text-xs md:text-sm text-[rgb(var(--color-on-surface-muted-rgb))] ${showSubtitleOnMobile ? '' : 'hidden md:block'}`}>
                {subtitle}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {badge && (
            <span className="inline-flex items-center rounded-lg bg-[rgb(var(--color-surface-alt-2-rgb))] px-2.5 py-1 text-xs font-medium text-[rgb(var(--color-on-surface-muted-rgb))]">
              {badge}
            </span>
          )}
          {rightContent}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
