import Head from 'next/head';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Samara&#39;s Gift</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
