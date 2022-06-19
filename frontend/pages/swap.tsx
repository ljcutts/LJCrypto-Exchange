import React, { useState, useContext, useEffect } from "react";
import Link from "next/link";
import { Web3Context, useWeb3 } from "../context";
import { providers, Contract, BigNumber, ethers } from "ethers";
import styles from "../styles/Home.module.css";


type IState = {
  ljcryptoBalance: string | undefined;
  setLJCryptoBalance: React.Dispatch<React.SetStateAction<string | undefined>>;
  maticBalance: string | undefined;
  setMaticBalance: React.Dispatch<React.SetStateAction<string | undefined>>;
  ljstablecoinBalance: string | undefined;
  setLJStableCoinBalance: React.Dispatch<React.SetStateAction<string | undefined>>;
  amountOne: string | undefined;
  setAmountOne: React.Dispatch<React.SetStateAction<string | undefined>>;
  amountTwo: string | undefined;
  setAmountTwo: React.Dispatch<React.SetStateAction<string | undefined>>;
};

import {
  LJCRYPTO_TOKEN_ABI,
  LJCRYPTO_TOKEN_ADDRESS,
} from "../constants/ljcryptotoken";

import {
  LJSTABLE_COIN_ABI,
  LJSTABLE_COIN_ADDRESS,
} from "../constants/ljstablecoin";

import {
  LJC_LJS_ABI,
  LJC_LJS_ADDRESS,
} from "../constants/ljcryptoandstablepair";
import {
  LJC_MATIC_ABI,
  LJC_MATIC_ADDRESS,
} from "../constants/ljcryptoandmaticpair";
import {
  LJS_MATIC_ABI,
  LJS_MATIC_ADDRESS,
} from "../constants/ljstableandmaticpair";
import Head from "next/head";




