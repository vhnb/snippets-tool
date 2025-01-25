import styles from './styles.module.css'
import { motion } from 'framer-motion'
import { FaArrowRightLong } from "react-icons/fa6";
import { GetServerSideProps, GetStaticProps } from 'next';
import { getSession } from 'next-auth/react';
import { useState } from 'react';
import { Toaster, toast } from 'sonner'
import Head from 'next/head';
import { query, collection, getDocs, where } from 'firebase/firestore';
import { db } from '@/service/firebaseConnection';
import { useSession } from 'next-auth/react';
import StepsPayment from '@/components/StepsPayment';

interface HomeProps {
    collaborators: number
}

export default function Payment({ collaborators }: HomeProps) {
    const [isLoading, setIsLoading] = useState(false)
    const { data: session } = useSession()

    async function handlePayment() {
        if (!session?.user) {
            toast.error("Por favor, faça login para continuar.")
            return
        }

        setIsLoading(true)

        try {
            const response = await fetch("/api/payment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userMail: session.user.email,
                }),
            })

            const data = await response.json()

            if (data.status === 'approved') {
                toast.success("Pagamento aprovado!")
            } else if (data.ticketUrl) {
                toast.success("Pagamento gerado! Baixe seu boleto no link abaixo.")
                window.location.href = data.ticketUrl
            } else {
                toast.error("Erro ao gerar o pagamento.")
            }
        } catch (error) {
            toast.error("Erro ao tentar iniciar o pagamento.")
        } finally {
            setIsLoading(false)
        }
    }

    function handleToSteps() {
        window.location.href = '#steps'
    }

    return (
        <>
            <Head>
                <title>Obtenha acesso a produtividade</title>
            </Head>
            <main className={styles.container}>
                <div className={styles.contentContainer}>
                    <div className={styles.contentTextMain}>
                        <motion.article initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
                            <p>🎉 <span></span> Snippets conta com mais de <strong>{collaborators}</strong> colaboradores ativos.</p>
                        </motion.article>
                        <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
                            Tenha seu passe para Produtividade!
                        </motion.h1>
                        <motion.p className={styles.descPayment} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.4 }}>
                            Tenha acesso completo a todas as funcionalidades do Snippets. Organize, edite e compartilhe seus códigos de forma eficiente e segura!
                        </motion.p>
                        <div className={styles.groupBtnsMain}>
                            <motion.button className={styles.btnPurchase} onClick={handlePayment} disabled={isLoading} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.7 }}>
                                {isLoading && (
                                    <div className="spinner-border spinner-border-sm" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                )}
                                {!isLoading && (
                                    <p style={{ marginBottom: '0px', }}>Obtenha acesso - R$5,00 <FaArrowRightLong style={{ marginLeft: '10px', }} /></p>
                                )}
                            </motion.button>
                            <motion.button onClick={handleToSteps} className={styles.btnToSteps} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1 }}>
                                Veja os passos antes de comprar
                            </motion.button>
                        </div>
                    </div>
                    <motion.video
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.3 }}
                        src='/video.mp4' autoPlay loop playsInline muted className={styles.containerVideo}
                    >
                    </motion.video>
                    <div id="qrCodeContainer"></div>
                </div>
            </main>
            <StepsPayment />
            <Toaster position="top-center" />
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const session = await getSession({ req })

    if (!session?.user) {
        return {
            redirect: {
                destination: '/auth/login',
                permanent: false
            }
        }
    }

    const userQuery = query(collection(db, 'users'), where('email', '==', session.user.email))
    const querySnapshot = await getDocs(userQuery)
    const userDoc = querySnapshot.docs[0]
    const userData = userDoc.data()

    if (userData.role === 'subscriber') {
        return {
            redirect: {
                destination: '/dashboard',
                permanent: false,
            },
        };
    }

    const subscribersQuery = query(collection(db, 'users'), where('role', '==', 'subscriber'))
    const subscribersSnapshot = await getDocs(subscribersQuery)

    return {
        props: {
            collaborators: subscribersSnapshot.size || 0,
            user: {
                email: session?.user?.email
            }
        }
    }
}