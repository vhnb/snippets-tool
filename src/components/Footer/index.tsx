import styles from './styles.module.css'

export default function Footer() {

    return (
        <>
            <footer className={styles.footer}>
                <div className={styles.contentFooter}>
                    <p>Snippets foi desenvolvido por <a target='blank' href="https://vhnb.vercel.app/">vitinho</a></p>
                </div>
            </footer>
        </>
    )
}