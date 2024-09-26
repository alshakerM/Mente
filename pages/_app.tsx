import Head from 'next/head';
import '../styles/globals.css';
import Notify from './notify';

function MyApp({ Component, pageProps }) {
  const { res } = Notify();
  return (
    <>
      <Head>
        <title>Samara&#39;s Gift</title>
      </Head>
      {res}
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
