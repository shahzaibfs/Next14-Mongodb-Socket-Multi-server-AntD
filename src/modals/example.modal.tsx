import { Modal } from 'antd'

export default function ExampleModal({ name, data, closeModal }: { closeModal: any, name?: string, data?: any, }) {
    return (
        <Modal title={name} open={true} onCancel={closeModal}>
            <pre>{JSON.stringify(data, undefined, 10)}</pre>
        </Modal>
    )
}
