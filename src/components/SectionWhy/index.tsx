import styles from './styles.module.css'
import { motion } from "framer-motion";
import { TbFolderSearch, TbShare2, TbCloudLock } from "react-icons/tb";

export default function SectionWhy() {
    return (
        <section className={styles.sectionWhy}>
            <div className={styles.contentSectionWhy}>
                <motion.h1 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.2 }} transition={{ duration: 0.3 }}>
                    Por que usar o snippets?
                </motion.h1>
                <div className={styles.contentCardsInfoWhy}>
                    <motion.div className={styles.cardInfoWhy} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.2 }} transition={{ duration: 0.5 }}>
                        <TbFolderSearch className={styles.iconCardInfoWhy}/>
                        <h1>Organização inteligente</h1>
                        <p>Classifique e encontre seus códigos com facilidade usando uma busca avançada. Não perca mais tempo procurando aonde salvou aquele trecho importante!</p>
                    </motion.div>
                    <motion.div className={styles.cardInfoWhy} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.2 }} transition={{ duration: 0.7 }}>
                        <TbShare2 className={styles.iconCardInfoWhy}/>
                        <h1>Compartilhamento simplificado</h1>
                        <p>Torne seus trechos públicos e colabore com outros desenvolvedores. Perfeito para compartilhar conhecimento e se conectar com a comunidade.</p>
                    </motion.div>
                    <motion.div className={styles.cardInfoWhy} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.2 }} transition={{ duration: 0.9 }}>
                        <TbCloudLock className={styles.iconCardInfoWhy}/>
                        <h1>Acesso seguro</h1>
                        <p>Armazene seus trechos na nuvem com privacidade garantida. Acesse de qualquer dispositivo sem medo de perder seu trabalho.</p>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}