import React, { type PropsWithChildren } from 'react';
import ErrorBoundary from "@/components/error-boundry";

function withErrorBoundary<T extends PropsWithChildren>(WrappedComponent: React.FC<T>): React.FC<T> {
    const Component: React.FC<T> = (props: T) => {
        return (
            <ErrorBoundary>
                <WrappedComponent {...props} />
            </ErrorBoundary>
        );
    };
    return Component;
}

export default withErrorBoundary;
