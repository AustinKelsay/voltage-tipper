import axios from 'axios'
import { runMiddleware, corsMiddleware } from "@/utils/corsMiddleware";

const HOST = process.env.NEXT_PUBLIC_HOST
const MACAROON = process.env.NEXT_PUBLIC_READ_MACAROON

export default async function handler(req, res) {
    // Apply CORS middleware to allow cross-origin requests
    await runMiddleware(req, res, corsMiddleware);

    // Get the host from the request headers
    const host = req.headers.host;

    // Construct the base URL
    const baseUrl = `https://${host}`;

    const { slug } = req.query

    // Check if the slug is valid
    if (!slug || slug === 'undefined') {
        res.status(404).json({ error: 'Not found' })
        return
    }

    // Fetch node information to verify the alias
    const { data } = await axios.get(`${HOST}/v1/getinfo`, {
        headers: {
            "Grpc-Metadata-macaroon": MACAROON
        }
    })

    // Check if the slug matches the node's alias
    if (data && data.alias && slug === data.alias) {
        // Prepare metadata as required by LUD-16
        const metadata = [
            ["text/plain", "Sample LN-ADDRESS endpoint"],
            // Add the text/identifier metadata as per LUD-16
            ["text/identifier", `${slug}@${host}`]
        ];

        // Construct the LNURL-pay response as per LUD-06 and LUD-16
        res.status(200).json({
            callback: `${baseUrl}/api/callback`, // URL for the callback phase
            maxSendable: 1000000, // Maximum amount in millisatoshis
            minSendable: 1000, // Minimum amount in millisatoshis
            metadata: JSON.stringify(metadata), // Metadata as a JSON string
            tag: 'payRequest' // Indicates this is a payment request
        })
        return
    } else {
        // If the slug doesn't match the node's alias, return a 404 error
        res.status(404).json({ error: 'Not found' })
        return
    }
}