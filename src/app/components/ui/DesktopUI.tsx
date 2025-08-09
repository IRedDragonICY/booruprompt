import React from 'react';

interface DesktopUIProps {
  leftPanel: React.ReactNode;
  children: React.ReactNode;
}

export function DesktopUI({ leftPanel, children }: DesktopUIProps) {
  return (
    <div className="flex min-h-screen items-center justify-center p-6 bg-[rgb(var(--color-surface-rgb))] text-[rgb(var(--color-on-surface-rgb))]">
      <div className="flex items-start md:flex-row flex-col mx-auto relative">
        <div className="hidden md:block flex-shrink-0 md:mr-4 md:mb-0 z-20 md:self-start">
          {leftPanel}
        </div>
        <div className="relative z-10 flex w-full max-w-xl flex-col overflow-hidden rounded-xl border border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-alt-rgb))] shadow-lg max-h-[calc(100vh-3rem)]">
          {children}
        </div>
      </div>
    </div>
  );
}