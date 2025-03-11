import styles from './styles.module.css'
import { motion } from "framer-motion";
import { TbShoppingBag, TbClockCheck, TbMailbox  } from "react-icons/tb";
import {  } from "react-icons/tb";

export default function StepsPayment() {
    return (
        <section id='steps' className={styles.sectionStepsPay}>
            <div className={styles.contentSectionStepsPay}>
                <motion.h1 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.2 }} transition={{ duration: 0.3 }}>
                    Como completar sua compra
                </motion.h1>
                <div className={styles.contentSectionStepsPay}>
                    <motion.div className={styles.cardStepsPay} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.2 }} transition={{ duration: 0.5 }}>
                        <TbShoppingBag className={styles.iconCardStepsPay}/>
                        <h1>Compre a ferramenta</h1>
                        <p>Clique no botão "Obtenha acesso" para iniciar a compra da ferramenta de produtividade. O pagamento é rápido e simples.</p>
                    </motion.div>
                    <motion.div className={styles.cardStepsPay} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.2 }} transition={{ duration: 0.7 }}>
                        <TbMailbox className={styles.iconCardStepsPay}/>
                        <h1>Aguarde o e-mail de confirmação</h1>
                        <p>Após a compra, você entrará na fila para receber um e-mail com todos os detalhes do pagamento e a confirmação de que o processo foi iniciado.</p>
                    </motion.div>
                    <motion.div className={styles.cardStepsPay} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.2 }} transition={{ duration: 0.9 }}>
                        <TbClockCheck className={styles.iconCardStepsPay}/>
                        <h1>Aguarde a liberação da ferramenta</h1>
                        <p>Assim que o pagamento for confirmado, a ferramenta será liberada para o seu uso e você poderá acessar todas as funcionalidades.</p>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}