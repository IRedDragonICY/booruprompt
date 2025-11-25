import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    text?: string;
    className?: string;
}

export const LoadingSpinner = ({ size = 'sm', text, className = '' }: LoadingSpinnerProps) => {
    const sizeClasses = {
        sm: 'h-5 w-5',
        md: 'h-8 w-8',
        lg: 'h-12 w-12'
    };

    return (
        <motion.span 
            className={`flex items-center justify-center text-[rgb(var(--color-primary-rgb))] ${className}`} 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
        >
            <motion.svg
                className={`mr-3 text-currentColor ${sizeClasses[size]}`} 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </motion.svg> 
            {text && <span className={size === 'lg' ? 'text-lg font-medium' : 'text-sm font-medium'}>{text}</span>}
        </motion.span>
    );
};
LoadingSpinner.displayName = 'LoadingSpinner';