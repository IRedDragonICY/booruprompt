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

interface NavItemProps {
    active: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
    highlight?: boolean;
}

const NavItem = ({ active, onClick, icon, label, highlight }: NavItemProps) => {
    return (
        <TooltipWrapper tipContent={label} side="right" sideOffset={16}>
            <button
                onClick={onClick}
                className={`group relative flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--color-primary-rgb))] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--color-surface-alt-rgb))] ${
                    active || highlight
                        ? 'bg-[rgb(var(--color-primary-rgb))]/10 text-[rgb(var(--color-primary-rgb))] shadow-sm'
                        : 'text-[rgb(var(--color-on-surface-muted-rgb))] hover:bg-[rgb(var(--color-surface-alt-2-rgb))] hover:text-[rgb(var(--color-on-surface-rgb))]'
                }`}
                aria-label={label}
                aria-current={active ? 'page' : undefined}
            >
                {/* Active Indicator (Left Border / Glow) */}
                {(active || highlight) && (
                    <motion.div
                        layoutId="active-nav-indicator"
                        className="absolute left-0 h-8 w-1 rounded-r-full bg-[rgb(var(--color-primary-rgb))]"
                        initial={{ opacity: 0, scaleY: 0.5 }}
                        animate={{ opacity: 1, scaleY: 1 }}
                        transition={{ duration: 0.2 }}
                    />
                )}
                
                {/* Icon with slight scale on hover */}
                <div className="relative z-10 transition-transform duration-200 group-hover:scale-110 group-active:scale-95">
                    {icon}
                </div>
            </button>
        </TooltipWrapper>
    );
};

export function DesktopSideNav({ active, highlightSettings = false, onSelectExtractor, onSelectImage, onSelectBooruList, onSelectStatus, onSelectApiTest, onOpenSettings }: DesktopSideNavProps) {
    const { t } = useTranslation();

    return (
        <nav className="hidden md:flex flex-col flex-shrink-0 h-full w-[88px] bg-[rgb(var(--color-surface-alt-rgb))] border-r border-[rgb(var(--color-surface-border-rgb))] items-center py-6 z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
            {/* Main Navigation */}
            <div className="flex flex-col gap-3 w-full items-center">
                <NavItem 
                    active={active === 'extractor'} 
                    onClick={onSelectExtractor} 
                    icon={<TagIcon className="h-6 w-6" />} 
                    label={t('common.navTooltip.extractor')} 
                />
                <NavItem 
                    active={active === 'image'} 
                    onClick={onSelectImage} 
                    icon={<PhotoIcon className="h-6 w-6" />} 
                    label={t('common.navTooltip.image')} 
                />
                <NavItem 
                    active={active === 'booru-list'} 
                    onClick={onSelectBooruList} 
                    icon={<TrophyIcon className="h-6 w-6" />} 
                    label={t('common.navTooltip.booruList')} 
                />
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Secondary / System Navigation */}
            <div className="flex flex-col gap-3 w-full items-center mb-2">
                <NavItem 
                    active={active === 'status'} 
                    onClick={onSelectStatus} 
                    icon={<SignalIcon className="h-6 w-6" />} 
                    label={t('common.navTooltip.status')} 
                />
                <NavItem 
                    active={active === 'api-test'} 
                    onClick={onSelectApiTest} 
                    icon={<CodeBracketIcon className="h-6 w-6" />} 
                    label={t('common.navTooltip.apiTest')} 
                />
                
                {/* Divider */}
                <div className="my-2 h-[1px] w-10 bg-[rgb(var(--color-surface-border-rgb))]" />
                
                <NavItem 
                    active={false}
                    highlight={highlightSettings}
                    onClick={onOpenSettings} 
                    icon={<CogIcon className="h-6 w-6" />} 
                    label={t('common.navTooltip.settings')} 
                />
            </div>
        </nav>
    );
}

export default DesktopSideNav;


