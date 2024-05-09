import { Modal } from 'antd'
import React, { ReactNode } from 'react'

export default function CreateServerModal({ name, data, closeModal, children }: { closeModal: any, children: ReactNode, name?: string, data?: any, }) {

    return (
        <Modal title={name} open={true} onCancel={closeModal}>
            <pre>{JSON.stringify(data, undefined, 10)}</pre>
        </Modal>
    )
}
