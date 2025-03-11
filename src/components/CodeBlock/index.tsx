import { useEffect, useState } from "react";
import Prism from 'prismjs';
import { TbCopy, TbCheck } from "react-icons/tb";

interface CodeBlock {
    code: string,
    language: string
}

export default function CodeBlock({ code, language = 'markup' }: CodeBlock) {
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
        <pre className={`language-${language}`}>
            <div className="contentCopy" onClick={handleCopy}>
                {copied ? <TbCheck className="iconCopy" /> : <TbCopy style={{cursor:'pointer',}} className="iconCopy" />}
            </div>
            <code className={`language-${language}`}>{code}</code>
        </pre>
    )
}