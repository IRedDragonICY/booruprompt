import { memo, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { SunIcon, MoonIcon, ComputerDesktopIcon, PaletteIcon } from '../icons/icons';
import { AnimatedIcon } from '../AnimatedIcon';

type ThemePreference = 'system' | 'light' | 'dark';

interface ThemeSectionProps {
    theme: ThemePreference;
    onChange: (theme: ThemePreference) => void;
}

// Icon map to avoid recreating JSX elements
const THEME_ICON_MAP = {
    system: ComputerDesktopIcon,
    light: SunIcon,
    dark: MoonIcon,
} as const;

const THEME_ANIMATION_MAP = {
    system: 'gentle' as const,
    light: 'spin' as const,
    dark: 'default' as const,
} as const;

export const ThemeSection = memo(function ThemeSection({ theme, onChange }: ThemeSectionProps) {
    const { t } = useTranslation();

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value as ThemePreference);
    }, [onChange]);

    const themeOptions = useMemo(() => [
        { value: 'system' as ThemePreference, label: t('settings.themeOptions.system') },
        { value: 'light' as ThemePreference, label: t('settings.themeOptions.light') },
        { value: 'dark' as ThemePreference, label: t('settings.themeOptions.dark') },
    ], [t]);

    return (
        <div className="rounded-2xl bg-[rgb(var(--color-surface-alt-rgb))] p-4">
            <label className="mb-3 flex items-center text-base font-medium text-[rgb(var(--color-on-surface-rgb))]">
                <span className="mr-3 text-[rgb(var(--color-primary-rgb))]"><PaletteIcon /></span>
                <span>{t('settings.sections.appearance')}</span>
            </label>
            <div className="flex items-center space-x-2 rounded-xl bg-[rgb(var(--color-surface-alt-2-rgb))] p-1.5">
                {themeOptions.map(({ value, label }) => {
                    const IconComponent = THEME_ICON_MAP[value];
                    const animation = THEME_ANIMATION_MAP[value];
                    const isSelected = theme === value;

                    return (
                        <label
                            key={value}
                            className={`flex flex-1 cursor-pointer items-center justify-center space-x-2 rounded-lg px-3 py-3 text-sm font-medium transition-all ${
                                isSelected
                                    ? 'bg-[rgb(var(--color-surface-rgb))] text-[rgb(var(--color-primary-rgb))] shadow-sm ring-1 ring-[rgb(var(--color-primary-rgb))]/30'
                                    : 'text-[rgb(var(--color-on-surface-muted-rgb))] hover:bg-[rgb(var(--color-surface-border-rgb))]'
                            }`}
                        >
                            <input
                                type="radio"
                                name="theme"
                                value={value}
                                checked={isSelected}
                                onChange={handleChange}
                                className="sr-only"
                                aria-label={t('settings.accessibility.themeOption', { label })}
                            />
                            <AnimatedIcon isActive={isSelected} animation={animation}>
                                <IconComponent />
                            </AnimatedIcon>
                            <span>{label}</span>
                        </label>
                    );
                })}
            </div>
        </div>
    );
});
