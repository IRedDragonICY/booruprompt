import React from 'react';
import { TagIcon, PhotoIcon, TrophyIcon, CogIcon } from './icons/icons';
import type { ActiveView } from '../types/settings';

interface MobileBottomNavProps {
  active: ActiveView;
  onSelectExtractor: () => void;
  onSelectImage: () => void;
  onSelectBooruList: () => void;
  onOpenSettings: () => void;
  highlightSettings?: boolean;
}

export function MobileBottomNav({ active, onSelectExtractor, onSelectImage, onSelectBooruList, onOpenSettings, highlightSettings = false }: MobileBottomNavProps) {
  const navRef = React.useRef<HTMLElement>(null);
  React.useEffect(() => {
    const el = navRef.current;
    if (!el) return;
    const update = () => {
      const h = el.getBoundingClientRect().height;
      document.documentElement.style.setProperty('--mobile-nav-height', `${h}px`);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener('resize', update);
    return () => { ro.disconnect(); window.removeEventListener('resize', update); };
  }, []);

  return (
    <nav ref={navRef} className="md:hidden fixed bottom-0 left-0 right-0 z-30 border-t border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-alt-rgb))] backdrop-blur-md" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="mx-auto max-w-xl">
        <div className="grid grid-cols-4 gap-1 p-1">

          <button onClick={onSelectExtractor} className={`group relative flex flex-col items-center justify-center rounded-xl px-2 py-2 transition-all ${active === 'extractor' ? 'text-[rgb(var(--color-primary-rgb))] bg-[rgba(var(--color-primary-rgb),0.12)]' : 'text-[rgb(var(--color-on-surface-muted-rgb))] hover:bg-[rgb(var(--color-surface-border-rgb))]'}`} aria-label="Tag Extractor" aria-current={active === 'extractor' ? 'page' : undefined}>
            <TagIcon />
            <span className="mt-1 text-[10px] font-medium">Tags</span>
            <span className="pointer-events-none absolute inset-0 rounded-xl bg-current opacity-0 group-active:opacity-10 transition-opacity" />
          </button>
          <button onClick={onSelectImage} className={`group relative flex flex-col items-center justify-center rounded-xl px-2 py-2 transition-all ${active === 'image' ? 'text-[rgb(var(--color-primary-rgb))] bg-[rgba(var(--color-primary-rgb),0.12)]' : 'text-[rgb(var(--color-on-surface-muted-rgb))] hover:bg-[rgb(var(--color-surface-border-rgb))]'}`} aria-label="Image Metadata" aria-current={active === 'image' ? 'page' : undefined}>
            <PhotoIcon className="h-5 w-5" />
            <span className="mt-1 text-[10px] font-medium">Image</span>
            <span className="pointer-events-none absolute inset-0 rounded-xl bg-current opacity-0 group-active:opacity-10 transition-opacity" />
          </button>
          <button onClick={onSelectBooruList} className={`group relative flex flex-col items-center justify-center rounded-xl px-2 py-2 transition-all ${active === 'booru-list' ? 'text-[rgb(var(--color-primary-rgb))] bg-[rgba(var(--color-primary-rgb),0.12)]' : 'text-[rgb(var(--color-on-surface-muted-rgb))] hover:bg-[rgb(var(--color-surface-border-rgb))]'}`} aria-label="Booru List" aria-current={active === 'booru-list' ? 'page' : undefined}>
            <TrophyIcon className="h-5 w-5" />
            <span className="mt-1 text-[10px] font-medium">Boorus</span>
            <span className="pointer-events-none absolute inset-0 rounded-xl bg-current opacity-0 group-active:opacity-10 transition-opacity" />
          </button>
          <button onClick={onOpenSettings} className={`group relative flex flex-col items-center justify-center rounded-xl px-2 py-2 transition-all ${active === 'settings' || highlightSettings ? 'text-[rgb(var(--color-primary-rgb))] bg-[rgba(var(--color-primary-rgb),0.12)]' : 'text-[rgb(var(--color-on-surface-muted-rgb))] hover:bg-[rgb(var(--color-surface-border-rgb))]'}`} aria-label="Settings" aria-current={active === 'settings' ? 'page' : undefined}>
            <CogIcon />
            <span className="mt-1 text-[10px] font-medium">Settings</span>
            <span className="pointer-events-none absolute inset-0 rounded-xl bg-current opacity-0 group-active:opacity-10 transition-opacity" />
          </button>
        </div>
      </div>
    </nav>
  );
}


