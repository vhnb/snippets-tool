import NextAuth from "next-auth/next";
import { getAuth } from "firebase/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/service/firebaseConnection";
import { doc, getDoc } from "firebase/firestore";

export default NextAuth({
    debug: true,
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials || !credentials.email || !credentials.password) {
                    throw new Error("Faltando email ou password.")
                }

                const auth = getAuth()

                try {
                    const userCredential = await signInWithEmailAndPassword(
                        auth, credentials.email, credentials.password
                    )
                    const user = userCredential.user

                    if (user && user.email) {
                        const userDocRef = doc(db, 'users', user.email)
                        const userDoc = await getDoc(userDocRef)

                        if(userDoc.exists()) {
                            const userData = userDoc.data()
                            return { 
                                id: user.uid,
                                email: user.email, 
                                name: userData.username || user.displayName || user.email 
                            }
                        }
                    }
                    return null
                } catch (error) {
                    console.error('Erro duranto o sign in', error)
                    return null
                }
            }
        })
    ],
    pages: {
        signIn: '/auth/login',
        newUser: '/auth/register'
    },
    secret: process.env.JWT_SECRET as string
})
