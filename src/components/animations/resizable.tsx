import React, { type ReactNode } from 'react';
import useMeasure from 'react-use-measure';
import { motion } from 'framer-motion';
import withErrorBoundary from '@/hocs/with-error-boundry';

function Resizable({ className, children, onAnimationComplete }: { className?: string, children: ReactNode, onAnimationComplete?: () => void }) {
    const [ref, { height }] = useMeasure();

    return (
        <motion.div
            animate={{ height: height || 'auto' }}
            className={`relative overflow-hidden ${className}`}
            onAnimationComplete={onAnimationComplete}
        >
            <div ref={ref} className={`${height ? 'absolute' : 'relative'} w-full`}>
                {children}
            </div>
        </motion.div>
    );
}

export default withErrorBoundary(Resizable);
