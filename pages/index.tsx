import Head from 'next/head'
import Header from '@/components/Header';
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import dynamic from 'next/dynamic'
import Data from '../components/Data';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <Head>
        <title>Pictioner</title>
        <meta name="description" content="Pictioner is a fun guessing game where users need to guess what GPT draws on the canvas within three tries. Users proceed to next rounds as they keep guessing things right or are eliminated when they get a guess wrong. Be ready for endless fun!" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className={`${styles.main}`}>
        <Data />
      </main>
      <Footer />
    </>
  )
}
