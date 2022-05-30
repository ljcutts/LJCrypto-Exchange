import React, { useState, useContext, useEffect, useRef } from "react";
import Link from "next/link";
import { Web3Context, useWeb3 } from "../context";
import { providers, Contract, BigNumber, ethers } from "ethers";
import styles from "../styles/Home.module.css";

import {
  LJCRYPTO_TOKEN_ABI,
  LJCRYPTO_TOKEN_ADDRESS,
} from "../constants/ljcryptotoken";

import {
  LJSTABLE_COIN_ABI,
  LJSTABLE_COIN_ADDRESS,
} from "../constants/ljstablecoin";

import {LJC_LJS_ABI, LJC_LJS_ADDRESS} from  "../constants/ljcryptoandstablepair"



const LiquidityPools: React.FC = () => {
const {account, connectWallet, getProviderOrSigner, getAddress, loading, setLoading} = useContext(Web3Context) as useWeb3;
const [pairModal, setPairModal] = useState(false)
const [changeLiquidityPair, setChangeLiquidityPair] = useState("")
const [tab, setTab] = useState("")
const [ljcryptoBalance, setLJCryptoBalance] = useState("0");
const [ljstablecoinBalance, setLJStableCoinBalance] = useState("0");
const [maticBalance, setMaticBalance] = useState("0");
const [amountOne, setAmountOne] = useState("0")
const [amountTwo, setAmountTwo] = useState("0");
const [howMuchLJCrypto, setHowMuchLJCrypto] = useState("0")
const [howMuchLJStable, setHowMuchLJStable] = useState("0");



const pairToggle = () => {
  setPairModal(!pairModal)
}

const toggleOutside = () => {
  if(pairModal === true) {
    setPairModal(false)
  }
}

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
  return new Contract(
    LJC_LJS_ADDRESS,
    LJC_LJS_ABI,
    providerOrSigner
  );
};

const getBalances = async() => {
   const provider = window.ethereum;
   const web3Provider = new providers.Web3Provider(provider).getSigner();
   const maticBalance = await web3Provider.getBalance()
   const ljcryptocontract = getLJCryptoTokenInstance(web3Provider);
  const ljstablecontract = getLJStableCoinInstance(web3Provider);
  const currentAccount = await getAddress();
  const valueOne = await ljcryptocontract.balanceOf(currentAccount);
  const valueTwo = await ljstablecontract.balanceOf(currentAccount);
   setLJCryptoBalance(parseInt(ethers.utils.formatEther(valueOne).toString()).toFixed(2));
   setLJStableCoinBalance(ethers.utils.formatEther(valueTwo))
   setMaticBalance(parseInt(ethers.utils.formatEther(maticBalance).toString()).toFixed(2));
}


const calculateAmount = async() => {
  let amountNeeded
  var re = new RegExp("^-?\\d+(?:.\\d{0," + (10 || -1) + "})?");
   const provider = window.ethereum;
   const web3Provider = new providers.Web3Provider(provider).getSigner();
   const contract = getLJCryptoTokenInstance(web3Provider);
   const value = await contract.currentPricePerToken();
  const ljstablePrice = 0.0004;
  //maybe use the wei units instead
  const ljcryptoPrice = ethers.utils.formatEther(value)
  if(amountTwo !== "0" && amountOne === "0") {
     const ljstableAmount = ljstablePrice * parseInt(amountTwo)
     amountNeeded = ljstableAmount / parseInt(ljcryptoPrice);
     setHowMuchLJCrypto(parseInt(amountNeeded.toString()).toFixed(2))
    console.log("amount", amountNeeded)
    console.log("ljcryptoPrice", parseInt(ljcryptoPrice) * 4)
    console.log(BigNumber.from(ethers.utils.parseEther(`0.0004`)).toString())
  } else if(amountOne !== "0" && amountTwo === "0") {
    const ljcryptoAmount = parseInt(ljcryptoPrice) * parseInt(amountOne)
    const amountNeeded2 = ljcryptoAmount/ljstablePrice
  } 
  
}

