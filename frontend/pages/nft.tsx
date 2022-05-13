import React, {useState, useContext, useEffect} from 'react'
import Link from "next/link";
import {Web3Context, useWeb3} from "../context"
import { providers, Contract, BigNumber, ethers } from "ethers";
import styles from "../styles/Home.module.css";

import {NFT_COLLECTION_ABI, NFT_COLLECTION_ADDRESS} from "../constants/nft"
import {NFT_STAKING_ABI, NFT_STAKING_ADDRESS} from "../constants/nftstaking"


type IState = {
  nftBalanceOne: string;
  setNftBalanceOne: React.Dispatch<React.SetStateAction<string>>;
  thisAmount: string
  setAmount: React.Dispatch<React.SetStateAction<string>>
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
  const [stakedNFTOne, setStakedNFTOne] = useState("0");
  const [stakedNFTTwo, setStakedNFTTwo] = useState("0");
  const [stakedNFTThree, setStakedNFTThree] = useState("0");
  const [stakedNFTFour, setStakedNFTFour] = useState("0");
  const [stakedNFTFive, setStakedNFTFive] = useState("0");
  const [stakedNFTSix, setStakedNFTSix] = useState("0");
  const [stakedNFTSeven, setStakedNFTSeven] = useState("0");
  const [stakedNFTEight, setStakedNFTEight] = useState("0");
  const [stakedNFTNine, setStakedNFTNine] = useState("0");
  const [stakedNFTTen, setStakedNFTTen] = useState("0");
  const [stakedNFTEleven, setStakedNFTEleven] = useState("0");
  const [stakingTab, setStakingTab] = useState(false);
  const [unstakingTab, setUnstakingTab] = useState(false);
  const [thisAmount, setAmount] = useState<IState["thisAmount"]>("");
  const [myStakingBalance, setStakingBalance] = useState("0")
  const [claimRewards, setClaimRewards] = useState(false)
  const [howMuch, setHowMuch] = useState(0)

  const toggleStaking = () => {
    setStakingTab(!stakingTab)
  }

  const toggleUnstaking = () => {
    setUnstakingTab(!unstakingTab);
  };

   const toggleRewards = () => {
     setClaimRewards(!claimRewards);
   };

  const getNFTContractInstance = (providerOrSigner: providers.Web3Provider | providers.JsonRpcSigner) => {
    return new Contract(
      NFT_COLLECTION_ADDRESS,
      NFT_COLLECTION_ABI,
      providerOrSigner
    );
  };

  const getNFTStakingContractInstance = (
    providerOrSigner: providers.Web3Provider | providers.JsonRpcSigner
  ) => {
    return new Contract(
      NFT_STAKING_ADDRESS,
      NFT_STAKING_ABI,
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

  const getStakingBalance = async(): Promise<string> => {
     const provider = await getProviderOrSigner(true);
     const contract = getNFTStakingContractInstance(provider);
     const value = await contract.checkStakingBalance()
     setStakingBalance(BigNumber.from(value).toString());
     return BigNumber.from(value).toString();
  }

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

  const updateStakingBalance = async() => {
    try {
         const provider = await getProviderOrSigner(true);
         const contract = getNFTStakingContractInstance(provider);
         const tx = await contract.updateStakingBalance();
         tx.wait();
    } catch (error: any) {
      console.log(error)
      window.alert(error.data.message)
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

  const fetchStakedNFTBalances = async() => {
    const provider = await getProviderOrSigner(true);
    const contract = getNFTStakingContractInstance(provider);
    const balanceOne = await contract.checkStakedNFTs(0)
    setStakedNFTOne(BigNumber.from(balanceOne).toString())
    const balanceTwo = await contract.checkStakedNFTs(1);
    setStakedNFTTwo(BigNumber.from(balanceTwo).toString());
    const balanceThree = await contract.checkStakedNFTs(2);
    setStakedNFTThree(BigNumber.from(balanceThree).toString());
    const balanceFour = await contract.checkStakedNFTs(3);
    setStakedNFTFour(BigNumber.from(balanceFour).toString());
    const balanceFive = await contract.checkStakedNFTs(4);
    setStakedNFTFive(BigNumber.from(balanceFive).toString());
    const balanceSix = await contract.checkStakedNFTs(5);
    setStakedNFTSix(BigNumber.from(balanceSix).toString());
    const balanceSeven = await contract.checkStakedNFTs(6);
    setStakedNFTSeven(BigNumber.from(balanceSeven).toString());
    const balanceEight = await contract.checkStakedNFTs(7);
    setStakedNFTEight(BigNumber.from(balanceEight).toString());
    const balanceNine = await contract.checkStakedNFTs(8);
    setStakedNFTNine(BigNumber.from(balanceNine).toString());
    const balanceTen = await contract.checkStakedNFTs(9);
    setStakedNFTTen(BigNumber.from(balanceTen).toString());
    const balanceEleven = await contract.checkStakedNFTs(10);
    setStakedNFTEleven(BigNumber.from(balanceEleven).toString());
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

  const isFundsApproved = async(): Promise<boolean> => {
     const provider = await getProviderOrSigner(true);
     const contract = getNFTContractInstance(provider);
     const thisAccount = await getAddress()
     const value = await contract.isApprovedForAll(thisAccount, NFT_STAKING_ADDRESS);
     return value;
  }

  const approveStakingContract = async() => {
    try {
       const provider = await getProviderOrSigner(true);
       const nftContract = getNFTContractInstance(provider);
       await nftContract.setApprovalForAll(NFT_STAKING_ADDRESS, true);
    } catch (error) {
      console.log(error)
    }
  }

  const claimAmount = async() => {
    let amount = BigNumber.from(0).toNumber()
     const provider = await getProviderOrSigner(true);
     const contract = getNFTStakingContractInstance(provider);
    for (let i = 0; i < 10; i++) {
      const value = await contract.checkStakedNFTs([i])
      amount += BigNumber.from(value).toNumber()
    }
    const totalAmount = amount
     const stakingBalance = await contract.checkStakingBalance();
     const difference = BigNumber.from(stakingBalance).toNumber() - BigNumber.from(totalAmount).toNumber()
     if(difference === 0 || difference < 0) {
       setHowMuch(0)
     } else {
       setHowMuch(difference)
     }
    // console.log("totalAmount", BigNumber.from(totalAmount).toNumber())
    // console.log("Difference", difference)
    return totalAmount
  }

  const claimStakingRewards = async(amount: string) => {
    try {
       const provider = await getProviderOrSigner(true);
       const contract = getNFTStakingContractInstance(provider);
       const tx = await contract.claimNFTStakingRewards(amount);
       tx.wait();
    } catch (error:any) {
      console.log(error)
      window.alert(error.data.message)
    }
  }

  const stakeNFTs = async(amount: string) => {
         const value = await isFundsApproved()
         if(value === false) {
           await approveStakingContract();
         } 
          try {
            const provider = await getProviderOrSigner(true);
            const contract = getNFTStakingContractInstance(provider);
            const split = amount.split(",");
            const tx = await contract.stakeNFTs(split);
            tx.wait();
          } catch (error:any) {
            console.log(error);
            window.alert(
              error.data.message
            );
          } 
  }

  const unstakeNFTs = async(amount: string) => {
    try {
        const provider = await getProviderOrSigner(true);
        const contract = getNFTStakingContractInstance(provider);
        const split = amount.split(",");
        const tx = await contract.unstakeNFTs(split);
        tx.wait();
    } catch (error:any) {
      console.log(error)
      window.alert(error.data.message)
    }
  }

   const handleChange = (
     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
   ) => {
     setAmount(e.target.value);
   };
    

useEffect(() => {
    setInterval(async function () {
      await isNumberAboveZero();
      await fetchNFTBalances()
      await totalNFTBalance()
      await getStakingBalance()
      await fetchStakedNFTBalances()
      await claimAmount()
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
              TIER1(ID 0): <span>{nftBalanceOne} TOKENS</span>
            </p>
          )}
        </div>
        <div className="flex mt-5 ml-3 md:mx-auto md:text-xl">
          {nftBalanceTwo !== "0" && (
            <p className="text-yellow-500 font-semibold capitalize">
              TIER2(ID 1): <span>{nftBalanceTwo} TOKENS</span>
            </p>
          )}
        </div>
        <div className="flex mt-5 ml-3 md:mx-auto md:text-xl">
          {nftBalanceThree !== "0" && (
            <p className="text-yellow-500 font-semibold capitalize">
              TIER3(ID 2): <span>{nftBalanceThree} TOKENS</span>
            </p>
          )}
        </div>
        <div className="flex mt-5 ml-3 md:mx-auto md:text-xl">
          {nftBalanceFour !== "0" && (
            <p className="text-yellow-500 font-semibold capitalize">
              TIER4(ID 3): <span>{nftBalanceFour} TOKENS</span>
            </p>
          )}
        </div>
        <div className="flex mt-5 ml-3 md:mx-auto md:text-xl">
          {nftBalanceFive !== "0" && (
            <p className="text-yellow-500 font-semibold capitalize">
              TIER5(ID 4): <span>{nftBalanceFive} TOKENS</span>
            </p>
          )}
        </div>
        <div className="flex mt-5 ml-3 md:mx-auto md:text-xl">
          {nftBalanceSix !== "0" && (
            <p className="text-yellow-500 font-semibold capitalize">
              TIER6(ID 5): <span>{nftBalanceSix} TOKENS</span>
            </p>
          )}
        </div>
        <div className="flex mt-5 ml-3 md:mx-auto md:text-xl">
          {nftBalanceSeven !== "0" && (
            <p className="text-yellow-500 font-semibold capitalize">
              TIER7(ID 6): <span>{nftBalanceSeven} TOKENS</span>
            </p>
          )}
        </div>
        <div className="flex mt-5 ml-3 md:mx-auto md:text-xl">
          {nftBalanceEight !== "0" && (
            <p className="text-yellow-500 font-semibold capitalize">
              TIER8(ID 7): <span>{nftBalanceEight} TOKENS</span>
            </p>
          )}
        </div>
        <div className="flex mt-5 ml-3 md:mx-auto md:text-xl">
          {nftBalanceNine !== "0" && (
            <p className="text-yellow-500 font-semibold capitalize">
              TIER9(ID 8): <span>{nftBalanceNine} TOKENS</span>
            </p>
          )}
        </div>
        <div className="flex mt-5 ml-3 md:mx-auto md:text-xl">
          {nftBalanceTen !== "0" && (
            <p className="text-yellow-500 font-semibold capitalize">
              TIER10(ID 9): <span>{nftBalanceTen} TOKENS</span>
            </p>
          )}
        </div>
      </div>
      <div className="flex mt-5 justify-start w-36 md:mx-auto items-center rounded-md px-2 h-8 bg-yellow-500 ml-4 font-semibold mb-5  whitespace-nowrap">
        Staking Balance:
      </div>
      <div className="flex flex-col justify-between h-16 w-80 md:mx-auto bg-black rounded-md ml-4 relative top-7 mb-20">
        <p className="flex items-center mt-5 text-yellow-500 font-semibold capitalize">
          Amount: {myStakingBalance}
        </p>
      </div>
      <p className="text-white text-2xl font-bold uppercase mx-auto px-4 mb-10">
        Recommended To Update Balance Every Day
      </p>
      <button
        onClick={updateStakingBalance}
        className="rounded-2xl whitespace-nowrap ml-4 mx-auto md:relative md:left-20 bg-black text-yellow-500 h-8 shadow-button w-48 font-bold transition ease-in-out hover:text-white mb-12"
      >
        Update Staking Balance
      </button>
      <div className="flex mt-5 justify-start w-56 md:mx-auto items-center rounded-md px-2 h-8 bg-yellow-500 ml-4 font-semibold mb-5  whitespace-nowrap">
        NFTs Being Used For Staking:
      </div>
      <div className="flex flex-col justify-between h-auto w-80 md:mx-auto bg-black rounded-md ml-4 relative top-7 mb-20">
        <p className="text-yellow-500 font-semibold capitalize">
          TIER1(ID 0): {stakedNFTOne}
        </p>
        <p className="text-yellow-500 font-semibold capitalize">
          TIER2(ID 1): {stakedNFTTwo}
        </p>
        <p className="text-yellow-500 font-semibold capitalize">
          TIER3(ID 2): {stakedNFTThree}
        </p>
        <p className="text-yellow-500 font-semibold capitalize">
          TIER4(ID 3): {stakedNFTFour}
        </p>
        <p className="text-yellow-500 font-semibold capitalize">
          TIER5(ID 4): {stakedNFTFive}
        </p>
        <p className="text-yellow-500 font-semibold capitalize">
          TIER6(ID 5): {stakedNFTSix}
        </p>
        <p className="text-yellow-500 font-semibold capitalize">
          TIER7(ID 6): {stakedNFTSeven}
        </p>
        <p className="text-yellow-500 font-semibold capitalize">
          TIER8(ID 7): {stakedNFTEight}
        </p>
        <p className="text-yellow-500 font-semibold capitalize">
          TIER9(ID 8): {stakedNFTNine}
        </p>
        <p className="text-yellow-500 font-semibold capitalize">
          TIER10(ID 9): {stakedNFTTen}
        </p>
        <p className="text-yellow-500 font-semibold capitalize">
          TIER-STAKING(ID 10): {stakedNFTEleven}
        </p>
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
          Mint
        </button>
      ) : (
        <button
          onClick={mintToken}
          className="rounded-2xl ml-4 mx-auto md:relative md:left-20 bg-black text-yellow-500 h-8 shadow-button w-40 font-bold transition ease-in-out hover:text-white mb-12"
        >
          Mint
        </button>
      )}
      <div className="flex mt-5 justify-start w-28 md:mx-auto items-center rounded-md px-2 h-8 bg-yellow-500 ml-4 font-semibold mb-5  whitespace-nowrap">
        Stake NFTs:
      </div>
      <p className="text-white text-2xl font-bold uppercase mx-auto px-4 mb-10">
        You need 10 or more NFTs to start staking
      </p>
      <button
        onClick={toggleStaking}
        className="rounded-2xl ml-4 mx-auto md:relative md:left-20 bg-black text-yellow-500 h-8 shadow-button w-40 font-bold transition ease-in-out hover:text-white mb-12"
      >
        Stake
      </button>
      {stakingTab && (
        <div className="fixed top-0 left-0 w-full h-full bg-shade grid z-50 place-items-center">
          <div className="flex flex-col bg-yellow-500 w-80 rounded-xl h-52">
            <svg
              viewBox="0 0 24 24"
              color="#FFFFFF"
              width="20px"
              xmlns="http://www.w3.org/2000/svg"
              className="relative left-280 top-4 cursor-pointer hover:scale-125"
              onClick={toggleStaking}
            >
              <path d="M18.3 5.70997C17.91 5.31997 17.28 5.31997 16.89 5.70997L12 10.59L7.10997 5.69997C6.71997 5.30997 6.08997 5.30997 5.69997 5.69997C5.30997 6.08997 5.30997 6.71997 5.69997 7.10997L10.59 12L5.69997 16.89C5.30997 17.28 5.30997 17.91 5.69997 18.3C6.08997 18.69 6.71997 18.69 7.10997 18.3L12 13.41L16.89 18.3C17.28 18.69 17.91 18.69 18.3 18.3C18.69 17.91 18.69 17.28 18.3 16.89L13.41 12L18.3 7.10997C18.68 6.72997 18.68 6.08997 18.3 5.70997Z"></path>
            </svg>
            <div className="flex flex-col ">
              <p className="uppercase text-center font-bold text-xs mb-5">
                Put in Amount of nfts to stake
              </p>
              <p className="uppercase text-center font-bold text-xs mb-5">
                Amount Has To Be Divisible By 10
              </p>
              <p className="uppercase text-center font-bold text-xs mb-5">
                Seprate the Ids In Commas
              </p>
              <input
                type="text"
                placeholder="Amount"
                onChange={handleChange}
                className="px-4 w-40 mx-auto rounded-xl mb-5 focus:outline-none border border-solid border-yellow-500 text-yellow-500"
              />
            </div>
            <button
              className="rounded-2xl mx-auto bg-black text-yellow-500 h-8 shadow-button w-40 font-bold transition ease-in-out hover:text-white "
              onClick={() => stakeNFTs(thisAmount)}
            >
              Stake NFTs
            </button>
          </div>
        </div>
      )}
      <div className="flex mt-5 justify-start w-28 md:mx-auto items-center rounded-md px-2 h-8 bg-yellow-500 ml-4 font-semibold mb-5  whitespace-nowrap">
        Unstake NFTs:
      </div>
      <p className="text-white text-2xl font-bold uppercase mx-auto px-4 mb-10">
        have to unstake 10 or more NFTs
      </p>
      <button
        onClick={toggleUnstaking}
        className="rounded-2xl ml-4 mx-auto md:relative md:left-20 bg-black text-yellow-500 h-8 shadow-button w-40 font-bold transition ease-in-out hover:text-white mb-12"
      >
        Unstake
      </button>
      {unstakingTab && (
        <div className="fixed top-0 left-0 w-full h-full bg-shade grid z-50 place-items-center">
          <div className="flex flex-col bg-yellow-500 w-80 rounded-xl h-52">
            <svg
              viewBox="0 0 24 24"
              color="#FFFFFF"
              width="20px"
              xmlns="http://www.w3.org/2000/svg"
              className="relative left-280 top-4 cursor-pointer hover:scale-125"
              onClick={toggleUnstaking}
            >
              <path d="M18.3 5.70997C17.91 5.31997 17.28 5.31997 16.89 5.70997L12 10.59L7.10997 5.69997C6.71997 5.30997 6.08997 5.30997 5.69997 5.69997C5.30997 6.08997 5.30997 6.71997 5.69997 7.10997L10.59 12L5.69997 16.89C5.30997 17.28 5.30997 17.91 5.69997 18.3C6.08997 18.69 6.71997 18.69 7.10997 18.3L12 13.41L16.89 18.3C17.28 18.69 17.91 18.69 18.3 18.3C18.69 17.91 18.69 17.28 18.3 16.89L13.41 12L18.3 7.10997C18.68 6.72997 18.68 6.08997 18.3 5.70997Z"></path>
            </svg>
            <div className="flex flex-col ">
              <p className="uppercase text-center mt-3 font-bold text-xs mb-5">
                Put in Amount of nfts to unstake
              </p>
              <p className="uppercase text-center font-bold text-xs mb-5">
                Seprate the Ids In Commas
              </p>
              <input
                type="text"
                placeholder="Amount"
                onChange={handleChange}
                className="px-4 w-40 mx-auto rounded-xl mb-5 focus:outline-none border border-solid border-yellow-500 text-yellow-500"
              />
            </div>
            <button
              className="rounded-2xl mx-auto bg-black text-yellow-500 h-8 shadow-button w-40 font-bold transition ease-in-out hover:text-white "
              onClick={() => unstakeNFTs(thisAmount)}
            >
              UnStake NFTs
            </button>
          </div>
        </div>
      )}
      <div className="flex mt-5 justify-start w-48 md:mx-auto items-center rounded-md px-2 h-8 bg-yellow-500 ml-4 font-semibold mb-10  whitespace-nowrap">
        Claim Staking Rewards:
      </div>
      <button
        onClick={toggleRewards}
        className="rounded-2xl ml-4 mx-auto md:relative md:left-20 bg-black text-yellow-500 h-8 shadow-button w-40 font-bold transition ease-in-out hover:text-white mb-12"
      >
        Claim Rewards
      </button>
      {claimRewards && (
        <div className="fixed top-0 left-0 w-full h-full bg-shade grid z-50 place-items-center">
          <div className="flex flex-col bg-yellow-500 w-80 rounded-xl h-52">
            <svg
              viewBox="0 0 24 24"
              color="#FFFFFF"
              width="20px"
              xmlns="http://www.w3.org/2000/svg"
              className="relative left-280 top-4 cursor-pointer hover:scale-125"
              onClick={toggleRewards}
            >
              <path d="M18.3 5.70997C17.91 5.31997 17.28 5.31997 16.89 5.70997L12 10.59L7.10997 5.69997C6.71997 5.30997 6.08997 5.30997 5.69997 5.69997C5.30997 6.08997 5.30997 6.71997 5.69997 7.10997L10.59 12L5.69997 16.89C5.30997 17.28 5.30997 17.91 5.69997 18.3C6.08997 18.69 6.71997 18.69 7.10997 18.3L12 13.41L16.89 18.3C17.28 18.69 17.91 18.69 18.3 18.3C18.69 17.91 18.69 17.28 18.3 16.89L13.41 12L18.3 7.10997C18.68 6.72997 18.68 6.08997 18.3 5.70997Z"></path>
            </svg>
            <div className="flex flex-col ">
              <p className="uppercase text-center mt-3 font-bold text-xs mb-5">
                Put in Amount of nfts to claim
              </p>
              <p className="uppercase text-center font-bold text-xs mb-5">
                You Are Eligible to claim{" "}
                <span className="text-red-500 italic">{howMuch}</span> NFTs
              </p>
              <input
                type="text"
                placeholder="Amount"
                onChange={handleChange}
                className="px-4 w-40 mx-auto rounded-xl mb-5 focus:outline-none border border-solid border-yellow-500 text-yellow-500"
              />
            </div>
            <button
              className="rounded-2xl mx-auto bg-black text-yellow-500 h-8 shadow-button w-40 font-bold transition ease-in-out hover:text-white "
              onClick={() => claimStakingRewards(thisAmount)}
            >
              Claim NFTs
            </button>
          </div>
        </div>
      )}
      <div className={styles.card}>
        <section className={styles.front}>
          <img src="/ljcrypto.webp" alt="" className=" rounded-3xl w-12 h-12" />
        </section>
        <div className={styles.back}>
          <img src="/ljcrypto.webp" alt="" className=" rounded-3xl w-12 h-12" />
        </div>
      </div>
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
