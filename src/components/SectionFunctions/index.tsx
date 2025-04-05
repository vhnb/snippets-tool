import styles from "./styles.module.css";
import { motion } from "framer-motion";

export default function SectionFunction() {
  return (
    <section className={styles.sectionFunction}>
      <div className={styles.contentSectionFunction}>
        <motion.h1 className={styles.titleSectionFunction} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.2 }} transition={{ duration: 0.3 }}>
          Funcionalidades incríveis
        </motion.h1>
        <div className={styles.contentInfoFunctions}>
          <div className={styles.containerInfoFunctions}>
            <motion.article className={styles.cardFunction} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.2 }} transition={{ duration: 0.5 }}>
              <p>Encontre rapidamente seus códigos com nossa busca poderosa. Filtre por tags ou outros critérios.</p>
            </motion.article>
            <motion.article className={styles.cardFunction} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.2 }} transition={{ duration: 0.5 }}>
              <p>Transforme seus snippets em públicos e permita que outros desenvolvedores aprendam com você ou colaborem.</p>
            </motion.article>
          </div>
          <div className={styles.containerInfoFunctions}>
            <motion.article className={styles.cardFunction} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.2 }} transition={{ duration: 0.5 }}>
              <p>Acesse seus códigos de qualquer dispositivo, seja no computador ou no celular, garantindo produtividade onde quer que esteja.</p>
            </motion.article>
            <motion.article className={styles.cardFunction} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.2 }} transition={{ duration: 0.5 }}>
              <p>Com o Snippets, todos os seus códigos ficam armazenados de forma segura e acessível na nuvem, sem a preocupação de perda de dados.</p>
            </motion.article>
          </div>
        </div>
      </div>
    </section>
  )
}