const addLJSLJCLiquidity = async(amountOne:string, amountTwo:string) => {
  try {
      setLoading(true);
      const signer = await getProviderOrSigner(true);
      const contract = getLJCJStablePairInstance(signer);
      const tx = await contract.addLiquidity(amountOne, amountTwo);
      await tx.wait();
      window.alert(`You Have Added Liquidity To The LJC/LJS Pair`);
      setLoading(false);
  } catch (error:any) {
     setLoading(false);
     console.log(error);
     window.alert(error.data.message);
  }
}

const renderTabs = () => {
  if(tab === "" || tab === "Add Liquidity") {
      if (changeLiquidityPair === "LJCrypto/LJStable" || changeLiquidityPair === "") {
        return (
          <>
            <div className="h-28 w-80 flex bg-yellow-500 rounded-2xl mb-2">
              <input
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setAmountOne(e.target.value)
                }
                className="pt-4 placeholder:text-black placeholder:opacity-60 font-semibold pl-4 bg-transparent mb-2 relative top-3 w-40 h-20 text-3xl outline-none pb-16 "
                type="number"
                placeholder={howMuchLJCrypto}
              />
              <div className="flex flex-col item-center pl-2 pt-3 w-40">
                <div className="flex items-center pr-3 pb-3 justify-end text-black font-semibold">
                  <img
                    src="/ljcrypto.webp"
                    alt=""
                    className="rounded-3xl w-10 mr-3 h-10"
                  />
                  LJC
                </div>
                <div className="flex items-center font-semibold text-base pr-3 justify-end text-black">
                  Balance:
                  <span className="pl-1  text-ellipsis font-bold text-red-600">
                    {ljcryptoBalance}
                  </span>
                </div>
              </div>
            </div>
            <div className="h-28 w-80 flex bg-yellow-500 rounded-2xl mb-2">
              <input
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setAmountTwo(e.target.value)
                }
                className="pt-4 placeholder:text-black placeholder:opacity-60 font-semibold pl-4 bg-transparent mb-2 relative top-3 w-40 h-20 text-3xl outline-none pb-16 "
                type="number"
                placeholder="0"
              />
              <div className="flex flex-col item-center pl-2 pt-3 w-40">
                <div className="flex items-center pr-3 pb-3 justify-end text-black font-semibold">
                  <img
                    src="/ljstable.png"
                    alt=""
                    className="rounded-3xl w-10 mr-3 h-10"
                  />
                  LJS
                </div>
                <div className="flex items-center font-semibold text-base pr-3 justify-end text-black">
                  Balance:
                  <span className="pl-1 font-bold text-red-600">
                    {ljstablecoinBalance}
                  </span>
                </div>
              </div>
            </div>
          </>
        );
      }
      if (changeLiquidityPair === "LJCrypto/Polygon") {
        return (
          <>
            <div className="h-28 w-80 flex bg-yellow-500 rounded-2xl mb-2">
              <input
                className="pt-4 placeholder:text-black placeholder:opacity-60 font-semibold pl-4 bg-transparent mb-2 relative top-3 w-40 h-20 text-3xl outline-none pb-16 "
                type="number"
                placeholder="0"
              />
              <div className="flex flex-col item-center pl-2 pt-3 w-40">
                <div className="flex items-center pr-3 pb-3 justify-end text-black font-semibold">
                  <img
                    src="/ljcrypto.webp"
                    alt=""
                    className="rounded-3xl w-10 mr-3 h-10"
                  />
                  LJC
                </div>
                <div className="flex items-center font-semibold text-base pr-3 justify-end text-black">
                  Balance:
                  <span className="pl-1 font-bold text-red-600">{ljcryptoBalance}</span>
                </div>
              </div>
            </div>
            <div className="h-28 w-80 flex bg-yellow-500 rounded-2xl mb-2">
              <input
                className="pt-4 placeholder:text-black placeholder:opacity-60 font-semibold pl-4 bg-transparent mb-2 relative top-3 w-40 h-20 text-3xl outline-none pb-16 "
                type="number"
                placeholder="0"
              />
              <div className="flex flex-col item-center pl-2 pt-3 w-40">
                <div className="flex items-center pr-3 pb-3 justify-end text-black font-semibold">
                  <img
                    src="/polygon-logo.png"
                    alt=""
                    className="rounded-3xl w-10 mr-3 h-10"
                  />
                  Matic
                </div>
                <div className="flex items-center font-semibold text-base pr-3 justify-end text-black">
                  Balance:
                  <span className="pl-1 font-bold text-red-600">{maticBalance}</span>
                </div>
              </div>
            </div>
          </>
        );
      }
      if(changeLiquidityPair === "LJStable/Polygon") {
        return (
          <>
            <div className="h-28 w-80 flex bg-yellow-500 rounded-2xl mb-2">
              <input
                className="pt-4 placeholder:text-black placeholder:opacity-60 font-semibold pl-4 bg-transparent mb-2 relative top-3 w-40 h-20 text-3xl outline-none pb-16 "
                type="number"
                placeholder="0"
              />
              <div className="flex flex-col item-center pl-2 pt-3 w-40">
                <div className="flex items-center pr-3 pb-3 justify-end text-black font-semibold">
                  <img
                    src="/ljstable.png"
                    alt=""
                    className="rounded-3xl w-10 mr-3 h-10"
                  />
                  LJS
                </div>
                <div className="flex items-center font-semibold text-base pr-3 justify-end text-black">
                  Balance:
                  <span className="pl-1 font-bold text-red-600">{ljstablecoinBalance}</span>
                </div>
              </div>
            </div>
            <div className="h-28 w-80 flex bg-yellow-500 rounded-2xl mb-2">
              <input
                className="pt-4 placeholder:text-black placeholder:opacity-60 font-semibold pl-4 bg-transparent mb-2 relative top-3 w-40 h-20 text-3xl outline-none pb-16 "
                type="number"
                placeholder="0"
              />
              <div className="flex flex-col item-center pl-2 pt-3 w-40">
                <div className="flex items-center pr-3 pb-3 justify-end text-black font-semibold">
                  <img
                    src="/polygon-logo.png"
                    alt=""
                    className="rounded-3xl w-10 mr-3 h-10"
                  />
                  Matic
                </div>
                <div className="flex items-center font-semibold text-base pr-3 justify-end text-black">
                  Balance:
                  <span className="pl-1 font-bold text-red-600">{maticBalance}</span>
                </div>
              </div>
            </div>
          </>
        );
      }
  }
}

