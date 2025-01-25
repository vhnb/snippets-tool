import styles from './styles.module.css'
import { motion } from "framer-motion";
import Marquee from "react-fast-marquee";
import { useEffect, useState } from 'react';
import { db } from '@/service/firebaseConnection';
import { collection, query, onSnapshot } from 'firebase/firestore'
import { TbSearch } from "react-icons/tb";
import CodeBlockNew from '@/components/CodeBlockNew'
import Head from 'next/head';
import { format } from 'date-fns';
import { Timestamp } from 'firebase/firestore';

interface HomeProps {
    user: {
        email: string
    }
}

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

export default function Snippets({ user }: HomeProps) {
    const [snippets, setSnippets] = useState<SnippetsProps[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    function handleToSnippetSeeComment(id: string) {
        window.location.href = `${process.env.NEXT_PUBLIC_URL}/snippet/${id}`
    }

    useEffect(() => {
        async function fetchSnippets() {
            const q = query(collection(db, 'snippets'))

            onSnapshot(q, (snapshot) => {
                let list = [] as SnippetsProps[]

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
                })
                setLoading(false)

                if (searchTerm) {
                    list = list.filter((snippet) => snippet.title.toLowerCase().includes(searchTerm.toLowerCase()))
                }

                setSnippets(list)
                setLoading(false)
            })
        }
        fetchSnippets()
    }, [user?.email])

    return (
        <>
            <Head>
                <title>Explore Snippets públicos</title>
            </Head>
            <main className={styles.container}>
                <div className={styles.contentContainer}>
                    <form>
                        <TbSearch size={25} />
                        <input type="text" placeholder='Busque por algo...' value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
                    </form>
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
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    ) : snippets.length === 0 ? (
                        <p>Nenhum snippet publicado...</p>
                    ) : null}
                </div>
            </main>
        </>
    )
}
