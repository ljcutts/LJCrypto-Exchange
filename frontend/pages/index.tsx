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
          <link rel="icon" href="/ljcrypto.webp" />
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
              <Link href="https://mumbaifaucet.com/">
                <a target="_blank">
                  <h1 className="pl-5 hover:text-white">Mumbai Faucet</h1>
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
              Swap, Stake, Trade Tokens, Become A Automatic Market Maker, Make Proposals, Join
              A Lottery And A Guessing Game, Breed NFTs.
            </p>
            <div className="flex mb-10">
              <Link href="https://twitter.com/LarryCutts6">
                <a target="_blank">
                  <img
                    src="/twitter.png"
                    alt=""
                    width="40"
                    height="40"
                    className="hover:opacity-50 mr-8"
                  />
                </a>
              </Link>
              <Link href="https://www.youtube.com/channel/UCifzIH_LbTJVjHbP97Qy8-A/featured">
                <a target="_blank">
                  <img
                    src="/youtube.webp"
                    alt=""
                    width="45"
                    height="45"
                    className="hover:opacity-50 mr-8"
                  />
                </a>
              </Link>
              <Link href="https://github.com/ljcutts/LJCrypto-Exchange">
                <a target="_blank">
                  <img
                    src="/github.png"
                    alt=""
                    width="45"
                    height="45"
                    className="hover:opacity-50 mr-8 rounded-3xl relative bottom-2 bg-white"
                  />
                </a>
              </Link>
            </div>
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