useEffect(() => {
  getBalances()
})

useEffect(() => {
 calculateAmount()
}, [amountOne, amountTwo])

  return (
    <main
      onClick={toggleOutside}
      className="bg-gradient-to-r from-yellow-300 to-black bg-no-repeat bg-[length:auto_100%] h-screen overflow-y-scroll"
    >
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
      <div className="flex items-center h-32 w-auto bg-black rounded-2xl relative top-10 mb-20">
        <div className="flex items-center text-yellow-500 mx-auto sm:text-lg text-xl font-bold uppercase px-4">
          <p>
            LiquidityPools: Become An Automatic Market Maker And Add/Remove
            Liquidity
          </p>
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
          <div className="flex mx-auto justify-between h-12 w-full  md:w-900 bg-yellow-500 rounded-3xl">
            <button className="md:w-107 w-1/3 rounded-3xl font-bold h-12 bg-black text-yellow-500">
              Add Liquidity
            </button>
            <button className="md:w-107 w-1/3 whitespace-nowrap font-bold rounded-3xl h-12 text-black">
              Remove Liquidity
            </button>
            <button className="md:w-107 w-1/3 rounded-3xl h-12 font-bold text-black">
              Stats
            </button>
          </div>
          <p className="text-xl md:text-center md:text-xl uppercase font-bold ml-4 mt-10 mb-3 text-white">
            Select Liquidity Pair:
          </p>
          <section className="flex items-center md:mx-auto whitespace-nowrap ml-4 mb-10 h-10 w-64 rounded-2xl bg-black text-yellow-500">
            {(changeLiquidityPair === "LJCrypto/LJStable" ||
              changeLiquidityPair === "") && (
              <div className="flex font-semibold items-center pl-2 pr-2 hover:bg-shade2 rounded-2xl">
                <img
                  src="/ljcrypto.webp"
                  alt=""
                  className=" rounded-3xl w-7 h-7"
                />
                <img
                  src="/ljstable.png"
                  alt=""
                  className=" rounded-3xl w-7 h-7 relative right-2"
                />
                LJCrypto/LJStable
              </div>
            )}
            {changeLiquidityPair === "LJCrypto/Polygon" && (
              <div className="flex font-semibold items-center pl-2 pr-2 hover:bg-shade2 rounded-2xl">
                <img
                  src="/ljcrypto.webp"
                  alt=""
                  className=" rounded-3xl w-7 h-7"
                />
                <img
                  src="/polygon-logo.png"
                  alt=""
                  className=" rounded-3xl w-7 h-7 relative right-2"
                />
                LJCrypto/Polygon
              </div>
            )}
            {changeLiquidityPair === "LJStable/Polygon" && (
              <div className="flex font-semibold items-center pl-2 pr-2 hover:bg-shade2 rounded-2xl">
                <img
                  src="/ljstable.png"
                  alt=""
                  className=" rounded-3xl w-7 h-7"
                />
                <img
                  src="/polygon-logo.png"
                  alt=""
                  className=" rounded-3xl w-7 h-7 relative right-2"
                />
                LJStable/Polygon
              </div>
            )}
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
              onClick={pairToggle}
              className="cursor-pointer hover:opacity-50"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </section>
          {pairModal && (
            <section className="w-64 h-auto md:mx-auto bg-yellow-500 ml-4 mt-3 p-3 mb-5 whitespace-nowrap text-base rounded-2xl">
              <div
                onClick={() => setChangeLiquidityPair("LJCrypto/LJStable")}
                className="flex font-semibold items-center mb-2 hover:bg-shade2 cursor-pointer rounded-2xl"
              >
                <img
                  src="/ljcrypto.webp"
                  alt=""
                  className=" rounded-3xl w-7 h-7"
                />
                <img
                  src="/ljstable.png"
                  alt=""
                  className=" rounded-3xl w-7 h-7 relative right-2"
                />
                LJCrypto/LJStable Pair
              </div>
              <div
                onClick={() => setChangeLiquidityPair("LJCrypto/Polygon")}
                className="flex font-semibold items-center hover:bg-shade2 cursor-pointer mb-2 rounded-2xl"
              >
                <img
                  src="/ljcrypto.webp"
                  alt=""
                  className=" rounded-3xl w-7 h-7"
                />
                <img
                  src="/polygon-logo.png"
                  alt=""
                  className=" rounded-3xl w-7 h-7 relative right-2"
                />
                LJCrypto/Polygon Pair
              </div>
              <div
                onClick={() => setChangeLiquidityPair("LJStable/Polygon")}
                className="flex font-semibold items-center hover:bg-shade2 cursor-pointer rounded-2xl"
              >
                <img
                  src="/ljstable.png"
                  alt=""
                  className=" rounded-3xl w-7 h-7"
                />
                <img
                  src="/polygon-logo.png"
                  alt=""
                  className=" rounded-3xl w-7 h-7 relative right-2"
                />
                LJStable/Polygon Pair
              </div>
            </section>
          )}
          <div className="w-80 h-56 flex flex-col md:mx-auto items-center rounded-2xl mb-5 ml-4 bg-transparent">
            {renderTabs()}
          </div>
          <div className="ml-4 md:flex md:justify-center md:ml-0">
            {tab === "" || tab === "Add Liquidity" ? (
              <button className="h-14 w-80 rounded-2xl bg-black font-semibold hover:text-white text-yellow-500">
                Add Liquidity
              </button>
            ) : (
              <button className="h-14 w-80 rounded-2xl bg-black font-semibold hover:text-white text-yellow-500">
                Remove Liquidity
              </button>
            )}
          </div>
        </>
      )}
    </main>
  );
};

export default LiquidityPools