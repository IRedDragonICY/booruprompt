import { memo, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { SunIcon, MoonIcon, ComputerDesktopIcon } from '../icons/icons';
import { AnimatedIcon } from '../AnimatedIcon';

type ThemePreference = 'system' | 'light' | 'dark';

interface ThemeSectionProps {
    theme: ThemePreference;
    onChange: (theme: ThemePreference) => void;
}

export const ThemeSection = memo(function ThemeSection({ theme, onChange }: ThemeSectionProps) {
    const { t } = useTranslation();

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value as ThemePreference);
    }, [onChange]);

    const themeOptions = useMemo(() => [
        { value: 'system' as ThemePreference, label: t('settings.themeOptions.system'), icon: <ComputerDesktopIcon />, animation: 'gentle' as const },
        { value: 'light' as ThemePreference, label: t('settings.themeOptions.light'), icon: <SunIcon />, animation: 'spin' as const },
        { value: 'dark' as ThemePreference, label: t('settings.themeOptions.dark'), icon: <MoonIcon />, animation: 'default' as const },
    ], [t]);

    return (
        <div>
            <label className="mb-2 flex items-center text-sm font-medium text-[rgb(var(--color-on-surface-rgb))]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" />
                </svg>
                <span>{t('settings.sections.appearance')}</span>
            </label>
            <div className="flex items-center space-x-2 rounded-xl bg-[rgb(var(--color-surface-alt-2-rgb))] p-1">
                {themeOptions.map(({ value, label, icon, animation }) => (
                    <label
                        key={value}
                        className={`flex flex-1 cursor-pointer items-center justify-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                            theme === value
                                ? 'bg-[rgb(var(--color-surface-rgb))] text-[rgb(var(--color-primary-rgb))] shadow-sm ring-1 ring-[rgb(var(--color-primary-rgb))]/30'
                                : 'text-[rgb(var(--color-on-surface-muted-rgb))] hover:bg-[rgb(var(--color-surface-border-rgb))]'
                        }`}
                    >
                        <input
                            type="radio"
                            name="theme"
                            value={value}
                            checked={theme === value}
                            onChange={handleChange}
                            className="sr-only"
                            aria-label={t('settings.accessibility.themeOption', { label })}
                        />
                        <AnimatedIcon isActive={theme === value} animation={animation}>
                            {icon}
                        </AnimatedIcon>
                        <span>{label}</span>
                    </label>
                ))}
            </div>
        </div>
    );
});
