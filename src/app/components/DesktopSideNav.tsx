import React from 'react';
import { motion } from 'framer-motion';
import { TagIcon, PhotoIcon, TrophyIcon, CogIcon, SignalIcon, CodeBracketIcon } from './icons/icons';
import { TooltipWrapper } from './TooltipWrapper';
import type { ActiveView } from '../types/settings';
import { useTranslation } from 'react-i18next';

interface DesktopSideNavProps {
    active: ActiveView;
    highlightSettings?: boolean;
    onSelectExtractor: () => void;
    onSelectImage: () => void;
    onSelectBooruList: () => void;
    onSelectStatus: () => void;
    onSelectApiTest: () => void;
    onOpenSettings: () => void;
}

const navButtonClass = (isActive: boolean) => `group relative overflow-hidden rounded-xl h-10 w-10 flex items-center justify-center transition-all duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--color-primary-rgb))] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--color-surface-alt-rgb))] ${isActive ? 'text-[rgb(var(--color-primary-rgb))] bg-[rgba(var(--color-primary-rgb),0.15)] ring-1 ring-[rgb(var(--color-primary-rgb))]/40 shadow-sm' : 'text-[rgb(var(--color-on-surface-muted-rgb))] bg-[rgb(var(--color-surface-alt-2-rgb))] hover:bg-[rgb(var(--color-surface-border-rgb))] hover:text-[rgb(var(--color-on-surface-rgb))]'}`;

export function DesktopSideNav({ active, highlightSettings = false, onSelectExtractor, onSelectImage, onSelectBooruList, onSelectStatus, onSelectApiTest, onOpenSettings }: DesktopSideNavProps) {
    const { t } = useTranslation();

    return (
        <div className="hidden md:block flex-shrink-0 h-full bg-[rgb(var(--color-surface-alt-rgb))] border-r border-[rgb(var(--color-surface-border-rgb))]">
            <div className="flex flex-col h-full justify-center space-y-2 p-3">
                <TooltipWrapper tipContent={t('common.navTooltip.extractor')}>
                    <motion.button whileTap={{ scale: 0.96 }} onClick={onSelectExtractor} className={navButtonClass(active === 'extractor')} aria-label={t('common.navTooltip.extractor')} aria-current={active === 'extractor' ? 'page' : undefined}>
                        <span className="pointer-events-none absolute inset-0 rounded-xl bg-current opacity-0 group-active:opacity-10 transition-opacity duration-200" />
                        <TagIcon />
                    </motion.button>
                </TooltipWrapper>
                <TooltipWrapper tipContent={t('common.navTooltip.image')}>
                    <motion.button whileTap={{ scale: 0.96 }} onClick={onSelectImage} className={navButtonClass(active === 'image')} aria-label={t('common.navTooltip.image')} aria-current={active === 'image' ? 'page' : undefined}>
                        <span className="pointer-events-none absolute inset-0 rounded-xl bg-current opacity-0 group-active:opacity-10 transition-opacity duration-200" />
                        <PhotoIcon className="h-6 w-6" />
                    </motion.button>
                </TooltipWrapper>
                <TooltipWrapper tipContent={t('common.navTooltip.booruList')}>
                    <motion.button whileTap={{ scale: 0.96 }} onClick={onSelectBooruList} className={navButtonClass(active === 'booru-list')} aria-label={t('common.navTooltip.booruList')} aria-current={active === 'booru-list' ? 'page' : undefined}>
                        <span className="pointer-events-none absolute inset-0 rounded-xl bg-current opacity-0 group-active:opacity-10 transition-opacity duration-200" />
                        <TrophyIcon />
                    </motion.button>
                </TooltipWrapper>
                <TooltipWrapper tipContent={t('common.navTooltip.status')}>
                    <motion.button whileTap={{ scale: 0.96 }} onClick={onSelectStatus} className={navButtonClass(active === 'status')} aria-label={t('common.navTooltip.status')} aria-current={active === 'status' ? 'page' : undefined}>
                        <span className="pointer-events-none absolute inset-0 rounded-xl bg-current opacity-0 group-active:opacity-10 transition-opacity duration-200" />
                        <SignalIcon />
                    </motion.button>
                </TooltipWrapper>
                <TooltipWrapper tipContent={t('common.navTooltip.apiTest')}>
                    <motion.button whileTap={{ scale: 0.96 }} onClick={onSelectApiTest} className={navButtonClass(active === 'api-test')} aria-label={t('common.navTooltip.apiTest')} aria-current={active === 'api-test' ? 'page' : undefined}>
                        <span className="pointer-events-none absolute inset-0 rounded-xl bg-current opacity-0 group-active:opacity-10 transition-opacity duration-200" />
                        <CodeBracketIcon />
                    </motion.button>
                </TooltipWrapper>
                <div className="my-1 h-[1px] bg-[rgb(var(--color-surface-border-rgb))]" />
                <TooltipWrapper tipContent={t('common.navTooltip.settings')}>
                    <motion.button whileTap={{ scale: 0.96 }} onClick={onOpenSettings} className={navButtonClass(!!highlightSettings)} aria-label={t('common.navTooltip.settings')}>
                        <span className="pointer-events-none absolute inset-0 rounded-xl bg-current opacity-0 group-active:opacity-10 transition-opacity duration-200" />
                        <CogIcon />
                    </motion.button>
                </TooltipWrapper>
            </div>
        </div>
    );
}

export default DesktopSideNav;


