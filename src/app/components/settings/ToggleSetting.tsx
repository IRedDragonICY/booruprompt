import { memo, useCallback, useId } from 'react';
import { motion } from 'framer-motion';
import { TooltipWrapper } from '../TooltipWrapper';

interface ToggleSettingProps {
    id?: string;
    label: string;
    description: React.ReactNode;
    tooltip?: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    icon?: React.ReactNode;
    note?: string;
}

const TOGGLE_TRANSITION = { type: "spring", stiffness: 500, damping: 30 };

export const ToggleSetting = memo(function ToggleSetting({
    id,
    label,
    description,
    tooltip,
    checked,
    onChange,
    icon,
    note
}: ToggleSettingProps) {
    const generatedId = useId();
    const inputId = id || generatedId;

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.checked);
    }, [onChange]);

    const content = (
        <div className="flex items-center text-base font-medium text-[rgb(var(--color-on-surface-rgb))]">
            {icon && <span className="mr-3 text-[rgb(var(--color-primary-rgb))]">{icon}</span>}
            <span>{label}</span>
        </div>
    );

    return (
        <div className="group relative overflow-hidden rounded-2xl bg-[rgb(var(--color-surface-alt-rgb))] p-4 transition-colors hover:bg-[rgb(var(--color-surface-alt-2-rgb))]">
            <label className="flex cursor-pointer select-none items-start justify-between">
                <div className="flex-1 pr-4">
                    {tooltip ? (
                        <TooltipWrapper tipContent={tooltip}>
                            {content}
                        </TooltipWrapper>
                    ) : content}
                    <div className="mt-1 text-sm text-[rgb(var(--color-on-surface-muted-rgb))] leading-relaxed">
                        {description}
                        {note && <span className="mt-1 block font-medium text-[rgb(var(--color-primary-rgb))]">{note}</span>}
                    </div>
                </div>
                
                <div className="relative shrink-0 mt-1">
                    <input
                        type="checkbox"
                        id={inputId}
                        className="peer sr-only"
                        checked={checked}
                        onChange={handleChange}
                    />
                    <div className="h-8 w-14 rounded-full bg-[rgb(var(--color-surface-border-rgb))] transition-colors duration-300 peer-checked:bg-[rgb(var(--color-primary-rgb))] peer-focus-visible:ring-2 peer-focus-visible:ring-[rgb(var(--color-primary-rgb))] peer-focus-visible:ring-offset-2" />
                    <motion.div
                        className="absolute left-1 top-1 h-6 w-6 rounded-full bg-white shadow-sm"
                        layout
                        transition={TOGGLE_TRANSITION}
                        initial={false}
                        animate={{ 
                            x: checked ? 24 : 0,
                            scale: checked ? 1.1 : 1
                        }}
                    />
                </div>
            </label>
        </div>
    );
});
