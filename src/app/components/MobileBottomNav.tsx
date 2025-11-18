import React from 'react';
import { TagIcon, PhotoIcon, TrophyIcon, CogIcon, SignalIcon, CodeBracketIcon } from './icons/icons';
import type { ActiveView } from '../types/settings';
import { useTranslation } from 'react-i18next';

interface MobileBottomNavProps {
  active: ActiveView;
  onSelectExtractor: () => void;
  onSelectImage: () => void;
  onSelectBooruList: () => void;
  onSelectStatus: () => void;
  onSelectApiTest: () => void;
  onOpenSettings: () => void;
  highlightSettings?: boolean;
}

export function MobileBottomNav({ active, onSelectExtractor, onSelectImage, onSelectBooruList, onSelectStatus, onSelectApiTest, onOpenSettings, highlightSettings = false }: MobileBottomNavProps) {
  const { t } = useTranslation();
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
        <div className="grid grid-cols-6 gap-1 p-1">

          <button onClick={onSelectExtractor} className={`group relative flex flex-col items-center justify-center rounded-xl px-2 py-2 transition-all ${active === 'extractor' ? 'text-[rgb(var(--color-primary-rgb))] bg-[rgba(var(--color-primary-rgb),0.12)]' : 'text-[rgb(var(--color-on-surface-muted-rgb))] hover:bg-[rgb(var(--color-surface-border-rgb))]'}`} aria-label={t('common.navTooltip.extractor')} aria-current={active === 'extractor' ? 'page' : undefined}>
            <TagIcon />
            <span className="mt-1 text-[10px] font-medium">{t('common.nav.extractor')}</span>
            <span className="pointer-events-none absolute inset-0 rounded-xl bg-current opacity-0 group-active:opacity-10 transition-opacity" />
          </button>
          <button onClick={onSelectImage} className={`group relative flex flex-col items-center justify-center rounded-xl px-2 py-2 transition-all ${active === 'image' ? 'text-[rgb(var(--color-primary-rgb))] bg-[rgba(var(--color-primary-rgb),0.12)]' : 'text-[rgb(var(--color-on-surface-muted-rgb))] hover:bg-[rgb(var(--color-surface-border-rgb))]'}`} aria-label={t('common.navTooltip.image')} aria-current={active === 'image' ? 'page' : undefined}>
            <PhotoIcon className="h-5 w-5" />
            <span className="mt-1 text-[10px] font-medium">{t('common.nav.image')}</span>
            <span className="pointer-events-none absolute inset-0 rounded-xl bg-current opacity-0 group-active:opacity-10 transition-opacity" />
          </button>
          <button onClick={onSelectBooruList} className={`group relative flex flex-col items-center justify-center rounded-xl px-2 py-2 transition-all ${active === 'booru-list' ? 'text-[rgb(var(--color-primary-rgb))] bg-[rgba(var(--color-primary-rgb),0.12)]' : 'text-[rgb(var(--color-on-surface-muted-rgb))] hover:bg-[rgb(var(--color-surface-border-rgb))]'}`} aria-label={t('common.navTooltip.booruList')} aria-current={active === 'booru-list' ? 'page' : undefined}>
            <TrophyIcon className="h-5 w-5" />
            <span className="mt-1 text-[10px] font-medium">{t('common.nav.booruList')}</span>
            <span className="pointer-events-none absolute inset-0 rounded-xl bg-current opacity-0 group-active:opacity-10 transition-opacity" />
          </button>
          <button onClick={onSelectStatus} className={`group relative flex flex-col items-center justify-center rounded-xl px-2 py-2 transition-all ${active === 'status' ? 'text-[rgb(var(--color-primary-rgb))] bg-[rgba(var(--color-primary-rgb),0.12)]' : 'text-[rgb(var(--color-on-surface-muted-rgb))] hover:bg-[rgb(var(--color-surface-border-rgb))]'}`} aria-label={t('common.navTooltip.status')} aria-current={active === 'status' ? 'page' : undefined}>
            <SignalIcon className="h-5 w-5" />
            <span className="mt-1 text-[10px] font-medium">{t('common.nav.status')}</span>
            <span className="pointer-events-none absolute inset-0 rounded-xl bg-current opacity-0 group-active:opacity-10 transition-opacity" />
          </button>
          <button onClick={onSelectApiTest} className={`group relative flex flex-col items-center justify-center rounded-xl px-2 py-2 transition-all ${active === 'api-test' ? 'text-[rgb(var(--color-primary-rgb))] bg-[rgba(var(--color-primary-rgb),0.12)]' : 'text-[rgb(var(--color-on-surface-muted-rgb))] hover:bg-[rgb(var(--color-surface-border-rgb))]'}`} aria-label={t('common.navTooltip.apiTest')} aria-current={active === 'api-test' ? 'page' : undefined}>
            <CodeBracketIcon className="h-5 w-5" />
            <span className="mt-1 text-[10px] font-medium">{t('common.nav.apiTest')}</span>
            <span className="pointer-events-none absolute inset-0 rounded-xl bg-current opacity-0 group-active:opacity-10 transition-opacity" />
          </button>
          <button onClick={onOpenSettings} className={`group relative flex flex-col items-center justify-center rounded-xl px-2 py-2 transition-all ${active === 'settings' || highlightSettings ? 'text-[rgb(var(--color-primary-rgb))] bg-[rgba(var(--color-primary-rgb),0.12)]' : 'text-[rgb(var(--color-on-surface-muted-rgb))] hover:bg-[rgb(var(--color-surface-border-rgb))]'}`} aria-label={t('common.navTooltip.settings')} aria-current={active === 'settings' ? 'page' : undefined}>
            <CogIcon />
            <span className="mt-1 text-[10px] font-medium">{t('common.nav.settings')}</span>
            <span className="pointer-events-none absolute inset-0 rounded-xl bg-current opacity-0 group-active:opacity-10 transition-opacity" />
          </button>
        </div>
      </div>
    </nav>
  );
}


