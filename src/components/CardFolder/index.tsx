import styles from './styles.module.css'
import { motion } from 'framer-motion'
import { TbFolder, TbFolderOpen, TbPencil, TbTrash } from 'react-icons/tb'
import { IoIosArrowDown } from 'react-icons/io'
import FolderContent from '../FolderContent'
import { useState } from 'react'

interface FolderProps {
    id: string,
    created: Date,
    nameFolder: string,
    colorFolder: string,
    userMail: string,
    userName: string
}

interface CardFolderProps {
    nameFolder: string,
    colorFolder: string,
    id: string,
    index: number,
    handleOpenModalDeleteFolder: (id: string) => void,
    handleOpenModalEditFolder: (item: FolderProps) => void,
    userMail: string,
    userName: string
}

export default function CardFolder({ nameFolder, colorFolder, id, index, handleOpenModalDeleteFolder,  handleOpenModalEditFolder, userMail, userName }: CardFolderProps) {
    const item = { nameFolder, colorFolder, id, index, userMail, userName, created: new Date() }

    return (
        <>
            <div className={`${"btn-group"} ${styles.containerMainFolders}`}>
                <motion.div data-bs-toggle="dropdown" aria-expanded="false" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.1, delay: index * 0.3 }} key={id} className={styles.folderCard} style={{ backgroundColor: `${colorFolder}15`, border: `1px solid ${colorFolder}60`, }}>
                    <div className={styles.contentFolderCard}>
                        <TbFolder className={styles.iconFolder} color={colorFolder} />
                        <h1>{nameFolder}</h1>
                    </div>
                    <IoIosArrowDown className={styles.iconMenuFolder} color='#fff' />
                    <ul className={`${"dropdown-menu dropdown-menu-lg-end"} ${styles.dropdownFolderOption}`}>
                        <button type="button" data-bs-toggle="collapse" data-bs-target={`#collapseExample-${id}`} aria-expanded="false" aria-controls={`#collapseExample-${id}`} className={styles.btnFolderOpen}>Abrir pasta <TbFolderOpen className={styles.iconFolderOpen} /></button>
                        <button data-bs-toggle="modal" data-bs-target="#exampleModalEditFolder" onClick={() => handleOpenModalEditFolder(item)} className={styles.btnEditFolder}>Editar pasta <TbPencil className={styles.iconEditFolder} /></button>
                        <button onClick={() => handleOpenModalDeleteFolder(id)} className={styles.btnDeleteFolder}>Deletar pasta <TbTrash className={styles.iconDeleteFolder} /></button>
                    </ul>
                </motion.div>
            </div>
            <FolderContent folderId={id} userMail={userMail} folderName={nameFolder} folderColor={colorFolder} />
        </>
    )
}
