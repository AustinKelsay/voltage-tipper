import axios from 'axios'
import { runMiddleware, corsMiddleware } from "@/utils/corsMiddleware";

const HOST = process.env.NEXT_PUBLIC_HOST
const MACAROON = process.env.NEXT_PUBLIC_READ_MACAROON

export default async function handler(req, res) {
    await runMiddleware(req, res, corsMiddleware);

    // Get the host from the request headers
    const host = req.headers.host;

    // Construct the base URL
    const baseUrl = `https://${host}`;

    const { slug } = req.query

    if (!slug || slug === 'undefined') {
        res.status(404).json({ error: 'Not found' })
        return
    }

    const { data } = await axios.get(`${HOST}/v1/getinfo`, {
        headers: {
            "Grpc-Metadata-macaroon": MACAROON
        }
    })

    if (data && data.alias && slug === data.alias) {
        const metadata = [
            ["text/plain", "Sample LN-ADDRESS endpoint"]
        ];

        res.status(200).json({
            callback: `${baseUrl}/api/callback`,
            maxSendable: 1000000,
            minSendable: 1000,
            metadata: JSON.stringify(metadata),
            tag: 'payRequest'
        })
        return
    } else {
        res.status(404).json({ error: 'Not found' })
        return
    }
}