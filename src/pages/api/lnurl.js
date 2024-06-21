import { runMiddleware, corsMiddleware } from "@/utils/corsMiddleware";

export default async function handler(req, res) {
  await runMiddleware(req, res, corsMiddleware);

  // Get the host from the request headers
  const host = req.headers.host;

  // Construct the base URL
  const baseUrl = `https://${host}`;

  const metadata = [
    ["text/plain", "Sample LN-ADDRESS endpoint"]
  ];

  const response = {
    callback: `${baseUrl}/api/callback`,
    maxSendable: 100000000, // millisatoshis
    minSendable: 1000, // millisatoshis
    metadata: JSON.stringify(metadata),
    tag: "payRequest"
  };

  res.status(200).json(response);
}