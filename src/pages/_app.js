import "@/styles/globals.css";
import { PrimeReactProvider } from 'primereact/api';
import { ToastProvider } from '@/hooks/useToast';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { useEffect, useState } from 'react';

// Default theme URL
const defaultThemeUrl = "primereact/resources/themes/bootstrap4-dark-blue/theme.css";

export default function MyApp({ Component, pageProps }) {
  // State to manage the current theme
  const [themeLoaded, setThemeLoaded] = useState(false);

  useEffect(() => {
    // Get the theme URL from environment variable or use default
    const themeUrl = process.env.NEXT_PUBLIC_PRIMEREACT_THEME_URL || defaultThemeUrl;

    // Dynamically import the theme CSS
    import(themeUrl)
      .then(() => {
        console.log(`Theme loaded successfully: ${themeUrl}`);
        setThemeLoaded(true);
      })
      .catch((error) => {
        console.error(`Failed to load theme: ${themeUrl}`, error);
        // If the specified theme fails to load, fall back to the default theme
        import(defaultThemeUrl)
          .then(() => {
            console.log(`Fallback theme loaded: ${defaultThemeUrl}`);
            setThemeLoaded(true);
          })
          .catch((fallbackError) => {
            console.error(`Failed to load fallback theme`, fallbackError);
            // If even the fallback theme fails, we set themeLoaded to true to allow the app to render
            setThemeLoaded(true);
          });
      });
  }, []); // Empty dependency array ensures this effect runs only once on mount

  // Only render the app once the theme is loaded
  if (!themeLoaded) {
    return null; // Or you could return a loading spinner here
  }

  return (
    <PrimeReactProvider>
      <ToastProvider>
        <Component {...pageProps} />
      </ToastProvider>
    </PrimeReactProvider>
  );
}