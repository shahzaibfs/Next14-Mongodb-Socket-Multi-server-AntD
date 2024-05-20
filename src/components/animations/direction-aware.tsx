import React, { type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import withErrorBoundary from '@/hocs/with-error-boundry';

const animFrames = {
    initial: (dir: number) => ({
        x: `${100 * dir}%`,
        opacity: 0,

    }),
    animate: {
        x: 0,
        opacity: 1,

    },
    exit: (dir: number) => ({
        x: `${-100 * dir}%`,
        opacity: 0,
    }),
};

function DirectionAware({ direction, children, onAnimationComplete, initial, id }: { id?: string, initial?: boolean; children: ReactNode, direction: 'left' | 'right', onAnimationComplete?: () => void }) {
    const dirSymbol = direction === 'left' ? -1 : 1;
    return (
        <AnimatePresence initial={initial} mode='wait' custom={dirSymbol}>
            <motion.div
                key={id ?? direction}
                custom={dirSymbol}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={animFrames}
                onAnimationComplete={onAnimationComplete}
                transition={{
                    duration: 0.15
                }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}

export default withErrorBoundary(DirectionAware);
