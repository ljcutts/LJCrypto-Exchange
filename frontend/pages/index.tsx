import type { NextPage } from 'next'
import { useState, useContext } from 'react'
import Head from 'next/head'
import Link from "next/link";
import SideBarMenu from './sidebarmenu'
import { useRouter } from "next/router";
import { Web3Context, useWeb3 } from "../context";


export type IState = {
  modal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  modalToggle: () => void;
};


const Home: NextPage = () => {
 const [modal, setModal] = useState<IState["modal"]>(false);

  const router = useRouter();

 const modalToggle = () => {
   setModal(!modal);
 };
 const {
   account,
   connectWallet,
 } = useContext(Web3Context) as useWeb3;


 const launchButton = async () => {
  if(account === null) {
    await connectWallet();
  }
  router.push("/guessinggame")
 }

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
              <Link href="/guessinggame">
                <a>
                  <h1 className="hover:text-white">GuessingGame</h1>
                </a>
              </Link>
              <Link href="/tokens">
                <a>
                  <h1 className="pl-5 hover:text-white">Tokens</h1>
                </a>
              </Link>
              <Link href="/nft">
                <a>
                  <h1 className="pl-5 hover:text-white">NFTs</h1>
                </a>
              </Link>
              <Link href="/dao">
                <a>
                  <h1 className="pl-5 hover:text-white">Governance</h1>
                </a>
              </Link>
              <Link href="/liquiditypools">
                <a>
                  <h1 className="pl-5 hover:text-white">Liquidity Pools</h1>
                </a>
              </Link>
              <Link href="/swap">
                <a>
                  <h1 className="pl-5 hover:text-white">Swap</h1>
                </a>
              </Link>
              <Link href="/lotterygame">
                <a>
                  <h1 className="pl-5 hover:text-white">Lottery</h1>
                </a>
              </Link>
              <button
                onClick={launchButton}
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
              onClick={launchButton}
              className="md:hidden rounded-2xl bg-yellow-500 text-white h-8 shadow-button w-24 font-bold ml-2 transition ease-in-out hover:bg-yellow-300"
            >
              Launch
            </button>
          </div>
        </main>
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
