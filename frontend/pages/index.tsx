import type { NextPage } from 'next'
import { useState, useRef, useEffect } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Link from "next/link";
import SideBarMenu from './sidebarmenu'
import Web3Modal from "web3modal";
import { useRouter } from "next/router";
import { providers, Contract } from "ethers";

export type IState = {
  modal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  modalToggle: () => void;
};


const Home: NextPage = () => {
 const [modal, setModal] = useState<IState["modal"]>(false);
  const [walletConnected, setWalletConnected] = useState(false);

  const web3ModalRef: any = useRef();


  const router = useRouter();

 const modalToggle = () => {
   setModal(!modal);
 };

 const getProviderOrSigner = async (needSigner = false) => {
   // Connect to Metamask
   // Since we store `web3Modal` as a reference, we need to access the `current` value to get access to the underlying object
   const provider = await web3ModalRef.current.connect();
   const web3Provider = new providers.Web3Provider(provider);

   // If user is not connected to the Rinkeby network, let them know and throw an error
   const { chainId } = await web3Provider.getNetwork();
   if (chainId !== 4) {
     alert("Change the network to Rinkeby");
     throw new Error("Change network to Rinkeby");
   }

   if (needSigner) {
     const signer = web3Provider.getSigner();
     return signer;
   }
   return web3Provider;
 };

 const connectWallet = async () => {
   try {
     // Get the provider from web3Modal, which in our case is MetaMask
     // When used for the first time, it prompts the user to connect their wallet
     await getProviderOrSigner();
     setWalletConnected(true);
     router.push("/guessinggame");
   } catch (err) {
     console.error(err);
   }
 };

   useEffect(() => {
     // if wallet is not connected, create a new instance of Web3Modal and connect the MetaMask wallet
     if (!walletConnected) {
       // Assign the Web3Modal class to the reference object by setting it's `current` value
       // The `current` value is persisted throughout as long as this page is open
       web3ModalRef.current = new Web3Modal({
         network: "rinkeby",
         providerOptions: {},
         //  disableInjectedProvider: false,
       });
     } 
     getProviderOrSigner()
   }, [walletConnected]);




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
          <nav className="flex px-4 items-center justify-between h-16 bg-yellow-500 mb-16">
            <Link href="/">
              <a>
                <img
                  src="/ljcrypto.webp"
                  alt=""
                  className=" rounded-3xl w-12 h-12 cursor-pointer transition ease-in-out delay-75 hover:scale-75"
                />
              </a>
            </Link>
            <div className="hidden md:flex md:items-center md:justify-between">
              <h1 className="">Liquidity Pools</h1>
              <h1 className="pl-5">Staking</h1>
              <h1 className="pl-5">Governance</h1>
              <h1 className="pl-5">Tokens And NFTs</h1>
              <h1 className="pl-5">LotteryGame</h1>
              <h1 className="pl-5">GuessingGame</h1>
              <button
                onClick={connectWallet}
                className="rounded-2xl bg-black ml-5 text-white h-8 shadow-button w-24 font-bold transition ease-in-out hover:scale-75"
              >
                Launch
              </button>
            </div>
            <img
              src="/menu.png"
              alt=""
              className="w-12 h-12 cursor-pointer transition ease-in-out delay-75 hover:scale-75 md:hidden md:cursor-none"
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
            <button
              onClick={connectWallet}
              className="md:hidden rounded-2xl bg-yellow-500 text-white h-8 shadow-button w-24 font-bold ml-2 transition ease-in-out hover:bg-yellow-300"
            >
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
