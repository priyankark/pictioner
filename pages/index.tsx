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
        <meta name="description" content="Fun Guessing Game! Try to beat the AI bot by guessing what the AI is drawing within three tries. Progress further on correct guesses and have endless hours of fun!" />
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
