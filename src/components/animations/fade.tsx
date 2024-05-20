import React, { type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import withErrorBoundary from '@/hocs/with-error-boundry';

const fadeFrames = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
};

function Fade({ children, onAnimationComplete }: { children: ReactNode, onAnimationComplete?: () => void }) {
    return (
        <AnimatePresence initial={true} mode='popLayout' >
            <motion.div
                key={JSON.stringify(children, ignoreCircularReferences())}
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

/*
  Replacer function to JSON.stringify that ignores
  circular references and internal React properties.
  https://github.com/facebook/react/issues/8669#issuecomment-531515508
*/
const ignoreCircularReferences = () => {
    const seen = new WeakSet();
    return (key: string, value: any) => {
        if (key.startsWith('_')) return; // Don't compare React's internal props.
        if (typeof value === 'object' && value !== null) {
            if (seen.has(value)) return;
            seen.add(value);
        }
        return value;
    };
};
