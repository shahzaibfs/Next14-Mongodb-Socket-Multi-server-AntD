import { Button } from 'antd';
import React, { Component, type ReactNode } from 'react';

interface ErrorBoundaryProps {
    children: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        console.error(error)
        return { hasError: true };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.log({ error, errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className='p-2'>
                    <h2 className='text-red-800'>Unexpected Error! Please Report.</h2>
                    <div className='flex gap-2 mt-2'>
                        <Button type='link' className='px-0' >
                            <u>Report</u>
                        </Button>
                        <Button type='primary' className='bg-red-800 focus:!bg-red-800 hover:!bg-red-800' >
                            Try again
                        </Button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
