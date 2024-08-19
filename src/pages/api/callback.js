import axios from "axios"
import crypto from "crypto"
import { runMiddleware, corsMiddleware } from "@/utils/corsMiddleware";

const HOST = process.env.NEXT_PUBLIC_HOST
const INVOICE_MACAROON = process.env.NEXT_PUBLIC_INVOICE_MACAROON

export default async function handler(req, res) {
    // Apply CORS middleware to allow cross-origin requests
    await runMiddleware(req, res, corsMiddleware);
    const { slug, ...queryParams } = req.query

    if (queryParams.amount) {
        // Prepare metadata as required by LUD-06
        const metadata = [
            ["text/plain", "Sample LN-ADDRESS endpoint"]
        ];

        const metadataString = JSON.stringify(metadata);

        // Create SHA256 hash of the metadata string
        const hash = crypto.createHash('sha256').update(metadataString).digest('hex');

        // Convert hash to base64 for use as description_hash in the invoice
        const descriptionHash = Buffer.from(hash, 'hex').toString('base64');

        // Convert amount from millisatoshis to satoshis as per LUD-06
        const value = parseInt(queryParams.amount) / 1000

        if (value < 1) {
            // Ensure amount is not less than 1 satoshi
            res.status(400).json({ error: 'Amount too low' })
            return
        } else {
            // Create invoice using the Lightning Network node API
            const { data } = await axios.post(`${HOST}/v1/invoices`,
                {
                    value: value,
                    memo: "voltage-tipper", // Prepend memo to identify payments from this app
                    description_hash: descriptionHash, // Include description_hash as per LUD-06
                },
                {
                    headers: { "Grpc-Metadata-macaroon": INVOICE_MACAROON }
                });

            if (data.payment_request) {
                // Return the payment request (invoice) and empty routes array as per LUD-06
                res.status(200).json({
                    pr: data.payment_request,
                    routes: []
                })
                return
            }
        }
    } else {
        // Amount is required as per LUD-06
        res.status(400).json({ error: 'Amount not specified' })
        return
    }
}