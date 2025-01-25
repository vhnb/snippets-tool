import styles from './styles.module.css'
import { motion } from 'framer-motion';
import { FaArrowLeftLong } from "react-icons/fa6";
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react'
import { Toaster, toast } from 'sonner'

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const router = useRouter()

    async function handleLoginUser(event: FormEvent) {
        event.preventDefault();

        const result = await signIn('credentials', {
            redirect: false,
            email,
            password
        })

        console.log(result)

        if (!result?.error) {
            router.push('/dashboard')
        } else {
            console.error(result.error)
            toast.error('E-mail ou senha estão incorretos.')
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
                        Bem-vindo de volta!
                    </motion.h1>
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.2 }}>
                        Entre para acessar e organizar seus snippets de código. Sua conta está pronta para te ajudar a manter tudo em um só lugar.
                    </motion.p>
                    <form onSubmit={handleLoginUser}>
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
                            Entrar
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