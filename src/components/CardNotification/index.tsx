import styles from './styles.module.css'
import { ReactNode } from 'react'

interface NotificationsProps {
    notification: string,
    createdNotified: Date,
    userMailNotified: string,
    iconNotification: ReactNode
}

export default function CardNotification({ notification, createdNotified, userMailNotified, iconNotification }: NotificationsProps){
    return(
        <li className={styles.cardNotification}>
            <h2 className={styles.iconNotification}>{iconNotification}</h2>
            <div className={styles.contentCardNotification}>
                <h1>Nova notificação</h1>
                <p>{notification}</p>
            </div>
        </li>
    )
}