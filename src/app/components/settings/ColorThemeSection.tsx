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
        <div className="rounded-2xl bg-[rgb(var(--color-surface-alt-rgb))] p-4">
            <label className="mb-3 flex items-center text-base font-medium text-[rgb(var(--color-on-surface-rgb))]">
                <span className="mr-3 text-[rgb(var(--color-primary-rgb))]"><PaletteIcon /></span>
                <span>{t('settings.sections.colorTheme')}</span>
            </label>
            <div className="grid grid-cols-4 gap-3 sm:grid-cols-7">
                {colorOptions.map(({ value, label, colorClass }) => (
                    <TooltipWrapper key={value} tipContent={label}>
                        <label className={`relative flex aspect-square cursor-pointer items-center justify-center rounded-full transition-all hover:scale-110 ${colorTheme === value ? 'ring-2 ring-[rgb(var(--color-primary-rgb))] ring-offset-2 ring-offset-[rgb(var(--color-surface-alt-rgb))]' : ''}`}>
                            <input type="radio" name="colorTheme" value={value} checked={colorTheme === value} onChange={handleThemeChange} className="sr-only" aria-label={t('settings.accessibility.colorThemeOption', { label })} />
                            <span className={`h-8 w-8 rounded-full ${colorClass} shadow-sm`} />
                            <AnimatePresence>
                                {colorTheme === value && (
                                    <motion.div className="absolute inset-0 flex items-center justify-center" {...CHECKMARK_VARIANTS} transition={{ duration: 0.15 }}>
                                        <svg className="h-4 w-4 text-white drop-shadow-md" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <span className="sr-only">{label}</span>
                        </label>
                    </TooltipWrapper>
                ))}
                <TooltipWrapper tipContent={t('settings.customColor.label')}>
                    <label className={`relative flex aspect-square cursor-pointer items-center justify-center rounded-full transition-all hover:scale-110 ${colorTheme === 'custom' ? 'ring-2 ring-[rgb(var(--color-primary-rgb))] ring-offset-2 ring-offset-[rgb(var(--color-surface-alt-rgb))]' : ''}`}>
                        <input type="radio" name="colorTheme" value="custom" checked={colorTheme === 'custom'} onChange={handleThemeChange} className="sr-only" aria-label={t('settings.customColor.label')} />
                        <span className="h-8 w-8 rounded-full border-2 border-gray-300 dark:border-gray-600 shadow-sm" style={{ backgroundColor: isValidHex ? localHex : '#ffffff' }} />
                        <AnimatePresence>
                            {colorTheme === 'custom' && (
                                <motion.div className="absolute inset-0 flex items-center justify-center" {...CHECKMARK_VARIANTS} transition={{ duration: 0.15 }}>
                                    <svg className="h-4 w-4 text-white drop-shadow-md mix-blend-difference" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <span className="sr-only">{t('settings.customColor.label')}</span>
                    </label>
                </TooltipWrapper>
            </div>
            {colorTheme === 'custom' && (
                <motion.div {...EXPAND_VARIANTS} className="mt-4 flex items-center space-x-3 rounded-xl bg-[rgb(var(--color-surface-alt-2-rgb))] p-3">
                    <input
                        type="color"
                        value={isValidHex ? localHex : '#ffffff'}
                        onChange={handleColorPickerChange}
                        className="h-10 w-10 cursor-pointer appearance-none rounded-lg border-0 bg-transparent p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-lg [&::-webkit-color-swatch]:border-none"
                        aria-label={t('settings.customColor.pickerLabel')}
                    />
                    <input
                        type="text"
                        value={localHex}
                        onChange={handleHexInputChange}
                        maxLength={7}
                        className="flex-1 appearance-none rounded-lg border-0 bg-[rgb(var(--color-surface-rgb))] px-3 py-2 font-mono text-sm text-[rgb(var(--color-on-surface-rgb))] placeholder:text-[rgb(var(--color-on-surface-faint-rgb))] shadow-sm ring-1 ring-inset ring-[rgb(var(--color-surface-border-rgb))] transition focus:ring-2 focus:ring-inset focus:ring-[rgb(var(--color-primary-rgb))]"
                        placeholder={t('settings.customColor.placeholder')}
                        aria-label={t('settings.customColor.inputLabel')}
                        pattern="^#?([a-fA-F0-9]{6})$"
                    />
                </motion.div>
            )}
        </div>
    );
});
