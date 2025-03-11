import "@/styles/globals.css";
import type { AppProps } from "next/app";
import LoadingBar from 'react-top-loading-bar'
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { SessionProvider } from "next-auth/react";
import Footer from "@/components/Footer";
import { useRouter } from "next/router";

import 'prismjs';
import '../styles/custom-prism.css';
import 'prismjs/components/prism-javascript.min.js';

export default function App({ Component, pageProps }: AppProps) {
  const [progress, setProgress] = useState(0)
  const router = useRouter()

  useEffect(() => {
    setProgress(100);
  }, []);

  const hideHeaderPages = ['/dashboard', '/404']

  return (
    <SessionProvider>
      <LoadingBar color='#fff' progress={progress} onLoaderFinished={() => setProgress(0)} />
      {!hideHeaderPages.includes(router.pathname) && <Header />}
      <Component {...pageProps} />
      <Footer />
    </SessionProvider>
  );
}