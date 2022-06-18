import React, { useState, useContext, useEffect } from "react";
import Link from "next/link";
import { Web3Context, useWeb3 } from "../context";
import { providers, Contract, BigNumber, ethers } from "ethers";
import styles from "../styles/Home.module.css";

import {LOTTERY_ADDRESS, LOTTERY_ABI} from "../constants/lotterygame"

import {subgraphQuery2} from '../utils'
import { FETCH_LOTTERYGAME } from "../queries";
import Head from "next/head";


type IState = {
  players: string[];
  setPlayers: React.Dispatch<React.SetStateAction<string[]>>;
  winners: string[];
  setWinners: React.Dispatch<React.SetStateAction<string[]>>;
};

const LotteryGame: React.FC = () => {
  const {
    account,
    connectWallet,
    getProviderOrSigner,
    loading,
    setLoading,
  } = useContext(Web3Context) as useWeb3;

  const getLotteryInstance = (
    providerOrSigner: providers.Web3Provider | providers.JsonRpcSigner
  ) => {
    return new Contract(
      LOTTERY_ADDRESS,
      LOTTERY_ABI,
      providerOrSigner
    );
  };
  
  const [lotteryDay, setLotteryDay] = useState(0)
  const [entryAmount, setEntryAmount] = useState("0");
  const [inGame, setInGame] = useState(false);
  const [players, setPlayers] = useState<IState['players']>([])
  const [winners, setWinners] = useState<IState["winners"]>([]);
  const [lastWinner, setLastWinner] = useState("")
  const [countDownDate, setCountDownDate] = useState(0)
  const [countDown, setCountDown] = useState(0);


  async function fetchFromLotteryGame() {
    const lotteryDay = await getLotteryDay()
    const gameArray = await subgraphQuery2(FETCH_LOTTERYGAME());
   const totalPlayers = [];
   for (let i = 0; i < lotteryDay; i++) {
    for (let z = 0; z < gameArray.lotteryGames[i].player.length; z++) {
      totalPlayers.push(gameArray.lotteryGames[i].player[z]);
    }
   }
   setPlayers(totalPlayers);
   const allWinners = []
   for (let i = 0; i < lotteryDay+1; i++) { 
    for (let z = 0; z < gameArray.lotteryGames[i].winner.length; z++) {
      allWinners.push(gameArray.lotteryGames[i].winner[z]);
    }
   }
    setWinners(allWinners);
    const lastWinnerOne = winners[winners.length-1]?.slice(0, 6)
    const lastWinnerTwo = winners[winners.length-1]?.slice(-4)
    const lastWinner =  `${lastWinnerOne}...${lastWinnerTwo}`
    setLastWinner(lastWinner);  
  }

  const getLotteryDay = async () => {
    const provider = window.ethereum;
    const web3Provider = new providers.Web3Provider(provider);
    const lotterycontract = getLotteryInstance(web3Provider);
    const value = await lotterycontract.getLotteryDay();
    setLotteryDay(BigNumber.from(value).toNumber() + 1);
    return BigNumber.from(value).toNumber();
  };

  const getEntryAmount = async () => {
    const provider = window.ethereum;
    const web3Provider = new providers.Web3Provider(provider);
    const lotterycontract = getLotteryInstance(web3Provider);
    const value = await lotterycontract.getEntryAmount();
    setEntryAmount(ethers.utils.formatEther(value));
  };

  const areYouIn = async () => {
    const provider = window.ethereum;
    const web3Provider = new providers.Web3Provider(provider).getSigner();
    const lotterycontract = getLotteryInstance(web3Provider);
    const value = await lotterycontract.areYouIn();
    setInGame(value);
  };

   const getDeadline = async () => {
     const provider = window.ethereum;
     const web3Provider = new providers.Web3Provider(provider);
     const lotterycontract = getLotteryInstance(web3Provider);
     const value = await lotterycontract.deadline();
     setCountDownDate(new Date(parseInt(value.toString()) * 1000).getTime());
   };



  const enterLotteryGame = async () => {
    try {
      setLoading(true);
      const signer = await getProviderOrSigner(true);
      const contract = getLotteryInstance(signer);
      const tx = await contract.enterTheGame({
        value: ethers.utils.parseEther(entryAmount),
      });
      await tx.wait();
      window.alert(`You Have Successfully Entered The Lottery Game`);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      console.log(error);
      window.alert(error.data.message);
    }
  };


  useEffect(() => {
     getLotteryDay()
         const interval = setInterval(() => {
           setCountDown(countDownDate - new Date().getTime());
         }, 1000);
         return () => clearInterval(interval);
  }, [countDownDate]);

  useEffect(() => {
    getEntryAmount()
    fetchFromLotteryGame()
    areYouIn()
    getDeadline();
  })

   const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
   const hours = Math.floor(
     (countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
   );
   const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
   const seconds = Math.floor((countDown % (1000 * 60)) / 1000);


  return (
    <main className="bg-gradient-to-r from-yellow-300 to-black bg-no-repeat bg-[length:auto_100%] h-screen overflow-y-scroll">
      <Head>
        <title>Lottery Game</title>
        <meta
          name="description"
          content="Enter Lottery Game for a chance to win some matic"
        />
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
          <p>Join The LotteryGame And Posssibly Win Some Matic!!!</p>
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
          <p className="flex justify-center mb-3 text-white text-2xl font-bold uppercase">
            Time Left Until Next Winner Is Chosen
          </p>
          {countDownDate > new Date().getTime() ? (
            <div className="flex justify-center mb-16">
              <div className="flex items-center mr-3 flex-col">
                <p className="font-bold text-2xl text-yellow-400">{hours}</p>
                <div className="flex items-center rounded-md px-2 h-8 bg-yellow-500 font-semibold mb-2  whitespace-nowrap">
                  Hours
                </div>
              </div>
              <div className="flex items-center mr-3 flex-col">
                <p className="font-bold text-2xl text-yellow-400">{minutes}</p>
                <div className="flex items-center rounded-md px-2 h-8 bg-yellow-500 font-semibold mb-2  whitespace-nowrap">
                  Minutes
                </div>
              </div>
              <div className="flex items-center mr-3 flex-col">
                <p className="font-bold text-2xl text-yellow-400">{seconds}</p>
                <div className="flex items-center rounded-md px-2 h-8 bg-yellow-500 font-semibold mb-2  whitespace-nowrap">
                  Seconds
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center mb-16">
              <div className="flex items-center mr-3 flex-col">
                <p className="font-bold text-2xl text-yellow-400">0</p>
                <div className="flex items-center rounded-md px-2 h-8 bg-yellow-500 font-semibold mb-2  whitespace-nowrap">
                  Hours
                </div>
              </div>
              <div className="flex items-center mr-3 flex-col">
                <p className="font-bold text-2xl text-yellow-400">0</p>
                <div className="flex items-center rounded-md px-2 h-8 bg-yellow-500 font-semibold mb-2  whitespace-nowrap">
                  Minutes
                </div>
              </div>
              <div className="flex items-center mr-3 flex-col">
                <p className="font-bold text-2xl text-yellow-400">0</p>
                <div className="flex items-center rounded-md px-2 h-8 bg-yellow-500 font-semibold mb-2  whitespace-nowrap">
                  Seconds
                </div>
              </div>
            </div>
          )}
          <p className="flex justify-center mb-8 text-white text-2xl font-bold uppercase">
            Current Game Number:
            <span className="pl-2 text-yellow-500">{lotteryDay}</span>
          </p>
          {inGame === false ? (
            <>
              <p className="flex justify-center mb-3 text-white text-2xl font-bold uppercase">
                Enter the game
              </p>
              <p className="flex justify-center mb-3 text-white italic text-2xl font-bold uppercase">
                <span className="text-yellow-500 pr-2">{entryAmount}</span>
                matic to enter
              </p>
              <div className="flex justify-center">
                <button
                  onClick={enterLotteryGame}
                  className="rounded-2xl bg-yellow-500 text-white h-8 w-40 font-bold transition ease-in-out hover:bg-yellow-300 mb-12"
                >
                  Join Lottery
                </button>
              </div>
            </>
          ) : (
            <p className="flex justify-center mb-20 text-white text-2xl font-bold uppercase">
              Please wait until the next winner is chosen
            </p>
          )}
          <div className="flex md:ml-5 justify-center pb-5 flex-col md:flex-row items-center">
            <div className="flex flex-col justify-center">
              <p className="pl-14 text-white text-lg font-bold uppercase">
                Player Count:
                <span className="pl-1 text-yellow-500 text-lg font-bold">
                  {players?.length}
                </span>
              </p>
              <div
                className={
                  players.length === 0
                    ? "w-64 h-48 mr-4 bg-black rounded-md overflow-scroll"
                    : "w-auto pr-2 h-48 mr-4 bg-black rounded-md overflow-scroll"
                }
              >
                <ol start={1} className="text-yellow-500 font-bold pl-6">
                  {players?.map((p, idx) => {
                    return (
                      <li key={idx}>
                        {p.slice(0, 20)}...
                        {p.slice(-4)}
                      </li>
                    );
                  })}
                </ol>
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-white flex flex-nowrap text-lg font-bold">
                Last Winner:
                <span className="pl-2 text-yellow-500 text-lg font-bold">
                  {lastWinner.includes(`undefined`) ? (
                    "NO_WINNER_YET"
                  ) : (
                    <span className="whitespace-nowrap">{lastWinner}</span>
                  )}
                </span>
              </p>
              <div className={
                  winners.length === 0
                    ? "w-64 h-48 mr-4 bg-black rounded-md overflow-scroll"
                    : "w-auto pr-2 h-48 mr-4 bg-black rounded-md overflow-scroll"
                }>
                <ol className="text-yellow-500 font-bold pl-6">
                  {winners?.map((w, idx) => {
                    return (
                      <li key={idx}>
                        {w.slice(0, 20)}...
                        {w.slice(-4)}
                      </li>
                    );
                  })}
                </ol>
              </div>
            </div>
          </div>
        </>
      )}
      {!loading && (
        <div className="flex flex-row justify-between mx-auto justify-self-center max-w-xs md:max-w-lg bg-black text-white rounded-2xl border border-solid border-yellow-400 relative top-20  pr-4 whitespace-nowrap overflow-x-scroll">
          <a className=" text-black font-semibold mr-4 px-2 rounded-3xl bg-yellow-400 flex items-center justify-center">
            Lottery Game
          </a>
          <Link href="/dao">
            <a className="pr-4 hover:text-yellow-500 cursor-pointer">
              Governance
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
          <Link href="/swap">
            <a className="pr-4 hover:text-yellow-500 cursor-pointer">Swap</a>
          </Link>
        </div>
      )}
    </main>
  );

}

export default LotteryGame