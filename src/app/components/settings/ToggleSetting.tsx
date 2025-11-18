import { memo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { TooltipWrapper } from '../TooltipWrapper';

interface ToggleSettingProps {
    id: string;
    label: string;
    description: string;
    tooltip: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    icon?: React.ReactNode;
    note?: string;
}

const TOGGLE_TRANSITION = { type: "spring", stiffness: 700, damping: 30 };

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
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.checked);
    }, [onChange]);

    return (
        <div className="rounded-xl border border-[rgb(var(--color-surface-border-rgb))] bg-[rgb(var(--color-surface-rgb))] p-3">
            <label className="flex cursor-pointer select-none items-center justify-between">
                <TooltipWrapper tipContent={tooltip}>
                    <span className="mr-3 text-sm font-medium text-[rgb(var(--color-on-surface-rgb))] flex items-center">
                        {icon}
                        <span className={icon ? "ml-2" : ""}>{label}</span>
                    </span>
                </TooltipWrapper>
                <div className="relative">
                    <input
                        type="checkbox"
                        id={id}
                        className="peer sr-only"
                        checked={checked}
                        onChange={handleChange}
                    />
                    <div className="block h-6 w-11 rounded-full bg-[rgb(var(--color-surface-border-rgb))] transition-colors duration-200 peer-checked:bg-[rgb(var(--color-primary-rgb))] peer-focus:ring-2 peer-focus:ring-[rgb(var(--color-primary-rgb))] peer-focus:ring-offset-2 peer-focus:ring-offset-[rgb(var(--color-surface-alt-rgb))]" />
                    <motion.div
                        className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-xs"
                        layout
                        transition={TOGGLE_TRANSITION}
                        initial={false}
                        animate={{ x: checked ? 20 : 0 }}
                    />
                </div>
            </label>
            <p className="mt-1.5 text-xs text-[rgb(var(--color-on-surface-muted-rgb))]">
                {description}
                {note && <span className="block">{note}</span>}
            </p>
        </div>
    );
});
