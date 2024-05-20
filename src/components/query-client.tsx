"use client"
import React, { type ReactNode } from 'react'
import { QueryClient, QueryClientProvider as QCProvider } from 'react-query'

const queryClient = new QueryClient()

export default function QueryClientProvider({ children }: { children: ReactNode }) {
    return (
        <QCProvider client={queryClient}>
            {children}
        </QCProvider>
    )
}
