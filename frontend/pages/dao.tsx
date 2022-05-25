import React, { useState, useContext, useEffect } from "react";
import Link from "next/link";
import { Web3Context, useWeb3 } from "../context";
import { providers, Contract, BigNumber, ethers } from "ethers";
import styles from "../styles/Home.module.css";
import { create } from "ipfs-http-client";


const ipfs = create('https://ipfs.infura.io:5001/api/v0');
// const ipfs = create({ apiPath: "/ipfs/api/v0", protocol: "https" });

import { LJCRYPTO_DAO_ABI, LJCRYPTO_DAO_ADDRESS } from "../constants/dao";
import { NFT_COLLECTION_ABI, NFT_COLLECTION_ADDRESS } from "../constants/nft";
import {
  LJCRYPTO_TOKEN_ABI,
  LJCRYPTO_TOKEN_ADDRESS,
} from "../constants/ljcryptotoken";

type IState = {
  proposals: (
    | {
        proposalId: number 
        deadline: Date | string
        yesVotes: string;
        noVotes: string;
        owner: any;
        cidHash: any;
        executionStatus: any;
        proposalApproved: any;
      }
    | undefined
  )[];
  setProposals: React.Dispatch<
    React.SetStateAction<
      (
        | {
            deadline: string;
            yesVotes: string;
            noVotes: string;
            owner: any;
            cidHash: any;
            executionStatus: any;
            proposalApproved: any;
          }
        | undefined
      )[]
    >
  >;
};


