"use client"
import CreateServerModal from "@/modals/create-server.modal";
import { ReactNode, createContext, useContext, useMemo, useState } from "react";


const modalCTX = createContext<{
    openModal(key: ModalMapperKeys, modalData?: any): void
    closeModal(key: ModalMapperKeys): void;
} | undefined>(undefined)

export const useModlCTX = () => {
    const ctx = useContext(modalCTX);
    if (!ctx) throw Error("Pleae use the context withtin modal-ctx-provider")
    return ctx
}

export const modalsMapper = {
    //* ======== SERVER
    "CREATE-SERVER": CreateServerModal,
    "CREATE-SERVER-v2": CreateServerModal

} as const

type ModalMapperKeys = keyof typeof modalsMapper;

interface Modal {
    key: ModalMapperKeys,
    data?: any;
}

export default function ModalCtxProvider({ children }: { children: ReactNode }) {
    const [modals, setModals] = useState<Modal[]>([])

    function openModal(key: ModalMapperKeys, data?: any) {
        setModals(oModals => {
            if (oModals.some(m => m.key === key)) return oModals
            return [...oModals, { key, data }]
        })
    }
    function closeModal(key: ModalMapperKeys) {
        setModals(oModals => {
            return oModals.filter(m => m.key !== key)
        })
    }

    const renderModals = useMemo(() => {
        return modals.map(m => {
            const { key, data } = m
            let ModalComponent = modalsMapper?.[key] as any ?? undefined
            if (!ModalComponent) {
                console.warn(`Modal with this key doesnot exist => ${key}`)
                return null
            }
            return <ModalComponent key={key} closeModal={() => { closeModal(key) }} {...data} />
        })
    }, [modals])
    return <modalCTX.Provider value={{ openModal, closeModal }}>
        {children}
        {renderModals}
    </modalCTX.Provider>
}
