import React, {useState, useContext, useEffect} from 'react'
import Link from "next/link";
import {Web3Context, useWeb3} from "../context"
import { providers, Contract, BigNumber, ethers } from "ethers";

import {NFT_COLLECTION_ABI, NFT_COLLECTION_ADDRESS} from "../constants/nft"


type IState = {
  nftBalanceOne: string;
  setNftBalanceOne: React.Dispatch<React.SetStateAction<string>>;
};

function NFT() {
  const { account, connectWallet, numberIsZero, setNumberIsZero, getProviderOrSigner, getAddress } = useContext(Web3Context) as useWeb3;

  const [nftBalanceOne, setNftBalanceOne] = useState("0");
  const [nftBalanceTwo, setNftBalanceTwo] = useState("0");
  const [nftBalanceThree, setNftBalanceThree] = useState("0");
  const [nftBalanceFour, setNftBalanceFour] = useState("0");
  const [nftBalanceFive, setNftBalanceFive] = useState("0");
  const [nftBalanceSix, setNftBalanceSix] = useState("0");
  const [nftBalanceSeven, setNftBalanceSeven] = useState("0");
  const [nftBalanceEight, setNftBalanceEight] = useState("0");
  const [nftBalanceNine, setNftBalanceNine] = useState("0");
  const [nftBalanceTen, setNftBalanceTen] = useState("0");
   const [totalBalance, setTotalBalance] = useState("0");

  const getNFTContractInstance = (providerOrSigner: providers.Web3Provider | providers.JsonRpcSigner) => {
    return new Contract(
      NFT_COLLECTION_ADDRESS,
      NFT_COLLECTION_ABI,
      providerOrSigner
    );
  };

  const isNumberAboveZero = async (): Promise<boolean> => {
      const provider = await getProviderOrSigner(true);
      const contract = getNFTContractInstance(provider);
      const value = await contract.numberAboveZero();
      setNumberIsZero(value);
      return value;
  };

  const totalNFTBalance = async() => {
    try {
       const provider = await getProviderOrSigner(true);
       const contract = getNFTContractInstance(provider);
       const value = await contract.totalNFTBalance();
       setTotalBalance(BigNumber.from(value).toString());
       return BigNumber.from(value).toString();
    } catch (error) {
      
    }
  }

  const fetchNFTBalances = async() => {
    const provider = await getProviderOrSigner(true);
    const contract = getNFTContractInstance(provider);
    const thisAccount = getAddress()
    const balanceOne =  await contract.balanceOf(thisAccount, 0);
    setNftBalanceOne(BigNumber.from(balanceOne).toString())
    const balanceTwo = await contract.balanceOf(thisAccount, 1);
    setNftBalanceTwo(BigNumber.from(balanceTwo).toString());
    const balanceThree = await contract.balanceOf(thisAccount, 2);
    setNftBalanceThree(BigNumber.from(balanceThree).toString());
    const balanceFour = await contract.balanceOf(thisAccount, 3);
    setNftBalanceFour(BigNumber.from(balanceFour).toString());
    const balanceFive = await contract.balanceOf(thisAccount, 4);
    setNftBalanceFive(BigNumber.from(balanceFive).toString());
    const balanceSix = await contract.balanceOf(thisAccount, 5);
    setNftBalanceSix(BigNumber.from(balanceSix).toString());
    const balanceSeven = await contract.balanceOf(thisAccount, 6);
    setNftBalanceSeven(BigNumber.from(balanceSeven).toString());
    const balanceEight = await contract.balanceOf(thisAccount, 7);
    setNftBalanceEight(BigNumber.from(balanceEight).toString());
    const balanceNine = await contract.balanceOf(thisAccount, 8);
    setNftBalanceNine(BigNumber.from(balanceNine).toString());
     const balanceTen = await contract.balanceOf(thisAccount, 9);
     setNftBalanceTen(BigNumber.from(balanceTen).toString());
  }

  const mintToken = async() => {
    try {
       const provider = await getProviderOrSigner(true);
       const contract = getNFTContractInstance(provider);
       const tx = await contract.mintToken({value: ethers.utils.parseEther("0.01")});
       tx.wait()
    } catch (error) {
      console.log(error)
      window.alert("Either A Random Id Hasn't Been Generated Yet Or You Don't Have Enough Funds To Mint NFT")
    }
  }
    

useEffect(() => {
    setInterval(async function () {
      await isNumberAboveZero();
      await fetchNFTBalances()
      await totalNFTBalance()
    }, 0.5 * 1000);
})

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
      <div className="flex items-center h-32 w-auto bg-black rounded-2xl relative top-10 mb-16">
        <div className="flex items-center text-yellow-500 mx-auto sm:text-lg text-xl font-bold uppercase px-4">
          <p className="">Buy, Transfer, Burn, Stake, And Breed NFTS!!!</p>
        </div>
      </div>
      <div className="flex mt-5 justify-start w-120 md:mx-auto items-center rounded-md px-2 h-8 bg-yellow-500 ml-4 font-semibold mb-5  whitespace-nowrap">
        NFT Balances:
      </div>
      <div className="flex flex-col justify-between h-auto w-80 md:mx-auto bg-black rounded-md ml-4 relative top-7 mb-20">
        <div className="flex ml-3 md:mx-auto md:text-xl">
          {totalBalance === "0" ? (
            <p className="text-yellow-500 font-semibold capitalize">
              <span>You Have No Minted Tokens</span>
            </p>
          ) : (
            <p className="text-yellow-500 font-semibold capitalize">
              Total NFT Balance: <span>{totalBalance}</span>
            </p>
          )}
        </div>
        <div className="flex ml-3 md:mx-auto md:text-xl">
          {nftBalanceOne !== "0" && (
            <p className="text-yellow-500 font-semibold capitalize">
              TIER1: <span>{nftBalanceOne} TOKENS</span>
            </p>
          )}
        </div>
        <div className="flex mt-5 ml-3 md:mx-auto md:text-xl">
          {nftBalanceTwo !== "0" && (
            <p className="text-yellow-500 font-semibold capitalize">
              TIER2: <span>{nftBalanceTwo} TOKENS</span>
            </p>
          )}
        </div>
        <div className="flex mt-5 ml-3 md:mx-auto md:text-xl">
          {nftBalanceThree !== "0" && (
            <p className="text-yellow-500 font-semibold capitalize">
              TIER3: <span>{nftBalanceThree} TOKENS</span>
            </p>
          )}
        </div>
        <div className="flex mt-5 ml-3 md:mx-auto md:text-xl">
          {nftBalanceFour !== "0" && (
            <p className="text-yellow-500 font-semibold capitalize">
              TIER4: <span>{nftBalanceFour} TOKENS</span>
            </p>
          )}
        </div>
        <div className="flex mt-5 ml-3 md:mx-auto md:text-xl">
          {nftBalanceFive !== "0" && (
            <p className="text-yellow-500 font-semibold capitalize">
              TIER5: <span>{nftBalanceFive} TOKENS</span>
            </p>
          )}
        </div>
        <div className="flex mt-5 ml-3 md:mx-auto md:text-xl">
          {nftBalanceSix !== "0" && (
            <p className="text-yellow-500 font-semibold capitalize">
              TIER6: <span>{nftBalanceSix} TOKENS</span>
            </p>
          )}
        </div>
        <div className="flex mt-5 ml-3 md:mx-auto md:text-xl">
          {nftBalanceSeven !== "0" && (
            <p className="text-yellow-500 font-semibold capitalize">
              TIER7: <span>{nftBalanceSeven} TOKENS</span>
            </p>
          )}
        </div>
        <div className="flex mt-5 ml-3 md:mx-auto md:text-xl">
          {nftBalanceEight !== "0" && (
            <p className="text-yellow-500 font-semibold capitalize">
              TIER8: <span>{nftBalanceEight} TOKENS</span>
            </p>
          )}
        </div>
        <div className="flex mt-5 ml-3 md:mx-auto md:text-xl">
          {nftBalanceNine !== "0" && (
            <p className="text-yellow-500 font-semibold capitalize">
              TIER9: <span>{nftBalanceNine} TOKENS</span>
            </p>
          )}
        </div>
        <div className="flex mt-5 ml-3 md:mx-auto md:text-xl">
          {nftBalanceTen !== "0" && (
            <p className="text-yellow-500 font-semibold capitalize">
              TIER10: <span>{nftBalanceTen} TOKENS</span>
            </p>
          )}
        </div>
      </div>
      <div className="flex mt-5 justify-start w-36 md:mx-auto items-center rounded-md px-2 h-8 bg-yellow-500 ml-4 font-semibold mb-5  whitespace-nowrap">
        Mint Random NFT:
      </div>
      <p className="text-black text-2xl italic mt-3 font-bold uppercase mx-auto px-4 mb-5">
        NFTs cost 0.01 MATIC
      </p>
      {numberIsZero === false ? (
        <p className="text-white text-2xl font-bold uppercase mx-auto px-4 mb-10">
          Please Wait Until a Random Id Has Been Generated
        </p>
      ) : (
        <p className="text-white text-2xl ml-4 font-bold uppercase mx-auto mb-10">
          You can now mint an nft!!!
        </p>
      )}
      {numberIsZero === false ? (
        <button className="rounded-2xl ml-4 mx-auto opacity-50 md:relative md:left-20 bg-black text-yellow-500 h-8 shadow-button w-40 font-bold transition ease-in-out mb-12">
          Mint NFT
        </button>
      ) : (
        <button
          onClick={mintToken}
          className="rounded-2xl ml-4 mx-auto md:relative md:left-20 bg-black text-yellow-500 h-8 shadow-button w-40 font-bold transition ease-in-out hover:text-white mb-12"
        >
          Mint NFT
        </button>
      )}
      {/* How Much it cost to mint NFT, Total NFT Balance, NFT Staking Requirement, NFT Balance For Individual NFTs */}
    </main>
  );
}

export default NFT


 {/* <p className="text-yellow-500 font-semibold capitalize">
            <div className="flex flex-col">
              {nftBalances.map((balance, index) => {
                return <span key={index}>{balance}</span>;
              })}
            </div>
            {/* TIER1: <span>0 TOKENS</span> </p>*/}

            // const fetchNFTBalances = async () => {
            //   const provider = await getProviderOrSigner(true);
            //   const contract = getNFTContractInstance(provider);
            //   const thisAccount = getAddress();
            //   let balances: any = [];
            //   for (let i = 0; i < 10; i++) {
            //     const balance = await contract.balanceOf(thisAccount, i);
            //     balances.push(ethers.utils.formatEther(balance));
            //     setNftBalance(balances);
            //   }
            //   console.log(balances);
            // };
