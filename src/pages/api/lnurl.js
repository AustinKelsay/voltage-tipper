import { runMiddleware, corsMiddleware } from "@/utils/corsMiddleware";

export default async function handler(req, res) {
  // Apply CORS middleware to allow cross-origin requests
  await runMiddleware(req, res, corsMiddleware);

  // Get the host from the request headers
  const host = req.headers.host;

  // Construct the base URL using the host
  const baseUrl = `https://${host}`;

  // Define metadata for the LNURL response
  const metadata = [
    ["text/plain", "Sample LN-ADDRESS endpoint"]
  ];

  // Construct the LNURL response object
  // https://github.com/lnurl/luds/blob/luds/06.md
  const response = {
    // URL to call when the user confirms the payment
    callback: `${baseUrl}/api/callback`,
    // Maximum amount that can be requested (in millisatoshis)
    maxSendable: 100000000,
    // Minimum amount that can be requested (in millisatoshis)
    minSendable: 1000,
    // Metadata as a JSON string
    metadata: JSON.stringify(metadata),
    // Indicates this is a payment request
    tag: "payRequest"
  };

  // Send the LNURL response as JSON with a 200 status code
  res.status(200).json(response);
}