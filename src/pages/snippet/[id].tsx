import styles from './styles.module.css'
import Head from 'next/head'
import { GetServerSideProps } from 'next'
import { FormEvent, useState } from 'react'
import { useSession } from 'next-auth/react'
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, where } from 'firebase/firestore'
import { db } from '@/service/firebaseConnection'
import { motion } from 'framer-motion';
import CodeBlockNew from '@/components/CodeBlockNew'
import { Toaster, toast } from 'sonner'
import { TbTrash } from "react-icons/tb";

interface SnippetsProps {
    item: {
        id: string,
        created: Date,
        isPublic: boolean,
        title: string,
        snippet: string,
        tag: string,
        userMail: string,
        userName: string
    }
    allComments: CommentProps[]
}

interface CommentProps {
    id: string,
    comment: string,
    created: string,
    snippetId: string,
    userMail: string,
    userName: string,
}

export default function Snippet({ item, allComments }: SnippetsProps) {
    const { data: session } = useSession()
    const [inputComment, setInputComment] = useState('')
    const [comments, setComments] = useState<CommentProps[]>(allComments || [])

    async function handleComment(event: FormEvent) {
        event.preventDefault()

        if (inputComment === '') return

        if (!session?.user?.email || !session?.user?.name) return

        try {
            const docRef = await addDoc(collection(db, 'comments'), {
                comment: inputComment,
                created: new Date(),
                userMail: session?.user?.email,
                userName: session?.user?.name,
                snippetId: item?.id
            })

            const data = {
                id: docRef.id,
                comment: inputComment,
                created: new Date().toString(),
                userMail: session?.user?.email,
                userName: session?.user?.name,
                snippetId: item?.id
            }

            setComments((oldItems) => [...oldItems, data])
            setInputComment('')
            toast.success('Comentário enviado com sucesso!')

        } catch (error) {
            console.error(error)
        }
    }

    async function handleDeleteComment(id: string) {
        try {
            await deleteDoc(doc(db, 'comments', id))
            const deleteComment = comments.filter((item) => item.id !== id)
            setComments(deleteComment)
            toast.success('Comentário deletado com sucesso!')
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <>
            <Head>
                <title>{item.title}</title>
            </Head>
            <main className={styles.container}>
                <div className={styles.contentContainer}>
                    <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
                        {item.title}
                    </motion.h1>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.2 }} className={styles.contentUserOwnerSnippet}>
                        <p className={styles.photoUser}>{item.userName.charAt(0).toUpperCase()} </p>
                        <span>{item.userName}</span>
                    </motion.div>
                    <motion.div style={{ width: '100%', }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.4 }}>
                        <CodeBlockNew code={item.snippet} language={item.tag} />
                    </motion.div>
                    <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.6 }} id='comentar' onSubmit={handleComment}>
                        <input value={inputComment} onChange={(event) => setInputComment(event.target.value)} placeholder='Digite seu comentário...' />
                        <button disabled={!session?.user} type='submit'>Enviar</button>
                    </motion.form>
                    {comments.length === 0 && (
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.8 }}>Nenhum comentário...</motion.p>
                    )}
                    {comments.map((item) => (
                        <article className={styles.cardComment} key={item.id}>
                            <h2>{item.userName.charAt(0).toUpperCase()}</h2>
                            <div className={styles.contentMessageUser}>
                                <div className={styles.userFunctionDelete}>
                                    <h3>{item.userName}</h3>
                                    {item.userMail === session?.user?.email && (
                                        <TbTrash className={styles.iconDeleteComment} onClick={() => handleDeleteComment(item.id)}/>
                                    )}
                                </div>
                                <p>{item.comment}</p>
                            </div>
                        </article>
                    ))}
                </div>
            </main>
            <Toaster position="top-center" />
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const id = params?.id as string

    const snapshotComments = await getDocs(query(collection(db, 'comments'), where("snippetId", "==", id)))

    let allComments: CommentProps[] = []
    snapshotComments.forEach((doc) => {
        allComments.push({
            id: doc.id,
            created: doc.data().created.toString(),
            comment: doc.data().comment,
            snippetId: doc.data().snippetId,
            userMail: doc.data().userMail,
            userName: doc.data().userName
        })
    })

    const snapshot = await getDoc(doc(db, 'snippets', id))

    if (snapshot.data() === undefined) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    if (!snapshot.data()?.isPublic) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    const snippets = {
        created: new Date(snapshot.data()?.created?.seconds * 1000).toLocaleDateString(),
        isPublic: snapshot.data()?.isPublic,
        title: snapshot.data()?.title,
        snippet: snapshot.data()?.snippet,
        tag: snapshot.data()?.tag,
        userMail: snapshot.data()?.userMail,
        userName: snapshot.data()?.userName,
        id: id
    }

    return {
        props: {
            item: snippets,
            allComments: allComments
        }
    }
}