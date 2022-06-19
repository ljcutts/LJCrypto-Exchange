import React, { useState, useContext, useEffect } from "react";
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
import Head from "next/head";

type IState = {
  account: string | null;
  setAccount: React.Dispatch<React.SetStateAction<string | null>>;
  ljcryptoPrice: string;
  setLJCryptoPrice: React.Dispatch<React.SetStateAction<string>>;
  ljcryptoBalance: string | undefined;
  setLJCryptoBalance: React.Dispatch<React.SetStateAction<string | undefined>>;
  ljcryptoEtherBalance: string;
  setLJCryptoEtherBalance: React.Dispatch<React.SetStateAction<string>>;
  ljstablecoinBalance: string | undefined;
  setLJStableCoinBalance: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
  ljstablecoinEtherBalance: string;
  setLJStableCoinEtherBalance: React.Dispatch<React.SetStateAction<string>>;
  amount: string;
  setAmount: React.Dispatch<React.SetStateAction<string>>;
};

const Tokens: React.FC = () => {
  const {
    account,
    connectWallet,
    getProviderOrSigner,
    getAddress,
    loading,
    setLoading,
  } = useContext(Web3Context) as useWeb3;

  const zero = BigNumber.from(0);
  const [ljcryptoPrice, setLJCryptoPrice] =
    useState<IState["ljcryptoPrice"]>("0");
  const [ljcryptoBalance, setLJCryptoBalance] =
    useState<IState["ljcryptoBalance"]>("0");
  const [ljcryptoEtherBalance, setLJCryptoEtherBalance] =
    useState<IState["ljcryptoEtherBalance"]>("0");
  const [ljstablecoinBalance, setLJStableCoinBalance] =
    useState<IState["ljstablecoinBalance"]>("0");
  const [ljstablecoinEtherBalance, setLJStableCoinEtherBalance] =
    useState<IState["ljstablecoinBalance"]>("0");
  const [ljcryptoStakingBalance, setLJCryptoStakingBalance] = useState("0");
  const [ljstablecoinStakingBalance, setLJStableCoinStakingBalance] =
    useState("0");
  const [ljcryptoStakingInEther, setLJCryptoStakingInEther] = useState("0");
  const [ljstableCoinStakingInEther, setLJStableCoinStakingInEther] =
    useState("0");
  const [thisAmount, setAmount] = useState<IState["amount"]>("");
  const [buyljCrypto, setbuyLJCrypto] = useState(false);
  const [sellljCrypto, setSellLJCrypto] = useState(false);
  const [buyljStable, setbuyLJStable] = useState(false);
  const [sellljStable, setsellLJStable] = useState(false);
  const [stakeLJCrypto, setStakeLJCrypto] = useState(false);
  const [unStakeLJCrypto, setUnstakeLJCrypto] = useState(false);
  const [stakeLJStable, setStakeLJStable] = useState(false);
  const [unStakeLJStable, setUnstakeLJStable] = useState(false);

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

  const getLJCryptoTokenPrice = async () => {
    const provider = window.ethereum;
    const web3Provider = new providers.Web3Provider(provider).getSigner();
    const contract = getLJCryptoTokenInstance(web3Provider);
    const value = await contract.currentPricePerToken();
    setLJCryptoPrice(ethers.utils.formatEther(value));
    return value;
  };

  const getLJCryptoTokenBalance = async () => {
    const re = new RegExp("^-?\\d+(?:.\\d{0," + (5 || -1) + "})?");
     const provider = window.ethereum;
     const web3Provider = new providers.Web3Provider(provider).getSigner();
    const contract = getLJCryptoTokenInstance(web3Provider);
    const currentAccount = await getAddress();
    const value = await contract.balanceOf(currentAccount);
    setLJCryptoBalance(ethers.utils.formatEther(value).match(re)?.[0]);
    return value;
  };

  const toggleBuyLJCrypto = () => {
    setbuyLJCrypto(!buyljCrypto);
  };

  const toggleSellLJCrypto = () => {
    setSellLJCrypto(!sellljCrypto);
  };

  const toggleBuyLJStableCoin = () => {
    setbuyLJStable(!buyljStable);
  };

  const toggleSellLJStableCoin = () => {
    setsellLJStable(!sellljStable);
  };

  const toggleStakeLJCrypto = () => {
    setStakeLJCrypto(!stakeLJCrypto);
  };

  const toggleUnstakeLJCrypto = () => {
    setUnstakeLJCrypto(!unStakeLJCrypto);
  };

  const toggleStakeLJStable = () => {
    setStakeLJStable(!stakeLJStable);
  };

  const toggleUnstakeLJStable = () => {
    setUnstakeLJStable(!unStakeLJStable);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setAmount(e.target.value);
  };

  const buyLJCryptoToken = async (amount: string) => {
    const weiAmount = ethers.utils.parseEther(amount.toString());
    try {
      const number = await getLJCryptoTokenPrice();
      const priceZero = ethers.utils.formatEther(number);
      const thisZero = ethers.utils.formatEther(zero);
      if (priceZero === thisZero) {
        setbuyLJCrypto(false);
        setLoading(true);
        const signer = await getProviderOrSigner(true);
        const contract = getLJCryptoTokenInstance(signer);
        const tx = await contract.buyTokens(weiAmount, {
          value: ethers.utils.parseEther(`0.1`),
        });
        await tx.wait();
        window.alert(`You have successfully bought ${amount} LJCryptoTokens `);
        setLoading(false);
      } else {
        setbuyLJCrypto(false);
        setLoading(true);
        const price = await getLJCryptoTokenPrice();
        const signer = await getProviderOrSigner(true);
        const contract = getLJCryptoTokenInstance(signer);
        const amountToPay =
          (parseInt(price) / 1e18) * parseInt(amount.toString());
        const tx = await contract.buyTokens(weiAmount, {
          value: ethers.utils.parseEther(`${amountToPay}`),
        });
        await tx.wait();
        window.alert(`You have successfully bought ${amount} LJCryptoTokens `);
        setLoading(false);
      }
    } catch (error: any) {
      setbuyLJCrypto(false);
      setLoading(false);
      console.log(error);
      window.alert(error)
    }
  };

  const sellLJCryptoToken = async (amount: string) => {
    const weiAmount = ethers.utils.parseEther(amount.toString());
    try {
      setSellLJCrypto(false);
      setLoading(true);
      const signer = await getProviderOrSigner(true);
      const contract = getLJCryptoTokenInstance(signer);
      const tx = await contract.sellTokens(weiAmount);
      await tx.wait();
      window.alert(`You have successfully sold ${amount} LJCryptoTokens`);
      setLoading(false);
    } catch (error: any) {
      setSellLJCrypto(false);
      setLoading(false);
      console.log(error);
      window.alert(error);
    }
  };

  const ljcryptoBalanceInEther = async () => {
    try {
      const provider = window.ethereum;
     const web3Provider = new providers.Web3Provider(provider).getSigner();
      const contract = getLJCryptoTokenInstance(web3Provider);
      const currentAccount = await getAddress();
      const value = await contract.userBalancePrice({ from: currentAccount });
      setLJCryptoEtherBalance(ethers.utils.formatEther(value));
      return value;
    } catch (error) {
      console.log(error);
    }
  };

  const buyljStableCoin = async (amount: string) => {
    const weiAmount = ethers.utils.parseEther(amount.toString());
    try {
      setbuyLJStable(false);
      setLoading(true);
      const signer = await getProviderOrSigner(true);
      const contract = getLJStableCoinInstance(signer);
      const paidAmount = (parseInt(amount) * 1) / 2500;
      const tx = await contract.buyTokens(weiAmount, {
        value: ethers.utils.parseEther(`${paidAmount}`),
      });
      await tx.wait();
      window.alert(`You Have Successfully Bought ${amount} LJStableCoins`);
      setLoading(false);
    } catch (error: any) {
      setbuyLJStable(false);
      setLoading(false);
      console.log(error);
      window.alert(error);
    }
  };

  const sellLJStableCoin = async (amount: string) => {
    const weiAmount = ethers.utils.parseEther(amount.toString());
    try {
      setsellLJStable(false);
      setLoading(true);
      const signer = await getProviderOrSigner(true);
      const contract = getLJStableCoinInstance(signer);
      const tx = await contract.sellTokens(weiAmount);
      await tx.wait();
      window.alert(`You Have Successfully Sold ${amount} LJStableCoins`);
      setLoading(false);
    } catch (error: any) {
      setsellLJStable(false);
      setLoading(false);
      console.error(error);
      window.alert(error);
    }
  };

  const ljstableBalanceInEther = async () => {
    try {
       const provider = window.ethereum;
       const web3Provider = new providers.Web3Provider(provider).getSigner();
      const contract = getLJStableCoinInstance(web3Provider);
      const currentAccount = await getAddress();
      const value = await contract.userBalancePrice({
        from: currentAccount,
      });
      setLJStableCoinEtherBalance(ethers.utils.formatEther(value));
      return value;
    } catch (error) {
      console.log(error);
    }
  };

  const getLJStableCoinBalance = async () => {
    const re = new RegExp("^-?\\d+(?:.\\d{0," + (5 || -1) + "})?");
     const provider = window.ethereum;
     const web3Provider = new providers.Web3Provider(provider).getSigner();
    const contract = getLJStableCoinInstance(web3Provider);
    const currentAccount = await getAddress();
    const value = await contract.balanceOf(currentAccount);
    setLJStableCoinBalance(ethers.utils.formatEther(value).match(re)?.[0]);
    return value;
  };

  const getStakingBalances = async () => {
    const provider = window.ethereum;
    const web3Provider = new providers.Web3Provider(provider).getSigner();
    const ljcryptoContract = getLJCryptoTokenInstance(web3Provider);
    const currentAccount = await getAddress();
    const stakingBalanceOne = await ljcryptoContract.stakingBalance(
      currentAccount
    );
    setLJCryptoStakingBalance(ethers.utils.formatEther(stakingBalanceOne));
    const ljstablecoinContract = getLJStableCoinInstance(web3Provider);
    const stakingBalanceTwo = await ljstablecoinContract.stakingBalance(
      currentAccount
    );
    setLJStableCoinStakingBalance(ethers.utils.formatEther(stakingBalanceTwo));
    const stakingInEtherOne = await ljcryptoContract.stakingBalancePrice();
    setLJCryptoStakingInEther(ethers.utils.formatEther(stakingInEtherOne));
    const stakingInEtherTwo = await ljstablecoinContract.stakingBalancePrice();
    setLJStableCoinStakingInEther(ethers.utils.formatEther(stakingInEtherTwo));
  };

  const stakeLJCryptoTokens = async (amount: string) => {
    const weiAmount = ethers.utils.parseEther(amount.toString());
    try {
      setStakeLJCrypto(false);
      setLoading(true);
      const provider = await getProviderOrSigner(true);
      const contract = getLJCryptoTokenInstance(provider);
      const tx = await contract.stakeTokens(weiAmount);
      await tx.wait();
      window.alert(`You Have Successfully staked ${amount} LJCryptoTokens`);
      setLoading(false);
    } catch (error: any) {
      setStakeLJCrypto(false);
      setLoading(false);
      console.log(error);
      window.alert(error);
    }
  };

  const unstakeLJCryptoTokens = async (amount: string) => {
    const weiAmount = ethers.utils.parseEther(amount.toString());
    try {
      setUnstakeLJCrypto(false);
      setLoading(true);
      const provider = await getProviderOrSigner(true);
      const contract = getLJCryptoTokenInstance(provider);
      const tx = await contract.unstakeTokens(weiAmount);
      await tx.wait();
      window.alert(`You Have Successfully Unstaked ${amount} LJCryptoTokens`);
      setLoading(false);
    } catch (error: any) {
      setUnstakeLJCrypto(false);
      setLoading(false);
      console.log(error);
      window.alert(error);
    }
  };

  const stakeLJStableCoins = async (amount: string) => {
    const weiAmount = ethers.utils.parseEther(amount.toString());
    try {
      setStakeLJStable(false);
      setLoading(true);
      const provider = await getProviderOrSigner(true);
      const contract = getLJStableCoinInstance(provider);
      const tx = await contract.stakeTokens(weiAmount);
      await tx.wait();
      window.alert(`You Have Successfully Staked ${amount} LJStableCoins`);
      setLoading(false);
    } catch (error: any) {
      setStakeLJStable(false);
      setLoading(false);
      console.log(error);
      window.alert(error);
    }
  };

  const unstakeLJStableCoins = async (amount: string) => {
    const weiAmount = ethers.utils.parseEther(amount.toString());
    try {
      setUnstakeLJStable(false);
      setLoading(true);
      const provider = await getProviderOrSigner(true);
      const contract = getLJStableCoinInstance(provider);
      const tx = await contract.unstakeTokens(weiAmount);
      await tx.wait();
      window.alert(`You Have Successfully Unstaked ${amount} LJStableCoins`);
      setLoading(false);
    } catch (error: any) {
      setUnstakeLJStable(false);
      setLoading(false);
      console.log(error);
      window.alert(error);
    }
  };

  const updateLJCryptoStakingBalance = async () => {
    try {
      setLoading(true);
      const provider = await getProviderOrSigner(true);
      const contract = getLJCryptoTokenInstance(provider);
      const tx = await contract.stakedBalance();
      await tx.wait();
      window.alert(`You Have Successfully Updated Your LJCryptoToken Balance`);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      console.log(error);
      window.alert(error);
    }
  };

  const updateLJStableCoinStakingBalance = async () => {
    try {
      setLoading(true);
      const provider = await getProviderOrSigner(true);
      const contract = getLJStableCoinInstance(provider);
      const tx = await contract.stakedBalance();
      await tx.wait();
      window.alert(`You Have Successfully Updated Your LJStableCoin Balance`);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      console.log(error);
      window.alert(error);
    }
  };


  useEffect(() => {
    getAddress();
    getLJCryptoTokenPrice();
    getLJCryptoTokenBalance();
    getLJStableCoinBalance();
    ljcryptoBalanceInEther();
    ljstableBalanceInEther();
    getStakingBalances();
  });

  return (
    <main className="bg-gradient-to-r from-yellow-300 to-black bg-no-repeat bg-[length:auto_100%] h-screen overflow-y-scroll">
      <Head>
        <title>LJCrypto-Tokens</title>
        <meta
          name="description"
          content="Buy, Sell, Stake LJCrypto/LJStable Tokens"
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
          <p className="">
            Available tokens to buy and stake: ljcryptotoken, ljstablecoin
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
          <div className="flex justify-start md:mx-auto w-40 items-center rounded-md px-2 h-8 bg-yellow-500 ml-4 font-semibold mb-2  whitespace-nowrap">
            Contract Addresses:
          </div>
          <div className="flex flex-col md:mx-auto justify-center h-32 pl-2 w-350 md:w-700 bg-black rounded-md font-semibold relative top-10 ml-4 mb-20">
            <p className="text-yellow-400 mb-5 md:mx-auto md:text-xl">
              LJCryptoToken:{" "}
              <span className="text-sm md:text-xl">
                {LJCRYPTO_TOKEN_ADDRESS}
              </span>
            </p>
            <p className="text-yellow-400 md:text-xl md:mx-auto">
              LJStableCoin:{" "}
              <span className="text-sm md:text-xl">
                {LJSTABLE_COIN_ADDRESS}
              </span>
            </p>
          </div>
          <div className="flex justify-start md:mx-auto w-28 items-center rounded-md px-2 h-8 bg-yellow-500 font-semibold mb-5 ml-4  whitespace-nowrap">
            Token Prices:
          </div>
          <p className="text-sm md:text-center md:text-xl font-bold ml-4 relative top-2 text-white">
            DISCLAIMER: THESE PRICES ARE IN MATIC CURRENCY AND NOT
            FIAT(USD/CAD/EUD....)
          </p>
          <div className="flex flex-col md:mx-auto h-auto w-80 md:w-96 bg-black rounded-md ml-4 relative top-10 mb-20">
            <div className="flex mt-5 ml-3 md:mx-auto md:text-lg">
              <img
                src="/ljcrypto.webp"
                alt=""
                className="rounded-3xl w-8 h-8 mr-3 ml-1"
              />
              <p className="text-yellow-500 font-semibold capitalize">
                LjcryptoToken:{" "}
                <span className="md:text-lg">{ljcryptoPrice} MATIC</span>
              </p>
            </div>
            <div className="flex mt-5 ml-3 md:mx-auto md:text-xl">
              <img
                src="/ljstable.png"
                alt=""
                className="rounded-3xl w-8 h-8 mr-3"
              />
              <p className="text-yellow-500 font-semibold capitalize">
                Ljstablecoin: <span>0.0004 MATIC</span>
              </p>
            </div>
          </div>
          <div className="flex justify-start w-32 md:mx-auto items-center rounded-md px-2 h-8 bg-yellow-500 ml-4 font-semibold mb-2  whitespace-nowrap">
            Your Balances:
          </div>
          <div className="flex flex-col h-auto w-80 md:mx-auto md:w-96 bg-black rounded-md ml-4 relative top-10 mb-20">
            <div className="flex mt-5 ml-3 md:text-xl md:mx-auto">
              <img
                src="/ljcrypto.webp"
                alt=""
                className="rounded-3xl w-8 h-8 mr-3"
              />
              <p className="text-yellow-500 font-semibold capitalize">
                LjcryptoToken: <span>{ljcryptoBalance} Tokens</span>
              </p>
            </div>
            <div className="flex mt-5 ml-3 md:text-xl md:mx-auto">
              <img
                src="/ljstable.png"
                alt=""
                className="rounded-3xl w-8 h-8 mr-3"
              />
              <p className="text-yellow-500 font-semibold capitalize">
                Ljstablecoin: <span>{ljstablecoinBalance} Tokens</span>
              </p>
            </div>
          </div>
          <div className="flex justify-start md:mx-auto w-36 items-center rounded-md px-2 h-8 bg-yellow-500 ml-4 font-semibold mb-2  whitespace-nowrap">
            Balance Amounts:
          </div>
          <div className="flex flex-col h-auto w-80 md:mx-auto bg-black rounded-md ml-4 relative top-10 mb-20">
            <div className="flex mt-5 ml-3 md:mx-auto md:text-xl">
              <img
                src="/ljcrypto.webp"
                alt=""
                className="rounded-3xl w-8 h-8 mr-3"
              />
              <p className="text-yellow-500 font-semibold capitalize">
                LjcryptoToken: <span>{ljcryptoEtherBalance} MATIC</span>
              </p>
            </div>
            <div className="flex mt-5 ml-3 md:mx-auto md:text-xl">
              <img
                src="/ljstable.png"
                alt=""
                className="rounded-3xl w-8 h-8 mr-3"
              />
              <p className="text-yellow-500 font-semibold capitalize">
                Ljstablecoin: <span>{ljstablecoinEtherBalance} MATIC</span>
              </p>
            </div>
          </div>
          <div className="flex justify-start md:mx-auto w-36 items-center rounded-md px-2 h-8 bg-yellow-500 ml-4 font-semibold mb-2  whitespace-nowrap">
            Staking Balances:
          </div>
          <div className="flex flex-col h-auto w-80 md:mx-auto bg-black rounded-md ml-4 relative top-10 mb-20">
            <div className="flex mt-5 ml-3 md:mx-auto md:text-xl">
              <img
                src="/ljcrypto.webp"
                alt=""
                className="rounded-3xl w-8 h-8 mr-3"
              />
              <p className="text-yellow-500 font-semibold capitalize">
                LjcryptoToken: <span>{ljcryptoStakingBalance}</span>
              </p>
            </div>
            <div className="flex mt-5 ml-3 md:mx-auto md:text-xl">
              <img
                src="/ljstable.png"
                alt=""
                className="rounded-3xl w-8 h-8 mr-3"
              />
              <p className="text-yellow-500 font-semibold capitalize">
                Ljstablecoin: <span>{ljstablecoinStakingBalance}</span>
              </p>
            </div>
          </div>
          <div className="flex justify-start md:mx-auto w-52 items-center rounded-md px-2 h-8 bg-yellow-500 ml-4 font-semibold mb-5 whitespace-nowrap">
            Update Staking Balances:
          </div>
          {ljcryptoStakingBalance === "0.0" &&
          ljstablecoinStakingBalance === "0.0" ? (
            <>
              <p className="text-white text-2xl font-bold uppercase md:flex md:justify-center md:px-0 px-4 mb-10">
                You dont have a staking balance to update
              </p>
              <div className="md:flex md:justify-center">
                <button className="rounded-2xl opacity-50 whitespace-nowrap ml-4 md:mx-auto bg-black text-yellow-500 h-8 shadow-button w-48 font-bold transition ease-in-out mb-12">
                  LJCryptoToken
                </button>
              </div>
              <div className="md:flex md:justify-center">
                <button className="rounded-2xl opacity-50 whitespace-nowrap ml-4 md:mx-auto bg-black text-yellow-500 h-8 shadow-button w-48 font-bold transition ease-in-out mb-12">
                  LJStableCoin
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-white text-2xl font-bold uppercase md:flex md:justify-center md:px-0 px-4 mb-10">
                Recommended To Update Balance Every Day
              </p>
              <div className="md:flex md:justify-center">
                {ljcryptoStakingBalance === "0.0" ? (
                  <button className="rounded-2xl opacity-50 whitespace-nowrap ml-4 md:mx-auto bg-black text-yellow-500 h-8 shadow-button w-48 font-bold transition ease-in-out mb-12 hover:text-white">
                    LJCryptoToken
                  </button>
                ) : (
                  <button
                    onClick={updateLJCryptoStakingBalance}
                    className="rounded-2xl  whitespace-nowrap ml-4 md:mx-auto bg-black text-yellow-500 h-8 shadow-button w-48 font-bold transition ease-in-out mb-12 hover:text-white"
                  >
                    LJCryptoToken
                  </button>
                )}
              </div>
              <div className="md:flex md:justify-center">
                {ljstablecoinStakingBalance === "0.0" ? (
                  <button className="rounded-2xl opacity-50 whitespace-nowrap ml-4 md:mx-auto bg-black text-yellow-500 h-8 shadow-button w-48 font-bold transition ease-in-out mb-12">
                    LJStableCoin
                  </button>
                ) : (
                  <button
                    onClick={updateLJStableCoinStakingBalance}
                    className="rounded-2xl whitespace-nowrap ml-4 md:mx-auto bg-black text-yellow-500 h-8 shadow-button w-48 font-bold transition ease-in-out mb-12 hover:text-white"
                  >
                    LJStableCoin
                  </button>
                )}
              </div>
            </>
          )}
          <div className="flex justify-start md:mx-auto w-52 items-center rounded-md px-2 h-8 bg-yellow-500 ml-4 font-semibold mb-2  whitespace-nowrap">
            Staking Balances In MATIC:
          </div>
          <div className="flex flex-col h-auto w-80 md:mx-auto bg-black rounded-md ml-4 relative top-10 mb-20">
            <div className="flex mt-5 ml-3 md:mx-auto md:text-xl">
              <img
                src="/ljcrypto.webp"
                alt=""
                className="rounded-3xl w-8 h-8 mr-3"
              />
              <p className="text-yellow-500 font-semibold capitalize">
                LjcryptoToken: <span>{ljcryptoStakingInEther} MATIC</span>
              </p>
            </div>
            <div className="flex mt-5 ml-3 md:mx-auto md:text-xl">
              <img
                src="/ljstable.png"
                alt=""
                className="rounded-3xl w-8 h-8 mr-3"
              />
              <p className="text-yellow-500 font-semibold capitalize">
                Ljstablecoin: <span>{ljstableCoinStakingInEther} MATIC</span>
              </p>
            </div>
          </div>
          <div className="flex justify-start md:mx-auto w-28 items-center rounded-md px-2 h-8 bg-yellow-500 ml-4 font-semibold mt-15  whitespace-nowrap">
            Buy And Sell:
          </div>
          <div className="flex flex-col md:mx-auto md:text-xl h-32 w-80 bg-black rounded-md ml-4 relative top-10 mb-20">
            <div className="flex mt-5 ml-3 ">
              <img
                src="/ljcrypto.webp"
                alt=""
                className="rounded-3xl w-8 h-8 mr-3"
              />
              <div className="flex justify-start items-center">
                <p className="text-yellow-500 font-semibold capitalize">
                  LjcryptoToken:
                </p>
                <button
                  onClick={toggleBuyLJCrypto}
                  className="rounded-md ml-3 mx-auto bg-yellow-500 text-white h-8 shadow-button w-12 font-semibold transition ease-in-out hover:scale-75"
                >
                  Buy
                </button>
                {buyljCrypto && (
                  <div className="fixed top-0 left-0 w-full h-full bg-shade grid z-50 place-items-center">
                    <div className="flex flex-col bg-yellow-500 w-80 rounded-xl h-52">
                      <svg
                        viewBox="0 0 24 24"
                        color="#FFFFFF"
                        width="20px"
                        xmlns="http://www.w3.org/2000/svg"
                        className="relative left-280 top-4 cursor-pointer hover:scale-125"
                        onClick={toggleBuyLJCrypto}
                      >
                        <path d="M18.3 5.70997C17.91 5.31997 17.28 5.31997 16.89 5.70997L12 10.59L7.10997 5.69997C6.71997 5.30997 6.08997 5.30997 5.69997 5.69997C5.30997 6.08997 5.30997 6.71997 5.69997 7.10997L10.59 12L5.69997 16.89C5.30997 17.28 5.30997 17.91 5.69997 18.3C6.08997 18.69 6.71997 18.69 7.10997 18.3L12 13.41L16.89 18.3C17.28 18.69 17.91 18.69 18.3 18.3C18.69 17.91 18.69 17.28 18.3 16.89L13.41 12L18.3 7.10997C18.68 6.72997 18.68 6.08997 18.3 5.70997Z"></path>
                      </svg>
                      <div className="flex flex-col mt-4">
                        <p className="uppercase text-center font-bold text-xs mt-3 mb-5">
                          Put in Amount of ljcryptotokens to buy
                        </p>
                        <input
                          type="number"
                          placeholder="Amount"
                          onChange={handleChange}
                          className="px-4 w-40 mx-auto rounded-xl mb-5 focus:outline-none border border-solid border-yellow-500 text-yellow-500"
                        />
                      </div>
                      <button
                        className="rounded-2xl mx-auto bg-black  text-yellow-500 h-8 shadow-button w-40 font-bold transition ease-in-out hover:text-white "
                        onClick={() => buyLJCryptoToken(thisAmount)}
                      >
                        Buy Tokens
                      </button>
                    </div>
                  </div>
                )}
                <button
                  onClick={toggleSellLJCrypto}
                  className=" rounded-md ml-3 mx-auto bg-yellow-500 text-black h-8 shadow-button w-12 font-bold transition ease-in-out hover:scale-75 "
                >
                  Sell
                </button>
                {sellljCrypto && (
                  <div className="fixed top-0 left-0 w-full h-full bg-shade grid z-50 place-items-center">
                    <div className="flex flex-col bg-yellow-500 w-80 rounded-xl h-52">
                      <svg
                        viewBox="0 0 24 24"
                        color="#FFFFFF"
                        width="20px"
                        xmlns="http://www.w3.org/2000/svg"
                        className="relative left-280 top-4 cursor-pointer hover:scale-125"
                        onClick={toggleSellLJCrypto}
                      >
                        <path d="M18.3 5.70997C17.91 5.31997 17.28 5.31997 16.89 5.70997L12 10.59L7.10997 5.69997C6.71997 5.30997 6.08997 5.30997 5.69997 5.69997C5.30997 6.08997 5.30997 6.71997 5.69997 7.10997L10.59 12L5.69997 16.89C5.30997 17.28 5.30997 17.91 5.69997 18.3C6.08997 18.69 6.71997 18.69 7.10997 18.3L12 13.41L16.89 18.3C17.28 18.69 17.91 18.69 18.3 18.3C18.69 17.91 18.69 17.28 18.3 16.89L13.41 12L18.3 7.10997C18.68 6.72997 18.68 6.08997 18.3 5.70997Z"></path>
                      </svg>
                      <div className="flex flex-col mt-4">
                        <p className="uppercase text-center font-bold text-xs mt-3 mb-5">
                          Put in Amount of ljcryptotokens to sell
                        </p>
                        <input
                          type="number"
                          placeholder="Amount"
                          onChange={handleChange}
                          className="px-4 w-40 mx-auto rounded-xl mb-5 focus:outline-none border border-solid border-yellow-500 text-yellow-500"
                        />
                      </div>
                      <button
                        className="rounded-2xl mx-auto bg-black text-yellow-500 h-8 shadow-button w-40 font-bold transition ease-in-out hover:text-white "
                        onClick={() => sellLJCryptoToken(thisAmount)}
                      >
                        Sell Tokens
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex mt-5 ml-3 ">
              <img
                src="/ljstable.png"
                alt=""
                className="rounded-3xl w-8 h-8 mr-3"
              />
              <div className="flex items-center">
                <p className="text-yellow-500 font-semibold capitalize">
                  Ljstablecoin:
                </p>
                <button
                  onClick={toggleBuyLJStableCoin}
                  className=" rounded-md ml-3 mx-auto bg-yellow-500 text-white h-8 shadow-button w-12 font-semibold transition ease-in-out hover:scale-75"
                >
                  Buy
                </button>
                {buyljStable && (
                  <div className="fixed top-0 left-0 w-full  h-full bg-shade grid z-50 place-items-center">
                    <div className="flex flex-col bg-yellow-500 w-80 rounded-xl h-52">
                      <svg
                        viewBox="0 0 24 24"
                        color="#FFFFFF"
                        width="20px"
                        xmlns="http://www.w3.org/2000/svg"
                        className="relative left-280 top-4 cursor-pointer hover:scale-125"
                        onClick={toggleBuyLJStableCoin}
                      >
                        <path d="M18.3 5.70997C17.91 5.31997 17.28 5.31997 16.89 5.70997L12 10.59L7.10997 5.69997C6.71997 5.30997 6.08997 5.30997 5.69997 5.69997C5.30997 6.08997 5.30997 6.71997 5.69997 7.10997L10.59 12L5.69997 16.89C5.30997 17.28 5.30997 17.91 5.69997 18.3C6.08997 18.69 6.71997 18.69 7.10997 18.3L12 13.41L16.89 18.3C17.28 18.69 17.91 18.69 18.3 18.3C18.69 17.91 18.69 17.28 18.3 16.89L13.41 12L18.3 7.10997C18.68 6.72997 18.68 6.08997 18.3 5.70997Z"></path>
                      </svg>
                      <div className="flex flex-col mt-4">
                        <p className="uppercase text-center font-bold text-xs mt-3 mb-5">
                          Put in Amount of ljstablecoins to buy
                        </p>
                        <input
                          type="number"
                          placeholder="Amount"
                          onChange={handleChange}
                          className="px-4 w-40 mx-auto rounded-xl mb-5 focus:outline-none border border-solid border-yellow-500 text-yellow-500"
                        />
                      </div>
                      <button
                        className="rounded-2xl mx-auto bg-black  text-yellow-500 h-8 shadow-button w-40 font-bold transition ease-in-out hover:text-white "
                        onClick={() => buyljStableCoin(thisAmount)}
                      >
                        Buy Tokens
                      </button>
                    </div>
                  </div>
                )}
                <button
                  onClick={toggleSellLJStableCoin}
                  className=" rounded-md ml-3 mx-auto bg-yellow-500 text-black h-8 shadow-button w-12 font-bold transition ease-in-out hover:scale-75 "
                >
                  Sell
                </button>
                {sellljStable && (
                  <div className="fixed top-0 left-0 w-full h-full bg-shade grid z-50 place-items-center">
                    <div className="flex flex-col bg-yellow-500 w-80 rounded-xl h-52">
                      <svg
                        viewBox="0 0 24 24"
                        color="#FFFFFF"
                        width="20px"
                        xmlns="http://www.w3.org/2000/svg"
                        className="relative left-280 top-4 cursor-pointer hover:scale-125"
                        onClick={toggleSellLJStableCoin}
                      >
                        <path d="M18.3 5.70997C17.91 5.31997 17.28 5.31997 16.89 5.70997L12 10.59L7.10997 5.69997C6.71997 5.30997 6.08997 5.30997 5.69997 5.69997C5.30997 6.08997 5.30997 6.71997 5.69997 7.10997L10.59 12L5.69997 16.89C5.30997 17.28 5.30997 17.91 5.69997 18.3C6.08997 18.69 6.71997 18.69 7.10997 18.3L12 13.41L16.89 18.3C17.28 18.69 17.91 18.69 18.3 18.3C18.69 17.91 18.69 17.28 18.3 16.89L13.41 12L18.3 7.10997C18.68 6.72997 18.68 6.08997 18.3 5.70997Z"></path>
                      </svg>
                      <div className="flex flex-col mt-4">
                        <p className="uppercase text-center font-bold text-xs mt-3 mb-5">
                          Put in Amount of ljstablecoins to sell
                        </p>
                        <input
                          type="number"
                          placeholder="Amount"
                          onChange={handleChange}
                          className="px-4 w-40 mx-auto rounded-xl mb-5 focus:outline-none border border-solid border-yellow-500 text-yellow-500"
                        />
                      </div>
                      <button
                        className="rounded-2xl mx-auto bg-black text-yellow-500 h-8 shadow-button w-40 font-bold transition ease-in-out hover:text-white "
                        onClick={() => sellLJStableCoin(thisAmount)}
                      >
                        Sell Tokens
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-start md:mx-auto w-40 items-center rounded-md px-2 h-8 bg-yellow-500 ml-4 font-semibold mb-2  whitespace-nowrap">
            Stake And Unstake:
          </div>
          <p className="text-sm md:text-center md:text-xl font-bold ml-4 relative top-2 text-white">
            STAKING BALANCE GETS UPDATED WHEN YOU UNSTAKE
          </p>
          <p className="text-sm md:text-center md:text-xl font-bold ml-4 relative top-2 text-white">
            LJCryptoToken APY: 100%
          </p>
          <p className="text-sm md:text-center md:text-xl font-bold ml-4 relative top-2 text-white">
            LJStableCoin APY: 100%
          </p>
          <div className="flex flex-col md:mx-auto md:text-lg h-32 w-80 md:w-350 bg-black rounded-md ml-4 relative top-10 mb-20">
            <div className="flex mt-5 ml-3 ">
              <img
                src="/ljcrypto.webp"
                alt=""
                className="rounded-3xl w-8 h-8 mr-3"
              />
              <div className="flex justify-start items-center">
                <p className="text-yellow-500 font-semibold capitalize">
                  LjcryptoToken:
                </p>
                <button
                  onClick={toggleStakeLJCrypto}
                  className="rounded-md ml-3 mx-auto bg-yellow-500 text-white h-8 shadow-button w-12 font-semibold transition ease-in-out hover:scale-75"
                >
                  Stake
                </button>
                {stakeLJCrypto && (
                  <div className="fixed top-0 left-0 w-full h-full bg-shade grid z-50 place-items-center">
                    <div className="flex flex-col bg-yellow-500 w-80 rounded-xl h-52">
                      <svg
                        viewBox="0 0 24 24"
                        color="#FFFFFF"
                        width="20px"
                        xmlns="http://www.w3.org/2000/svg"
                        className="relative left-280 top-4 cursor-pointer hover:scale-125"
                        onClick={toggleStakeLJCrypto}
                      >
                        <path d="M18.3 5.70997C17.91 5.31997 17.28 5.31997 16.89 5.70997L12 10.59L7.10997 5.69997C6.71997 5.30997 6.08997 5.30997 5.69997 5.69997C5.30997 6.08997 5.30997 6.71997 5.69997 7.10997L10.59 12L5.69997 16.89C5.30997 17.28 5.30997 17.91 5.69997 18.3C6.08997 18.69 6.71997 18.69 7.10997 18.3L12 13.41L16.89 18.3C17.28 18.69 17.91 18.69 18.3 18.3C18.69 17.91 18.69 17.28 18.3 16.89L13.41 12L18.3 7.10997C18.68 6.72997 18.68 6.08997 18.3 5.70997Z"></path>
                      </svg>
                      <div className="flex flex-col mt-4">
                        <p className="uppercase text-center font-bold text-xs mt-3 mb-5">
                          Put in Amount of ljcryptotokens to stake
                        </p>
                        <input
                          type="number"
                          placeholder="Amount"
                          onChange={handleChange}
                          className="px-4 w-40 mx-auto rounded-xl mb-5 focus:outline-none border border-solid border-yellow-500 text-yellow-500"
                        />
                      </div>
                      <button
                        className="rounded-2xl mx-auto bg-black  text-yellow-500 h-8 shadow-button w-40 font-bold transition ease-in-out hover:text-white "
                        onClick={() => stakeLJCryptoTokens(thisAmount)}
                      >
                        Stake Tokens
                      </button>
                    </div>
                  </div>
                )}
                <button
                  onClick={toggleUnstakeLJCrypto}
                  className="rounded-md ml-3 mx-auto bg-yellow-500 text-black h-8 shadow-button w-16 md:w-20 font-bold transition ease-in-out hover:scale-75 "
                >
                  Unstake
                </button>
                {unStakeLJCrypto && (
                  <div className="fixed top-0 left-0 w-full h-full bg-shade grid z-50 place-items-center">
                    <div className="flex flex-col bg-yellow-500 w-80 rounded-xl h-52">
                      <svg
                        viewBox="0 0 24 24"
                        color="#FFFFFF"
                        width="20px"
                        xmlns="http://www.w3.org/2000/svg"
                        className="relative left-280 top-4 cursor-pointer hover:scale-125"
                        onClick={toggleUnstakeLJCrypto}
                      >
                        <path d="M18.3 5.70997C17.91 5.31997 17.28 5.31997 16.89 5.70997L12 10.59L7.10997 5.69997C6.71997 5.30997 6.08997 5.30997 5.69997 5.69997C5.30997 6.08997 5.30997 6.71997 5.69997 7.10997L10.59 12L5.69997 16.89C5.30997 17.28 5.30997 17.91 5.69997 18.3C6.08997 18.69 6.71997 18.69 7.10997 18.3L12 13.41L16.89 18.3C17.28 18.69 17.91 18.69 18.3 18.3C18.69 17.91 18.69 17.28 18.3 16.89L13.41 12L18.3 7.10997C18.68 6.72997 18.68 6.08997 18.3 5.70997Z"></path>
                      </svg>
                      <div className="flex flex-col mt-4">
                        <p className="uppercase text-center font-bold text-xs mt-3 mb-5">
                          Put in Amount of ljcryptotokens to unstake
                        </p>
                        <input
                          type="number"
                          placeholder="Amount"
                          onChange={handleChange}
                          className="px-4 w-40 mx-auto rounded-xl mb-5 focus:outline-none border border-solid border-yellow-500 text-yellow-500"
                        />
                      </div>
                      <button
                        className="rounded-2xl mx-auto bg-black text-yellow-500 h-8 shadow-button w-40 font-bold transition ease-in-out hover:text-white "
                        onClick={() => unstakeLJCryptoTokens(thisAmount)}
                      >
                        UnStake Tokens
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex mt-5 ml-3 ">
              <img
                src="/ljstable.png"
                alt=""
                className="rounded-3xl w-8 h-8 mr-3"
              />
              <div className="flex items-center">
                <p className="text-yellow-500 font-semibold capitalize">
                  Ljstablecoin:
                </p>
                <button
                  onClick={toggleStakeLJStable}
                  className=" rounded-md ml-3 mx-auto bg-yellow-500 text-white h-8 shadow-button w-12 font-semibold transition ease-in-out hover:scale-75"
                >
                  Stake
                </button>
                {stakeLJStable && (
                  <div className="fixed top-0 left-0 w-full  h-full bg-shade grid z-50 place-items-center">
                    <div className="flex flex-col bg-yellow-500 w-80 rounded-xl h-52">
                      <svg
                        viewBox="0 0 24 24"
                        color="#FFFFFF"
                        width="20px"
                        xmlns="http://www.w3.org/2000/svg"
                        className="relative left-280 top-4 cursor-pointer hover:scale-125"
                        onClick={toggleStakeLJStable}
                      >
                        <path d="M18.3 5.70997C17.91 5.31997 17.28 5.31997 16.89 5.70997L12 10.59L7.10997 5.69997C6.71997 5.30997 6.08997 5.30997 5.69997 5.69997C5.30997 6.08997 5.30997 6.71997 5.69997 7.10997L10.59 12L5.69997 16.89C5.30997 17.28 5.30997 17.91 5.69997 18.3C6.08997 18.69 6.71997 18.69 7.10997 18.3L12 13.41L16.89 18.3C17.28 18.69 17.91 18.69 18.3 18.3C18.69 17.91 18.69 17.28 18.3 16.89L13.41 12L18.3 7.10997C18.68 6.72997 18.68 6.08997 18.3 5.70997Z"></path>
                      </svg>
                      <div className="flex flex-col mt-4">
                        <p className="uppercase text-center font-bold text-xs mt-3 mb-5">
                          Put in Amount of ljstablecoins to stake
                        </p>
                        <input
                          type="number"
                          placeholder="Amount"
                          onChange={handleChange}
                          className="px-4 w-40 mx-auto rounded-xl mb-5 focus:outline-none border border-solid border-yellow-500 text-yellow-500"
                        />
                      </div>
                      <button
                        className="rounded-2xl mx-auto bg-black  text-yellow-500 h-8 shadow-button w-40 font-bold transition ease-in-out hover:text-white "
                        onClick={() => stakeLJStableCoins(thisAmount)}
                      >
                        Stake Tokens
                      </button>
                    </div>
                  </div>
                )}
                <button
                  onClick={toggleUnstakeLJStable}
                  className=" rounded-md ml-3 mx-auto bg-yellow-500 text-black h-8 shadow-button w-16 md:w-20 font-bold transition ease-in-out hover:scale-75 "
                >
                  Unstake
                </button>
                {unStakeLJStable && (
                  <div className="fixed top-0 left-0 w-full h-full bg-shade grid z-50 place-items-center">
                    <div className="flex flex-col bg-yellow-500 w-80 rounded-xl h-52">
                      <svg
                        viewBox="0 0 24 24"
                        color="#FFFFFF"
                        width="20px"
                        xmlns="http://www.w3.org/2000/svg"
                        className="relative left-280 top-4 cursor-pointer hover:scale-125"
                        onClick={toggleUnstakeLJStable}
                      >
                        <path d="M18.3 5.70997C17.91 5.31997 17.28 5.31997 16.89 5.70997L12 10.59L7.10997 5.69997C6.71997 5.30997 6.08997 5.30997 5.69997 5.69997C5.30997 6.08997 5.30997 6.71997 5.69997 7.10997L10.59 12L5.69997 16.89C5.30997 17.28 5.30997 17.91 5.69997 18.3C6.08997 18.69 6.71997 18.69 7.10997 18.3L12 13.41L16.89 18.3C17.28 18.69 17.91 18.69 18.3 18.3C18.69 17.91 18.69 17.28 18.3 16.89L13.41 12L18.3 7.10997C18.68 6.72997 18.68 6.08997 18.3 5.70997Z"></path>
                      </svg>
                      <div className="flex flex-col mt-4">
                        <p className="uppercase text-center font-bold text-xs mt-3 mb-5">
                          Put in Amount of ljstablecoins to unstake
                        </p>
                        <input
                          type="number"
                          placeholder="Amount"
                          onChange={handleChange}
                          className="px-4 w-40 mx-auto rounded-xl mb-5 focus:outline-none border border-solid border-yellow-500 text-yellow-500"
                        />
                      </div>
                      <button
                        className="rounded-2xl mx-auto bg-black text-yellow-500 h-8 shadow-button w-40 font-bold transition ease-in-out hover:text-white "
                        onClick={() => unstakeLJStableCoins(thisAmount)}
                      >
                        Unstake Tokens
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-row justify-between mx-auto  justify-self-center max-w-xs md:max-w-lg bg-black text-white rounded-2xl border border-solid border-yellow-400 z-50 bottom-0 right-1/2 pr-4 whitespace-nowrap overflow-x-scroll">
            <a className=" text-black font-semibold mr-4 px-2 rounded-3xl bg-yellow-400 flex items-center justify-center">
              Tokens
            </a>
            <Link href="/lotterygame">
              <a className="pr-4 hover:text-yellow-500 cursor-pointer">
                Lottery Game
              </a>
            </Link>
            <Link href="/dao">
              <a className="pr-4 hover:text-yellow-500 cursor-pointer">
                Governance
              </a>
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
        </>
      )}
    </main>
  );
};

export default Tokens;
