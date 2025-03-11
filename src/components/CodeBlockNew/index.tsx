import { useState, useEffect } from "react";
import Prism from 'prismjs';
import { TbCopy, TbCheck } from "react-icons/tb";
import styles from './styles.module.css';

interface CodeBlockProps {
    code: string
    language: string
}

export default function CodeBlockNew({ code, language = 'markup' }: CodeBlockProps) {
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        Prism.highlightAll()
    }, [code])

    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(code)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (error) {
            console.error("Falha ao copiar:", error)
        }
    }

    return (
        <div onClick={handleCopy} className={styles.codeBlockContainer}>
            <button className={styles.copyButton}>
                {copied ? <TbCheck className={styles.iconCopy} /> : <TbCopy className={styles.iconCopy} />}
                Copiar
            </button>
            <pre className={`language-${language} ${styles.preNew}`}>
                <code className={`language-${language} ${styles.codeBlock}`}>
                    {code}
                </code>
            </pre>
        </div>
    )
}