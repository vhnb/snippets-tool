import styles from './styles.module.css'
import { useSession } from 'next-auth/react';
import { TbMenu } from "react-icons/tb";
import DropDownUser from '../DropDownUser';
import MenuMobile from '../MenuMobile';
import { useRouter } from 'next/router';

export default function HeaderDashboard() {
    const { data: session, status } = useSession()
    const router = useRouter()

    function handleToHome(){
        router.push('/')
    }

    return (
        <>
            <header className={styles.header}>
                <div className={styles.contentHeader}>
                    <div onClick={handleToHome} className={styles.contentDesignHeader}>
                        <h1>Snippets Tool</h1>
                    </div>
                    <nav>
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