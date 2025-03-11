import styles from './styles.module.css'
import { useSession } from 'next-auth/react'
import { signOut } from 'next-auth/react'
import Modal from '@mui/material/Modal';
import { useState } from 'react';
import Box from '@mui/material/Box';

export default function DropDownUser() {
    const { data: session, status } = useSession()
    const [open, setOpen] = useState(false)
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 320,
        bgcolor: '#000000ec',
        boxShadow: 24,
        border: '1px solid #6c6c6c32',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '6px',
    }

    return (
        <>
            <div className={`${"dropdown"} ${styles.dropdown}`}>
                <button className={styles.btnDropDown} data-bs-toggle="dropdown" aria-expanded="false">
                    {session?.user?.name?.charAt(0).toUpperCase()}
                </button>
                <ul className={`${"dropdown-menu dropdown-menu-end"} ${styles.containerDropDown}`}>
                    <span>Conectado como</span>
                    <p>{session?.user?.email}</p>
                    <div className={styles.line}></div>
                    <button onClick={handleOpen}>Sair</button>
                </ul>
            </div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <h1 className={styles.textConfirmLogout}>Deseja mesmo sair?</h1>
                    <div className={styles.lineModal}></div>
                    <button className={styles.btnConfirmLogout} onClick={() => signOut({ callbackUrl: '/auth/login' })}>Sair</button>
                </Box>
            </Modal>
        </>
    )
}