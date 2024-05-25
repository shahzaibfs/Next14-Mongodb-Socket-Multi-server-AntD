import React, { type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import withErrorBoundary from '@/hocs/with-error-boundry';

const fadeFrames = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
};

function Fade({ children, onAnimationComplete, initial = true }: { initial?: boolean; children: ReactNode, onAnimationComplete?: () => void }) {
    return (
        <AnimatePresence initial={initial} mode='popLayout'>
            <motion.div
                key={useStableKey(children)}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={fadeFrames}
                transition={{ duration: 0.6 }}
                onAnimationComplete={onAnimationComplete}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}

export default withErrorBoundary(Fade);

const useStableKey = (children: ReactNode) => {
    return React.useMemo(() => {
        const seen = new WeakSet();
        return JSON.stringify(children, (key, value) => {
            if (key.startsWith('_')) return;
            if (typeof value === 'object' && value !== null) {
                if (seen.has(value)) return;
                seen.add(value);
            }
            return value;
        });
    }, [children]);
};
