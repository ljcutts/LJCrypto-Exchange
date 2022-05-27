import React, { useState, useContext, useEffect, useRef } from "react";
import Link from "next/link";
import { Web3Context, useWeb3 } from "../context";
import { providers, Contract, BigNumber, ethers } from "ethers";
import styles from "../styles/Home.module.css";
import Web3Modal from "web3modal";


const LiquidityPools: React.FC = () => {
  const [account, setAccount] = useState<useWeb3["account"]>(null);
  const [walletConnected, setWalletConnected] = useState(false);

  const web3ModalRef: any = useRef();

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

  const getAddress = async () => {
    const provider = window.ethereum;
    const web3Provider = new providers.Web3Provider(provider);
    const thisAccount =  await web3Provider.getSigner().getAddress();
   setAccount(thisAccount)
    return thisAccount;
  };

   const connectWallet = async () => {
     try {
       await getProviderOrSigner();
       setWalletConnected(true);
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
     setInterval(async() => {
       await getAddress()
     })
     
   }, [walletConnected, account]);


  return (
    <main className="bg-gradient-to-r from-yellow-300 to-black bg-no-repeat bg-[length:auto_100%] h-screen overflow-y-scroll">
      <nav className="flex px-4 items-center justify-between h-16 pt-3">
        <Link href="/">
          <a>
            <img
              src="/ljcrypto.webp"
              alt=""
              className=" rounded-3xl w-12 h-12 cursor-pointer transition ease-in-out delay-75 hover:scale-75"
            />
          </a>
        </Link>
        <button className="rounded-2xl bg-yellow-500 text-white h-8 shadow-button w-40 font-bold ml-2 transition ease-in-out hover:bg-yellow-300">
          <div className="text-xl text-black">
            {account !== null ? (
              <p className="text-xl">
                {account.slice(0, 6)}...
                {account.slice(-4)}
              </p>
            ) : (
              <p onClick={connectWallet}> Connect </p>
            )}
          </div>
        </button>
      </nav>
    </main>
  );
};

export default LiquidityPools