import styles from './styles.module.css'
import { motion } from 'framer-motion'
import { TbMist } from 'react-icons/tb'

interface CardStatisticsProps {
    titleStatistics: string,
    iconStatistics: React.ReactNode,
    countStatistics: number,
    loading: boolean,
    delay?: number
}

export default function CardStatistics({ titleStatistics, iconStatistics, countStatistics, loading, delay }: CardStatisticsProps) {
    return (
        <motion.article className={styles.cardStatistics} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay }}>
            <div className={styles.contentHeaderSnippetsStatistics}>
                <p>{titleStatistics}</p>
                {iconStatistics}
            </div>
            {loading ? (
                <span className={styles.statisticLoadingSkeleton}></span>
            ) : (
                <h1>{countStatistics}</h1>
            )}
        </motion.article>
    )
}