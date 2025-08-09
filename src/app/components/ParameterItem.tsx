import React from 'react';

export const ParameterItem = React.memo(({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col sm:flex-row sm:justify-between border-b border-[rgb(var(--color-surface-border-rgb))] py-2 text-sm last:border-b-0">
    <span className="font-medium text-[rgb(var(--color-on-surface-muted-rgb))] mr-2 shrink-0">{label}:</span>
    <span className="text-left sm:text-right text-[rgb(var(--color-on-surface-rgb))] break-words">{value}</span>
  </div>
));
ParameterItem.displayName = 'ParameterItem';


