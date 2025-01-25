import styles from './styles.module.css'

export default function PageNotFound() {
    return (
        <main className={styles.container}>
            <div className={styles.contentContainer}>
                <h1>404</h1>
                <h2>Página não encontrada</h2>
                <a href="/">Voltar</a>
            </div>
        </main>
    )
}