const Dao: React.FC = () => {
const { account, connectWallet, numberIsZero, setNumberIsZero, getProviderOrSigner, getAddress, loading, setLoading} = useContext(Web3Context) as useWeb3;
 const [tab, setTab] = useState("")
 const [powerBalance, setPowerBalance] = useState("0")
 const [nftPowerTab, setNFTPowerTab] = useState(false)
 const [tokenPowerTab, setTokenPowerTab] = useState(false);
 const [thisAmount, setAmount] = useState("");
 const [proposalText, setProposalText] = useState("")
 const [proposals, setProposals] = useState<IState["proposals"]>([]);
 const [numProposals, setNumProposals] = useState(0);

 const toggleNFTPower = () => {
   setNFTPowerTab(!nftPowerTab);
 };

  const toggleTokenPower = () => {
    setTokenPowerTab(!tokenPowerTab);
  };

 const getNFTContractInstance = (
   providerOrSigner: providers.Web3Provider | providers.JsonRpcSigner
 ) => {
   return new Contract(
     NFT_COLLECTION_ADDRESS,
     NFT_COLLECTION_ABI,
     providerOrSigner
   );
 };

 const getLJCryptoTokenInstance = (
   providerOrSigner: providers.Web3Provider | providers.JsonRpcSigner
 ): Contract => {
   return new Contract(
     LJCRYPTO_TOKEN_ADDRESS,
     LJCRYPTO_TOKEN_ABI,
     providerOrSigner
   );
 };

 const getLJCryptoDAOInstance = (
   providerOrSigner: providers.Web3Provider | providers.JsonRpcSigner
 ) => {
   return new Contract(
     LJCRYPTO_DAO_ADDRESS,
     LJCRYPTO_DAO_ABI,
     providerOrSigner
   );
 };


 async function fetchIPFSData() {
    const ipfsUrl = `https://ipfs.io/ipfs/QmRtZjU5pFrx1EwpwMZwQFDhpwxw12PBCWCQhztLzuQFQL`;
    const response = await fetch(ipfsUrl);
    const data = await response.json();
    console.log(data)
 }

 const getPowerBalance = async() => {
    const signer = await getProviderOrSigner(true);
    const contract = getLJCryptoDAOInstance(signer);
    const value = await contract.powerBalance();
    setPowerBalance(BigNumber.from(value).toString())
 }

 const approveNFTFunds = async () => {
   try {
     setLoading(true);
     const signer = await getProviderOrSigner(true);
     const nftContract = getNFTContractInstance(signer);
     const tx = await nftContract.setApprovalForAll(LJCRYPTO_DAO_ADDRESS, true);
     await tx.wait();
     window.alert("Your NFTs Have Been Approved For Your DAO Power Balance");
     setLoading(false);
   } catch (error: any) {
     setLoading(false);
     console.log(error);
     window.alert(error.data.message);
   }
 };


  const isNFTFundsApproved = async (): Promise<boolean> => {
    const signer = await getProviderOrSigner(true);
    const nftContract = getNFTContractInstance(signer);
    const thisAccount = await getAddress();
    const value = await nftContract.isApprovedForAll(
      thisAccount,
      LJCRYPTO_DAO_ADDRESS
    );
    return value;
  };


 const getPowerThroughNFT = async(id:string) => {
    const value = await isNFTFundsApproved();
    if (value === false) {
      await approveNFTFunds();
    } 
   try {
      setLoading(true)
      const signer = await getProviderOrSigner(true);
      const contract = getLJCryptoDAOInstance(signer);
      const tx = await contract.receivePowerThroughNFT(id);
      await tx.wait();
      setNFTPowerTab(false)
     if(id === "0") {
       window.alert(`One Has Been Added To Your Dao Power Balance`)
     } else {
       window.alert(`${id} Has Been Added To Your Dao Power Balance`)
     }
     setLoading(false)
   } catch (error:any) {
     setNFTPowerTab(false);
     setLoading(false)
     console.log(error)
     window.alert(error.data.message)
   }
 }

 const approveTokenFunds = async (amount: string) => {
   try {
     setLoading(true);
     const signer = await getProviderOrSigner(true);
     const tokenContract = getLJCryptoTokenInstance(signer);
     const tx = await tokenContract.approve(LJCRYPTO_DAO_ADDRESS, amount);
     await tx.wait();
     window.alert(`${amount} LJCryptoTokens Have Been Approved For Dao Power Balance`);
     setLoading(false);
   } catch (error: any) {
     setLoading(false);
     console.log(error);
     window.alert(error.data.message);
   }
 };


  const getPowerThroughToken = async (amount: string) => {
    await approveTokenFunds(amount)
    try {
      setLoading(true);
      const signer = await getProviderOrSigner(true);
      const contract = getLJCryptoDAOInstance(signer);
      const tx = await contract.receivePowerThroughToken(amount);
      await tx.wait();
      setTokenPowerTab(false);
      window.alert(`${amount} Has Been Added To Your Dao Power Balance`);
      setLoading(false);
    } catch (error: any) {
      setTokenPowerTab(false);
      setLoading(false);
      console.log(error);
      window.alert(error.data.message);
    }
  };



  const fetchProposal = async() => {
  const signer = await getProviderOrSigner(true);
  const contract = getLJCryptoDAOInstance(signer);
   const cid = (await contract.proposals(0)).cidHash;
  const decodedCid = ethers.utils.defaultAbiCoder.decode(["string"], cid);
  console.log(`\ndecodedValue: ${decodedCid[0]}\n`);
  console.log(cid)
  }

  const getNumOfProposals = async() => {
       const provider = await getProviderOrSigner(false);
       const contract = getLJCryptoDAOInstance(provider);
       const numOfProposals = await contract.numProposals();
       setNumProposals(BigNumber.from(numOfProposals).toNumber())
  }

  const fetchProposalById = async (id: number) => {
    try {
      let text, deadline
      const provider = await getProviderOrSigner(false);
      const contract = getLJCryptoDAOInstance(provider);
      const proposal = await contract.proposals(id);
      const cid = proposal.cidHash;
      const decodedCid = ethers.utils.defaultAbiCoder.decode(["string"], cid);
      const ipfsUrl = `https://ipfs.io/ipfs/${decodedCid[0]}`;
      const response = await fetch(ipfsUrl);
      text = await response.json()
      if(proposal.deadline < BigNumber.from(1)) {
        deadline = "First Voter Has To Start The Deadline"
      } else {
        deadline = new Date(parseInt(proposal.deadline.toString()) * 1000);
      }
      const parsedProposal = {
        proposalId: id,
        deadline: deadline,
        yesVotes: BigNumber.from(proposal.yes).toString(),
        noVotes: BigNumber.from(proposal.no).toString(),
        owner: proposal.proposalOwner,
        cidHash: text,
        executionStatus: proposal.executed,
        proposalApproved: proposal.proposalApproved,
      };
      return parsedProposal;
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAllProposals = async () => {
    try {
      const proposals = [];
      for (let i = 0; i < numProposals; i++) {
        const proposal = await fetchProposalById(i);
        proposals.push(proposal);
      }
      setProposals(proposals);
      return proposals;
    } catch (error) {
      console.error(error);
    }
  };

  const createProposal = async(proposal: string) => {
    try {
       setLoading(true);
       const signer = await getProviderOrSigner(true);
       const contract = getLJCryptoDAOInstance(signer);
       const tx = await contract.createProposal(proposal);
       await tx.wait();
       window.alert(`You Have Succesfully Created A Proposal`);
       setLoading(false);
    } catch (error:any) {
       setLoading(false);
       console.log(error);
       window.alert(error.data.message);
    }
  }

   async function pushProposalToIPFS(proposal: string) {
     const value = await ipfs.add(JSON.stringify(proposal));
     const hash = value.path
     console.log("hashCID:", hash)
     await createProposal(hash)
   }

   const voteOnProposal = async(proposalId:number, choice: number) => {
     try {
       setLoading(true);
       const signer = await getProviderOrSigner(true);
       const contract = getLJCryptoDAOInstance(signer);
       const tx = await contract.voteOnProposal(proposalId, choice);
       await tx.wait();
        setLoading(false)
     } catch (error:any) {
       setLoading(false)
       console.log(error)
       window.alert(error.data.message)
     }
   }


  useEffect(() => {
    setInterval(async function() {
       await getPowerBalance()
       await getNumOfProposals()
    }, 2 * 1000)
  }, [tab])


  useEffect(() => {
    fetchAllProposals();
    if (tab === "Vote On Proposal") {
      fetchAllProposals();
    } 
  }, [tab])

 const changeTabs = () => {
   if (tab === "Dao Power" && !loading) {
     return (
       <div>
         <p className="text-xl md:text-center md:text-xl uppercase font-bold ml-4 mb-16 relative top-2 text-white">
           <span className="mb-2">View and update your dao power</span> <br />{" "}
           (You can only obtain more power if it is at 0)
         </p>
         <div className="flex justify-start md:mx-auto w-40 items-center rounded-md px-2 h-8 bg-yellow-500 font-semibold mb-10 ml-4  whitespace-nowrap">
           DAO Power Balance:
         </div>
         <div className="flex flex-col md:mx-auto py-5 h-16 mb-20 w-48 md:w-56 bg-black rounded-md font-semibold ml-4">
           <p className="text-yellow-400 mb-5 md:mx-auto md:text-xl">
             Dao Balance: {powerBalance}
           </p>
         </div>
         <div className="flex justify-start md:mx-auto w-56 items-center rounded-md px-2 h-8 bg-yellow-500 font-semibold mb-10 ml-4  whitespace-nowrap">
           Obtain Power Through NFT:
         </div>
         <div className="md:flex md:justify-center">
           <button
             onClick={toggleNFTPower}
             className="rounded-2xl whitespace-nowrap ml-4 md:ml-0 bg-black text-yellow-500 h-8 shadow-button w-48 font-bold transition ease-in-out mb-20 hover:text-white"
           >
             Exchange NFTs
           </button>
           {nftPowerTab && (
             <div className="fixed top-0 left-0 w-full h-full bg-shade grid z-50 place-items-center">
               <div className="flex flex-col bg-yellow-500 w-80 rounded-xl h-auto">
                 <svg
                   viewBox="0 0 24 24"
                   color="#FFFFFF"
                   width="20px"
                   xmlns="http://www.w3.org/2000/svg"
                   className="relative left-280 top-4 cursor-pointer hover:scale-125"
                   onClick={toggleNFTPower}
                 >
                   <path d="M18.3 5.70997C17.91 5.31997 17.28 5.31997 16.89 5.70997L12 10.59L7.10997 5.69997C6.71997 5.30997 6.08997 5.30997 5.69997 5.69997C5.30997 6.08997 5.30997 6.71997 5.69997 7.10997L10.59 12L5.69997 16.89C5.30997 17.28 5.30997 17.91 5.69997 18.3C6.08997 18.69 6.71997 18.69 7.10997 18.3L12 13.41L16.89 18.3C17.28 18.69 17.91 18.69 18.3 18.3C18.69 17.91 18.69 17.28 18.3 16.89L13.41 12L18.3 7.10997C18.68 6.72997 18.68 6.08997 18.3 5.70997Z"></path>
                 </svg>
                 <div className="flex flex-col mt-4">
                   <p className="uppercase text-center font-bold text-xs  mb-3">
                     How much power you can get from nfts:
                   </p>
                   <ul className="mx-auto mb-3 text-red-700 font-semibold">
                     <li>TIER1(ID-0): +1 Power</li>
                     <li>TIER2(ID-1): +1 Power</li>
                     <li>TIER3(ID-2): +2 Power</li>
                     <li>TIER4(ID-3): +3 Power</li>
                     <li>TIER5(ID-4): +4 Power</li>
                     <li>TIER6(ID-5): +5 Power</li>
                     <li>TIER7(ID-6): +6 Power</li>
                     <li>TIER8(ID-7): +7 Power</li>
                     <li>TIER9(ID-8): +8 Power</li>
                     <li>TIER10(ID-9): +9 Power</li>
                     <li>TIER-STAKING(ID-10): +10 Power</li>
                     <li>TIER-BREEDING(ID-11): +11 Power</li>
                   </ul>
                   <input
                     type="number"
                     placeholder="Select ID"
                     onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                       setAmount(e.target.value)
                     }
                     className="px-4 w-40 mx-auto rounded-xl mb-5 focus:outline-none border border-solid border-yellow-500 text-yellow-500"
                   />
                 </div>
                 <button
                   className="rounded-2xl mx-auto bg-black mb-4  text-yellow-500 h-8 shadow-button w-40 font-bold transition ease-in-out hover:text-white "
                   onClick={() => getPowerThroughNFT(thisAmount)}
                 >
                   Get NFT Power
                 </button>
               </div>
             </div>
           )}
         </div>
         <div className="flex justify-start md:mx-auto w-300 items-center rounded-md px-2 h-8 bg-yellow-500 font-semibold mb-10 ml-4  whitespace-nowrap">
           Obtain Power Through LJCryptoToken:
         </div>
         <div className="md:flex md:justify-center">
           <button onClick={toggleTokenPower} className="rounded-2xl whitespace-nowrap ml-4 md:ml-0 bg-black text-yellow-500 h-8 shadow-button w-48 font-bold transition ease-in-out mb-12 hover:text-white">
             Exchange Tokens
           </button>
           {tokenPowerTab && (
             <div className="fixed top-0 left-0 w-full h-full bg-shade grid z-50 place-items-center">
               <div className="flex flex-col bg-yellow-500 w-80 rounded-xl h-auto">
                 <svg
                   viewBox="0 0 24 24"
                   color="#FFFFFF"
                   width="20px"
                   xmlns="http://www.w3.org/2000/svg"
                   className="relative left-280 top-4 cursor-pointer hover:scale-125"
                   onClick={toggleTokenPower}
                 >
                   <path d="M18.3 5.70997C17.91 5.31997 17.28 5.31997 16.89 5.70997L12 10.59L7.10997 5.69997C6.71997 5.30997 6.08997 5.30997 5.69997 5.69997C5.30997 6.08997 5.30997 6.71997 5.69997 7.10997L10.59 12L5.69997 16.89C5.30997 17.28 5.30997 17.91 5.69997 18.3C6.08997 18.69 6.71997 18.69 7.10997 18.3L12 13.41L16.89 18.3C17.28 18.69 17.91 18.69 18.3 18.3C18.69 17.91 18.69 17.28 18.3 16.89L13.41 12L18.3 7.10997C18.68 6.72997 18.68 6.08997 18.3 5.70997Z"></path>
                 </svg>
                 <div className="flex flex-col mt-4">
                   <p className="uppercase text-center font-bold text-xs  mb-3">
                     Obtain <span className="text-red-500 italic">1</span> Power Per Token:
                   </p>
                   <input
                     type="number"
                     placeholder="Amount"
                     onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                       setAmount(e.target.value)
                     }
                     className="px-4 w-40 mx-auto rounded-xl mb-5 focus:outline-none border border-solid border-yellow-500 text-yellow-500"
                   />
                 </div>
                 <button
                   className="rounded-2xl mx-auto bg-black mb-4  text-yellow-500 h-8 shadow-button w-40 font-bold transition ease-in-out hover:text-white "
                   onClick={() => getPowerThroughToken(thisAmount)}
                 >
                   Get Token Power
                 </button>
               </div>
             </div>
           )}
         </div>
       </div>
     );
   }
   if (tab === "Create Proposal" && !loading) {
     return (
       <div className="flex flex-col items-center">
         <p className="text-xl md:text-center md:text-xl uppercase font-bold ml-4 mb-16 relative top-2 text-white">
           Write And Create your proposal here
         </p>
         <textarea
           className="resize-none w-85 bg-black text-yellow-500 mb-10 p-5 h-40 outline-none rounded-lg"
           placeholder="Enter Your Proposal"
           onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
             setProposalText(e.target.value)
           }
         ></textarea>
         <button
          onClick={() => pushProposalToIPFS(proposalText)}
           className="rounded-2xl whitespace-nowrap bg-black text-yellow-500 h-8 shadow-button w-48 font-bold transition ease-in-out mb-20 hover:text-white"
         >
           Submit Proposal
         </button>
       </div>
     );
   }
   
   if (tab === "Vote On Proposal" && !loading) {
     return (
       <div>
         <p className="text-xl md:text-center md:text-xl uppercase font-bold ml-4 mb-16 relative top-2 text-white">
           Vote On Proposals Before Their Deadlines
         </p>
         <div className="md:flex md:flex-col md:items-center ml-4 md:ml-0">
           {proposals.map((p, idx) => (
             <div
               key={idx}
               className="bg-black text-yellow-500 w-85 h-auto rounded-2xl p-5 mb-5"
             >
               <p className="mb-2">
                 Proposal Number: <span className="pl-1">{p?.proposalId}</span>
               </p>
               <p className="mb-5 break-words">
                 The Proposal:
                 <span className="pl-2">{p?.cidHash}</span>
               </p>
               <span className="text-red-500 bold italic">
                 Deadline To Vote: {p?.deadline.toLocaleString()}
               </span>
               {account === p?.owner ? (
                 <div className="pt-5">
                   <p>The Owner Can't Vote</p>
                 </div>
               ) : (
                 <div className="pt-5">
                   {/* render the voting buttons based on whether the user has already voted or is the proposalOwner */}
                   <button
                     onClick={() => voteOnProposal(p.proposalId, 1)}
                     className="rounded-2xl whitespace-nowrap bg-yellow-500 px-2 text-black h-8 shadow-button w-auto font-bold transition ease-in-out mr-5 hover:text-white"
                   >
                     Vote Yes
                   </button>
                   <button
                     onClick={() => voteOnProposal(p.proposalId, 2)}
                     className="rounded-2xl whitespace-nowrap bg-yellow-500 px-2 text-black h-8 shadow-button w-auto font-bold transition ease-in-out hover:text-white"
                   >
                     Vote No
                   </button>
                 </div>
               )}
             </div>
           ))}
         </div>
       </div>
     );
   }
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
            Governance: Use Tokens and NFTs to Create, Vote, Execute, And View
            Proposals
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
        <div className="flex justify-between px-5 flex-wrap mb-10">
          {tab !== "Dao Power" && (
            <button
              onClick={() => setTab("Dao Power")}
              className="rounded-2xl  whitespace-nowrap ml-4 bg-black text-yellow-500 h-8 shadow-button w-auto font-bold transition ease-in-out mb-12 delay-75 hover:scale-75"
            >
              Receive Dao Power
            </button>
          )}
          {tab !== "Create Proposal" && (
            <button
              onClick={() => setTab("Create Proposal")}
              className="rounded-2xl  whitespace-nowrap ml-4 bg-black text-yellow-500 h-8 shadow-button w-auto font-bold transition ease-in-out mb-12 delay-75 hover:scale-75"
            >
              Create Proposals
            </button>
          )}
          {tab !== "Vote On Proposal" && (
            <button
              onClick={() => setTab("Vote On Proposal")}
              className="rounded-2xl  whitespace-nowrap ml-4 bg-black text-yellow-500 h-8 shadow-button w-auto font-bold transition ease-in-out mb-12 delay-75 hover:scale-75"
            >
              Vote On Proposals
            </button>
          )}
          {tab !== "View Proposals" && (
            <button
              onClick={() => setTab("View Proposals")}
              className="rounded-2xl  whitespace-nowrap ml-4 bg-black text-yellow-500 h-8 shadow-button w-auto font-bold transition ease-in-out mb-12 delay-75 hover:scale-75"
            >
              View Proposals
            </button>
          )}
        </div>
      )}
      {changeTabs()}
    </main>
  );
};

// export async function getServerSideProps() {
//   //  const provider = await getProviderOrSigner(false);
//    const contract = new Contract(
//      LJCRYPTO_DAO_ADDRESS,
//      LJCRYPTO_DAO_ABI,
//      window.ethereum
//    );;
//   const data = await contract.fetchAllProposals();;
//   return {
//     props: {
//       proposals: JSON.parse(JSON.stringify(data)),
//     },
//   };
// }

export default Dao;