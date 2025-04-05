import nodemailer from 'nodemailer';
import { db } from '@/service/firebaseConnection';
import { doc, setDoc } from 'firebase/firestore';

export default async function handler(req: any, res: any) {
    if (req.method === 'POST') {
        const { email } = req.body
        const code = Math.floor(1000 + Math.random() * 9000).toString()

        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                }
            })

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Seu código de acesso',
                html: `
                    <html>
                        <body style="font-family: "Inter", serif; margin: 0; padding: 0; background-color: #f4f4f4;">
                            <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #000000; border-radius: 8px;">
                                <h1 style="color: #fff;">Código de acesso para a sua conta Snippets</h1>
                                <p style="color: rgba(255, 255, 255, 0.635); font-size: 16px;">
                                    O seu código de acesso é:
                                </p>
                                <div style="width: 100%; background-color: #ffffff28; display: flex; align-items: center; justify-content: center; border-radius: 8px; height: auto;">
                                    <h1 style="color: #385df2; word-spacing: 20px; width: 100%; text-align: center; font-size: 40px;">${code}</h1>
                                </div>
                                <p style="color: rgba(255, 255, 255, 0.635);">Este código é válido por 5 minutos. Não compartilhe este código com ninguém.<br>
                                Caso não tenha solicitado este código, desconsidere este e-mail.
                                </p>
                                <hr style="border: 0; border-top: 1px solid #6c6c6c23; margin: 20px 0;">
                                <footer style="font-size: 12px; text-align: center; color: #888;">
                                    <p>Se você não solicitou este código, por favor ignore este e-mail.</p>
                                </footer>
                            </div>
                        </body>
                    </html>
                `
            }

            await transporter.sendMail(mailOptions)

            await setDoc(doc(db, 'authCodes', email), {
                code,
                createdAt: Date.now()
            })

            return res.status(200).json({ message: 'Código enviado com sucesso.' })
        } catch (error) {
            console.error('Erro ao enviar código', error)
            return res.status(500).json({ error: 'Erro ao enviar código' })
        }
    } else {
        return res.status(405).json({ error: 'Método não permitido' })
    }
}