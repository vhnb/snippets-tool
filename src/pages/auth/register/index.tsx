import styles from './styles.module.css'
import { motion } from 'framer-motion';
import { FaArrowLeftLong } from "react-icons/fa6";
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/router';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '@/service/firebaseConnection';
import { doc, setDoc } from 'firebase/firestore';
import { Toaster, toast } from 'sonner'

export default function Register() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const router = useRouter()

    async function handleRegisterUser(event: FormEvent) {
        event.preventDefault()

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password)
            const user = userCredential.user

            if (user.email) {
                await setDoc(doc(db, 'users', user.email), {
                    username: username,
                    email: user.email,
                    role: 'user'
                })

                await updateProfile(user, { displayName: username })

                await fetch('/api/welcomeMail', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: user.email,
                        username: username
                    })
                })

                router.push('/auth/login')
            } else {
                throw new Error('E-mail do usuário é inválido.')
            }
        } catch (error: any) {
            console.log('Erro ao cadastrar usuário', error)

            if (error.code === 'auth/weak-password') {
                toast.error('A senha precisa ter pelo menos 6 caracteres.');
            } else if (error.code === 'auth/email-already-in-use') {
                toast.error('Este e-mail já está em uso. Tente outro.');
            } else {
                toast.error('Erro ao cadastrar usuário. Tente novamente mais tarde.');
            }
        }
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
                        Comece a armazenar, organizar e compartilhar seus snippets de código com facilidade. Em poucos minutos, você estará pronto para começar.
                    </motion.p>
                    <form onSubmit={handleRegisterUser}>
                        <motion.input
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.4 }}
                            type="text" placeholder='Digite seu nome de usuário'
                            value={username} onChange={(event) => setUsername(event.target.value)} required
                        />
                        <motion.input
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.6 }}
                            type="email" placeholder='Digite seu e-mail'
                            value={email} onChange={(event) => setEmail(event.target.value)} required
                        />
                        <motion.input
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.8 }}
                            type="password" placeholder='Digite sua senha'
                            value={password} onChange={(event) => setPassword(event.target.value)} required
                        />
                        <motion.button type='submit' initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1 }}>
                            Criar conta
                        </motion.button>
                    </form>
                    <motion.p className={styles.textAlertUser} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.2 }}>
                        Já possui uma conta? <a href='/auth/login'>Faça login</a>
                    </motion.p>
                </div>
            </main>
            <Toaster position="top-center" />
        </>
    )
}