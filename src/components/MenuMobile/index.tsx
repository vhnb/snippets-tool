import styles from './styles.module.css'
import { TbMinus } from "react-icons/tb";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react'
import { useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

export default function MenuMobile() {
    const { data: session } = useSession()
    const router = useRouter()
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

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
    };

    function handleToLogin() {
        router.push('/auth/login')
    }

    return (
        <>
            <div className={`${"offcanvas offcanvas-start"} ${styles.containerOffcanvas}`} tabIndex={-1} id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
                <div className={`${"offcanvas-header"} ${styles.offcanvasHeader}`}>
                    <h1>Opções</h1>
                    <TbMinus className={styles.iconCloseMenu} data-bs-dismiss="offcanvas" aria-label="Close" />
                </div>
                <div className={`${"offcanvas-body"} ${styles.offcanvasBody}`}>
                    <a href='/snippets'>Snippets públicos</a>
                    {session && <a href='/dashboard'>Dashboard</a>}
                    {!session && <button data-bs-dismiss="offcanvas" aria-label="Close" className={styles.btnLogin} onClick={handleToLogin}>Login</button>}
                    {session && <p>Conectado como: {session?.user?.email}</p>}
                    {session && <div className={styles.line}></div>}
                    {session && <button className={styles.btnConfirmLogout} onClick={handleOpen}>Sair</button>}
                </div>
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