import type { NextPage } from 'next'
import { useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from "next/link";
import SideBarMenu from './sidebarmenu'

export type IState = {
  modal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  modalToggle: () => void;
};


const Home: NextPage = () => {
 const [modal, setModal] = useState<IState["modal"]>(false);

 const modalToggle = () => {
   setModal(!modal);
 };


  return (
    <>
      <div className="bg-background bg-no-repeat bg-[length:auto_100%] h-screen">
        <Head>
          <title>LJCrypto Exchange</title>
          <meta
            name="description"
            content="The Exchange where you can swap, stake, add liquidity, and play games"
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className="">
          <nav className="flex px-2 items-center justify-between h-16 bg-yellow-500 cursor-pointer mb-16">
            <Link href="/">
              <a>
                <img
                  src="/ljcrypto.webp"
                  alt=""
                  className=" rounded-3xl w-12 h-12 transition ease-in-out delay-75 hover:scale-75"
                />
              </a>
            </Link>
            <img
              src="/menu.png"
              alt=""
              className="w-12 h-12 cursor-pointer transition ease-in-out delay-75 hover:scale-75"
              onClick={modalToggle}
            />
          </nav>
          <div className="flex flex-col ml-4">
            <h1 className="text-white text-5xl">LJCrypto</h1>
            <h1 className="text-white text-5xl mb-5">Exchange</h1>
            <p className="text-white text-2xl mb-5">
              Swap, Stake, Become A Automatic Market Maker, Make Proposals, Join
              A Lottery And A Guessing Game, Breed NFTs.
            </p>
            <button className="rounded-2xl bg-yellow-500 text-white h-8 shadow-button w-24 font-bold ml-2 transition ease-in-out hover:bg-yellow-300">
              Launch
            </button>
          </div>
        </main>

        {/* <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer> */}
      </div>
      {modal && (
        <SideBarMenu
          modalToggle={modalToggle}
          modal={modal}
          setModal={setModal}
        />
      )}
    </>
  );
}

export default Home
