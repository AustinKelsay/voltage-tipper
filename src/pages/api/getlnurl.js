import { bech32 } from 'bech32';
import { runMiddleware, corsMiddleware } from "@/utils/corsMiddleware";

function encodeLnurl(url) {
    const words = bech32.toWords(Buffer.from(url, 'utf8'));
    return bech32.encode('lnurl', words, 2000).toUpperCase();
}

export default function handler(req, res) {
    runMiddleware(req, res, corsMiddleware);

    // Get the host from the request headers
    const host = req.headers.host;

    // Construct the base URL
    const baseUrl = `https://${host}`;

    const originalUrl = `${baseUrl}/api/lnurl`
    const encodedLnurl = encodeLnurl(originalUrl);

    res.status(200).json({
        lnurl: encodedLnurl,
        originalUrl: originalUrl
    })
}