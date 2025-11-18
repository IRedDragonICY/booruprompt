import { memo, useMemo, useCallback, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { TooltipWrapper } from '../TooltipWrapper';
import { PaletteIcon } from '../icons/icons';

type ColorTheme = 'blue' | 'orange' | 'teal' | 'rose' | 'purple' | 'green' | 'custom';

interface ColorThemeSectionProps {
    colorTheme: ColorTheme;
    customColorHex?: string;
    onChange: (theme: ColorTheme, customHex?: string) => void;
}

const DEFAULT_CUSTOM_COLOR = '#3B82F6';
const CHECKMARK_VARIANTS = { initial: { scale: 0, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0, opacity: 0 } };
const EXPAND_VARIANTS = { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, exit: { opacity: 0, height: 0 } };

export const ColorThemeSection = memo(function ColorThemeSection({ colorTheme, customColorHex, onChange }: ColorThemeSectionProps) {
    const { t } = useTranslation();
    const [localHex, setLocalHex] = useState(customColorHex || DEFAULT_CUSTOM_COLOR);

    useEffect(() => {
        setLocalHex(customColorHex || DEFAULT_CUSTOM_COLOR);
    }, [customColorHex]);

    const handleThemeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value as ColorTheme;
        if (value === 'custom') {
            const validHex = /^#[0-9a-fA-F]{6}$/.test(localHex) ? localHex : DEFAULT_CUSTOM_COLOR;
            onChange('custom', validHex);
        } else {
            onChange(value);
        }
    }, [onChange, localHex]);

    const handleColorPickerChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newHex = e.target.value;
        setLocalHex(newHex);
        if (colorTheme !== 'custom') onChange('custom', newHex);
        else onChange('custom', newHex);
    }, [onChange, colorTheme]);

    const handleHexInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        let newHex = e.target.value;
        if (!newHex.startsWith('#')) newHex = `#${newHex}`;
        setLocalHex(newHex);
        if (/^#[0-9a-fA-F]{6}$/.test(newHex)) {
            if (colorTheme !== 'custom') onChange('custom', newHex);
            else onChange('custom', newHex);
        }
    }, [onChange, colorTheme]);

    const colorOptions = useMemo(() => [
        { value: 'blue' as ColorTheme, label: t('settings.colorThemes.blue'), colorClass: 'bg-[#3B82F6] dark:bg-[#60A5FA]' },
        { value: 'orange' as ColorTheme, label: t('settings.colorThemes.orange'), colorClass: 'bg-[#F97316] dark:bg-[#FB923C]' },
        { value: 'teal' as ColorTheme, label: t('settings.colorThemes.teal'), colorClass: 'bg-[#0D9488] dark:bg-[#2DD4BF]' },
        { value: 'rose' as ColorTheme, label: t('settings.colorThemes.rose'), colorClass: 'bg-[#E11D48] dark:bg-[#FB7185]' },
        { value: 'purple' as ColorTheme, label: t('settings.colorThemes.purple'), colorClass: 'bg-[#8B5CF6] dark:bg-[#A78BFA]' },
        { value: 'green' as ColorTheme, label: t('settings.colorThemes.green'), colorClass: 'bg-[#16A34A] dark:bg-[#4ADE80]' },
    ], [t]);

    const isValidHex = useMemo(() => /^#[0-9a-fA-F]{6}$/.test(localHex), [localHex]);

    return (
        <div>
            <label className="mb-2 flex items-center text-sm font-medium text-[rgb(var(--color-on-surface-rgb))]">
                <span className="mr-2"><PaletteIcon /></span>
                <span>{t('settings.sections.colorTheme')}</span>
            </label>
            <div className="grid grid-cols-3 gap-2 rounded-xl bg-[rgb(var(--color-surface-alt-2-rgb))] p-2">
                {colorOptions.map(({ value, label, colorClass }) => (
                    <TooltipWrapper key={value} tipContent={label}>
                        <label className={`relative flex cursor-pointer items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition-all hover:scale-[1.02] ${colorTheme === value ? 'bg-[rgb(var(--color-surface-rgb))] shadow-sm ring-2 ring-[rgb(var(--color-primary-rgb))] ring-offset-1 ring-offset-[rgb(var(--color-surface-alt-2-rgb))]' : 'hover:bg-[rgb(var(--color-surface-border-rgb))]'}`}>
                            <input type="radio" name="colorTheme" value={value} checked={colorTheme === value} onChange={handleThemeChange} className="sr-only" aria-label={t('settings.accessibility.colorThemeOption', { label })} />
                            <span className={`block h-5 w-5 rounded-full ${colorClass}`} />
                            <AnimatePresence>
                                {colorTheme === value && (
                                    <motion.div className="absolute inset-0 flex items-center justify-center" {...CHECKMARK_VARIANTS} transition={{ duration: 0.15 }}>
                                        <svg className="h-3 w-3 text-[rgb(var(--color-primary-content-rgb))] dark:text-gray-900" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <span className="sr-only">{label}</span>
                        </label>
                    </TooltipWrapper>
                ))}
                <TooltipWrapper tipContent={t('settings.customColor.label')}>
                    <label className={`relative flex cursor-pointer items-center justify-center rounded-md px-3 py-1.5 text-sm font-medium transition-all hover:scale-[1.02] ${colorTheme === 'custom' ? 'bg-[rgb(var(--color-surface-rgb))] shadow-sm ring-2 ring-[rgb(var(--color-primary-rgb))] ring-offset-1 ring-offset-[rgb(var(--color-surface-alt-2-rgb))]' : 'hover:bg-[rgb(var(--color-surface-border-rgb))]'}`}>
                        <input type="radio" name="colorTheme" value="custom" checked={colorTheme === 'custom'} onChange={handleThemeChange} className="sr-only" aria-label={t('settings.customColor.label')} />
                        <span className="block h-5 w-5 rounded-full border border-gray-400 dark:border-gray-600" style={{ backgroundColor: isValidHex ? localHex : '#ffffff' }} />
                        <AnimatePresence>
                            {colorTheme === 'custom' && (
                                <motion.div className="absolute inset-0 flex items-center justify-center" {...CHECKMARK_VARIANTS} transition={{ duration: 0.15 }}>
                                    <svg className="h-3 w-3 text-[rgb(var(--color-primary-content-rgb))] dark:text-gray-900" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <span className="sr-only">{t('settings.customColor.label')}</span>
                    </label>
                </TooltipWrapper>
            </div>
            {colorTheme === 'custom' && (
                <motion.div {...EXPAND_VARIANTS} className="mt-3 flex items-center space-x-3 rounded-lg bg-[rgb(var(--color-surface-alt-2-rgb))] p-3">
                    <input
                        type="color"
                        value={isValidHex ? localHex : '#ffffff'}
                        onChange={handleColorPickerChange}
                        className="h-8 w-8 cursor-pointer appearance-none rounded-sm border border-[rgb(var(--color-surface-border-rgb))] bg-transparent p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-sm [&::-webkit-color-swatch]:border-none"
                        aria-label={t('settings.customColor.pickerLabel')}
                    />
                    <input
                        type="text"
                        value={localHex}
                        onChange={handleHexInputChange}
                        maxLength={7}
                        className="flex-1 appearance-none rounded-md border border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-rgb))] px-2 py-1 font-mono text-sm text-[rgb(var(--color-on-surface-rgb))] placeholder:text-[rgb(var(--color-on-surface-faint-rgb))] transition duration-200 focus:border-transparent focus:outline-hidden focus:ring-1 focus:ring-[rgb(var(--color-primary-rgb))]"
                        placeholder={t('settings.customColor.placeholder')}
                        aria-label={t('settings.customColor.inputLabel')}
                        pattern="^#?([a-fA-F0-9]{6})$"
                    />
                </motion.div>
            )}
        </div>
    );
});
