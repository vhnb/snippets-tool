import styles from './styles.module.css'
import { LuFolderSymlink } from "react-icons/lu";
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import DropDownUser from '../DropDownUser';
import { TbMenu } from "react-icons/tb";
import MenuMobile from '../MenuMobile';

export default function Header() {
    const { data: session, status } = useSession()
    const router = useRouter()

    function handleToHome() {
        router.push('/')
    }

    function handleToLogin() {
        router.push('/auth/login')
    }

    return (
        <>
            <header className={styles.header}>
                <div className={styles.contentHeader}>
                    <div onClick={handleToHome} className={styles.contentDesignHeader}>
                        <LuFolderSymlink className={styles.iconHeader} />
                        <h1>Snippets</h1>
                    </div>
                    <nav>
                        <a href='/snippets'>Snippets públicos</a>
                        {session && <a href='/dashboard'>Dashboard</a>}
                        {!session && <button className={styles.btnLogin} onClick={handleToLogin}>Login</button>}
                        {session && (
                            <DropDownUser />
                        )}
                    </nav>
                    <TbMenu data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" className={styles.iconMenu} />
                </div>
            </header>
            <MenuMobile />
        </>
    )
}