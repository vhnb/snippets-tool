import styles from './styles.module.css'
import { motion } from 'framer-motion'
import { TbLink, TbCopy, TbFileDownload, TbFolderPlus, TbFolder } from 'react-icons/tb'
import { db } from '@/service/firebaseConnection'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { useEffect, useState, FormEvent } from 'react'
import { IoClose } from 'react-icons/io5'

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

interface CardSnippetProps {
    id: string,
    snippet: string,
    loading: boolean,
    index: number,
    title: string,
    isPublic: boolean,
    tag: string,
    created: Date,
    userMail: string,
    userName: string,
    folderId?: string | null,
    handleShareSnippetPublic: (id: string) => void,
    handleOpenEditSnippetModal: (item: SnippetsProps) => void,
    handleOpen: (id: string) => void,
    handleCopy: (snippet: string) => void,
    handleDownload: (snippet: string, title: string) => void,
    handleMoveToFolder: (snippetId: string, folderId: string | null) => void,
    idModalEdit: string,
    buttonOthersFolders: boolean,
    buttonRemoveFolder: boolean
}

interface FolderProps {
    id: string,
    created: Date,
    nameFolder: string,
    colorFolder: string,
    userMail: string,
    userName: string
}

export default function CardSnippet({ id, snippet, loading, index, title, isPublic, tag, created, userMail, userName, handleShareSnippetPublic, handleOpenEditSnippetModal, handleOpen, handleCopy, handleDownload, handleMoveToFolder, idModalEdit, buttonOthersFolders, buttonRemoveFolder }: CardSnippetProps) {
    const [folders, setFolders] = useState<FolderProps[]>([])

    useEffect(() => {
        async function loadFolders() {
            const q = query(collection(db, 'folders'), where('userMail', '==', userMail))

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
                setFolders(list)
            })
        }
        loadFolders()
    }, [userMail])

    return (
        <>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.1, delay: index * 0.2 }} key={id} className={styles.snippetCard}>
                <div className={styles.headerCardSnippet}>
                    <h2>{title}</h2>
                    <div className={styles.contentHeaderCardSnippet}>
                        <div className={`${"btn-group"} ${styles.containerFolderToAdd}`}>
                            <button data-bs-toggle="dropdown" aria-expanded="false" className={styles.btnAddToFolder}><TbFolderPlus size={18} /></button>
                            <ul className={`${"dropdown-menu dropdown-menu-end"} ${styles.dropdownFolderToAdd}`}>
                                {buttonRemoveFolder === true && (
                                    <li className={styles.folderToRemove} onClick={() => handleMoveToFolder(id, null)}>
                                        <p className={styles.nameFolderToAdd}>Sem pasta</p>
                                        <IoClose className={styles.iconFolderToAdd} />
                                    </li>
                                )}
                                {buttonOthersFolders === true && (
                                    <>
                                        {folders.map((item) => (
                                            <li key={item.id} className={styles.folderToAdd} onClick={() => handleMoveToFolder(id, item.id)}>
                                                <p className={styles.nameFolderToAdd}>{item.nameFolder}</p>
                                                <TbFolder className={styles.iconFolderToAdd} />
                                            </li>
                                        ))}
                                        {folders.length === 0 && (
                                            <p style={{marginBottom:'0px', marginTop:'0px', fontSize:'14px',}}>Nenhuma pasta encontrada...</p>
                                        )}
                                    </>
                                )}
                            </ul>
                        </div>
                        {!isPublic && (
                            <p className={styles.isPrivate}><TbLink className={styles.iconRedirectSnippetPublic} size={18} /> Privado</p>
                        )}
                        {isPublic && (
                            <p onClick={() => handleShareSnippetPublic(id)} className={styles.isPublic}><TbLink className={styles.iconRedirectSnippetPublic} size={18} /> Público</p>
                        )}
                    </div>
                </div>
                <p className={styles.codeSnippet}>{snippet}</p>
                <div className={styles.footerCardSnippet}>
                    <span>{tag}</span>
                    <div className={styles.fuctionSnippets}>
                        <button data-bs-toggle="modal" data-bs-target={idModalEdit} onClick={() => handleOpenEditSnippetModal({ id, created, isPublic, title, snippet, tag, userMail, userName })} className={styles.btnEdit}>Editar</button>
                        <button onClick={() => handleOpen(id)} className={styles.btnDelete}>Deletar</button>
                        <button onClick={() => handleCopy(snippet)} className={styles.btnCopy}><TbCopy size={15} /> Copiar</button>
                        <button className={styles.btnDownload} onClick={() => handleDownload(snippet, title)}><TbFileDownload size={15} /> Baixar</button>
                    </div>
                </div>
            </motion.div>
        </>
    )
}
