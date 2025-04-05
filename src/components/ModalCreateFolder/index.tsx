import styles from './styles.module.css'
import { useEffect, useState, useRef, FormEvent } from 'react'
import { db } from '@/service/firebaseConnection'
import { IoClose } from 'react-icons/io5'
import { Toaster, toast } from 'sonner'
import { addDoc, collection } from 'firebase/firestore'
import { useSession } from 'next-auth/react'

interface UserProps {
    user: {
        email: string
    }
}

export default function ModalCreateFolder({ user }: UserProps) {
    const [inputNameFolder, setInputNameFolder] = useState('')
    const [inputColorFolder, setInputColorFolder] = useState('')
    const { data: session } = useSession()
    const modalRef = useRef<HTMLDivElement>(null)

    async function handleCreateFolder(event: FormEvent) {
        event.preventDefault()

        try {
            await addDoc(collection(db, 'folders'), {
                created: new Date(),
                nameFolder: inputNameFolder,
                colorFolder: inputColorFolder,
                userMail: session?.user?.email,
                userName: session?.user?.name
            })
            setInputNameFolder('')
            toast.success('Pasta criada com sucesso.')

            const modalCloseButton = document.getElementById('btnClose');
            modalCloseButton?.dispatchEvent(new MouseEvent('click'))
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <>
            <div ref={modalRef} className={`${"modal fade"} ${styles.containerModal}`} id="exampleModal3" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className={`${"modal-dialog modal-dialog-centered"} ${styles.dialogModal}`}>
                    <div className={`${"modal-content"} ${styles.contentModal}`}>
                        <div className={styles.headerModal}>
                            <h1>Criar Nova Pasta</h1>
                            <IoClose id='btnClose' data-bs-dismiss="modal" aria-label="Close" className={styles.iconModalHeader} />
                        </div>
                        <form onSubmit={handleCreateFolder}>
                            <input value={inputNameFolder} onChange={(event) => setInputNameFolder(event.target.value)} type="text" required placeholder='Nome da pasta...' />
                            <input value={inputColorFolder} onChange={(event) => setInputColorFolder(event.target.value)} type="color" />
                            <p>Apenas 4 pastas poderão ser criadas.</p>
                            <div className={styles.footerModal}>
                                <button type='submit'>Criar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Toaster position="top-center" />
        </>
    )
}