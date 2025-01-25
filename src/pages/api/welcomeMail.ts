import nodemailer from 'nodemailer';

export default async function handler(req: any, res: any) {
    if(req.method === 'POST') {
        const { email, username } = req.body

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
                subject: 'Conta criada com sucesso!',
                text: `Olá ${username},\n\nSua conta no Snippets foi criada com sucesso! Estamos muito felizes em tê-lo conosco. A partir de agora, você pode começar a armazenar, organizar e compartilhar seus snippets de código.\n\nAtenciosamente,\nEquipe Snippets`,
            }

            await transporter.sendMail(mailOptions)

            return res.status(200).json({ message: 'E-mail enviado com sucesso.' })
        } catch (error) {
            console.error('Erro ao enviar e-mail:', error)
            return res.status(500).json({ error: 'Erro ao enviar e-mail' })
        }
    } else {
        return res.status(405).json({ error: 'Método não permitido' })
    }
}