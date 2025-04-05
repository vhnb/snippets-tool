import styles from './styles.module.css'
import { motion } from 'framer-motion';
import { FaArrowLeftLong } from "react-icons/fa6";
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/router';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '@/service/firebaseConnection';
import { doc, setDoc } from 'firebase/firestore';
import { Toaster, toast } from 'sonner'
import { getDoc } from 'firebase/firestore';

export default function Register() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [codeSent, setCodeSent] = useState(false)
    const [code, setCode] = useState('')
    const [inputColor, setInputColor] = useState('')
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    async function handleRequestCode(event: FormEvent) {
        event.preventDefault()

        setLoading(true)

        const userDocRef = doc(db, 'users', email)
        const userDocSnapshot = await getDoc(userDocRef)

        if (userDocSnapshot.exists()) {
            toast.error('Este e-mail já está em uso. Tente outro.')
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

    async function handleRegisterUser(event: FormEvent) {
        event.preventDefault()

        setLoading(true)

        const userDocRef = doc(db, 'authCodes', email)
        const userDocSnapshot = await getDoc(userDocRef)

        if (!userDocSnapshot.exists()) {
            toast.error('Código inválido ou expirado.')
            setInputColor('#cd35353f')
            setLoading(false)
            return
        }

        await setDoc(doc(db, 'users', email), {
            username: username,
            email: email
        })

        setInputColor('#7bd4641e')
        router.push('/auth/login')

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
                        Crie sua conta no Snippets
                    </motion.h1>
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.2 }}>
                        Armazene, organize e compartilhe seus snippets de código com facilidade. Comece agora!
                    </motion.p>
                    <form onSubmit={codeSent ? handleRegisterUser : handleRequestCode}>
                        <motion.input
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.4 }}
                            type="text" placeholder='Digite seu nome de usuário'
                            value={username} onChange={(event) => setUsername(event.target.value)} required
                            disabled={codeSent}
                        />
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
                        <motion.button style={loading ? { backgroundColor:'#a0a0a0', border: '1px solid #a0a0a0', }: {}} disabled={loading} type='submit' initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.8 }}>
                            {loading ? (
                                <>
                                    <div style={{ marginRight: '10px', }} className="spinner-border spinner-border-sm" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    Carregando
                                </>
                            ) : codeSent ? 'Criar conta' : 'Enviar código'}
                        </motion.button>
                    </form>
                    <motion.p className={styles.textAlertUser} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1 }}>
                        Já possui uma conta? <a href='/auth/login'>Faça login</a>
                    </motion.p>
                </div>
            </main>
            <Toaster position="top-center" />
        </>
    )
}