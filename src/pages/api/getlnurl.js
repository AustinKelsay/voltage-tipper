import { bech32 } from 'bech32';
import { runMiddleware, corsMiddleware } from "@/utils/corsMiddleware";

// Function to encode a URL into LNURL format
function encodeLnurl(url) {
    // Convert the URL string to a byte array
    const words = bech32.toWords(Buffer.from(url, 'utf8'));
    // Encode the byte array into a bech32 string with 'lnurl' prefix
    return bech32.encode('lnurl', words, 2000).toUpperCase();
}

export default function handler(req, res) {
    // Apply CORS middleware to allow cross-origin requests
    runMiddleware(req, res, corsMiddleware);

    // Get the host from the request headers
    const host = req.headers.host;

    // Construct the base URL using the host
    const baseUrl = `https://${host}`;

    // Create the original URL for the LNURL endpoint
    const originalUrl = `${baseUrl}/api/lnurl`
    // Encode the original URL into LNURL format
    const encodedLnurl = encodeLnurl(originalUrl);

    // Send the response with the encoded LNURL and original URL
    res.status(200).json({
        lnurl: encodedLnurl,
        originalUrl: originalUrl
    })
}