import axios from "axios"
import crypto from "crypto"

const HOST = process.env.NEXT_PUBLIC_HOST
const INVOICE_MACAROON = process.env.NEXT_PUBLIC_INVOICE_MACAROON

export default async function handler(req, res) {
    const { slug, ...queryParams } = req.query

    if (queryParams.amount) {
        const metadata = [
            ["text/plain", "Sample LN-ADDRESS endpoint"]
        ];

        const metadataString = JSON.stringify(metadata);

        const hash = crypto.createHash('sha256').update(metadataString).digest('hex');

        const descriptionHash = Buffer.from(hash, 'hex').toString('base64'); // Encoding as base64

        // Convert amount from millisatoshis to satoshis
        const value = parseInt(queryParams.amount) / 1000

        if (value < 1) {
            res.status(400).json({ error: 'Amount too low' })
            return
        } else {
            // Create invoice
            const { data } = await axios.post(`${HOST}/v1/invoices`,
                {
                    value: value,
                    // prepend the memo with voltage-tipper to identify all payments from this app
                    memo: "voltage-tipper",
                    description_hash: descriptionHash,
                },
                {
                    headers: { "Grpc-Metadata-macaroon": INVOICE_MACAROON }
                });

            if (data.payment_request) {
                res.status(200).json({
                    pr: data.payment_request,
                    routes: []
                })
                return
            }
        }
    } else {
        res.status(400).json({ error: 'Amount not specified' })
        return
    }
}