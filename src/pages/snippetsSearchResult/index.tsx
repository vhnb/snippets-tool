import styles from './styles.module.css'
import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { db } from '@/service/firebaseConnection'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { Timestamp } from 'firebase/firestore'
import Head from 'next/head';
import { format } from 'date-fns';
import CodeBlockNew from '@/components/CodeBlockNew'

interface SnippetsProps {
    id: string,
    created: Timestamp,
    isPublic: boolean,
    title: string,
    snippet: string,
    tag: string,
    userMail: string,
    userName: string
}

export default function snippetsSearchResult() {
    const router = useRouter()
    const { term } = router.query
    const [snippets, setSnippets] = useState<SnippetsProps[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (term) {
            searchSnippets(term as string)
        }
    }, [term])

    async function searchSnippets(term: string) {
        try {
            setLoading(true)
            const docRef = collection(db, 'snippets')
            const docSnap = await getDocs(docRef)

            const allSnippets = [] as SnippetsProps[]
            docSnap.forEach((doc) => {
                allSnippets.push({
                    id: doc.id,
                    created: doc.data().created,
                    isPublic: doc.data().isPublic,
                    title: doc.data().title,
                    snippet: doc.data().snippet,
                    tag: doc.data().tag,
                    userMail: doc.data().userMail,
                    userName: doc.data().userName
                })
            })

            const filteredSnippets = allSnippets.filter(snippet => snippet.title.toLocaleLowerCase().includes(term.toLocaleLowerCase()))
            setSnippets(filteredSnippets)

        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    function handleToSnippetSeeComment(id: string) {
        window.location.href = `${process.env.NEXT_PUBLIC_URL}/snippet/${id}#comentar`
    }

    return (
        <>
            <Head>
                <title>Resultados para a pesquisa: {term}</title>
            </Head>
            <main className={styles.container}>
                <div className={styles.contentContainer}>
                    <h1 className={styles.titleSearch}>Resultados para a pesquisa: <span>{term}</span></h1>
                    {snippets.filter(item => item.isPublic).map((item, index, arr) => (
                        <div key={item.id} className={styles.contentSnippetUser}>
                            <div className={styles.contentPerfilAndDate}>
                                <div className={styles.contentUserOwnerSnippet}>
                                    <p className={styles.photoUser}>{item.userName.charAt(0).toUpperCase()} </p>
                                    <span>{item.userName}</span>
                                </div>
                                <h3>{format(item.created.toDate(), 'dd/MM/yyyy')}</h3>
                            </div>
                            <div style={{ width: '100%', }}>
                                <CodeBlockNew code={item.snippet} language={item.tag} />
                            </div>
                            <h1>{item.title}</h1>
                            <a onClick={() => handleToSnippetSeeComment(item.id)}>Ver todos os comentários</a>
                            {arr.length > 1 && <div className={styles.line}></div>}
                        </div>
                    ))}
                    {loading ? (
                        <div style={{ display: 'flex', width: '100%', }}>
                            <div className="spinner-border spinner-border-sm text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : snippets.length === 0 && !loading && (
                        <p className={styles.infoSearch}>Nenhum resultado encontrado. <a href='/snippets'>Voltar</a></p>
                    )}
                </div>
            </main>
        </>
    )
}