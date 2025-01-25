import styles from "@/styles/Home.module.css";
import CodeBlock from "@/components/CodeBlock";
import { FaArrowRightLong } from "react-icons/fa6";
import { motion } from 'framer-motion';
import SectionWhy from "@/components/SectionWhy";
import { useRouter } from "next/router";
import Head from "next/head";
import SectionLatestSnippets from "@/components/SectionLatestSnippets";

interface HomeProps {
  user: {
      email: string
  }
}

export default function Home({ user }: HomeProps) {
  const router = useRouter()

  const htmlCode = `
    <!DOCTYPE html>
      <html lang="pt-br">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Snippets</title>
      </head>
      <body>
          <main>
              <h1>
                Organize seus códigos de forma inteligente.
              </h1>
              <p>
                Guarde, classifique e compartilhe snippets de código com 
                facilidade.
              </p>
          </main>
      </body>
      </html>
  `

  function handleToRegisterPage(){
    router.push('/auth/register')
  }

  function handleToSnippetsPublicPage(){
    router.push('/snippets')
  }

  return (
    <>
    <Head>
      <title>Snippets</title>
    </Head>
      <main className={styles.container}>
        <div className={styles.contentContainer}>
          <div className={styles.contentTextMain}>
            <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
              Organize seus códigos de forma inteligente.
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.4 }}>
              Guarde, classifique e compartilhe snippets de código com facilidade. Acesse seus trechos importantes de qualquer lugar, com organização e segurança garantidas.
            </motion.p>
            <div className={styles.groupBtnsMain}>
              <motion.button onClick={handleToRegisterPage} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.7 }}>Começar agora <FaArrowRightLong style={{ marginLeft: '10px', }} /></motion.button>
              <motion.button onClick={handleToSnippetsPublicPage} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.8 }}>Veja snippets públicos</motion.button>
            </div>
          </div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1 }}>
            <CodeBlock code={htmlCode} language="markup" />
          </motion.div>
        </div>
      </main>
      <SectionWhy />
      <SectionLatestSnippets user={user}/>
    </>
  );
}
