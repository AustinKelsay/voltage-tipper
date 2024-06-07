import Cors from 'cors';

// Initialize the cors middleware
export const corsMiddleware = Cors({
   methods: ['GET', 'HEAD', 'POST'],
   origin: '*',
});


// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
export async function runMiddleware(req, res, middleware) {
 return new Promise((resolve, reject) => {
     middleware(req, res, (result) => {
         if (result instanceof Error) {
             return reject(result);
         }
         return resolve(result);
     });
 });
}