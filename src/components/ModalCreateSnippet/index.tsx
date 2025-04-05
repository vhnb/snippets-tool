import styles from './styles.module.css'
import { IoClose } from "react-icons/io5";
import Switch from "react-switch";
import { FormEvent, useState, useRef } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/service/firebaseConnection';
import { Toaster, toast } from 'sonner'
import { useSession } from 'next-auth/react';

interface HomeProps {
    user: {
        email: string
    }
}

export default function ModalCreateSnippet({ user }: HomeProps) {
    const [inputTitleSnippet, setInputTitleSnippet] = useState('')
    const [inputSnippet, setInputSnippet] = useState('')
    const [inputTagSnippet, setInputTagSnippet] = useState('')
    const [publicSnippet, setPublicSnippet] = useState(false)
    const { data: session } = useSession()
    const modalRef = useRef<HTMLDivElement>(null)

    async function handleCreateSnippet(event: FormEvent) {
        event.preventDefault()

        if (inputTagSnippet === "") {
            return
        }

        try {
            await addDoc(collection(db, 'snippets'), {
                created: new Date(),
                tag: inputTagSnippet,
                snippet: inputSnippet,
                title: inputTitleSnippet,
                isPublic: publicSnippet,
                folderId: null,
                userMail: session?.user?.email,
                userName: session?.user?.name
            })
            setInputTagSnippet('')
            setInputSnippet('')
            setInputTitleSnippet('')
            setPublicSnippet(false)
            toast.success('Snippet salvo com sucesso.')

            const modalCloseButton = document.querySelector('#buttonCloseModalEditSnippet');
            modalCloseButton?.dispatchEvent(new MouseEvent('click'))
        } catch (error) {
            console.error(error)
        }
    }

    const handleChangePublic = (nextChecked: boolean) => {
        setPublicSnippet(nextChecked)
    }

    return (
        <>
            <div ref={modalRef} className={`${"modal fade"} ${styles.containerModal}`} id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className={`${"modal-dialog modal-dialog-centered"} ${styles.dialogModal}`}>
                    <div className={`${"modal-content"} ${styles.contentModal}`}>
                        <div className={styles.headerModal}>
                            <h1>Criar Novo Snippet</h1>
                            <IoClose id='buttonCloseModalEditSnippet' data-bs-dismiss="modal" aria-label="Close" className={styles.iconModalHeader} />
                        </div>
                        <form onSubmit={handleCreateSnippet}>
                            <input value={inputTitleSnippet} onChange={(event) => setInputTitleSnippet(event.target.value)} type="text" required placeholder='Título do trecho...' />
                            <textarea value={inputSnippet} onChange={(event) => setInputSnippet(event.target.value)} required placeholder='Digite o trecho...' />
                            <select value={inputTagSnippet} onChange={(event) => setInputTagSnippet(event.target.value)} required className={styles.btnFilter}>
                                <option value="">Tecnologia usada...</option>
                                <option value="JavaScript">JavaScript</option>
                                <option value="Python">Python</option>
                                <option value="Java">Java</option>
                                <option value="C++">C++</option>
                                <option value="C#">C#</option>
                                <option value="PHP">PHP</option>
                                <option value="TypeScript">TypeScript</option>
                                <option value="Swift">Swift</option>
                                <option value="SQL">SQL</option>
                                <option value="HTML">HTML</option>
                                <option value="CSS">CSS</option>
                                <option value="Go (Golang)">Go (Golang)</option>
                            </select>
                            <div className={styles.contentIfSnippetPublic}>
                                <label>
                                    <span>Deixar o trecho público?</span>
                                    <Switch
                                        onChange={handleChangePublic}
                                        checked={publicSnippet}
                                        offColor="#888"
                                        onColor="#4269e8"
                                        offHandleColor="#fff"
                                        onHandleColor="#fff"
                                        uncheckedIcon={false}
                                        checkedIcon={false}
                                        height={20}
                                        width={40}
                                    />
                                </label>
                            </div>
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