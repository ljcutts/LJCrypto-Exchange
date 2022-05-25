import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { providers, Contract, BigNumber, ethers } from "ethers";
import Web3Modal from "web3modal";
import { FETCH_GUESSINGGAME } from "../queries";
import { subgraphQuery } from "../utils";

import {
  GUESSING_GAME_ABI,
  GUESSING_GAME_ADDRESS,
} from "../constants/guessingGame";
//Make a window.alert where the user gets notified whether or not they guessed right and how much they guessed

type IState = {
  account: string | null;
  setAccount: React.Dispatch<React.SetStateAction<string | null>>;
  player: string | null;
  setPlayer: React.Dispatch<React.SetStateAction<string | null>>;
  winner: string | null;
  setWinner: React.Dispatch<React.SetStateAction<string | null>>;
  otherPlayer: string | null;
  setOtherPlayer: React.Dispatch<React.SetStateAction<string | null>>;
  amount: string;
  setAmount: React.Dispatch<React.SetStateAction<string>>;
  numberIsZero: boolean;
  setNumberIsZero: React.Dispatch<React.SetStateAction<boolean>>;
  page: boolean;
  setPage: React.Dispatch<React.SetStateAction<boolean>>;
};

const GuessingGame: React.FC = () => {
  const zero = BigNumber.from(0);
  const [account, setAccount] = useState<IState["account"]>(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const [thisAmount, setAmount] = useState<IState["amount"]>("");
  const [player, setPlayer] = useState<IState["player"]>("");
  const [winner, setWinner] = useState<IState["winner"]>("");
  const [otherPlayer, setOtherPlayer] = useState<IState["otherPlayer"]>("");
  const [numberisZero, setNumberIsZero] = useState<IState["numberIsZero"]>(false);
  const [page, setPage] = useState<IState["page"]>(false);
  

  const getGuessingGameContractInstance = (providerOrSigner: any) => {
    return new Contract(
      GUESSING_GAME_ADDRESS,
      GUESSING_GAME_ABI,
      providerOrSigner
    );
  };

  async function fetchFromGame() {
    const gameArray = await subgraphQuery(FETCH_GUESSINGGAME());
    const player1 = gameArray.guessingGames[0].Player[0];
    const player2 = gameArray.guessingGames[0].Player[1];
    const winner = gameArray.guessingGames[0].Winner
    if (player1 === undefined) {
      setPlayer("");
    } else {
      setPlayer(player1);
    }
    if (player2 === undefined) {
      setOtherPlayer("");
    } else {
      setOtherPlayer(player2);
    }

    if(winner === undefined) {
      setWinner("")
    } else {
      setWinner(winner)
    }
  }

  const restartGame = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const daoContract = getGuessingGameContractInstance(signer);
      const txn = await daoContract.timeIsUp()
      await txn.wait();
    } catch (error) {
      console.log(error);
      window.alert(
        "10 Minutes Haven't Passed Since Both Players Joined The Game"
      );
    }
  };



  const joinGame = async (amount: string) => {
    try {
      const signer = await getProviderOrSigner(true);
      const daoContract = getGuessingGameContractInstance(signer);
      const txn = await daoContract.enterGuessingGame({
        value: ethers.utils.parseEther(`${amount}`),
      });
      await txn.wait();
    } catch (error:any) {
      console.log(error);
      window.alert(error.error.message)
    }
  };

  const isNumberAboveZero = async (): Promise<boolean> => {
    const provider = await getProviderOrSigner(true);
    const contract = getGuessingGameContractInstance(provider);
    const value = await contract.numberAboveZero();
    setNumberIsZero(value);
    return value;
  };

  const web3ModalRef: any = useRef();

  const getAddress = async () => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);
    const thisAccount = await web3Provider.getSigner().getAddress();
    setAccount(await web3Provider.getSigner().getAddress());
    return thisAccount;
  };


  const makeAGuess = async (guess: boolean) => {
    try {
      const signer = await getProviderOrSigner(true);
      const daoContract = getGuessingGameContractInstance(signer);
      const txn = await daoContract.guessTheNumberValue(guess);
      await txn.wait();
    } catch (error) {
      console.log(error);
      window.alert("Either You are Not A Player Or You Have Already Guessed")
    }
  };

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
     setInterval(async function () {
       await getAddress();
       await isNumberAboveZero()
       await fetchFromGame();
     }, 0.5 * 1000);
  }, [walletConnected, account, numberisZero]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setAmount(e.target.value);
  };

  const togglePage = () => {
    setPage(!page);
  };

  const guessPage = () => {
    if (page === true) {
      return (
        <button
          onClick={togglePage}
          className="rounded-2xl mx-auto bg-black text-yellow-500 h-8 shadow-button w-40 font-bold transition ease-in-out mb-10"
        >
          Join The Game
        </button>
      );  
    }
  };

  const renderPage = () => {
    if (page === false) {
      return thisAmount === "0" || thisAmount === "" ? (
        <div className="flex justify-start">
          <button  className="rounded-2xl mx-auto bg-yellow-500 md:relative md:left-40 text-white h-8 shadow-button w-40 font-bold transition ease-in-out  opacity-50 mb-10">
            Enter Game
          </button>
          <button 
            onClick={togglePage}
            className="rounded-2xl mx-auto bg-black md:relative md:right-40 text-yellow-500 h-8 shadow-button w-40 font-bold transition ease-in-out mb-10"
          >
            Make Guess Here
          </button>
        </div>
      ) : (
        <div className="flex justify-start">
          <button onClick={() => joinGame(thisAmount)} className="rounded-2xl mx-auto bg-yellow-500 md:relative md:left-40 text-white h-8 shadow-button w-40 font-bold transition ease-in-out mb-10">
            Enter Game
          </button>
          <button
            onClick={togglePage}
            className="rounded-2xl mx-auto bg-black md:relative md:right-40 text-yellow-500 h-8 shadow-button w-40 font-bold transition ease-in-out mb-10"
          >
            Make Guess Here
          </button>
        </div>
      );
    }
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
      <div className="flex items-center h-32 w-auto bg-black rounded-2xl relative top-10">
        <p className="flex items-center text-yellow-500 mx-auto text-xl font-bold uppercase px-4 ">
          Guess correctly if the random number generated is greater than 50 and
          money will be sent to your account!!!
        </p>
      </div>
      <div className="flex flex-col justify-center mx-auto relative top-32">
        {page === true &&
          (numberisZero === false ? (
            <p className="text-white text-2xl font-bold uppercase mx-auto px-4 mb-10">
              Please Wait Until a number has been generated
            </p>
          ) : (
            <p className="text-white text-2xl font-bold uppercase mx-auto px-4 mb-10">
              You can now enter your guess!!!
            </p>
          ))}

        {page === false && (
          <p className="text-white text-2xl font-bold uppercase mx-auto px-4 mb-10">
            You need to pay 0.1 Ether Or More To Enter The Game
          </p>
        )}

        <div className="flex flex-col">
          {page === false ? (
            <p className="mx-auto text-white text-2xl uppercase font-bold mb-3 ">
              Enter Amount Here
            </p>
          ) : (
            <p className="mx-auto text-white text-2xl uppercase font-bold mb-3 ">
              What is the correct answer?
            </p>
          )}
          {page === false && (
            <input
              className="px-4 w-40 mx-auto rounded-xl mb-10 focus:outline-none border border-solid border-yellow-500 bg-black text-yellow-500"
              type="number"
              placeholder="Amount In Ether"
              onChange={handleChange}
            />
          )}
          {page === true &&
            (numberisZero === false ? (
              <div className="flex justify-start">
                <button className="rounded-2xl mx-auto opacity-50 md:relative md:left-20 bg-yellow-500 text-white h-8 shadow-button w-40 font-bold transition ease-in-out hover:bg-yellow-300 mb-12">
                  True
                </button>
                <button className="rounded-2xl mx-auto opacity-50 bg-yellow-500 md:relative md:right-20 text-white h-8 shadow-button w-40 font-bold transition ease-in-out hover:bg-yellow-300 mb-12">
                  False
                </button>
              </div>
            ) : (
              <div className="flex justify-start">
                <button
                  onClick={() => makeAGuess(true)}
                  className="rounded-2xl mx-auto md:relative md:left-20 bg-yellow-500 text-white h-8 shadow-button w-40 font-bold transition ease-in-out hover:bg-yellow-300 mb-12"
                >
                  True
                </button>
                <button
                  onClick={() => makeAGuess(false)}
                  className="rounded-2xl mx-auto bg-yellow-500 md:relative md:right-20 text-white h-8 shadow-button w-40 font-bold transition ease-in-out hover:bg-yellow-300 mb-12"
                >
                  False
                </button>
              </div>
            ))}
        </div>
        {renderPage()}
        {guessPage()}
        <p className="mx-auto text-white text-2xl font-bold uppercase mt-5">
          The Winner:
        </p>
        <div className="flex flex-col h-7 text-xl w-80 mx-auto pl-3 bg-black rounded-md text-yellow-500 font-bold mb-5">
          {winner !== null ? (
            <p className="text-xl">
              {winner.slice(0, 20)}...
              {winner.slice(-4)}
            </p>
          ) : (
            ""
          )}
        </div>
        <p className="mx-auto text-white text-2xl font-bold uppercase mt-5">
          Current Players:
        </p>
        <p className="mx-auto text-white text-xl font-bold uppercase mb-5 md:text-2xl">
          (Only 2 players can enter at a time)
        </p>
        <div className="flex flex-col h-14 w-80 mx-auto pl-3 bg-black rounded-md text-yellow-500 font-bold mb-5">
          <div>
            {player !== null ? (
              <p className="text-xl">
                1. {player.slice(0, 20)}...
                {player.slice(-4)}
              </p>
            ) : (
              ""
            )}
          </div>
          <div>
            {otherPlayer !== null ? (
              <p className="text-xl">
                2. {otherPlayer.slice(0, 20)}...
                {otherPlayer.slice(-4)}
              </p>
            ) : (
              <p className="text-xl">2. {otherPlayer}</p>
            )}
          </div>
        </div>
        <p className="mx-auto text-white text-2xl font-bold uppercase mt-5 mb-5">
          Restart The Game
        </p>
        <p className="mx-auto text-white text-xl font-bold uppercase mb-5 md:text-2xl">
          (This is only if 10 minutes passed and the 2 players have not guessed
          yet)
        </p>
        <button
          onClick={restartGame}
          className="rounded-2xl mx-auto bg-yellow-500 text-white h-8 shadow-button w-40 font-bold transition ease-in-out mb-10"
        >
          Restart
        </button>
      </div>
      <div className="flex flex-row justify-between mx-auto translate-x-1/2 translate-y-down50% justify-self-center max-w-xs bg-black text-white rounded-2xl border border-solid border-yellow-400 z-50 fixed bottom-0 right-1/2 pr-4 whitespace-nowrap overflow-x-scroll">
        <a className=" text-black font-semibold mr-4 px-2 rounded-3xl bg-yellow-400 flex items-center justify-center">
          Guessing Game
        </a>
        <a className="pr-4 hover:text-yellow-500 cursor-pointer">
          Lottery Game
        </a>
        <a className="pr-4 hover:text-yellow-500 cursor-pointer">Staking</a>
        <a className="pr-4 hover:text-yellow-500 cursor-pointer">
          Liquidity Pools
        </a>
        <a className="pr-4 hover:text-yellow-500 cursor-pointer">Tokens&NFTs</a>
      </div>
    </main>
  );
};

export default GuessingGame;
