import type { NextApiRequest, NextApiResponse } from "next";
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { db } from "@/service/firebaseConnection";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";

export default async function handler(req: NextApiRequest, res: NextApiResponse,) {
    const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN!, options: { timeout: 10000 } })

    const payment = new Payment(client)

    const body = {
        transaction_amount: 5,
        description: `Acesso a ferramenta Snippets`,
        payment_method_id: 'pix',
        payer: {
            email: req.body.userMail
        }
    }

    payment.create({ body }).then(async response => {

        const status = response.status
        const ticketUrl = response.point_of_interaction?.transaction_data?.ticket_url

        if (status === "approved" || ticketUrl) {
            try {
                await addDoc(collection(db, 'payments'), {
                    email: req.body.userMail, 
                    status: status,  
                    ticketUrl: ticketUrl || null, 
                    createdAt: new Date(), 
                })

                if (status === "approved") {
                    const userDocRef = doc(db, 'users', req.body.userMail)
                    await updateDoc(userDocRef, {
                        role: 'subscriber'
                    })

                    return res.status(200).json({
                        status: status,
                        message: "Pagamento aprovado com sucesso.",
                    })
                } else if (ticketUrl) {
                    return res.status(200).json({
                        status: status,
                        message: "Pagamento por boleto gerado. Acesse o boleto.",
                        ticketUrl: ticketUrl,
                    })
                }
            } catch (error) {
                console.error("Erro ao salvar no banco:", error);
                return res.status(500).json({
                    error: "Erro ao salvar dados do pagamento."
                })
            }
        } else if (ticketUrl) {
            return res.status(200).json({
                status: status,
                message: "Pagamento por boleto gerado. Acesse o boleto.",
                ticketUrl: ticketUrl,
            })
        } else {
            return res.status(400).json({
                status: status,
                message: "Erro ao processar pagamento, por favor tente novamente.",
            })
        }
    }).catch((error) => {
        console.error("Erro ao criar cobrança:", error)
        res.status(500).json({ error: "Erro ao criar cobrança" })
    })
}