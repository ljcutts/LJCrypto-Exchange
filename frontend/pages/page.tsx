import {useState, useEffect, useRef} from 'react'
import { IState as Props } from "./index";
import Link from "next/link";
import { providers, Contract, BigNumber, ethers } from "ethers";
import Web3Modal from "web3modal";

import {
  GUESSING_GAME_ABI,
  GUESSING_GAME_ADDRESS
} from "../constants/guessingGame";

type IState = {
  account: string | null;
  setAccount: React.Dispatch<React.SetStateAction<string | null>>;
  amount: string
  setAmount: React.Dispatch<React.SetStateAction<string>>;
};

 

const GuessingGame: React.FC = () => {
  const zero = BigNumber.from(0);
  const [account, setAccount] = useState<IState["account"]>(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const [thisAmount, setAmount] = useState<IState["amount"]>("");

  const getGuessingGameContractInstance = (providerOrSigner: any) => {
    return new Contract(
      GUESSING_GAME_ADDRESS,
      GUESSING_GAME_ABI,
      providerOrSigner
    );
  };

  const joinGame = async(amount:string) => {
    try {
       const signer = await getProviderOrSigner(true);
       const daoContract = getGuessingGameContractInstance(signer);
       const txn = await daoContract.enterGuessingGame({value: ethers.utils.parseEther(`${amount}`)});
       await txn.wait();
    } catch (error) {
      console.log(error)
    }
  }

  const isNumberAboveZero = async () :Promise<boolean> => {
    const provider = await getProviderOrSigner(true);
    const contract = getGuessingGameContractInstance(provider);
    const value = await contract.numberAboveZero(); 
    console.log(value)
    return value;
  };

  const web3ModalRef: any = useRef();

  const getAddress = async() => {
     const provider = await web3ModalRef.current.connect();
     const web3Provider = new providers.Web3Provider(provider);
     setAccount(await web3Provider.getSigner().getAddress());
     //Fetch the balance of the User
  }
  


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


   const connectWallet = async () => {
     try {
       // Get the provider from web3Modal, which in our case is MetaMask
       // When used for the first time, it prompts the user to connect their wallet
       await getProviderOrSigner();
       setWalletConnected(true);
     } catch (err) {
       console.error(err);
     }
   };

  useEffect(() => {
     if (!walletConnected) {
       // Assign the Web3Modal class to the reference object by setting it's `current` value
       // The `current` value is persisted throughout as long as this page is open
       web3ModalRef.current = new Web3Modal({
         network: "rinkeby",
         providerOptions: {},
         //  disableInjectedProvider: false,
       });
     } 
    getAddress()
  }, [walletConnected])

 const handleChange = (
   e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
 ) => {
   setAmount(e.target.value);
 };

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
          <p className="text-xl text-black">
            {account !== null ? (
              <p className="text-xl">
                {account.slice(0, 6)}...
                {account.slice(-4)}
              </p>
            ) : (
              <p onClick={connectWallet}> Connect </p>
            )}
          </p>
        </button>
      </nav>
      <div className="flex items-center h-32 w-auto bg-black rounded-2xl relative top-10">
        <p className="flex items-center text-yellow-500 mx-auto text-xl font-bold uppercase px-4 ">
          Guess correctly if the random number generated is greater than 10
          ether and money will be sent to your account!!!
        </p>
      </div>
      <div className="flex flex-col justify-center mx-auto relative top-32">
        <p className="text-white text-2xl font-bold uppercase mx-auto px-4 mb-10">
          You need to pay 0.1 Ether Or More To Enter The Game
        </p>
        <div className="flex flex-col">
          <p className="mx-auto text-white text-2xl uppercase font-bold mb-3 ">
            Enter Amount Here
          </p>
          <input
            className="px-4 w-40 mx-auto rounded-xl mb-10 focus:outline-none border border-solid border-yellow-500 bg-black text-yellow-500"
            type="number"
            placeholder="Amount In Ether"
            onChange={handleChange}
          />
        </div>
        {thisAmount === "0" || thisAmount === "" ? (
          <button className="rounded-2xl mx-auto bg-yellow-500 text-white h-8 shadow-button w-40 font-bold transition ease-in-out hover:bg-yellow-300 opacity-50 mb-10">
            Join Game
          </button>
        ) : (
          <button
            onClick={() => joinGame(thisAmount)}
            className="rounded-2xl mx-auto bg-yellow-500 text-white h-8 shadow-button w-40 font-bold transition ease-in-out hover:bg-yellow-300 mb-12"
          >
            Join Game
          </button>
        )}
        <p className="mx-auto text-white text-2xl font-bold uppercase mt-5">
          Current Players:
        </p>
        <p className="mx-auto text-white text-2xl font-bold uppercase mb-5">
          (Only 2 players can enter at a time)
        </p>
        <div className="flex flex-col h-12 w-80 mx-auto pl-3 bg-black rounded-md text-yellow-500 font-bold">
          {/* <div>
            1. {account.slice(0, 25)}...
            {account.slice(-4)}
          </div>
          <div>
            2. {account.slice(0, 25)}...
            {account.slice(-4)}
          </div> */}
        </div>
      </div>
      <div className="flex flex-row justify-between mx-auto translate-x-1/2 translate-y-down50% justify-self-center max-w-xs bg-black text-white rounded-2xl border border-solid border-yellow-400 z-50 fixed bottom-0 right-1/2 pr-4 whitespace-nowrap overflow-x-scroll">
        <a className=" text-black font-semibold mr-4 px-2 rounded-3xl bg-yellow-400 flex items-center justify-center">
          Guessing Game
        </a>
        <a className="pr-4 hover:text-yellow-500">Lottery Game</a>
        <a className="pr-4">Staking</a>
        <a className="pr-4">Liquidity Pools</a>
        <a className="pr-4">Tokens&NFTs</a>
      </div>
    </main>
  );
};

export default GuessingGame