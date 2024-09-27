import Head from 'next/head';
import '../styles/globals.css';
import Notify from './notify';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Samara&#39;s Gift</title>
      </Head>
      <Notify />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
