import styles from './styles.module.css'
import { useEffect, useState, FormEvent } from "react";
import { auth, db } from '@/service/firebaseConnection';
import { collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, orderBy, query, where, updateDoc } from "firebase/firestore";
import { getSession, useSession } from 'next-auth/react';
import { GetServerSideProps } from 'next';
import { motion } from 'framer-motion'
import Head from 'next/head';
import { Toaster, toast } from 'sonner'
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { TbMist, TbLock, TbFolder, TbEye, TbSearch } from "react-icons/tb";
import { IoClose } from "react-icons/io5";
import Switch from "react-switch";
import HeaderDashboard from '@/components/HeaderDashboard';
import ModalCreateSnippet from '@/components/ModalCreateSnippet';
import ModalCreateFolder from '@/components/ModalCreateFolder';
import CardFolder from '@/components/CardFolder';
import CardStatistics from '@/components/CardStatistics';
import CardSnippet from '@/components/CardSnippet';
import FolderContent from '@/components/FolderContent';

interface HomeProps {
    user: {
        email: string
    }
}

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

interface FolderProps {
    id: string,
    created: Date,
    nameFolder: string,
    colorFolder: string,
    userMail: string,
    userName: string
}

export default function Dashboard({ user }: HomeProps) {
    const { data: session } = useSession()
    const [snippets, setSnippets] = useState<SnippetsProps[]>([])
    const [folder, setFolder] = useState<FolderProps[]>([])
    const [snippetsCount, setSnippetsCount] = useState(0)
    const [publicSnippetsCount, setPublicSnippetsCount] = useState(0)
    const [privateSnippetsCount, setPrivateSnippetsCount] = useState(0)
    const [folderCount, setFolderCount] = useState(0)
    const [copied, setCopied] = useState(false)
    const [loading, setLoading] = useState(true)
    const [open, setOpen] = useState(false)
    const handleClose = () => setOpen(false)
    const [openFolderDelete, setOpenFolderDelete] = useState(false)
    const handleCloseFolderDelete = () => setOpenFolderDelete(false)
    const [snippetToDelete, setSnippetToDelete] = useState<string | null>(null)
    const [folderToDelete, setFolderToDelete] = useState<string | null>(null)
    const [inputEditTitleSnippet, setInputEditTitleSnippet] = useState('')
    const [inputEditSnippet, setInputEditSnippet] = useState('')
    const [inputEditTagSnippet, setInputEditTagSnippet] = useState('')
    const [editPublicSnippet, setEditPublicSnippet] = useState(false)
    const [editSnippetId, setEditSnippetId] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [filteredSnippetsCount, setFilteredSnippetsCount] = useState(0)
    const [filterTag, setFilterTag] = useState('')
    const [editFoldertId, setEditFolderId] = useState<string | null>(null)
    const [inputEditNameFolder, setInputEditNameFolder] = useState('')
    const [inputEditColorFolder, setInputEditColorFolder] = useState('')

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
        async function loadSnippets() {
            const q = query(collection(db, 'snippets'), where('userMail', '==', user.email))

            onSnapshot(q, (snapshot) => {
                let list = [] as SnippetsProps[]
                let publicCount = 0
                let privateCount = 0

                snapshot.forEach((doc) => {
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
                    if (doc.data().isPublic) {
                        publicCount++
                    } else {
                        privateCount++
                    }
                })

                setSnippetsCount(list.length)
                setPublicSnippetsCount(publicCount)
                setPrivateSnippetsCount(privateCount)
                setLoading(false)

                if (searchTerm) {
                    list = list.filter((snippet) => snippet.title.toLowerCase().includes(searchTerm.toLowerCase()))
                }

                if (filterTag) {
                    list = list.filter((snippet) => snippet.tag === filterTag)
                }

                setSnippets(list)
                setFilteredSnippetsCount(list.length)
                setLoading(false)
            })
        }
        loadSnippets()
    }, [user.email, searchTerm, filterTag])

    useEffect(() => {
        async function LoadFolders() {
            const q = query(collection(db, 'folders'), where('userMail', '==', user.email))

            onSnapshot(q, (snapshot) => {
                let list = [] as FolderProps[]

                snapshot.forEach((doc) => {
                    list.push({
                        id: doc.id,
                        created: doc.data().created,
                        nameFolder: doc.data().nameFolder,
                        colorFolder: doc.data().colorFolder,
                        userMail: doc.data().userMail,
                        userName: doc.data().userName
                    })
                })
                setFolder(list)
                setFolderCount(list.length)
                setLoading(false)
            })
        }
        LoadFolders()
    }, [user.email])

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

    function handleOpenModalDeleteFolder(id: string) {
        setFolderToDelete(id)
        setOpenFolderDelete(true)
    }

    async function handleDeleteFolder(id: string) {
        if (!id) return

        const q = await getDocs(query(collection(db, 'snippets'), where('folderId', '==', id)))

        if (q.empty) {
            await deleteDoc(doc(db, 'folders', id))
            setOpenFolderDelete(false)
            toast.success('Pasta deletada com sucesso.')
        } else {
            toast.error('Esta pasta contém conteúdo dentro.')
        }
    }

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
                isPublic: editPublicSnippet,
            })
            setEditSnippetId(null)
            setInputEditTitleSnippet('')
            setInputEditSnippet('')
            setInputEditTagSnippet('')
            setEditPublicSnippet(false)
            toast.success('Trecho editado com sucesso.')
        } catch (error) {
            console.error(error)
        }
    }

    function handleChangePublic(checked: boolean) {
        setEditPublicSnippet(checked)
    }

    async function handleShareSnippetPublic(id: string) {
        const url = `${process.env.NEXT_PUBLIC_URL}/snippet/${id}`
        await navigator.clipboard.writeText(url)
        toast('URL do trecho público copiada.')
    }

    function handleOpenModalEditFolder(item: FolderProps) {
        setEditFolderId(item.id)
        setInputEditNameFolder(item.nameFolder)
        setInputEditColorFolder(item.colorFolder)
    }

    async function handleEditFolder(event: FormEvent) {
        event.preventDefault()

        if (!editFoldertId) return

        try {
            await updateDoc(doc(db, 'folders', editFoldertId), {
                colorFolder: inputEditColorFolder,
                nameFolder: inputEditNameFolder
            })
            setEditFolderId(null)
            setInputEditColorFolder("")
            toast.success("Pasta editada com sucesso.")
        } catch (error) {
            console.error(error)
        }
    }

    async function handleMoveToFolder(snippetId: string, folderId: string | null) {
        try {
            await updateDoc(doc(db, 'snippets', snippetId), {
                folderId: folderId
            })

            const updateSnippets = snippets.map(snippet => snippet.id === snippetId ? { ...snippet, folderId } : snippet)
            setSnippets(updateSnippets)

            toast.success('Trecho movido para pasta com sucesso.')
        } catch (error) {
            console.error(error)
            toast.error('Erro ao mover trecho para pasta.')
        }
    }

    return (
        <>
            <Head>
                <title>Snippets Tool</title>
            </Head>
            <HeaderDashboard user={user} />
            <main className={styles.container}>
                <div className={styles.contentContainer}>
                    <div className={styles.contentFunctionCreateSnippets}>
                        <motion.h1 className={styles.titleDashboard} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
                            Bem-vindo, {session?.user?.name}!
                        </motion.h1>
                        <motion.button data-bs-toggle="modal" data-bs-target="#exampleModal" className={styles.btnCreateSnippets} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
                            Criar Snippet
                        </motion.button>
                    </div>
                    <div className={styles.contentStatistics}>
                        <CardStatistics titleStatistics='Snippets armazenados' iconStatistics={<TbMist className={styles.iconSnippetsStatistics} />} countStatistics={snippetsCount} loading={loading} />
                        <CardStatistics titleStatistics='Snippets privados' iconStatistics={<TbLock className={styles.iconSnippetsStatistics} />} countStatistics={privateSnippetsCount} loading={loading} delay={0.3} />
                        <CardStatistics titleStatistics='Snippets públicos' iconStatistics={<TbEye className={styles.iconSnippetsStatistics} />} countStatistics={publicSnippetsCount} loading={loading} delay={0.5} />
                        <CardStatistics titleStatistics='Pastas criadas' iconStatistics={<TbFolder className={styles.iconSnippetsStatistics} />} countStatistics={folderCount} loading={loading} delay={0.7} />
                    </div>
                    <div className={styles.contentFunctionsUser}>
                        <motion.form initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.9 }}>
                            <TbSearch size={25} />
                            <input type="text" placeholder='Busque por nome do snippet...' value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
                        </motion.form>
                        <motion.select value={filterTag} onChange={(event) => setFilterTag(event.target.value)} className={styles.btnFilter} name="Filtrar por..." initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 1.1 }}>
                            <option value="">Filtrar por...</option>
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
                        </motion.select>
                        <motion.button disabled={folder.length === 4} data-bs-toggle="modal" data-bs-target="#exampleModal3" className={styles.btnCreateFolder} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 1.3 }}>
                            Criar pasta
                        </motion.button>
                    </div>
                    <div className={styles.line}></div>
                    <div className={styles.contentAllFolders}>
                        {folder.map((item, index) => (
                            <CardFolder
                                key={item.id}
                                nameFolder={item.nameFolder}
                                colorFolder={item.colorFolder}
                                id={item.id}
                                index={index}
                                handleOpenModalDeleteFolder={handleOpenModalDeleteFolder}
                                handleOpenModalEditFolder={handleOpenModalEditFolder}
                                userMail={user.email}
                                userName={session?.user?.name || ''}
                            />
                        ))}
                        {[...Array(4 - folder.length)].map((index) => (
                            <div className={styles.folderCardGhost} key={`ghost-${index}`}>
                                <TbFolder className={styles.iconFolderGhost} />
                            </div>
                        ))}
                    </div>
                    <div className={styles.line}></div>
                    <div className={styles.contentAllSnippets}>
                        {loading && (
                            <>
                                <div className={styles.cardSnippetLoadingSkeleton}></div>
                                <div className={styles.cardSnippetLoadingSkeleton}></div>
                            </>
                        )}
                        {snippets.length === 0 && !loading && (
                            <p>Nenhum snippet encontrado.</p>
                        )}
                        {snippets.map((item, index) => (
                            item.folderId === null && (
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
                                    idModalEdit='#exampleModal2'
                                    buttonOthersFolders={true}
                                    buttonRemoveFolder={false}
                                />
                            )
                        ))}
                    </div>
                </div>
            </main>
            <Toaster position="top-center" />
            <ModalCreateSnippet user={user} />
            <ModalCreateFolder user={user} />
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <h1 className={styles.textConfirmLogout}>Deseja mesmo deletar este trecho?</h1>
                    <div className={styles.lineModal}></div>
                    <button onClick={() => handleDeleteSnippet(snippetToDelete!)} className={styles.btnConfirmLogout}>Deletar</button>
                </Box>
            </Modal>
            <Modal
                open={openFolderDelete}
                onClose={handleCloseFolderDelete}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <h1 className={styles.textConfirmLogout}>Deseja mesmo deletar esta pasta?</h1>
                    <div className={styles.lineModal}></div>
                    <button onClick={() => handleDeleteFolder(folderToDelete!)} className={styles.btnConfirmLogout}>Deletar</button>
                </Box>
            </Modal>
            <div className={`${"modal fade"} ${styles.containerModal}`} id="exampleModal2" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className={`${"modal-dialog modal-dialog-centered"} ${styles.dialogModal}`}>
                    <div className={`${"modal-content"} ${styles.contentModal}`}>
                        <div className={styles.headerModal}>
                            <h1>Editar Trecho</h1>
                            <IoClose data-bs-dismiss="modal" aria-label="Close" className={styles.iconModalHeader} />
                        </div>
                        <form onSubmit={handleEditSnippet}>
                            <input value={inputEditTitleSnippet} onChange={(event) => setInputEditTitleSnippet(event.target.value)} type="text" required placeholder='Novo título do trecho...' />
                            <textarea value={inputEditSnippet} onChange={(event) => setInputEditSnippet(event.target.value)} required placeholder='Digite o novo trecho...' />
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
            <div className={`${"modal fade"} ${styles.containerModal}`} id="exampleModalEditFolder" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className={`${"modal-dialog modal-dialog-centered"} ${styles.dialogModal}`}>
                    <div className={`${"modal-content"} ${styles.contentModal}`}>
                        <div className={styles.headerModal}>
                            <h1>Editar Pasta</h1>
                            <IoClose data-bs-dismiss="modal" aria-label="Close" className={styles.iconModalHeader} />
                        </div>
                        <form onSubmit={handleEditFolder}>
                            <input value={inputEditNameFolder} onChange={(event) => setInputEditNameFolder(event.target.value)} type="text" required placeholder='Novo nome da pasta...' />
                            <input value={inputEditColorFolder} onChange={(event) => setInputEditColorFolder(event.target.value)} type="color" required />
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

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const session = await getSession({ req })

    if (!session?.user) {
        return {
            redirect: {
                destination: '/auth/login',
                permanent: false
            }
        }
    }

    return {
        props: {
            user: {
                email: session?.user?.email
            }
        }
    }
}