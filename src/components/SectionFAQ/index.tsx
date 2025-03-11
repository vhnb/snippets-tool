import styles from './styles.module.css'
import { motion } from 'framer-motion'
import {
    Accordion,
    AccordionItem,
    AccordionItemHeading,
    AccordionItemButton,
    AccordionItemPanel,
} from 'react-accessible-accordion';
import { TbPlus } from "react-icons/tb";
import { useState } from 'react';

const items = [
    {
        id: '1',
        titleAccord: 'O que é o Snippets?',
        contentAccord: 'Snippets é uma plataforma de armazenamento e organização de trechos de código, feita especialmente para programadores. Você pode salvar, classificar com tags, e até compartilhar seus códigos com outros desenvolvedores. É uma ferramenta minimalista, intuitiva e segura.'
    },
    {
        id: '2',
        titleAccord: 'O que acontece após eu pagar pelo Snippets?',
        contentAccord: 'Após o pagamento, sua conta será atualizada para assinante e você terá acesso a todas as funcionalidades da plataforma.'
    },
    {
        id: '3',
        titleAccord: 'Onde meus códigos são armazenados?',
        contentAccord: 'Seus códigos são armazenados na nuvem, garantindo segurança e fácil acesso de qualquer dispositivo, sem o risco de perder seu trabalho.'
    },
    {
        id: '4',
        titleAccord: 'O Snippets é compatível com todos os dispositivos?',
        contentAccord: 'Sim! O Snippets é uma plataforma responsiva, o que significa que você pode acessá-la de qualquer dispositivo, seja no seu desktop, tablet ou celular.'
    },
    {
        id: '5',
        titleAccord: 'Existe uma versão gratuita do Snippets?',
        contentAccord: 'Não, o Snippets oferece todas as suas funcionalidades de forma paga. Para acessar a plataforma e usufruir de todos os recursos, como criação de pastas, organização avançada e segurança, é necessário pagar uma taxa única de R$ 5.'
    },
    {
        id: '6',
        titleAccord: 'Como posso entrar em contato com o suporte?',
        contentAccord: 'Seus códigos são armazenados na nuvem, garantindo segurança e fácil acesso de qualquer dispositivo, sem o risco de perder seu trabalho.'
    }
]

export default function SectionFAQ() {

    return (
        <section className={styles.sectionFAQ}>
            <div className={styles.contentSectionFAQ}>
                <motion.h1 className={styles.titleSectionFAQ} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.2 }} transition={{ duration: 0.3 }}>
                    Perguntas frequentes
                </motion.h1>
                <motion.div style={{ width: '100%', }} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, amount: 0.2 }} transition={{ duration: 0.3 }}>
                    <Accordion allowZeroExpanded className={styles.contentAccord}  onChange={() => console.log('Hello world')}>
                        {items.map((item) => (
                            <AccordionItem className={styles.cardAccord} key={item.id}>
                                <AccordionItemHeading>
                                    <AccordionItemButton className={styles.btnAccord}>
                                        {item.titleAccord}
                                        <TbPlus
                                            className={styles.iconPlus}
                                        />
                                    </AccordionItemButton>
                                </AccordionItemHeading>
                                <AccordionItemPanel className={styles.textContentAccord}>
                                    {item.contentAccord}
                                </AccordionItemPanel>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </motion.div>
            </div>
        </section>
    )
}