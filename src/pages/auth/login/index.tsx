import styles from './styles.module.css'
import { motion } from 'framer-motion';
import { FaArrowLeftLong } from "react-icons/fa6";
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react'
import { Toaster, toast } from 'sonner'
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/service/firebaseConnection';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';

export default function Login() {
    const [email, setEmail] = useState('')
    const [codeSent, setCodeSent] = useState(false)
    const [code, setCode] = useState('')
    const [inputColor, setInputColor] = useState('')
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    async function handleRequestCode(event: FormEvent) {
        event.preventDefault()

        setLoading(true)

        const userRef = doc(db, 'users', email)
        const userDoc = await getDoc(userRef)

        if (!userDoc.exists()) {
            toast.error('Este e-mail não está registrado.')
            setLoading(false)
            return
        }

        const response = await fetch('/api/sendCode', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        })

        if (response.ok) {
            setCodeSent(true)
            toast.success('Código enviado para o seu email.')
        } else {
            toast.error('Erro ao enviar código.')
        }

        setLoading(false)
    }

    async function handleLoginUser(event: FormEvent) {
        event.preventDefault()

        setLoading(true)

        const result = await signIn('credentials', {
            redirect: false,
            email,
            code
        })

        console.log(result)

        if (!result?.error) {
            setInputColor('#7bd4641e')
            router.push('/dashboard')
            setLoading(false)
        } else {
            console.error(result.error)
            toast.error('Código inválido ou expirado.')
            setInputColor('#cd35353f')
        }

        setLoading(false)
    }

    return (
        <>
            <main className={styles.container}>
                <div className={styles.contentContainer}>
                    <motion.a className={styles.btnToBack} href='/' initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
                        <FaArrowLeftLong style={{ marginRight: '5px' }} />
                        Voltar
                    </motion.a>
                    <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
                        Seja bem-vindo de volta!
                    </motion.h1>
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.2 }}>
                        Faça login para gerenciar seus snippets com eficiência!
                    </motion.p>
                    <form onSubmit={codeSent ? handleLoginUser : handleRequestCode}>
                        <motion.input
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.6 }}
                            type="email" placeholder='Digite seu e-mail'
                            value={email} onChange={(event) => setEmail(event.target.value)} required
                            disabled={codeSent}
                        />
                        {codeSent && (
                            <motion.input
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.2 }}
                                type="text" placeholder='Digite o código recebido'
                                value={code} onChange={(event) => setCode(event.target.value)} required
                                style={{ backgroundColor: inputColor }}
                                maxLength={4}
                            />
                        )}
                        <motion.button style={loading ? { backgroundColor:'#a0a0a0', border: '1px solid #a0a0a0', }: {}} disabled={loading} type='submit' initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1 }}>
                            {loading ? (
                                <>
                                    <div style={{ marginRight: '10px', }} className="spinner-border spinner-border-sm" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    Carregando
                                </>
                            ) : codeSent ? 'Entrar' : 'Enviar código'}
                        </motion.button>
                    </form>
                    <motion.p className={styles.textAlertUser} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.2 }}>
                        Ainda não possui uma conta? <a href='/auth/register'>Registre-se</a>
                    </motion.p>
                </div>
            </main>
            <Toaster position="top-center" />

        </>
    )
}