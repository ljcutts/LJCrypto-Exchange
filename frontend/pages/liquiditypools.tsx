import React, { useState, useContext, useEffect, useRef } from "react";
import Link from "next/link";
import { Web3Context, useWeb3 } from "../context";
import { providers, Contract, BigNumber, ethers } from "ethers";
import styles from "../styles/Home.module.css";


const LiquidityPools: React.FC = () => {
const { account, connectWallet, getProviderOrSigner, getAddress, loading, setLoading} = useContext(Web3Context) as useWeb3;
const [pairModal, setPairModal] = useState(false)
const [changeLiquidityPair, setChangeLiquidityPair] = useState("")

const pairToggle = () => {
  setPairModal(!pairModal)
}

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
      <div className="flex items-center h-32 w-auto bg-black rounded-2xl relative top-10 mb-20">
        <div className="flex items-center text-yellow-500 mx-auto sm:text-lg text-xl font-bold uppercase px-4">
          <p>
            LiquidityPools: Become An Automatic Market Maker And Add/Remove
            Liquidity
          </p>
        </div>
      </div>
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
      <section className="flex items-center md:mx-auto whitespace-nowrap ml-4 h-10 w-64 rounded-2xl bg-black text-yellow-500">
        {(changeLiquidityPair === "LJCrypto/LJStable" ||
          changeLiquidityPair === "") && (
          <div className="flex font-semibold items-center pl-2 pr-2 hover:bg-shade2 rounded-2xl">
            <img src="/ljcrypto.webp" alt="" className=" rounded-3xl w-7 h-7" />
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
            <img src="/ljcrypto.webp" alt="" className=" rounded-3xl w-7 h-7" />
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
            <img src="/ljstable.png" alt="" className=" rounded-3xl w-7 h-7" />
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
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          onClick={pairToggle}
          className="cursor-pointer"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </section>
      {pairModal && (
        <section className="w-64 h-auto md:mx-auto bg-yellow-500 ml-4 mt-3 p-3 whitespace-nowrap text-base rounded-2xl">
          <div
            onClick={() => setChangeLiquidityPair("LJCrypto/LJStable")}
            className="flex font-semibold items-center mb-2 hover:bg-shade2 cursor-pointer rounded-2xl"
          >
            <img src="/ljcrypto.webp" alt="" className=" rounded-3xl w-7 h-7" />
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
            <img src="/ljcrypto.webp" alt="" className=" rounded-3xl w-7 h-7" />
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
            <img src="/ljstable.png" alt="" className=" rounded-3xl w-7 h-7" />
            <img
              src="/polygon-logo.png"
              alt=""
              className=" rounded-3xl w-7 h-7 relative right-2"
            />
            LJStable/Polygon Pair
          </div>
        </section>
      )}
    </main>
  );
};

export default LiquidityPools