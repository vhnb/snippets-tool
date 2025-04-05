import styles from './styles.module.css'
import { TbBell, TbMessage } from "react-icons/tb";
import { useEffect, useState } from 'react';
import { collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, orderBy, query, where, updateDoc } from "firebase/firestore";
import { useSession } from 'next-auth/react';
import { db } from '@/service/firebaseConnection';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import CardNotification from '../CardNotification';

interface HomeProps {
    user: {
        email: string
    }
}

interface NotificationsProps {
    id: string,
    notification: string,
    snippetIdNotification: string,
    createdNotified: Date,
    userMailNotified: string
}

export default function DropDownNotification({ user }: HomeProps) {
    const { data: session } = useSession()
    const [notification, setNotification] = useState<NotificationsProps[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function LoadNotifications() {
            const q = query(collection(db, 'notifications'), where("userMailNotified", "==", user.email))

            onSnapshot(q, (snapshot) => {
                let list = [] as NotificationsProps[]

                snapshot.forEach((doc) => {
                    list.push({
                        id: doc.data().id,
                        notification: doc.data().notification,
                        snippetIdNotification: doc.data().snippetIdNotification,
                        createdNotified: doc.data().createdNotified,
                        userMailNotified: doc.data().userMailNotified,
                    })
                })
                setNotification(list)
                setLoading(false)
            })
        }
        LoadNotifications()
    }, [user.email])

    return (
        <div>
            <div className={`${"dropdown"} ${styles.dropdown}`}>
                <button className={styles.btnDropDown} data-bs-toggle="dropdown" aria-expanded="false">
                    <TbBell className={styles.iconNotification} />
                    {notification.length > 0 && (
                        <span className="position-absolute top-0 start-100 translate-middle p-1 bg-light border border-light rounded-circle">
                            <span className="visually-hidden">New alerts</span>
                        </span>
                    )}
                </button>
                <ul className={`${"dropdown-menu dropdown-menu-end"} ${styles.containerDropDown}`}>
                    {notification.map((item) => (
                        <CardNotification
                            notification={item.notification}
                            createdNotified={item.createdNotified}
                            userMailNotified={item.userMailNotified}
                            iconNotification={<TbMessage />}
                        />
                    ))}
                    {notification.length === 0 && (
                        <p className={styles.statusNotificationsText}>Sem notificações...</p>
                    )}
                    {notification.length > 1 && (
                        <button>Limpar notificações</button>
                    )}
                </ul>
            </div>
        </div>
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

    return {
        props: {
            user: {
                email: session?.user?.email
            }
        }
    }
}