import Head from 'next/head';
import { HomePage } from '../components/HomePage/HomePage';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <>
      <Head>
        <link rel="manifest" href="/manifest.json"></link>
      </Head>
      <HomePage />
    </>
  );
}
