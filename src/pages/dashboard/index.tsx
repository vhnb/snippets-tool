import styles from './styles.module.css'
import { useEffect, useState, FormEvent } from "react";
import { auth, db } from '@/service/firebaseConnection';
import { collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, orderBy, query, where, updateDoc } from "firebase/firestore";
import { getSession, useSession } from 'next-auth/react';
import { GetServerSideProps } from 'next';
import { motion } from 'framer-motion'
import HeaderDashboard from '@/components/HeaderDashboard';
import { TbMist, TbLock, TbFolder, TbEye, TbSearch, TbCopy, TbFileDownload, TbLink } from "react-icons/tb";
import ModalCreateSnippet from '@/components/ModalCreateSnippet';
import Head from 'next/head';
import { Toaster, toast } from 'sonner'
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { IoClose } from "react-icons/io5";
import Switch from "react-switch";

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
    userName: string
}

export default function Dashboard({ user }: HomeProps) {
    const { data: session } = useSession()
    const [snippets, setSnippets] = useState<SnippetsProps[]>([])
    const [snippetsCount, setSnippetsCount] = useState(0)
    const [publicSnippetsCount, setPublicSnippetsCount] = useState(0)
    const [privateSnippetsCount, setPrivateSnippetsCount] = useState(0)
    const [copied, setCopied] = useState(false)
    const [loading, setLoading] = useState(true)
    const [open, setOpen] = useState(false)
    const handleClose = () => setOpen(false)
    const [snippetToDelete, setSnippetToDelete] = useState<string | null>(null)
    const [inputEditTitleSnippet, setInputEditTitleSnippet] = useState('')
    const [inputEditSnippet, setInputEditSnippet] = useState('')
    const [inputEditTagSnippet, setInputEditTagSnippet] = useState('')
    const [editPublicSnippet, setEditPublicSnippet] = useState(false)
    const [editSnippetId, setEditSnippetId] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [filteredSnippetsCount, setFilteredSnippetsCount] = useState(0)
    const [filterTag, setFilterTag] = useState('')

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
        async function fetchSnippets() {
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
                        userName: doc.data().userName
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

                if(searchTerm) {
                    list = list.filter((snippet) => snippet.title.toLowerCase().includes(searchTerm.toLowerCase()))
                }

                if(filterTag) {
                    list = list.filter((snippet) => snippet.tag === filterTag)
                }

                setSnippets(list)
                setFilteredSnippetsCount(list.length)
                setLoading(false)
            })
        }
        fetchSnippets()
    }, [user.email, searchTerm, filterTag])

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
        if(!id) return
        await deleteDoc(doc(db, 'snippets', id))
        setOpen(false)
        toast.success('Trecho deletado com sucesso.')
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

    return (
        <>
            <Head>
                <title>Snippets Tool</title>
            </Head>
            <HeaderDashboard />
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
                        <motion.article initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                            <div className={styles.contentHeaderSnippetsStatistics}>
                                <p>Snippets armazenados</p>
                                <TbMist className={styles.iconSnippetsStatistics} />
                            </div>
                            {loading ? (
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            ) : (
                                <h1>{snippetsCount}</h1>
                            )}
                        </motion.article>
                        <motion.article initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.3 }}>
                            <div className={styles.contentHeaderSnippetsStatistics}>
                                <p>Snippets privados</p>
                                <TbLock className={styles.iconSnippetsStatistics} />
                            </div>
                            {loading ? (
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            ) : (
                                <h1>{privateSnippetsCount}</h1>
                            )}
                        </motion.article>
                        <motion.article initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.5 }}>
                            <div className={styles.contentHeaderSnippetsStatistics}>
                                <p>Snippets públicos</p>
                                <TbEye className={styles.iconSnippetsStatistics} />
                            </div>
                            {loading ? (
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            ) : (
                                <h1>{publicSnippetsCount}</h1>
                            )}
                        </motion.article>
                        <motion.article initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.7 }}>
                            <div className={styles.contentHeaderSnippetsStatistics}>
                                <p>Pastas criadas</p>
                                <TbFolder className={styles.iconSnippetsStatistics} />
                            </div>
                            <h1>0</h1>
                        </motion.article>
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
                        <motion.button className={styles.btnCreateFolder} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 1.3 }}>
                            Criar pasta
                        </motion.button>
                    </div>
                    <div className={styles.line}></div>
                    <div className={styles.contentAllSnippets}>
                        {loading ? (
                            <div className="spinner-border spinner-border-sm" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        ) : snippets.length === 0 && !loading && (
                            <p>Nenhum snippet encontrado.</p>
                        )}
                        {snippets.map((item, index) => (
                            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.1, delay: index * 0.2 }} key={item.id} className={styles.snippetCard}>
                                <div className={styles.headerCardSnippet}>
                                    <h2>{item.title}</h2>
                                    {!item.isPublic && (
                                        <p className={styles.isPrivate}><TbLink className={styles.iconRedirectSnippetPublic} size={18}/> Privado</p>
                                    )}
                                    {item.isPublic && (
                                        <p onClick={() => handleShareSnippetPublic(item.id)} className={styles.isPublic}><TbLink className={styles.iconRedirectSnippetPublic} size={18}/> Público</p>
                                    )}
                                </div>
                                <p className={styles.codeSnippet}>{item.snippet}</p>
                                <div className={styles.footerCardSnippet}>
                                    <span>{item.tag}</span>
                                    <div className={styles.fuctionSnippets}>
                                        <button data-bs-toggle="modal" data-bs-target="#exampleModal2" onClick={() => handleOpenEditSnippetModal(item)} className={styles.btnEdit}>Editar</button>
                                        <button onClick={() => handleOpen(item.id)} className={styles.btnDelete}>Deletar</button>
                                        <button onClick={() => handleCopy(item.snippet)} className={styles.btnCopy}><TbCopy size={15} /> Copiar</button>
                                        <button className={styles.btnDownload} onClick={() => handleDownload(item.snippet, item.title)}><TbFileDownload size={15} /> Baixar</button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </main>
            <Toaster position="top-center" />
            <ModalCreateSnippet user={user}/>
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
            <div className={`${"modal fade"} ${styles.containerModal}`} id="exampleModal2" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
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
                            <button data-bs-dismiss="modal" aria-label="Close" type='submit'>Editar</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const session = await getSession({ req })

    console.log('Session:', session)

    if (!session?.user) {
        return {
            redirect: {
                destination: '/auth/login',
                permanent: false
            }
        }
    }

    const userQuery = query(collection(db, 'users'), where('email', '==', session.user.email))
    const querySnapshot = await getDocs(userQuery)

    if (querySnapshot.empty) {
        return {
            redirect: {
                destination: '/payment',
                permanent: false,
            },
        }
    }

    const userDoc = querySnapshot.docs[0]
    const userData = userDoc.data()

    if (userData.role !== 'subscriber') {
        return {
            redirect: {
                destination: '/payment',
                permanent: false,
            },
        };
    }

    return {
        props: {
            user: {
                email: session?.user?.email
            }
        }
    }
}