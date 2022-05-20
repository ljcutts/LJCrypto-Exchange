import React, {useState, useContext, useEffect} from 'react'
import Link from "next/link";
import {Web3Context, useWeb3} from "../context"
import { providers, Contract, BigNumber, ethers } from "ethers";
import styles from "../styles/Home.module.css";
import Web3Modal from "web3modal";
import {NFT_COLLECTION_ABI, NFT_COLLECTION_ADDRESS} from "../constants/nft"
import {NFT_STAKING_ABI, NFT_STAKING_ADDRESS} from "../constants/nftstaking"



type IState = {
  nftBalanceOne: string;
  setNftBalanceOne: React.Dispatch<React.SetStateAction<string>>;
  thisAmount: string
  setAmount: React.Dispatch<React.SetStateAction<string>>
};

function NFT() {
  const { account, numberIsZero, setNumberIsZero, getProviderOrSigner, getAddress, connectWallet, walletConnected, web3ModalRef} = useContext(Web3Context) as useWeb3;

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
  const [nftBalanceEleven, setNftBalanceEleven] = useState("0");
  const [nftBalanceTwelve, setNftBalanceTwelve] = useState("0");
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
  const [stakedNFTTwelve, setStakedNFTTwelve] = useState("0");
  const [stakedNFTTotal, setStakedNFTTotal] = useState("0")
  const [stakingTab, setStakingTab] = useState(false);
  const [unstakingTab, setUnstakingTab] = useState(false);
  const [thisAmount, setAmount] = useState<IState["thisAmount"]>("");
  const [sendTo, setSendTo] = useState("")
  const [whatId, setWhatId] = useState("")
  const [myStakingBalance, setStakingBalance] = useState("0")
  const [claimRewards, setClaimRewards] = useState(false)
  const [howMuch, setHowMuch] = useState(0)
  const [breedTab, setBreedTab] = useState(false)
  const [transferTab, setTransferTab] = useState(false) 
  const [burnTab, setBurnTab] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const toggleStaking = () => {
    setStakingTab(!stakingTab)
  }

  const toggleUnstaking = () => {
    setUnstakingTab(!unstakingTab);
  };

   const toggleRewards = () => {
     setClaimRewards(!claimRewards);
   };

    const toggleBreed = () => {
     setBreedTab(!breedTab);
   };

   const toggleTransfer = () => {
     setTransferTab(!transferTab);
   };

    const toggleBurn = () => {
      setBurnTab(!burnTab);
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
         setIsLoading(true);
         const provider = await getProviderOrSigner(true);
         const contract = getNFTStakingContractInstance(provider);
         const tx = await contract.updateStakingBalance();
         await tx.wait();
         window.alert("Your Staking Balance Has Been Updated")
         setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      console.log(error)
      window.alert(error.data.message)
    }
  }

  const fetchNFTBalances = async() => {
    const provider = await getProviderOrSigner(true);
    const contract = getNFTContractInstance(provider);
    const thisAccount =  await new providers.Web3Provider(window.ethereum).getSigner().getAddress()
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
    const balanceEleven = await contract.balanceOf(thisAccount, 10);
    setNftBalanceEleven(BigNumber.from(balanceEleven).toString());
    const balanceTweleve = await contract.balanceOf(thisAccount, 11);
    setNftBalanceTwelve(BigNumber.from(balanceTweleve).toString());
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
    const balanceTweleve = await contract.checkStakedNFTs(11);
    setStakedNFTTwelve(BigNumber.from(balanceTweleve).toString());
  }

  const mintToken = async() => {
    try {
       setIsLoading(true);
       const provider = await getProviderOrSigner(true);
       const contract = getNFTContractInstance(provider);
       const tx = await contract.mintToken({value: ethers.utils.parseEther("0.01")});
       await tx.wait();
       window.alert("You Have Successfully Minted A Token")
       setIsLoading(false);
    } catch (error:any) {
       setIsLoading(false);
      console.log(error)
      window.alert(error.data.message)
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
      setIsLoading(true)
       const provider = await getProviderOrSigner(true);
       const nftContract = getNFTContractInstance(provider);
      const tx = await nftContract.setApprovalForAll(NFT_STAKING_ADDRESS, true);
      await tx.wait()
      window.alert("Your NFTs Have Been Approved For Staking")
      setIsLoading(false);
    } catch (error:any) {
      setIsLoading(false)
      console.log(error)
      window.alert(error.data.message)
    }
  }

  const claimAmount = async() => {
    let amount = BigNumber.from(0).toNumber()
     const provider = await getProviderOrSigner(true);
     const contract = getNFTStakingContractInstance(provider);
    for (let i = 0; i < 12; i++) {
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
     setStakedNFTTotal(BigNumber.from(stakingBalance).toString())
    return totalAmount
  }

  const claimStakingRewards = async(amount: string) => {
    try {
       setIsLoading(true)
       const provider = await getProviderOrSigner(true);
       const contract = getNFTStakingContractInstance(provider);
       const tx = await contract.claimNFTStakingRewards(amount);
      await tx.wait();
      window.alert(`You Have Successfully Claimed ${amount} NFTs`)
      setIsLoading(false)
    } catch (error:any) {
      setIsLoading(false)
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
            setStakingTab(false);
            setIsLoading(true)
            const provider = await getProviderOrSigner(true);
            const contract = getNFTStakingContractInstance(provider);
            const split = amount.split(",");
            const tx = await contract.stakeNFTs(split);
            await tx.wait();
            window.alert(`You Have Successfully Staked TokenIds of ${amount}`)
            setIsLoading(false)
          } catch (error:any) {
             setStakingTab(false);
            setIsLoading(false)
            console.log(error);
            window.alert(
              error.data.message
            );
          } 
  }

  const unstakeNFTs = async(amount: string) => {
    try {
      setUnstakingTab(false)
        setIsLoading(true)
        const provider = await getProviderOrSigner(true);
        const contract = getNFTStakingContractInstance(provider);
        const split = amount.split(",");
        const tx = await contract.unstakeNFTs(split);
        await tx.wait();
        setStakingTab(false)
        window.alert(`You Have UnStaked ${amount} NFTs`)
        setIsLoading(false)
    } catch (error:any) {
      setUnstakingTab(false)
      setIsLoading(false)
      console.log(error)
      window.alert(error.data.message)
    }
  }

  const breedNFTs = async(amount: string) => {
    try {
      setBreedTab(false)
       setIsLoading(true)
       const provider = await getProviderOrSigner(true);
       const contract = getNFTContractInstance(provider);
       const split = amount.split(",");
       const tx = await contract.breedNFTs(split);
       await tx.wait();
       window.alert(`You Have Successfully Breeded an NFT`)
       setIsLoading(false)
    } catch (error:any) {
      setBreedTab(false)
      setIsLoading(false)
      console.log(error)
      window.alert(error.data.message)
    }
  }

  const transferNFTs = async (to: string, id: string, amount: string) => {
    try {
      setTransferTab(false)
      setIsLoading(true)
      const provider = await getProviderOrSigner(true);
      const contract = getNFTContractInstance(provider);
      const thisAccount = await getAddress();
      const tx = await contract.safeTransferFrom(
        thisAccount,
        to,
        id,
        amount,
        ethers.utils.formatBytes32String("")
      );
      await tx.wait();
      window.alert(`You Have Transferred ${amount} NFTs to ${to} of Token ID ${id}`)
      setIsLoading(false)
    } catch (error: any) {
      setTransferTab(false)
      setIsLoading(false)
      console.log(error)
      window.alert(error.data.message);
    }
  };

  const burnNFTs = async(id: string, amount: string) => {
    try {
      setBurnTab(false)
       setIsLoading(true)
       const provider = await getProviderOrSigner(true);
       const contract = getNFTContractInstance(provider);
       const thisAccount = await getAddress();
       const tx = await contract.burn(thisAccount, id, amount);
       await tx.wait();
       window.alert(`You Have burned ${amount} NFTs of Token ID ${id}`)
       setIsLoading(false)
    } catch (error:any) {
      setBurnTab(false)
       setIsLoading(false)
       console.log(error);
       window.alert(error.data.message);
    }
  }

   const handleChange = (
     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
   ) => {
     setAmount(e.target.value);
   };
    

useEffect(() => {
  if (!walletConnected) {
          web3ModalRef.current = new Web3Modal({
            network: "mumbai",
            providerOptions: {},
          });
        }
  setInterval(async function () {
    await getAddress();
    await isNumberAboveZero();
    await fetchNFTBalances();
    await totalNFTBalance();
    await getStakingBalance();
    await fetchStakedNFTBalances();
    await claimAmount();
  }, 2 * 1000);
}, [walletConnected, account]);

  return (
    <>
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
        {isLoading ? (
          <>
            <p className="text-white text-3xl font-bold uppercase flex justify-center md:px-0 px-4 mb-3">
              Loading...
            </p>
            <article className={styles.card}>
              <section className={styles.cardSideFront}>
                <h1 className="h1">
                  <img
                    className="rounded-1400"
                    src="/ljcrypto.webp"
                  />
                </h1>
              </section>
            </article>
          </>
        ) : (
          <>
            <p className="text-white text-2xl font-bold uppercase md:flex md:justify-center md:px-0 px-4 mb-10">
              View NFT Collection Here
            </p>
            <Link href="https://testnets.opensea.io/collection/unidentified-contract-pp3ki7zvnb">
              <a className="md:flex md:justify-content md:mx-auto w-40" target="_blank">
                <button className="rounded-2xl ml-4 md:mx-auto bg-black text-yellow-500 h-8 shadow-button w-40 font-bold transition ease-in-out hover:text-white mb-12">
                  View NFTs
                </button>
              </a>
            </Link>
            <div className="flex mt-5 justify-start w-120 md:mx-auto items-center rounded-md px-2 h-8 bg-yellow-500 ml-4  font-semibold mb-5  whitespace-nowrap">
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
              <div className="flex mt-5 ml-3 md:mx-auto md:text-xl">
                {nftBalanceEleven !== "0" && (
                  <p className="text-yellow-500 font-semibold capitalize">
                    TIER-STAKING(ID 10): <span>{nftBalanceEleven} TOKENS</span>
                  </p>
                )}
              </div>
              <div className="flex mt-5 ml-3 md:mx-auto md:text-xl">
                {nftBalanceTwelve !== "0" && (
                  <p className="text-yellow-500 font-semibold capitalize">
                    TIER-BREEDING(ID 11): <span>{nftBalanceTwelve} TOKENS</span>
                  </p>
                )}
              </div>
            </div>
            <div className="flex mt-5 justify-start w-36 md:mx-auto items-center rounded-md px-2 h-8 bg-yellow-500 ml-4 font-semibold mb-5  whitespace-nowrap">
              Staking Balance:
            </div>
            <div className="flex flex-col justify-between h-16 w-80 md:mx-auto bg-black rounded-md ml-4 relative top-7 mb-20">
              {myStakingBalance === "0" ? (
                <p className="flex items-center mt-5 text-yellow-500 md:justify-center md:text-xl font-semibold capitalize">
                  You Have No Staking Balance
                </p>
              ) : (
                <p className="flex items-center mt-5 md:justify-center md:text-xl text-yellow-500 font-semibold capitalize">
                  Amount: {myStakingBalance}
                </p>
              )}
            </div>
            {myStakingBalance === "0" ? (
              <>
                <p className="text-white text-2xl font-bold uppercase md:flex md:justify-center md:px-0 px-4 mb-10">
                  You don't have a staking balance to update
                </p>
                <div className="md:flex md:justify-center">
                  <button className="rounded-2xl opacity-50 whitespace-nowrap ml-4 md:mx-auto bg-black text-yellow-500 h-8 shadow-button w-48 font-bold transition ease-in-out mb-12">
                    Update Staking Balance
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-white text-2xl font-bold uppercase md:flex md:justify-center md:px-0 px-4 mb-10">
                  Recommended To Update Balance Every Day
                </p>
                <div className="md:flex md:justify-center">
                  <button
                    onClick={updateStakingBalance}
                    className="rounded-2xl whitespace-nowrap ml-4 md:mx-auto bg-black text-yellow-500 h-8 shadow-button w-48 font-bold transition ease-in-out hover:text-white mb-12"
                  >
                    Update Staking Balance
                  </button>
                </div>
              </>
            )}

            <div className="flex mt-5 justify-start w-56 md:mx-auto items-center rounded-md px-2 h-8 bg-yellow-500 ml-4 font-semibold mb-5  whitespace-nowrap">
              NFTs Being Used For Staking:
            </div>
            <div className="flex flex-col justify-between md:text-xl h-auto w-80 md:mx-auto md:text-center bg-black rounded-md ml-4 relative top-7 mb-20">
              {stakedNFTTotal === "0" ? (
                <p className="text-yellow-500 mb-3 font-semibold capitalize">
                  You Have No NFTs Being Used For Staking
                </p>
              ) : (
                <>
                  <p className="text-yellow-500 mb-3 font-semibold capitalize">
                    Total Amount: {stakedNFTTotal}
                  </p>
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
                  <p className="text-yellow-500 font-semibold capitalize">
                    TIER-BREEDING(ID 11): {stakedNFTTwelve}
                  </p>
                </>
              )}
            </div>
            <div className="flex mt-5 justify-start w-36 md:mx-auto items-center rounded-md px-2 h-8 bg-yellow-500 ml-4 font-semibold mb-5  whitespace-nowrap">
              Mint Random NFT:
            </div>
            <p className="text-black text-2xl md:flex md:justify-center italic mt-3 font-bold uppercase mx-auto px-4 mb-5">
              NFTs cost 0.01 MATIC
            </p>
            {numberIsZero === false ? (
              <p className="text-white text-2xl font-bold uppercase md:flex md:justify-center px-4 mb-10">
                Please Wait Until a Random Id Has Been Generated
              </p>
            ) : (
              <p className="text-white text-2xl md:flex md:justify-center ml-4 font-bold uppercase mx-auto mb-10">
                You can now mint an nft!!!
              </p>
            )}
            <div className="md:flex md:justify-center">
              {numberIsZero === false ? (
                <button className="rounded-2xl ml-4 opacity-50  bg-black text-yellow-500 h-8 shadow-button w-40 font-bold transition ease-in-out mb-12">
                  Mint
                </button>
              ) : (
                <button
                  onClick={mintToken}
                  className="rounded-2xl ml-4 md:mx-auto bg-black text-yellow-500 h-8 shadow-button w-40 font-bold transition ease-in-out hover:text-white mb-12"
                >
                  Mint
                </button>
              )}
            </div>
            <div className="flex mt-5 justify-start w-28 md:mx-auto items-center rounded-md px-2 h-8 bg-yellow-500 ml-4 font-semibold mb-5  whitespace-nowrap">
              Stake NFTs:
            </div>
            <p className="text-white text-2xl font-bold uppercase md:flex md:justify-center px-4 mb-10">
              You need 10 or more NFTs to start staking
            </p>
            <div className="md:flex md:justify-center">
              <button
                onClick={toggleStaking}
                className="rounded-2xl ml-4 bg-black text-yellow-500 h-8 shadow-button w-40 font-bold transition ease-in-out hover:text-white mb-12"
              >
                Stake
              </button>
            </div>
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
                    className="rounded-2xl mx-auto bg-black mb-2 text-yellow-500 h-8 shadow-button w-40 font-bold transition ease-in-out hover:text-white"
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
            <p className="text-white text-2xl font-bold uppercase md:flex md:justify-center px-4 mb-10">
              have to unstake 10 or more NFTs
            </p>
            <div className="md:flex md:justify-center">
              <button
                onClick={toggleUnstaking}
                className="rounded-2xl ml-4 bg-black text-yellow-500 h-8 shadow-button w-40 font-bold transition ease-in-out hover:text-white mb-12"
              >
                Unstake
              </button>
            </div>
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
            <div className="md:flex md:justify-center">
              <button
                onClick={toggleRewards}
                className="rounded-2xl ml-4 md:ml-0 bg-black text-yellow-500 h-8 shadow-button w-40 font-bold transition ease-in-out hover:text-white mb-12"
              >
                Claim Rewards
              </button>
            </div>
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
                      <span className="text-red-500 italic">{howMuch}</span>{" "}
                      NFTs
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
            <div className="flex mt-5 justify-start w-28 md:mx-auto items-center rounded-md px-2 h-8 bg-yellow-500 ml-4 font-semibold mb-5  whitespace-nowrap">
              Breed NFTs:
            </div>
            <p className="text-white text-2xl font-bold md:flex md:justify-center uppercase mx-auto px-4 mb-10">
              Use 2 Token Ids to make new nft
            </p>
            <div className="md:flex md:justify-center">
              <button
                onClick={toggleBreed}
                className="rounded-2xl ml-4 md:ml-0 bg-black text-yellow-500 h-8 shadow-button w-32 font-bold transition ease-in-out hover:text-white mb-12"
              >
                Breed
              </button>
            </div>
            {breedTab && (
              <div className="fixed top-0 left-0 w-full h-full bg-shade grid z-50 place-items-center">
                <div className="flex flex-col bg-yellow-500 w-80 rounded-xl h-52">
                  <svg
                    viewBox="0 0 24 24"
                    color="#FFFFFF"
                    width="20px"
                    xmlns="http://www.w3.org/2000/svg"
                    className="relative left-280 top-4 cursor-pointer hover:scale-125"
                    onClick={toggleBreed}
                  >
                    <path d="M18.3 5.70997C17.91 5.31997 17.28 5.31997 16.89 5.70997L12 10.59L7.10997 5.69997C6.71997 5.30997 6.08997 5.30997 5.69997 5.69997C5.30997 6.08997 5.30997 6.71997 5.69997 7.10997L10.59 12L5.69997 16.89C5.30997 17.28 5.30997 17.91 5.69997 18.3C6.08997 18.69 6.71997 18.69 7.10997 18.3L12 13.41L16.89 18.3C17.28 18.69 17.91 18.69 18.3 18.3C18.69 17.91 18.69 17.28 18.3 16.89L13.41 12L18.3 7.10997C18.68 6.72997 18.68 6.08997 18.3 5.70997Z"></path>
                  </svg>
                  <div className="flex flex-col ">
                    <p className="uppercase text-center mt-3 font-bold text-xs mb-5">
                      Put in 2 Ids to breed nft
                    </p>
                    <p className="uppercase text-center font-bold text-xs mb-5">
                      SEPRATE THE IDS IN COMMAS
                    </p>
                    <input
                      type="text"
                      placeholder="IDs"
                      onChange={handleChange}
                      className="px-4 w-40 mx-auto rounded-xl mb-5 focus:outline-none border border-solid border-yellow-500 text-yellow-500"
                    />
                  </div>
                  <button
                    className="rounded-2xl mx-auto bg-black text-yellow-500 h-8 shadow-button w-40 font-bold transition ease-in-out hover:text-white "
                    onClick={() => breedNFTs(thisAmount)}
                  >
                    Breed
                  </button>
                </div>
              </div>
            )}
            <div className="flex mt-5 justify-start w-28 md:mx-auto items-center rounded-md px-2 h-8 bg-yellow-500 ml-4 font-semibold mb-5  whitespace-nowrap">
              Transfer NFTs:
            </div>
            <p className="text-white text-2xl md:flex md:justify-center font-bold uppercase mx-auto px-4 mb-10">
              Transfer a specific id to others
            </p>
            <div className="md:flex md:justify-center">
              <button
                onClick={toggleTransfer}
                className="rounded-2xl ml-4 md:ml-0 bg-black text-yellow-500 h-8 shadow-button w-32 font-bold transition ease-in-out hover:text-white mb-12"
              >
                Transfer
              </button>
            </div>
            {transferTab && (
              <div className="fixed top-0 left-0 w-full h-full bg-shade grid z-50 place-items-center">
                <div className="flex flex-col bg-yellow-500 w-80 rounded-xl h-56">
                  <svg
                    viewBox="0 0 24 24"
                    color="#FFFFFF"
                    width="20px"
                    xmlns="http://www.w3.org/2000/svg"
                    className="relative left-280 top-4 cursor-pointer hover:scale-125"
                    onClick={toggleTransfer}
                  >
                    <path d="M18.3 5.70997C17.91 5.31997 17.28 5.31997 16.89 5.70997L12 10.59L7.10997 5.69997C6.71997 5.30997 6.08997 5.30997 5.69997 5.69997C5.30997 6.08997 5.30997 6.71997 5.69997 7.10997L10.59 12L5.69997 16.89C5.30997 17.28 5.30997 17.91 5.69997 18.3C6.08997 18.69 6.71997 18.69 7.10997 18.3L12 13.41L16.89 18.3C17.28 18.69 17.91 18.69 18.3 18.3C18.69 17.91 18.69 17.28 18.3 16.89L13.41 12L18.3 7.10997C18.68 6.72997 18.68 6.08997 18.3 5.70997Z"></path>
                  </svg>
                  <div className="flex flex-col ">
                    <p className="uppercase text-center font-bold text-xs mb-5">
                      Transfer NFT
                    </p>
                    <input
                      type="text"
                      placeholder="Which ID"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setWhatId(e.target.value)
                      }
                      className="px-4 w-40 mx-auto rounded-xl mb-5 focus:outline-none border border-solid border-yellow-500 text-yellow-500"
                    />
                    <input
                      type="text"
                      placeholder="Amount To Send"
                      onChange={handleChange}
                      className="px-4 w-40 mx-auto rounded-xl mb-5 focus:outline-none border border-solid border-yellow-500 text-yellow-500"
                    />
                    <input
                      type="text"
                      placeholder="Recipient Address"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setSendTo(e.target.value)
                      }
                      className="px-4 w-40 mx-auto rounded-xl mb-5 focus:outline-none border border-solid border-yellow-500 text-yellow-500"
                    />
                  </div>
                  <button
                    className="rounded-2xl mx-auto bg-black mb-2 text-yellow-500 h-8 shadow-button w-40 font-bold transition ease-in-out hover:text-white "
                    onClick={() => transferNFTs(sendTo, whatId, thisAmount)}
                  >
                    Transfer NFTs
                  </button>
                </div>
              </div>
            )}
            <div className="flex mt-5 justify-start w-24 md:mx-auto items-center rounded-md px-2 h-8 bg-yellow-500 ml-4 font-semibold mb-5  whitespace-nowrap">
              Burn NFTs:
            </div>
            <p className="text-white text-2xl md:flex md:justify-center font-bold uppercase mx-auto px-4 mb-10">
              You can discard your own nfts
            </p>
            <div className="md:flex md:justify-center">
              <button
                onClick={toggleBurn}
                className="rounded-2xl ml-4 md:ml-0 bg-black text-yellow-500 h-8 shadow-button w-32 font-bold transition ease-in-out hover:text-white mb-12"
              >
                Burn
              </button>
            </div>
            {burnTab && (
              <div className="fixed top-0 left-0 w-full h-full bg-shade grid z-50 place-items-center">
                <div className="flex flex-col bg-yellow-500 w-80 rounded-xl h-56">
                  <svg
                    viewBox="0 0 24 24"
                    color="#FFFFFF"
                    width="20px"
                    xmlns="http://www.w3.org/2000/svg"
                    className="relative left-280 top-4 cursor-pointer hover:scale-125"
                    onClick={toggleBurn}
                  >
                    <path d="M18.3 5.70997C17.91 5.31997 17.28 5.31997 16.89 5.70997L12 10.59L7.10997 5.69997C6.71997 5.30997 6.08997 5.30997 5.69997 5.69997C5.30997 6.08997 5.30997 6.71997 5.69997 7.10997L10.59 12L5.69997 16.89C5.30997 17.28 5.30997 17.91 5.69997 18.3C6.08997 18.69 6.71997 18.69 7.10997 18.3L12 13.41L16.89 18.3C17.28 18.69 17.91 18.69 18.3 18.3C18.69 17.91 18.69 17.28 18.3 16.89L13.41 12L18.3 7.10997C18.68 6.72997 18.68 6.08997 18.3 5.70997Z"></path>
                  </svg>
                  <div className="flex flex-col ">
                    <p className="uppercase text-center mt-3 font-bold text-xs mb-5">
                      Burn An NFT
                    </p>
                    <input
                      type="text"
                      placeholder="Which ID"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setWhatId(e.target.value)
                      }
                      className="px-4 w-40 mx-auto rounded-xl mb-5 focus:outline-none border border-solid border-yellow-500 text-yellow-500"
                    />
                    <input
                      type="text"
                      placeholder="Amount To Burn"
                      onChange={handleChange}
                      className="px-4 w-40 mx-auto rounded-xl mb-5 focus:outline-none border border-solid border-yellow-500 text-yellow-500"
                    />
                  </div>
                  <button
                    className="rounded-2xl mx-auto bg-black mb-1 text-yellow-500 h-8 shadow-button w-40 font-bold transition ease-in-out hover:text-white "
                    onClick={() => burnNFTs(whatId, thisAmount)}
                  >
                    Burn NFTs
                  </button>
                </div>
              </div>
            )}
          </>
        )}
        {isLoading === false && (
          <div className="flex flex-row justify-between mx-auto  justify-self-center max-w-xs md:max-w-lg bg-black text-white rounded-2xl border border-solid border-yellow-400 z-50 bottom-0 right-1/2 pr-4 whitespace-nowrap overflow-x-scroll">
            <a className=" text-black font-semibold mr-4 px-2 rounded-3xl bg-yellow-400 flex items-center justify-center">
              NFTs
            </a>
            <a className="pr-4 hover:text-yellow-500 cursor-pointer">
              Lottery Game
            </a>
            <a className="pr-4 hover:text-yellow-500 cursor-pointer">Staking</a>
            <a className="pr-4 hover:text-yellow-500 cursor-pointer">
              Liquidity Pools
            </a>
            <a className="pr-4 hover:text-yellow-500 cursor-pointer">
              Tokens&NFTs
            </a>
          </div>
        )}
      </main>
    </>
  );
}

export default NFT