const Swap: React.FC = () => {
const { account, connectWallet, getProviderOrSigner, getAddress, loading, setLoading} = useContext(Web3Context) as useWeb3;
const [swapBox, setSwapBox] = useState(false)
const [swapBox2, setSwapBox2] = useState(false);
const [selectedCrypto, setSelectedCrypto] = useState("")
const [selectedCrypto2, setSelectedCrypto2] = useState("");
const [ljcryptoBalance, setLJCryptoBalance] = useState<IState["ljcryptoBalance"]>("0");
const [ljstablecoinBalance, setLJStableCoinBalance] = useState<IState["ljstablecoinBalance"]>("0");
const [maticBalance, setMaticBalance] = useState<IState["maticBalance"]>("0");
const [amountOne, setAmountOne] = useState("0.0");
const [amountTwo, setAmountTwo] = useState("0.0");

const toggleBox = async() => {
    setSwapBox(!swapBox);
}

const toggleBox2 = async () => {
  setSwapBox2(!swapBox2);
};


const toggleLJC = async() => {
    setSelectedCrypto("LJC")
    toggleBox()
}

const toggleLJS = async () => {
  setSelectedCrypto("LJS");
  toggleBox();
};

const togglePolygon = async () => {
  setSelectedCrypto("Polygon");
  toggleBox();
};

const toggleLJC2 = async () => {
  setSelectedCrypto2("LJC");
  toggleBox2();
};

const toggleLJS2 = async () => {
  setSelectedCrypto2("LJS");
  toggleBox2();
};

const togglePolygon2 = async () => {
  setSelectedCrypto2("Polygon");
  toggleBox2();
};


const getLJCryptoTokenInstance = (
  providerOrSigner: providers.Web3Provider | providers.JsonRpcSigner
) => {
  return new Contract(
    LJCRYPTO_TOKEN_ADDRESS,
    LJCRYPTO_TOKEN_ABI,
    providerOrSigner
  );
};

const getLJStableCoinInstance = (
  providerOrSigner: providers.Web3Provider | providers.JsonRpcSigner
) => {
  return new Contract(
    LJSTABLE_COIN_ADDRESS,
    LJSTABLE_COIN_ABI,
    providerOrSigner
  );
};

const getLJCJStablePairInstance = (
  providerOrSigner: providers.Web3Provider | providers.JsonRpcSigner
) => {
  return new Contract(LJC_LJS_ADDRESS, LJC_LJS_ABI, providerOrSigner);
};

const getLJCMaticPairInstance = (
  providerOrSigner: providers.Web3Provider | providers.JsonRpcSigner
) => {
  return new Contract(LJC_MATIC_ADDRESS, LJC_MATIC_ABI, providerOrSigner);
};

const getLJSMaticPairInstance = (
  providerOrSigner: providers.Web3Provider | providers.JsonRpcSigner
) => {
  return new Contract(LJS_MATIC_ADDRESS, LJS_MATIC_ABI, providerOrSigner);
};



const getBalances = async () => {
  const re = new RegExp("^-?\\d+(?:.\\d{0," + (2 || -1) + "})?");
  const provider = window.ethereum;
  const web3Provider = new providers.Web3Provider(provider).getSigner();
  const maticBalance = await web3Provider.getBalance();
  const ljcryptocontract = getLJCryptoTokenInstance(web3Provider);
  const ljstablecontract = getLJStableCoinInstance(web3Provider);
  const currentAccount = await getAddress();
  const valueOne = await ljcryptocontract.balanceOf(currentAccount);
  const valueTwo = await ljstablecontract.balanceOf(currentAccount);
  setLJCryptoBalance(
    ethers.utils.formatEther(valueOne).toString().match(re)?.[0]
  );
  setLJStableCoinBalance(
    ethers.utils.formatEther(valueTwo).toString().match(re)?.[0]
  );
  setMaticBalance(
    ethers.utils.formatEther(maticBalance).toString().match(re)?.[0]
  );
};


const toggleSwap = () => {
  
  if(selectedCrypto === "" && selectedCrypto2 === "") {
    const valueOne = "LJC"
    const valueTwo = "LJS"
    setSelectedCrypto2(valueOne);
    setSelectedCrypto(valueTwo);
  } else {
    setSelectedCrypto2(selectedCrypto)
    setSelectedCrypto(selectedCrypto2)
  }
 
}

const calculateSwapAmounts = async() => {
 const re = new RegExp("^-?\\d+(?:.\\d{0," + (10 || -1) + "})?");
 const provider = window.ethereum;
 const web3Provider = new providers.Web3Provider(provider).getSigner();
 const ljcLjscontract = await getLJCJStablePairInstance(web3Provider);
 const ljsMaticcontract = await getLJSMaticPairInstance(web3Provider);
 const ljcMaticcontract = await getLJCMaticPairInstance(web3Provider);
 const ljcryptoReserve = await  ljcLjscontract.getLJCryptoReserve();
 const ljcryptoReserve2 = await ljcMaticcontract.getLJCryptoReserve();
 const ljstableReserve = await ljcLjscontract.getLJStableReserve();
 const ljstableReserve2 = await ljsMaticcontract.getLJStableReserve();
 const ljsMaticcontractBalance = await new providers.Web3Provider(provider).getBalance(LJS_MATIC_ADDRESS);
 const ljcMaticcontractBalance = await new providers.Web3Provider(provider).getBalance(LJC_MATIC_ADDRESS);
 if((selectedCrypto === "" || selectedCrypto === "LJC") && (selectedCrypto2 === "LJS" || selectedCrypto2 === "")) {
   if(amountOne !== "0.0"){
      const amountA = ethers.utils.parseEther(
        `${amountOne === "" ? "0.0" : amountOne}`
      );
      const amountOfTokens =  await ljcLjscontract.getAmountOfTokens(amountA, ljcryptoReserve.toString(), ljstableReserve.toString());
       setAmountTwo(ethers.utils.formatEther(amountOfTokens).toString());
   }
  }
  if ((selectedCrypto === "LJS") && (selectedCrypto2 === "LJC")) {
    if (amountOne !== "0.0") {
      const amountA = ethers.utils.parseEther(
        `${amountOne === "" ? "0.0" : amountOne}`
      );
      const amountOfTokens = await ljcLjscontract.getAmountOfTokens(
        amountA,
        ljstableReserve.toString(),
        ljcryptoReserve.toString()
      );
      setAmountTwo(ethers.utils.formatEther(amountOfTokens).toString());
    }
  }

  if(selectedCrypto === "LJS" && selectedCrypto2 === "Polygon") {
     if (amountOne !== "0.0") {
       const amountA = ethers.utils.parseEther(
         `${amountOne === "" ? "0.0" : amountOne}`
       );
       const amountOfTokens = await ljsMaticcontract.getAmountOfTokens(
         amountA,
         ljstableReserve2.toString(),
         ljsMaticcontractBalance.toString()
       );
      setAmountTwo(
        ethers.utils.formatEther(amountOfTokens).toString()
      );
     }
  }

  if (selectedCrypto === "Polygon" && selectedCrypto2 === "LJS") {
    if (amountOne !== "0.0") {
      const amountA = ethers.utils.parseEther(
        `${amountOne === "" ? "0.0" : amountOne}`
      );
      const amountOfTokens = await ljsMaticcontract.getAmountOfTokens(
        amountA,
        ljsMaticcontractBalance.toString(),
        ljstableReserve2.toString(),
      );
      setAmountTwo(ethers.utils.formatEther(amountOfTokens).toString());
    }
  }

  if (selectedCrypto === "LJC" && selectedCrypto2 === "Polygon") {
    if (amountOne !== "0.0") {
      const amountA = ethers.utils.parseEther(
        `${amountOne === "" ? "0.0" : amountOne}`
      );
      const amountOfTokens = await ljcMaticcontract.getAmountOfTokens(
        amountA,
        ljcryptoReserve2.toString(),
        ljcMaticcontractBalance.toString()
      );
      setAmountTwo(ethers.utils.formatEther(amountOfTokens).toString());
    }
  }

  if (selectedCrypto === "Polygon" && selectedCrypto2 === "LJC") {
    if (amountOne !== "0.0") {
      const amountA = ethers.utils.parseEther(
        `${amountOne === "" ? "0.0" : amountOne}`
      );
      const amountOfTokens = await ljcMaticcontract.getAmountOfTokens(
        amountA,
         ljcMaticcontractBalance.toString(),
        ljcryptoReserve2.toString()
      );
      setAmountTwo(ethers.utils.formatEther(amountOfTokens).toString());
    }
  }
}


const approveLJCryptoTokens = async (address: string, amountOne: BigNumber) => {
  try {
    setLoading(true);
    const signer = await getProviderOrSigner(true);
    const ljcryptoContract = getLJCryptoTokenInstance(signer);
    const tx = await ljcryptoContract.approve(address, amountOne);
    await tx.wait();
    window.alert(
      `You Have Successfully Approved ${ethers.utils.formatEther(
        amountOne
      )} LJCrypto Tokens`
    );
    setLoading(false);
  } catch (error: any) {
    setLoading(false);
    console.log(error);
    window.alert(error)
  }
};

const approveLJStableCoins = async (address: string, amountOne: BigNumber) => {
  try {
    setLoading(true);
    const signer = await getProviderOrSigner(true);
    const ljstableContract = getLJStableCoinInstance(signer);
    const tx = await ljstableContract.approve(address, amountOne);
    await tx.wait();
    window.alert(
      `You Have Successfully Approved ${ethers.utils.formatEther(amountOne)} LJStableCoins`
    );
    setLoading(false);
  } catch (error: any) {
    setLoading(false);
    console.log(error);
    window.alert(error)
  }
};


const ljcryptoTokenToLJStableToken = async (amountOne: string, amountTwo: string) => {
  await approveLJCryptoTokens(LJC_LJS_ADDRESS, ethers.utils.parseEther(`${amountOne}`));
  try {
     setLoading(true);
     const signer = await getProviderOrSigner(true);
     const contract = getLJCJStablePairInstance(signer);
     const tx = await contract.ljcryptoTokenToLJStableToken(
       ethers.utils.parseEther(`${amountOne}`),
       ethers.utils.parseEther(`${amountTwo}`)
     );
     await tx.wait();
     window.alert(`You Have Successfully Swapped LJCryptoTokens to LJStableCoins`);
     setLoading(false);
  } catch (error:any) {
   setLoading(false);
   console.log(error);
   window.alert(error);
  }
};

const ljStableTokenToLJCryptoToken = async (amountOne: string, amountTwo: string) => {
  await approveLJStableCoins(LJC_LJS_ADDRESS, ethers.utils.parseEther(`${amountOne}`));
  try {
    setLoading(true);
    const signer = await getProviderOrSigner(true);
    const contract = getLJCJStablePairInstance(signer);
    const tx = await contract.ljstableTokenToLJCryptoToken(
      ethers.utils.parseEther(`${amountOne}`),
      ethers.utils.parseEther(`${amountTwo}`)
    );
    await tx.wait();
    window.alert(
      `You Have Successfully Swapped LJStableCoins To LJCryptoTokens`
    );
    setLoading(false);
  } catch (error: any) {
    setLoading(false);
    console.log(error);
    window.alert(error);
  }
};

const ljStableCoinToMatic = async (amountOne: string, amountTwo: string) => {
  await approveLJStableCoins(LJS_MATIC_ADDRESS, ethers.utils.parseEther(`${amountOne}`));
  try {
    setLoading(true);
    const signer = await getProviderOrSigner(true);
    const contract = getLJSMaticPairInstance(signer);
    const tx = await contract.ljStableCoinTokenToMatic(
      ethers.utils.parseEther(`${amountOne}`),
      ethers.utils.parseEther(`${amountTwo}`)
    );
    await tx.wait();
    window.alert(
      `You Have Successfully Swapped LJStableCoins to Matic Tokens`
    );
    setLoading(false);
  } catch (error: any) {
    setLoading(false);
    console.log(error);
    window.alert(error);
  }
};

const maticToLJStableCoin = async (amountOne: string, amountTwo: string) => {
  try {
    setLoading(true);
    const signer = await getProviderOrSigner(true);
    const contract = getLJSMaticPairInstance(signer);
    const tx = await contract.maticToLJStableCoinToken(
      ethers.utils.parseEther(`${amountTwo}`),
      { value: ethers.utils.parseEther(`${amountOne}`) }
    );
    await tx.wait();
    window.alert(`You Have Successfully Swapped Matic Tokens To LJStableCoins`);
    setLoading(false);
  } catch (error: any) {
    setLoading(false);
    console.log(error);
    window.alert(error);
  }
};

const ljcryptoTokenToMatic = async (amountOne: string, amountTwo: string) => {
  await approveLJCryptoTokens(LJC_MATIC_ADDRESS, ethers.utils.parseEther(`${amountOne}`));
  try {
    setLoading(true);
    const signer = await getProviderOrSigner(true);
    const contract = getLJCMaticPairInstance(signer);
    const tx = await contract.ljcryptoTokenToMatic(
      ethers.utils.parseEther(`${amountOne}`),
      ethers.utils.parseEther(`${amountTwo}`)
    );
    await tx.wait();
    window.alert(`You Have Successfully Swapped LJCrypto Tokens to Matic Tokens`);
    setLoading(false);
  } catch (error: any) {
    setLoading(false);
    console.log(error);
    window.alert(error);
  }
};

const maticToLJCryptoToken = async (amountOne: string, amountTwo: string) => {
  try {
    setLoading(true);
    const signer = await getProviderOrSigner(true);
    const contract = getLJCMaticPairInstance(signer);
    const tx = await contract.maticToLJCryptoToken(
      ethers.utils.parseEther(`${amountTwo}`),
      {value: ethers.utils.parseEther(`${amountOne}`)}
    );
    await tx.wait();
    window.alert(`You Have Successfully Swapped Matic Tokens To LJCrypto Tokens`);
    setLoading(false);
  } catch (error: any) {
    setLoading(false);
    console.log(error);
    window.alert(error);
  }
};


const initiateSwaps = async() => {
  if((selectedCrypto === "" || selectedCrypto === "LJC") && (selectedCrypto2 === "LJS" || selectedCrypto2 === "")) {
    await ljcryptoTokenToLJStableToken(amountOne, amountTwo)
  }
  if(selectedCrypto === "LJS" && selectedCrypto2 === "Polygon") {
    await ljStableCoinToMatic(amountOne,amountTwo)
  }
  if (selectedCrypto === "LJC" && selectedCrypto2 === "Polygon") {
    await ljcryptoTokenToMatic(amountOne, amountTwo);
  }

  if (selectedCrypto === "LJS" && selectedCrypto2 === "LJC") {
    await ljStableTokenToLJCryptoToken(amountOne, amountTwo)
  }

  if (selectedCrypto === "Polygon" && selectedCrypto2 === "LJS") {
    await maticToLJStableCoin(amountOne, amountTwo)
  }

  if (selectedCrypto === "Polygon" && selectedCrypto2 === "LJC") {
    await maticToLJCryptoToken(amountOne, amountTwo);
  }
}


useEffect(() => {
    getBalances()
})

useEffect(() => {
calculateSwapAmounts();
}, [amountOne, amountTwo])


  return (
    <main className="bg-gradient-to-r from-yellow-300 to-black bg-no-repeat bg-[length:auto_100%] h-screen overflow-y-scroll">
      <Head>
        <title>Swapping</title>
        <meta name="description" content="Swap Tokens" />
        <link rel="icon" href="/ljcrypto.webp" />
      </Head>
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
      <div className="flex items-center h-32 w-auto bg-black rounded-2xl relative top-10 mb-16">
        <div className="flex items-center text-yellow-500 mx-auto sm:text-lg text-xl font-bold uppercase px-4">
          <p className="">Swap LJCrypto, LJStable, and Matic Tokens</p>
        </div>
      </div>
      {loading ? (
        <>
          <p className="text-white text-3xl font-bold uppercase flex justify-center md:px-0 px-4 mb-3">
            Loading...
          </p>
          <article className={styles.card}>
            <section className={styles.cardSideFront}>
              <h1 className="h1">
                <img className="rounded-1400" src="/ljcrypto.webp" />
              </h1>
            </section>
          </article>
        </>
      ) : (
        <>
          <section className="relative top-16">
            <div className="h-28 w-80 ml-4 flex bg-yellow-500 rounded-2xl mb-2 md:mx-auto">
              <input
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setAmountOne(e.target.value)
                }
                className="pt-4 placeholder:text-black placeholder:opacity-60 font-semibold pl-4 bg-transparent mb-2 relative top-3 w-40 h-20 text-3xl outline-none pb-16 "
                type="number"
                placeholder="0.0"
              />
              {(selectedCrypto === "" || selectedCrypto === "LJC") && (
                <div className="flex flex-col item-center pl-2 pt-3 w-40">
                  <div className="flex items-center pr-3 pb-3 justify-end text-black font-semibold">
                    <img
                      src="/ljcrypto.webp"
                      alt=""
                      className="rounded-3xl w-10 mr-3 h-10"
                    />
                    LJC
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      onClick={toggleBox}
                      className="cursor-pointer hover:opacity-50"
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>
                  <div className="flex items-center font-semibold text-base pr-3 justify-end text-black">
                    Balance:
                    <span className="pl-1 text-red-600">{ljcryptoBalance}</span>
                    <span className="pl-1 text-ellipsis font-bold text-red-600"></span>
                  </div>
                </div>
              )}
              {selectedCrypto === "LJS" && (
                <div className="flex flex-col item-center pl-2 pt-3 w-40">
                  <div className="flex items-center pr-3 pb-3 justify-end text-black font-semibold">
                    <img
                      src="/ljstable.png"
                      alt=""
                      className="rounded-3xl w-10 mr-3 h-10"
                    />
                    LJS
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      onClick={toggleBox}
                      className="cursor-pointer hover:opacity-50"
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>
                  <div className="flex items-center font-semibold text-base pr-3 justify-end text-black">
                    Balance:
                    <span className="pl-1 text-red-600">
                      {ljstablecoinBalance}
                    </span>
                  </div>
                </div>
              )}
              {selectedCrypto === "Polygon" && (
                <div className="flex flex-col item-center pl-2 pt-3 w-40">
                  <div className="flex items-center pr-3 pb-3 justify-end text-black font-semibold">
                    <img
                      src="/polygon-logo.png"
                      alt=""
                      className="rounded-3xl w-10 mr-3 h-10"
                    />
                    Matic
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      onClick={toggleBox}
                      className="cursor-pointer hover:opacity-50"
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>
                  <div className="flex items-center font-semibold text-base pr-3 justify-end text-black">
                    Balance:
                    <span className="pl-1 text-red-600">{maticBalance}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-center items-center h-7 w-80 ml-4 bg-transparent rounded-2xl mb-2 md:mx-auto">
              <div
                onClick={toggleSwap}
                className="flex cursor-pointer hover:opacity-50  justify-center items-center bg-black h-7 w-7 rounded-3xl"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#FFE900"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <polyline points="19 12 12 19 5 12"></polyline>
                </svg>
              </div>
            </div>
            <div className="h-28 w-80 ml-4 flex bg-yellow-500 rounded-2xl mb-2 md:mx-auto">
              <input
                disabled
                value={
                  amountTwo === "0" || amountOne === "" ? "0.0" : amountTwo
                }
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setAmountTwo(e.target.value)
                }
                className="pt-4 placeholder:text-black placeholder:opacity-60 font-semibold pl-4 bg-transparent mb-2 relative top-3 w-40 h-20 text-3xl outline-none pb-16 "
                type="number"
                placeholder="0.0"
              />
              {(selectedCrypto2 === "" || selectedCrypto2 === "LJS") &&
                selectedCrypto !== "LJS" && (
                  <div className="flex flex-col item-center pl-2 pt-3 w-40">
                    <div className="flex items-center pr-3 pb-3 justify-end text-black font-semibold">
                      <img
                        src="/ljstable.png"
                        alt=""
                        className="rounded-3xl w-10 mr-3 h-10"
                      />
                      LJS
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        onClick={toggleBox2}
                        className="cursor-pointer hover:opacity-50"
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>
                    <div className="flex items-center font-semibold text-base pr-3 justify-end text-black">
                      Balance:
                      <span className="pl-1 text-red-600">
                        {ljstablecoinBalance}
                      </span>
                    </div>
                  </div>
                )}
              {selectedCrypto2 === "LJC" &&
                selectedCrypto !== "LJC" &&
                selectedCrypto !== "" && (
                  <div className="flex flex-col item-center pl-2 pt-3 w-40">
                    <div className="flex items-center pr-3 pb-3 justify-end text-black font-semibold">
                      <img
                        src="/ljcrypto.webp"
                        alt=""
                        className="rounded-3xl w-10 mr-3 h-10"
                      />
                      LJC
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        onClick={toggleBox2}
                        className="cursor-pointer hover:opacity-50"
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>
                    <div className="flex items-center font-semibold text-base pr-3 justify-end text-black">
                      Balance:
                      <span className="pl-1 text-red-600">
                        {ljcryptoBalance}
                      </span>
                    </div>
                  </div>
                )}
              {selectedCrypto2 === "Polygon" && selectedCrypto !== "Polygon" && (
                <div className="flex flex-col item-center pl-2 pt-3 w-40">
                  <div className="flex items-center pr-3 pb-3 justify-end text-black font-semibold">
                    <img
                      src="/polygon-logo.png"
                      alt=""
                      className="rounded-3xl w-10 mr-3 h-10"
                    />
                    Matic
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      onClick={toggleBox2}
                      className="cursor-pointer hover:opacity-50"
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>
                  <div className="flex items-center font-semibold text-base pr-3 justify-end text-black">
                    Balance:
                    <span className="pl-1 text-red-600">{maticBalance}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="md:flex md:justify-center">
              <button
                onClick={initiateSwaps}
                className="h-14 ml-4 md:ml-0 w-80 rounded-2xl bg-black font-semibold hover:text-white text-yellow-500 mb-5"
              >
                Swap
              </button>
            </div>
            {swapBox && (
              <div className="fixed top-0 left-0 w-full h-full bg-shade2 grid z-50 place-items-center">
                <div className="bg-yellow-500 text-black p-5 rounded-3xl w-80 h-auto">
                  <div className="flex justify-between mb-5">
                    Select a token
                    <svg
                      viewBox="0 0 24 24"
                      color="#FFFFFF"
                      width="20px"
                      xmlns="http://www.w3.org/2000/svg"
                      className="cursor-pointer hover:scale-125"
                      onClick={toggleBox}
                    >
                      <path d="M18.3 5.70997C17.91 5.31997 17.28 5.31997 16.89 5.70997L12 10.59L7.10997 5.69997C6.71997 5.30997 6.08997 5.30997 5.69997 5.69997C5.30997 6.08997 5.30997 6.71997 5.69997 7.10997L10.59 12L5.69997 16.89C5.30997 17.28 5.30997 17.91 5.69997 18.3C6.08997 18.69 6.71997 18.69 7.10997 18.3L12 13.41L16.89 18.3C17.28 18.69 17.91 18.69 18.3 18.3C18.69 17.91 18.69 17.28 18.3 16.89L13.41 12L18.3 7.10997C18.68 6.72997 18.68 6.08997 18.3 5.70997Z"></path>
                    </svg>
                  </div>
                  {selectedCrypto === "LJC" ||
                  selectedCrypto2 === "LJC" ||
                  selectedCrypto === "" ? (
                    <div className="flex mb-5 justify-between opacity-50 rounded-md">
                      <div className="flex items-center">
                        <img
                          src="/ljcrypto.webp"
                          alt=""
                          className="rounded-3xl w-10 mr-3 h-10"
                        />
                        <div className="flex text-bold flex-col">
                          <p className="leading-3">LJC</p>
                          <p>LJCrypto Token</p>
                        </div>
                      </div>
                      <span className="flex font-bold text-red-600 items-center">
                        {ljcryptoBalance}
                      </span>
                    </div>
                  ) : (
                    <div
                      onClick={toggleLJC}
                      className="flex mb-5 justify-between hover:bg-shade cursor-pointer rounded-md"
                    >
                      <div className="flex items-center">
                        <img
                          src="/ljcrypto.webp"
                          alt=""
                          className="rounded-3xl w-10 mr-3 h-10"
                        />
                        <div className="flex text-bold flex-col">
                          <p className="leading-3">LJC</p>
                          <p>LJCrypto Token</p>
                        </div>
                      </div>
                      <span className="flex font-bold text-red-600 items-center">
                        {ljcryptoBalance}
                      </span>
                    </div>
                  )}
                  {selectedCrypto !== "LJS" &&
                  selectedCrypto2 !== "LJS" &&
                  selectedCrypto2 !== "" ? (
                    <div
                      onClick={toggleLJS}
                      className="flex mb-5 justify-between rounded-md hover:bg-shade cursor-pointer"
                    >
                      <div className="flex items-center">
                        <img
                          src="/ljstable.png"
                          alt=""
                          className="rounded-3xl w-10 mr-3 h-10"
                        />
                        <div className="flex flex-col">
                          <p className="leading-3">LJS</p>
                          <p>LJStableCoin</p>
                        </div>
                      </div>
                      <span className="flex font-bold text-red-600 items-center">
                        {ljstablecoinBalance}
                      </span>
                    </div>
                  ) : (
                    <div className="flex mb-5 justify-between opacity-50 rounded-md">
                      <div className="flex items-center">
                        <img
                          src="/ljstable.png"
                          alt=""
                          className="rounded-3xl w-10 mr-3 h-10"
                        />
                        <div className="flex flex-col">
                          <p className="leading-3">LJS</p>
                          <p>LJStableCoin</p>
                        </div>
                      </div>
                      <span className="flex font-bold text-red-600 items-center">
                        {ljstablecoinBalance}
                      </span>
                    </div>
                  )}
                  {selectedCrypto === "Polygon" ||
                  selectedCrypto2 === "Polygon" ? (
                    <div className="flex justify-between opacity-50">
                      <div className="flex items-center">
                        <img
                          src="/polygon-logo.png"
                          alt=""
                          className="rounded-3xl w-10 mr-3 h-10"
                        />
                        <div className="flex flex-col">
                          <p className="leading-3">MATIC</p>
                          <p>Polygon Matic</p>
                        </div>
                      </div>
                      <span className="flex font-bold text-red-600 items-center">
                        {maticBalance}
                      </span>
                    </div>
                  ) : (
                    <div
                      onClick={togglePolygon}
                      className="flex justify-between rounded-md hover:bg-shade cursor-pointer"
                    >
                      <div className="flex items-center">
                        <img
                          src="/polygon-logo.png"
                          alt=""
                          className="rounded-3xl w-10 mr-3 h-10"
                        />
                        <div className="flex flex-col">
                          <p className="leading-3">MATIC</p>
                          <p>Polygon Matic</p>
                        </div>
                      </div>
                      <span className="flex font-bold text-red-600 items-center">
                        {maticBalance}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
            {swapBox2 && (
              <div className="fixed top-0 left-0 w-full h-full bg-shade2 grid z-50 place-items-center">
                <div className="bg-yellow-500 text-black p-5 rounded-3xl w-80 h-auto">
                  <div className="flex justify-between mb-5">
                    Select a token
                    <svg
                      viewBox="0 0 24 24"
                      color="#FFFFFF"
                      width="20px"
                      xmlns="http://www.w3.org/2000/svg"
                      className="cursor-pointer hover:scale-125"
                      onClick={toggleBox2}
                    >
                      <path d="M18.3 5.70997C17.91 5.31997 17.28 5.31997 16.89 5.70997L12 10.59L7.10997 5.69997C6.71997 5.30997 6.08997 5.30997 5.69997 5.69997C5.30997 6.08997 5.30997 6.71997 5.69997 7.10997L10.59 12L5.69997 16.89C5.30997 17.28 5.30997 17.91 5.69997 18.3C6.08997 18.69 6.71997 18.69 7.10997 18.3L12 13.41L16.89 18.3C17.28 18.69 17.91 18.69 18.3 18.3C18.69 17.91 18.69 17.28 18.3 16.89L13.41 12L18.3 7.10997C18.68 6.72997 18.68 6.08997 18.3 5.70997Z"></path>
                    </svg>
                  </div>
                  {selectedCrypto2 === "LJC" ||
                  selectedCrypto === "LJC" ||
                  selectedCrypto === "" ? (
                    <div className="flex mb-5 justify-between opacity-50 rounded-md">
                      <div className="flex items-center">
                        <img
                          src="/ljcrypto.webp"
                          alt=""
                          className="rounded-3xl w-10 mr-3 h-10"
                        />
                        <div className="flex text-bold flex-col">
                          <p className="leading-3">LJC</p>
                          <p>LJCrypto Token</p>
                        </div>
                      </div>
                      <span className="flex font-bold text-red-600 items-center">
                        {ljcryptoBalance}
                      </span>
                    </div>
                  ) : (
                    <div
                      onClick={toggleLJC2}
                      className="flex mb-5 justify-between hover:bg-shade cursor-pointer rounded-md"
                    >
                      <div className="flex items-center">
                        <img
                          src="/ljcrypto.webp"
                          alt=""
                          className="rounded-3xl w-10 mr-3 h-10"
                        />
                        <div className="flex text-bold flex-col">
                          <p className="leading-3">LJC</p>
                          <p>LJCrypto Token</p>
                        </div>
                      </div>
                      <span className="flex font-bold text-red-600 items-center">
                        {ljcryptoBalance}
                      </span>
                    </div>
                  )}
                  {selectedCrypto !== "LJS" &&
                  selectedCrypto2 !== "LJS" &&
                  selectedCrypto2 !== "" ? (
                    <div
                      onClick={toggleLJS2}
                      className="flex mb-5 justify-between rounded-md hover:bg-shade cursor-pointer"
                    >
                      <div className="flex items-center">
                        <img
                          src="/ljstable.png"
                          alt=""
                          className="rounded-3xl w-10 mr-3 h-10"
                        />
                        <div className="flex flex-col">
                          <p className="leading-3">LJS</p>
                          <p>LJStableCoin</p>
                        </div>
                      </div>
                      <span className="flex font-bold text-red-600 items-center">
                        {ljstablecoinBalance}
                      </span>
                    </div>
                  ) : (
                    <div className="flex mb-5 justify-between rounded-md opacity-50">
                      <div className="flex items-center">
                        <img
                          src="/ljstable.png"
                          alt=""
                          className="rounded-3xl w-10 mr-3 h-10"
                        />
                        <div className="flex flex-col">
                          <p className="leading-3">LJS</p>
                          <p>LJStableCoin</p>
                        </div>
                      </div>
                      <span className="flex font-bold text-red-600 items-center">
                        {ljstablecoinBalance}
                      </span>
                    </div>
                  )}
                  {selectedCrypto === "Polygon" ||
                  selectedCrypto2 === "Polygon" ? (
                    <div className="flex justify-between opacity-50">
                      <div className="flex items-center">
                        <img
                          src="/polygon-logo.png"
                          alt=""
                          className="rounded-3xl w-10 mr-3 h-10"
                        />
                        <div className="flex flex-col">
                          <p className="leading-3">MATIC</p>
                          <p>Polygon Matic</p>
                        </div>
                      </div>
                      <span className="flex font-bold text-red-600 items-center">
                        {maticBalance}
                      </span>
                    </div>
                  ) : (
                    <div
                      onClick={togglePolygon2}
                      className="flex justify-between rounded-md hover:bg-shade cursor-pointer"
                    >
                      <div className="flex items-center">
                        <img
                          src="/polygon-logo.png"
                          alt=""
                          className="rounded-3xl w-10 mr-3 h-10"
                        />
                        <div className="flex flex-col">
                          <p className="leading-3">MATIC</p>
                          <p>Polygon Matic</p>
                        </div>
                      </div>
                      <span className="flex font-bold text-red-600 items-center">
                        {maticBalance}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>
        </>
      )}
      {!loading && (
        <div className="flex flex-row justify-between mx-auto justify-self-center max-w-xs md:max-w-lg bg-black text-white rounded-2xl border border-solid border-yellow-400 relative top-20  pr-4 whitespace-nowrap overflow-x-scroll">
          <a className=" text-black font-semibold mr-4 px-2 rounded-3xl bg-yellow-400 flex items-center justify-center">
            Swap
          </a>
          <Link href="/lotterygame">
            <a className="pr-4 hover:text-yellow-500 cursor-pointer">
              Lottery Game
            </a>
          </Link>
          <Link href="/tokens">
            <a className="pr-4 hover:text-yellow-500 cursor-pointer">Tokens</a>
          </Link>
          <Link href="/nft">
            <a className="pr-4 hover:text-yellow-500 cursor-pointer">NFTs</a>
          </Link>
          <Link href="/guessinggame">
            <a className="pr-4 hover:text-yellow-500 cursor-pointer">
              Guessing Game
            </a>
          </Link>
          <Link href="/liquiditypools">
            <a className="pr-4 hover:text-yellow-500 cursor-pointer">
              Liquidity Pools
            </a>
          </Link>
          <Link href="/dao">
            <a className="pr-4 hover:text-yellow-500 cursor-pointer">
              Governance
            </a>
          </Link>
        </div>
      )}
    </main>
  );
};

export default Swap;