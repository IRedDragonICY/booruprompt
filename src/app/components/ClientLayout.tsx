'use client';

import React from 'react';
import { I18nProvider } from '../../i18n/provider';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return <I18nProvider>{children}</I18nProvider>;
}
