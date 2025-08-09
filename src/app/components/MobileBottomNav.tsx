import React from 'react';
import { TagIcon, PhotoIcon, CogIcon } from './icons/icons';

interface MobileBottomNavProps {
  active: 'extractor' | 'image';
  onSelectExtractor: () => void;
  onSelectImage: () => void;
  onOpenSettings: () => void;
  highlightSettings?: boolean;
}

export function MobileBottomNav({ active, onSelectExtractor, onSelectImage, onOpenSettings, highlightSettings = false }: MobileBottomNavProps) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-alt-rgb))] backdrop-blur-md" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="mx-auto max-w-xl">
        <div className="grid grid-cols-3 gap-1 p-1">
          <button onClick={onSelectExtractor} className={`group relative flex items-center justify-center rounded-xl px-3 py-2 transition-all ${active === 'extractor' ? 'text-[rgb(var(--color-primary-rgb))] bg-[rgba(var(--color-primary-rgb),0.12)]' : 'text-[rgb(var(--color-on-surface-muted-rgb))] hover:bg-[rgb(var(--color-surface-border-rgb))]'}`} aria-label="Tag Extractor" aria-current={active === 'extractor' ? 'page' : undefined}>
            <TagIcon />
            <span className="ml-2 text-xs font-medium">Tags</span>
            <span className="pointer-events-none absolute inset-0 rounded-xl bg-current opacity-0 group-active:opacity-10 transition-opacity" />
          </button>
          <button onClick={onSelectImage} className={`group relative flex items-center justify-center rounded-xl px-3 py-2 transition-all ${active === 'image' ? 'text-[rgb(var(--color-primary-rgb))] bg-[rgba(var(--color-primary-rgb),0.12)]' : 'text-[rgb(var(--color-on-surface-muted-rgb))] hover:bg-[rgb(var(--color-surface-border-rgb))]'}`} aria-label="Image Metadata" aria-current={active === 'image' ? 'page' : undefined}>
            <PhotoIcon className="h-5 w-5" />
            <span className="ml-2 text-xs font-medium">Image</span>
            <span className="pointer-events-none absolute inset-0 rounded-xl bg-current opacity-0 group-active:opacity-10 transition-opacity" />
          </button>
          <button onClick={onOpenSettings} className={`group relative flex items-center justify-center rounded-xl px-3 py-2 transition-all ${highlightSettings ? 'text-[rgb(var(--color-primary-rgb))] bg-[rgba(var(--color-primary-rgb),0.12)]' : 'text-[rgb(var(--color-on-surface-muted-rgb))] hover:bg-[rgb(var(--color-surface-border-rgb))]'}`} aria-label="Settings">
            <CogIcon />
            <span className="ml-2 text-xs font-medium">Settings</span>
            <span className="pointer-events-none absolute inset-0 rounded-xl bg-current opacity-0 group-active:opacity-10 transition-opacity" />
          </button>
        </div>
      </div>
    </nav>
  );
}


