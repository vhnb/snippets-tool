import { db } from "@/service/firebaseConnection"
import { where, collection, onSnapshot, query, updateDoc, doc, deleteDoc } from 'firebase/firestore'
import { useState, useEffect, FormEvent } from 'react'
import CardSnippet from "../CardSnippet"
import { Toaster, toast } from "sonner"
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import styles from './styles.module.css'
import { IoClose } from "react-icons/io5"
import Switch from "react-switch";

interface SnippetsProps {
    id: string,
    created: Date,
    isPublic: boolean,
    title: string,
    snippet: string,
    tag: string,
    userMail: string,
    userName: string,
    folderId?: string | null
}

interface FolderContentProps {
    folderId: string | null,
    userMail: string,
    folderName: string,
    folderColor: string
}

export default function FolderContent({ folderId, userMail, folderName, folderColor }: FolderContentProps) {
    const [snippets, setSnippets] = useState<SnippetsProps[]>([])
    const [loading, setLoading] = useState(true)
    const [copied, setCopied] = useState(false)
    const [open, setOpen] = useState(false)
    const [snippetToDelete, setSnippetToDelete] = useState<string | null>(null)
    const [inputEditTitleSnippet, setInputEditTitleSnippet] = useState('')
    const [inputEditSnippet, setInputEditSnippet] = useState('')
    const [inputEditTagSnippet, setInputEditTagSnippet] = useState('')
    const [editPublicSnippet, setEditPublicSnippet] = useState(false)
    const [editSnippetId, setEditSnippetId] = useState<string | null>(null)

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 350,
        bgcolor: '#000000ec',
        boxShadow: 24,
        border: '1px solid #6c6c6c32',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '6px',
    }

    useEffect(() => {
        async function LoadSnippets() {
            const q = query(collection(db, 'snippets'), where('userMail', '==', userMail), where('folderId', '==', folderId))

            onSnapshot(q, (snapshot) => {
                let list = [] as SnippetsProps[]

                snapshot.forEach((doc) => {
                    if (doc.data().folderId === folderId) {
                        list.push({
                            id: doc.id,
                            created: doc.data().created,
                            isPublic: doc.data().isPublic,
                            title: doc.data().title,
                            snippet: doc.data().snippet,
                            tag: doc.data().tag,
                            userMail: doc.data().userMail,
                            userName: doc.data().userName,
                            folderId: doc.data().folderId
                        })
                    }
                })
                setSnippets(list)
                setLoading(false)
            })
        }
        LoadSnippets()
    }, [userMail, folderId])

    function handleOpenEditSnippetModal(item: SnippetsProps) {
        setEditSnippetId(item.id)
        setInputEditTitleSnippet(item.title)
        setInputEditSnippet(item.snippet)
        setInputEditTagSnippet(item.tag)
        setEditPublicSnippet(item.isPublic)
    }

    async function handleEditSnippet(event: FormEvent) {
        event.preventDefault()

        if (!editSnippetId) return

        try {
            await updateDoc(doc(db, 'snippets', editSnippetId), {
                title: inputEditTitleSnippet,
                snippet: inputEditSnippet,
                tag: inputEditTagSnippet,
                isPublic: editPublicSnippet
            })
            setEditSnippetId(null)
            setInputEditTitleSnippet('')
            setInputEditSnippet('')
            setInputEditTagSnippet('')
            setEditPublicSnippet(false)
            toast.success('Trecho editado com sucesso.')
        } catch (error) {
            console.error(error)
            toast.error('Erro ao editar trecho.')
        }
    }

    function handleOpen(id: string) {
        setSnippetToDelete(id)
        setOpen(true)
    }

    async function handleDeleteSnippet(id: string) {
        if (!id) return
        await deleteDoc(doc(db, 'snippets', id))
        setOpen(false)
        toast.success('Trecho deletado com sucesso.')
    }

    async function handleShareSnippetPublic(id: string) {
        const url = `${process.env.NEXT_PUBLIC_URL}/snippet/${id}`
        await navigator.clipboard.writeText(url)
        toast('URL do trecho público copiada.')
    }

    async function handleMoveToFolder(snippetId: string, folderId: string | null) {
        try {
            await updateDoc(doc(db, 'snippets', snippetId), {
                folderId: folderId
            })
            toast.success('Trecho movido para pasta com sucesso.')
        } catch (error) {
            console.error(error)
            toast.error('Erro ao mover trecho para pasta.')
        }
    }

    async function handleCopy(snippet: string) {
        try {
            await navigator.clipboard.writeText(snippet)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
            toast.success('Trecho copiado.')
        } catch (error) {
            console.error("Falha ao copiar:", error)
        }
    }

    async function handleDownload(snippet: string, title: string) {
        const blob = new Blob([snippet], { type: 'text/plain' })
        const url = URL.createObjectURL(blob)

        const link = document.createElement('a')
        link.href = url
        link.download = `${title}.txt`
        link.click()

        URL.revokeObjectURL(url)
        toast.success('Arquivo baixado.')
    }

    function handleChangePublic(checked: boolean) {
        setEditPublicSnippet(checked)
    }

    return (
        <>
            <div style={{border:`1px solid ${folderColor}50`, backgroundColor:`${folderColor}05`,}} className={`${"collapse"} ${styles.contentCollapseContent}`} id={`collapseExample-${folderId}`}>
                <h1>Pasta {folderName}</h1>
                {snippets.map((item, index) => (
                    <CardSnippet
                        key={item.id}
                        id={item.id}
                        loading={loading}
                        index={index}
                        created={item.created}
                        isPublic={item.isPublic}
                        title={item.title}
                        snippet={item.snippet}
                        tag={item.tag}
                        userMail={item.userMail}
                        userName={item.userName}
                        folderId={item.folderId}
                        handleShareSnippetPublic={handleShareSnippetPublic}
                        handleOpenEditSnippetModal={handleOpenEditSnippetModal}
                        handleOpen={handleOpen}
                        handleCopy={handleCopy}
                        handleDownload={handleDownload}
                        handleMoveToFolder={handleMoveToFolder}
                        idModalEdit="#exampleModal4"
                        buttonOthersFolders={false}
                        buttonRemoveFolder={true}
                    />
                ))}
                {snippets.length === 0 && (
                    <p className={styles.messageInfoContentSnippets}>Nenhum snippet dentro desta pasta.</p>
                )}
            </div>
            <Toaster position="top-center" />
            <Modal
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <h1 className={styles.textConfirmLogout}>Deseja mesmo deletar este trecho?</h1>
                    <div className={styles.lineModal}></div>
                    <button className={styles.btnConfirmLogout} onClick={() => handleDeleteSnippet(snippetToDelete!)}>Deletar</button>
                </Box>
            </Modal>
            <div className={`${"modal fade"} ${styles.containerModal}`} id="exampleModal4" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className={`${"modal-dialog modal-dialog-centered"} ${styles.dialogModal}`}>
                    <div className={`${"modal-content"} ${styles.contentModal}`}>
                        <div className={styles.headerModal}>
                            <h1>Editar Trecho</h1>
                            <IoClose data-bs-dismiss="modal" aria-label="Close" className={styles.iconModalHeader} />
                        </div>
                        <form onSubmit={handleEditSnippet}>
                            <input value={inputEditTitleSnippet} onChange={(event) => setInputEditTitleSnippet(event.target.value)} type="text" required placeholder='Título do trecho...' />
                            <textarea value={inputEditSnippet} onChange={(event) => setInputEditSnippet(event.target.value)} required placeholder='Digite o trecho...' />
                            <select value={inputEditTagSnippet} onChange={(event) => setInputEditTagSnippet(event.target.value)} required className={styles.btnFilter}>
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
                                        checked={editPublicSnippet}
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
                                <button data-bs-dismiss="modal" aria-label="Close" type='submit'>Editar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}