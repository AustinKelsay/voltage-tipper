
export default async function handler(req, res) {
   const metadata = [
       ["text/plain", "Sample LN-ADDRESS endpoint"]
   ];
   const response = {
       // callback refers to the endpoint that will be called by the LNURL server to get the invoice
       callback: `${process.env.BACKEND_URL}/api/callback`,
       maxSendable: 100000000, // milisatoshis
       minSendable: 1000,      // milisatoshis
       metadata: JSON.stringify(metadata),
       tag: "payRequest"
   };
   res.status(200).json(response);
}