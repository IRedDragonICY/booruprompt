import React from 'react';
import { MobileBottomNav } from '../MobileBottomNav';
import type { ActiveView } from '../../types/settings';

interface MobileUIProps {
  active: ActiveView;
  onSelectExtractor: () => void;
  onSelectImage: () => void;
  onOpenSettings: () => void;
  highlightSettings?: boolean;
  children: React.ReactNode;
}

export function MobileUI({ active, onSelectExtractor, onSelectImage, onOpenSettings, highlightSettings = false, children }: MobileUIProps) {
  return (
    <div className="relative w-full min-h-dvh">
      {children}
      <MobileBottomNav
        active={active}
        onSelectExtractor={onSelectExtractor}
        onSelectImage={onSelectImage}
        onOpenSettings={onOpenSettings}
        highlightSettings={highlightSettings}
      />
    </div>
  );
}