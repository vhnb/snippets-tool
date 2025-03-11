import styles from './styles.module.css'
import { motion } from "framer-motion";
import Marquee from "react-fast-marquee";
import { useEffect, useState } from 'react';
import { db } from '@/service/firebaseConnection';
import { addDoc, collection, query, where, onSnapshot, limit, orderBy } from 'firebase/firestore'
import { TbExternalLink } from "react-icons/tb";

interface HomeProps {
    user: {
        email: string
    }
}

interface SnippetsProps {
    id: string,
    created: Date,
    isPublic: boolean,
    title: string,
    snippet: string,
    tag: string,
    userMail: string,
    userName: string
}

export default function SectionLatestSnippets({ user }: HomeProps) {
    const [snippets, setSnippets] = useState<SnippetsProps[]>([])
    const [loading, setLoading] = useState(true)

    function handleToSnippet(id: string){
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
                setSnippets(list)
                setLoading(false)
            })
        }
        fetchSnippets()
    }, [user?.email])

    return (
        <section className={styles.sectionLatestSnippets}>
            <div className={styles.contentSectionLatestSnippets}>
                <motion.h1 className={styles.titleSectionLatestSnippets} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.2 }} transition={{ duration: 0.3 }}>
                    Últimos snippets compartilhados
                </motion.h1>
                <Marquee speed={30} autoFill={true} className={styles.containerCarouselLatestSnippets} pauseOnHover={true} gradient={true} gradientColor="#000">
                    {snippets.filter(item => item.isPublic).map((item) => (
                        <div onClick={() => handleToSnippet(item.id)} key={item.id} className={styles.cardSnippetsLatestPublic}>
                            <div className={styles.alignItensCard}>
                                <h2>{item.userName.charAt(0).toUpperCase()}</h2>
                                <div className={styles.contentInfoSnippet}>
                                    <h1>{item.title}</h1>
                                </div>
                            </div>
                            <p>{item.snippet}</p>
                            <TbExternalLink className={styles.iconLinkExternal}/>
                        </div>
                    ))}
                </Marquee>
            </div>
        </section>
    )
}