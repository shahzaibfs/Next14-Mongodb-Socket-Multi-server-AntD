"use client";

import dynamic from "next/dynamic";
import { type ReactNode, createContext, useContext, useMemo, useState } from "react";
import Spinner from "@/components/spinner";

const modalCTX = createContext<
    | {
        openModal(key: ModalMapperKeys, modalData?: any): void;
        closeModal(key: ModalMapperKeys): void;
    }
    | undefined
>(undefined);

export const useModlCTX = () => {
    const ctx = useContext(modalCTX);
    if (!ctx) throw Error("Pleae use the context withtin modal-ctx-provider");
    return ctx;
};

/**
 * Note: You can use lazy loading here by importing the dynamic from NEXT.js
 */
export const modalsMapper = {
    /**
     * Example...
     */
    EXAMPLE: dynamic(() => import("@/modals/example.modal"), {
        loading: () => <Spinner>Loading Example...</Spinner>,
    }),
} as const;

type ModalMapperKeys = keyof typeof modalsMapper;

interface Modal {
    key: ModalMapperKeys;
    data?: any;
}

export default function ModalCtxProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [modals, setModals] = useState<Modal[]>([]);

    const openModal = (key: ModalMapperKeys, data?: any) => {
        setModals((oModals) => {
            if (oModals.some((m) => m.key === key)) return oModals;
            return [...oModals, { key, data }];
        });
    }
    const closeModal = (key: ModalMapperKeys) => {
        setModals((oModals) => {
            return oModals.filter((m) => m.key !== key);
        });
    }

    const renderModals = useMemo(() => {
        return modals.map((m) => {
            const { key, data } = m;
            const ModalComponent = (modalsMapper?.[key] as any) ?? undefined;
            if (!ModalComponent) {
                console.warn(`Modal with this key doesnot exist => ${key}`);
                return null;
            }
            return (
                <ModalComponent
                    key={key}
                    closeModal={() => {
                        closeModal(key);
                    }}
                    {...data}
                />
            );
        });
    }, [modals]);

    return (
        <modalCTX.Provider value={{ openModal, closeModal }}>
            {children}
            {renderModals}
        </modalCTX.Provider>
    );
}
