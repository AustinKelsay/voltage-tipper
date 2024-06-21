import "@/styles/globals.css";
import { PrimeReactProvider } from 'primereact/api';
import { ToastProvider } from '@/hooks/useToast';
import "primereact/resources/themes/bootstrap4-dark-blue/theme.css"
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

export default function MyApp({ Component, pageProps }) {
    return (
        <PrimeReactProvider>
            <ToastProvider>
                <Component {...pageProps} />
            </ToastProvider>
        </PrimeReactProvider>
    );
}