import React from 'react';
import { motion } from 'framer-motion';
import { TagCategoryOption } from '../utils/extractionUtils';

const MotionCard = motion.div;

interface CategoryToggleProps {
    category: TagCategoryOption;
    count: number;
    onToggle: () => void;
}

const CategoryToggle = React.memo(({ category, count, onToggle }: CategoryToggleProps) => (
    <MotionCard className="flex items-center justify-between rounded-2xl bg-[rgb(var(--color-surface-alt-2-rgb))] p-4 transition-all hover:shadow-md hover:shadow-[rgba(var(--color-primary-rgb),0.12)]" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: "easeOut" }} whileTap={{ scale: 0.98 }} whileHover={{ y: -2, backgroundColor: "rgba(var(--color-surface-alt-2-rgb), 0.8)" }}>
        <div className="flex items-center space-x-3 overflow-hidden">
            <motion.span className={`inline-flex h-4 w-4 shrink-0 rounded-full items-center justify-center`} style={{ backgroundColor: `rgb(var(${category.variable}))` }} animate={{ scale: category.enabled ? 1 : 0.8, boxShadow: category.enabled ? '0 2px 4px rgba(0,0,0,0.2)' : 'none' }} transition={{ type: 'spring', stiffness: 300, damping: 15 }}/>
            <div className="flex flex-col min-w-0">
                <span className="truncate text-base font-medium text-[rgb(var(--color-on-surface-rgb))]" title={category.label}>{category.label}</span>
                {count > 0 && <span className="text-xs text-[rgb(var(--color-on-surface-muted-rgb))]">{count} {count === 1 ? 'tag' : 'tags'}</span>}
            </div>
        </div>
        <div className="relative">
            <label className="relative inline-flex shrink-0 cursor-pointer items-center">
                <input type="checkbox" className="peer sr-only" checked={category.enabled} onChange={onToggle} aria-labelledby={`category-label-${category.id}`}/>
                <div className={`relative h-8 w-14 rounded-full bg-[rgb(var(--color-surface-border-rgb))] transition-all duration-300 ease-out peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[rgb(var(--color-primary-rgb))] peer-focus:ring-offset-2 peer-focus:ring-offset-[rgb(var(--color-surface-alt-rgb))] peer-checked:bg-[rgb(var(${category.variable}))] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:h-7 after:w-7 after:rounded-full after:bg-white peer-checked:after:translate-x-6 after:shadow-sm after:transition-all after:duration-300 dark:after:bg-gray-200`}/>
            </label>
            <span id={`category-label-${category.id}`} className="sr-only">{category.label} Toggle</span>
            <motion.div className="absolute inset-0 rounded-full pointer-events-none opacity-0" animate={{ opacity: category.enabled ? 0.12 : 0, backgroundColor: `rgb(var(${category.variable}))` }} initial={false} transition={{ duration: 0.3 }}/>
        </div>
    </MotionCard>
));
CategoryToggle.displayName = 'CategoryToggle';

export default CategoryToggle; 