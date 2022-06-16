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

import {LJC_LJS_ABI, LJC_LJS_ADDRESS} from  "../constants/ljcryptoandstablepair"
import {LJC_MATIC_ABI, LJC_MATIC_ADDRESS} from "../constants/ljcryptoandmaticpair"
import {LJS_MATIC_ABI, LJS_MATIC_ADDRESS} from "../constants/ljstableandmaticpair"

type IState = {
  howMuchLJCrypto: string | undefined;
  setHowMuchLJCrypto: React.Dispatch<React.SetStateAction<string | undefined>>;
  howMuchLJCrypto2: string | undefined;
  setHowMuchLJCrypto2: React.Dispatch<React.SetStateAction<string | undefined>>;
  howMuchLJStable: string | undefined;
  setHowMuchLJStable: React.Dispatch<React.SetStateAction<string | undefined>>;
  howMuchLJStable2: string | undefined;
  setHowMuchLJStable2: React.Dispatch<React.SetStateAction<string | undefined>>;
  ljcryptoBalance: string | undefined;
  setLJCryptoBalance: React.Dispatch<React.SetStateAction<string | undefined>>;
  maticBalance: string | undefined;
  setMaticBalance: React.Dispatch<React.SetStateAction<string | undefined>>;
  ljstablecoinBalance: string | undefined;
  setLJStableCoinBalance: string | undefined;
  howMuchPolygon: string | undefined;
  setHowMuchPolygon: React.Dispatch<React.SetStateAction<string | undefined>>;
  howMuchPolygon2: string | undefined;
  setHowMuchPolygon2: React.Dispatch<React.SetStateAction<string | undefined>>;
  ljcLiquidityBalanceOne: string | undefined;
  setLjcLiquidityBalanceOne: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
  ljcLiquidityBalanceTwo: string | undefined;
  setLjcLiquidityBalanceTwo: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
  ljsLiquidityBalanceOne: string | undefined;
  setLjsLiquidityBalanceOne: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
  ljsLiquidityBalanceTwo: string | undefined;
  setLjsLiquidityBalanceTwo: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
  maticBalanceOne: string | undefined;
  setMaticBalanceOne: React.Dispatch<React.SetStateAction<string | undefined>>;
  maticBalanceTwo: string | undefined;
  setMaticBalanceTwo: React.Dispatch<React.SetStateAction<string | undefined>>;
  ljcReserveOne: string | undefined;
  setLjcReserveOne: React.Dispatch<React.SetStateAction<string | undefined>>;
  ljsReserveOne: string | undefined;
  setLjsReserveOne: React.Dispatch<React.SetStateAction<string | undefined>>;
  maticReserveOne: string | undefined;
  setMaticReserveOne: React.Dispatch<React.SetStateAction<string | undefined>>;
  ljsReserveTwo: string | undefined;
  setLjsReserveTwo: React.Dispatch<React.SetStateAction<string | undefined>>;
  maticReserveTwo: string | undefined;
  setMaticReserveTwo: React.Dispatch<React.SetStateAction<string | undefined>>;
};

const LiquidityPools: React.FC = () => {
  const {
    account,
    connectWallet,
    getProviderOrSigner,
    getAddress,
    loading,
    setLoading,
  } = useContext(Web3Context) as useWeb3;
  const [pairModal, setPairModal] = useState(false);
  const [changeLiquidityPair, setChangeLiquidityPair] = useState("");
  const [tab, setTab] = useState("");
  const [ljcryptoBalance, setLJCryptoBalance] =
    useState<IState["ljcryptoBalance"]>("0");
  const [ljstablecoinBalance, setLJStableCoinBalance] =
    useState<IState["ljstablecoinBalance"]>("0");
  const [maticBalance, setMaticBalance] = useState<IState["maticBalance"]>("0");
  const [amountOne, setAmountOne] = useState("0.0");
  const [amountTwo, setAmountTwo] = useState("0.0");
  const [secondAmountOne, setSecondAmountOne] = useState("0.0")
  const [secondAmountTwo, setSecondAmountTwo] = useState("0.0")
   const [thirdAmountOne, setThirdAmountOne] = useState("0.0");
   const [thirdAmountTwo, setThirdAmountTwo] = useState("0.0");
  const [howMuchLJCrypto, setHowMuchLJCrypto] =
    useState<IState["howMuchLJCrypto"]>("0.0");
    const [howMuchLJCrypto2, setHowMuchLJCrypto2] =
      useState<IState["howMuchLJCrypto2"]>("0.0");
  const [howMuchLJStable, setHowMuchLJStable] =
    useState<IState["howMuchLJStable"]>("0.0");
    const [howMuchLJStable2, setHowMuchLJStable2] =
      useState<IState["howMuchLJStable2"]>("0.0");
    const [howMuchPolygon, setHowMuchPolygon] =
      useState<IState["howMuchPolygon"]>("0.0");
      const [howMuchPolygon2, setHowMuchPolygon2] =
        useState<IState["howMuchPolygon2"]>("0.0");
        const [ljcLiquidityBalanceOne, setLjcLiquidityBalanceOne] = useState<IState["ljcLiquidityBalanceOne"]>("0")
         const [ljcLiquidityBalanceTwo, setLjcLiquidityBalanceTwo] =
           useState<IState["ljcLiquidityBalanceOne"]>("0");
         const [ljsLiquidityBalanceOne, setLjsLiquidityBalanceOne] =
           useState<IState["ljsLiquidityBalanceOne"]>("0");
           const [ljsLiquidityBalanceTwo, setLjsLiquidityBalanceTwo] =
             useState<IState["ljsLiquidityBalanceTwo"]>("0");
              const [maticBalanceOne, setMaticBalanceOne] =
                useState<IState["ljsLiquidityBalanceTwo"]>("0");
                const [maticBalanceTwo, setMaticBalanceTwo] =
                  useState<IState["ljsLiquidityBalanceTwo"]>("0");
  const [ljcReserveOne, setLjcReserveOne] = useState<IState["ljcReserveOne"]>("0");
  const [maticReserveOne, setMaticReserveOne] = useState<IState["maticReserveOne"]>("0");
  const [ljcReserveTwo, setLjcReserveTwo] = useState<IState["ljcReserveOne"]>("0");
  const [ljsReserveOne, setLjsReserveOne] = useState<IState["ljsReserveOne"]>("0");
  const [ljsReserveTwo, setLjsReserveTwo] = useState<IState["ljsReserveTwo"]>("0");
  const [maticReserveTwo, setMaticReserveTwo] = useState<IState["maticReserveTwo"]>("0");

  const pairToggle = () => {
    setPairModal(!pairModal);
  };

  const toggleOutside = () => {
    if (pairModal === true) {
      setPairModal(false);
    }
  };

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
    return new Contract(LJC_LJS_ADDRESS, LJC_LJS_ABI, providerOrSigner);
  };

  const getLJCMaticPairInstance = (
    providerOrSigner: providers.Web3Provider | providers.JsonRpcSigner
  ) => {
    return new Contract(LJC_MATIC_ADDRESS, LJC_MATIC_ABI, providerOrSigner);
  };

  const getLJSMaticPairInstance = (
    providerOrSigner: providers.Web3Provider | providers.JsonRpcSigner
  ) => {
    return new Contract(LJS_MATIC_ADDRESS, LJS_MATIC_ABI, providerOrSigner);
  };

  const getBalances = async () => {
    const re = new RegExp("^-?\\d+(?:.\\d{0," + (2 || -1) + "})?");
    const provider = window.ethereum;
    const web3Provider = new providers.Web3Provider(provider).getSigner();
    const maticBalance = await web3Provider.getBalance();
    const ljcryptocontract = getLJCryptoTokenInstance(web3Provider);
    const ljstablecontract = getLJStableCoinInstance(web3Provider);
    const currentAccount = await getAddress();
    const valueOne = await ljcryptocontract.balanceOf(currentAccount);
    const valueTwo = await ljstablecontract.balanceOf(currentAccount);
    setLJCryptoBalance(
      ethers.utils.formatEther(valueOne).toString().match(re)?.[0]
    );
    setLJStableCoinBalance(
      ethers.utils.formatEther(valueTwo).toString().match(re)?.[0]
    );
    setMaticBalance(
      ethers.utils.formatEther(maticBalance).toString().match(re)?.[0]
    );
  };

  const getLiquidityBalances = async() => {
     const re = new RegExp("^-?\\d+(?:.\\d{0," + (10 || -1) + "})?");
     const provider = window.ethereum;
     const web3Provider = new providers.Web3Provider(provider).getSigner();
     const ljcLjscontract = await getLJCJStablePairInstance(web3Provider)
     const ljsMaticcontract = await getLJSMaticPairInstance(web3Provider);
     const ljcMaticcontract = await getLJCMaticPairInstance(web3Provider);
     const ljcMaticcontractBalance = await new providers.Web3Provider(provider).getBalance(LJC_MATIC_ADDRESS);
     const ljsMaticcontractBalance = await new providers.Web3Provider(provider).getBalance(LJS_MATIC_ADDRESS);
     const ljcReserveOne = await ljcLjscontract.getLJCrytpoReserve();
     const ljcReserveTwo = await ljcMaticcontract.getLJCryptoReserve();
     const ljsReserveOne = await ljcLjscontract.getLJStableReserve();
      const ljsReserveTwo = await ljsMaticcontract.getLJStableReserve();
     const ljcBalanceTwo = await ljcMaticcontract.getLJCryptoBalance();
     const maticBalanceTwo = await ljcMaticcontract.getMaticBalance();
     const ljsBalanceTwo = await ljsMaticcontract.getLJStableBalance();
     const maticBalanceOne = await ljsMaticcontract.getMaticBalance();
     setMaticBalanceOne(ethers.utils.formatEther(maticBalanceOne).toString().match(re)?.[0]);
     setMaticBalanceTwo(ethers.utils.formatEther(maticBalanceTwo).toString().match(re)?.[0]);
     setLjsLiquidityBalanceTwo(ethers.utils.formatEther(ljsBalanceTwo).toString().match(re)?.[0]);
     const ljcryptoBalanceOne = await ljcLjscontract.getLJCryptoBalance();
     setLjcLiquidityBalanceOne(ethers.utils.formatEther(ljcryptoBalanceOne).toString().match(re)?.[0]);
     setLjcLiquidityBalanceTwo(ethers.utils.formatEther(ljcBalanceTwo).toString().match(re)?.[0]);
     const ljsBalanceOne = await ljcLjscontract.getLJStableBalance();
     setLjsLiquidityBalanceOne(ethers.utils.formatEther(ljsBalanceOne).toString().match(re)?.[0])
     setLjcReserveOne(ethers.utils.formatEther(ljcReserveOne).toString().match(re)?.[0]);
     setLjsReserveOne(ethers.utils.formatEther(ljsReserveOne).toString().match(re)?.[0]);
     setLjsReserveTwo(ethers.utils.formatEther(ljsReserveTwo).toString().match(re)?.[0]);
     setLjcReserveTwo(ethers.utils.formatEther(ljcReserveTwo).toString().match(re)?.[0]);
     setMaticReserveOne(ethers.utils.formatEther(ljcMaticcontractBalance).toString().match(re)?.[0]);
     setMaticReserveTwo(ethers.utils.formatEther(ljsMaticcontractBalance).toString().match(re)?.[0]);
  }

  const calculateLJCLJSAmount = async () => {
    let amountNeeded;
    const re = new RegExp("^-?\\d+(?:.\\d{0," + (4 || -1) + "})?");
    const provider = window.ethereum;
    const web3Provider = new providers.Web3Provider(provider).getSigner();
    const liquiditycontract = getLJCJStablePairInstance(web3Provider);
    const ljcryptoReserve = await liquiditycontract.getLJCrytpoReserve();
    const ljstableReserve = await liquiditycontract.getLJStableReserve();
    const contract = getLJCryptoTokenInstance(web3Provider);
    const ljcryptoPrice = await contract.currentPricePerToken();
    const ljstablePrice = 0.0004;
    if (
      changeLiquidityPair === "LJCrypto/LJStable" ||
      changeLiquidityPair === ""
    ) {
      if (amountTwo !== "0.0") {
        const amountB = ethers.utils.parseEther(
          `${amountTwo === "" ? "0.0" : amountTwo}`
        );
        const ljstableAmount = (ljstablePrice * 1e18) * parseInt(amountTwo);
        amountNeeded =
          ljstableAmount / BigNumber.from(ljcryptoPrice).toNumber();
        if (
          (BigNumber.from(ljcryptoReserve).toString() === "0" &&
          BigNumber.from(ljstableReserve).toString() === "0") || (tab === "Remove Liquidity")
        ) {
          setHowMuchLJCrypto(amountNeeded.toString().match(re)?.[0]);
        } else {
           const ljcryptoAmount = ethers.utils.formatEther(
             (amountB.mul(ljcryptoReserve)).div(ljstableReserve)
           );
          setHowMuchLJCrypto(ljcryptoAmount.match(re)?.[0]);
        }
      }
      if (amountOne !== "0.0") {
        const amountA = ethers.utils.parseEther(
          `${amountOne === "" ? "0" : amountOne}`
        );
        const ljstableAmount = ethers.utils.formatEther(
          amountA.mul(ljstableReserve).div(ljcryptoReserve.toString() !== "0" ? ljcryptoReserve : BigNumber.from(10000000))
        );
        const ljcryptoAmount =
          BigNumber.from(ljcryptoPrice).toNumber() * parseFloat(amountOne);
        amountNeeded = ljcryptoAmount / (ljstablePrice * 1e18);
        if (
          (BigNumber.from(ljcryptoReserve).toString() === "0" &&
            BigNumber.from(ljstableReserve).toString() === "0") ||
          (tab === "Remove Liquidity")
        ) {
          setHowMuchLJStable(amountNeeded.toString().match(re)?.[0]);
        } else {
          setHowMuchLJStable(ljstableAmount.match(re)?.[0]);
        }
      }
    }
  };

  const calculateLJCMaticAmount = async() => {
    let amountNeeded;
    const provider = window.ethereum;
    const web3Provider = new providers.Web3Provider(provider).getSigner();
    const liquiditycontract = getLJCMaticPairInstance(web3Provider);
    const ljcryptoReserve = await liquiditycontract.getLJCryptoReserve();
    const maticReserve = await new providers.Web3Provider(provider).getBalance(LJC_MATIC_ADDRESS);
    const contract = getLJCryptoTokenInstance(web3Provider);
     const ljcryptoPrice = await contract.currentPricePerToken();
     const theLJCryptoReserve = BigNumber.from(ljcryptoReserve).toString();
     if (changeLiquidityPair === "LJCrypto/Polygon") {
       if (secondAmountTwo !== "0.0") {
         if (theLJCryptoReserve === "0" || tab === "Remove Liquidity") {
             amountNeeded = parseFloat(secondAmountTwo) / (BigNumber.from(ljcryptoPrice).toNumber() / 1e18);
             setHowMuchLJCrypto2(amountNeeded.toString());
         } else {
            amountNeeded = (ljcryptoReserve * (parseFloat(secondAmountTwo)))/(maticReserve.toNumber())
            setHowMuchLJCrypto2(amountNeeded.toString());
         }
       }
          if (secondAmountOne !== "0.0") {
            if(theLJCryptoReserve === "0" || tab === "Remove Liquidity") {
               amountNeeded = parseFloat(secondAmountOne) * (parseFloat(ljcryptoPrice) / 1e18)
               setHowMuchPolygon(amountNeeded.toString());
            } else {
              const actualMaticReserve = maticReserve.toNumber() - (parseFloat(secondAmountOne)*1e18)
              const one = maticReserve.add(ethers.utils.parseEther(`${secondAmountOne}`)).mul(ethers.utils.parseEther(`${secondAmountOne}`).div(ljcryptoReserve))
               amountNeeded =
                 ((parseFloat(secondAmountOne) * 1e18) * actualMaticReserve) /
                 ljcryptoReserve;
              setHowMuchPolygon(ethers.utils.formatEther(one));
            }
          }  
     }
  }

  const calculateLJSMaticAmount = async() => {
     let amountNeeded;
     const provider = window.ethereum;
     const web3Provider = new providers.Web3Provider(provider).getSigner();
     const liquiditycontract = getLJSMaticPairInstance(web3Provider);
     const ljstableReserve = await liquiditycontract.getLJStableReserve();
     const maticReserve = await (await new providers.Web3Provider(provider).getBalance(LJS_MATIC_ADDRESS)).toString();
     const ljstablePrice = 0.0004.toString();
     const theLJStableReserve = BigNumber.from(ljstableReserve).toString();
     if (changeLiquidityPair === "LJStable/Polygon") {
       if (thirdAmountTwo !== "0.0") {
         if (theLJStableReserve === "0" || tab === "Remove Liquidity") {
           amountNeeded =
             parseFloat(thirdAmountTwo) /
             (parseFloat(ljstablePrice));
           setHowMuchLJStable2(amountNeeded.toString());
         } else {
           amountNeeded =
             (ljstableReserve * parseFloat(thirdAmountTwo)) /
            parseInt(maticReserve);
           setHowMuchLJStable2(amountNeeded.toString());
         }
       }
       if (thirdAmountOne !== "0.0") {
         if (theLJStableReserve === "0" || tab === "Remove Liquidity") {
           amountNeeded = parseFloat(thirdAmountOne) * (parseFloat(ljstablePrice));
           setHowMuchPolygon2(amountNeeded.toString());
         } else {
           amountNeeded =
             (parseFloat(thirdAmountOne) * parseFloat(maticReserve)) /
             ljstableReserve;
           setHowMuchPolygon2(amountNeeded.toString());
         }
       }
     }
  }

  const approveLJCryptoTokens = async (address:string, amountOne: BigNumber) => {
   try {
     setLoading(true)
      const signer = await getProviderOrSigner(true);
      const ljcryptoContract = getLJCryptoTokenInstance(signer);
      const tx = await ljcryptoContract.approve(address, amountOne);
      await tx.wait()
      window.alert(`You Have Successfully Approved ${ethers.utils.formatEther(amountOne)} LJCrypto Tokens`);
     setLoading(false)
   } catch (error:any) {
     setLoading(false)
     console.log(error)
   }
  }

  const approveLJStableTokens = async (address:string, amountOne: BigNumber) => {
    try {
      setLoading(true);
      const signer = await getProviderOrSigner(true);
      const ljstableContract = getLJStableCoinInstance(signer);
      const tx = await ljstableContract.approve(address, amountOne);
      await tx.wait();
      window.alert(
        `You Have Successfully Approved ${ethers.utils.formatEther(
          amountOne
        )} LJStable Tokens`
      );
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      console.log(error);
    }
  };

  const addLJSLJCLiquidity = async (amountOne: string, amountTwo: string) => {
    const weiAmountOne = ethers.utils.parseEther(amountOne.toString());
    const weiAmountTwo = ethers.utils.parseEther(amountTwo.toString());
    await approveLJCryptoTokens(LJC_LJS_ADDRESS,weiAmountOne)
    await approveLJStableTokens(LJC_LJS_ADDRESS,weiAmountTwo)
    try {
      setLoading(true);
      const signer = await getProviderOrSigner(true);
      const contract = getLJCJStablePairInstance(signer);
      const tx = await contract.addLiquidity(weiAmountOne, weiAmountTwo);
      await tx.wait();
      window.alert(`You Have Added Liquidity To The LJC/LJS Pair`);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      console.log(error);
      window.alert(error.data.message);
    }
  };

  const removeLJSLJCLiquidity = async (amountOne: string, amountTwo: string) => {
    // const weiAmountOne = ethers.utils.parseEther(amountOne.toString());
    // const weiAmountTwo = ethers.utils.parseEther(amountTwo.toString());
    try {
      setLoading(true);
      const signer = await getProviderOrSigner(true);
      const contract = getLJCJStablePairInstance(signer);
      const tx = await contract.removeLiquidity(
        ethers.utils.parseEther(amountOne.toString()),
        ethers.utils.parseEther(amountTwo.toString())
      );
      await tx.wait();
      window.alert(`You Have Removed Liquidity From The LJC/LJS Pair`);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      console.log(error);
      window.alert(error.data.message);
    }
  }

  const addLJCMaticLiquidity = async (amountOne: string, amountTwo: string) => {
    const weiAmountOne = ethers.utils.parseEther(amountOne.toString());
    const weiAmountTwo = ethers.utils.parseEther(amountTwo.toString());
    await approveLJCryptoTokens(LJC_MATIC_ADDRESS, weiAmountOne);
    try {
      setLoading(true);
      const signer = await getProviderOrSigner(true);
      const contract = getLJCMaticPairInstance(signer);
      const tx = await contract.addLiquidity(weiAmountOne, {value: weiAmountTwo});
      await tx.wait();
      window.alert(`You Have Added Liquidity To The LJC/Matic Pair`);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      console.log(error);
      window.alert(error.data.message);
    }
  };

  const removeLJCMaticLiquidity = async (
    amountOne: string,
    amountTwo: string
  ) => {
    const weiAmountOne = ethers.utils.parseEther(amountOne.toString());
    const weiAmountTwo = ethers.utils.parseEther(amountTwo.toString());
    try {
      setLoading(true);
      const signer = await getProviderOrSigner(true);
      const contract = getLJCMaticPairInstance(signer);
      const tx = await contract.removeLiquidity(weiAmountOne, weiAmountTwo);
      await tx.wait();
      window.alert(`You Have Removed Liquidity From The LJC/Matic Pair`);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      console.log(error);
      window.alert(error.data.message);
    }
  };

  const addLJSMaticLiquidity = async (amountOne: string, amountTwo: string) => {
    const weiAmountOne = ethers.utils.parseEther(amountOne.toString());
    const weiAmountTwo = ethers.utils.parseEther(amountTwo.toString());
    await approveLJStableTokens(LJS_MATIC_ADDRESS, weiAmountOne);
    try {
      setLoading(true);
      const signer = await getProviderOrSigner(true);
      const contract = getLJSMaticPairInstance(signer);
      const tx = await contract.addLiquidity(weiAmountOne, {
        value: weiAmountTwo,
      });
      await tx.wait();
      window.alert(`You Have Added Liquidity To The LJS/Matic Pair`);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      console.log(error);
      window.alert(error.data.message);
    }
  };

  const removeLJSMaticLiquidity = async (amountOne: string, amountTwo: string) => {
    const weiAmountOne = ethers.utils.parseEther(amountOne.toString());
    const weiAmountTwo = ethers.utils.parseEther(amountTwo.toString());
    try {
      setLoading(true);
      const signer = await getProviderOrSigner(true);
      const contract = getLJSMaticPairInstance(signer);
      const tx = await contract.removeLiquidity(weiAmountOne, weiAmountTwo);
      await tx.wait();
      window.alert(`You Have Removed Liquidity From The LJS/Matic Pair`);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      console.log(error);
      window.alert(error.data.message);
    }
  };

  const renderTabs = () => {
    if (tab === "" || tab === "Add Liquidity") {
      if (
        changeLiquidityPair === "LJCrypto/LJStable" ||
        changeLiquidityPair === ""
      ) {
        return (
          <>
            <div className="h-28 w-80 flex bg-yellow-500 rounded-2xl mb-2">
              <input
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setAmountOne(e.target.value)
                }
                className="pt-4 placeholder:text-black placeholder:opacity-60 font-semibold pl-4 bg-transparent mb-2 relative top-3 w-40 h-20 text-3xl outline-none pb-16 "
                type="number"
                placeholder={
                  howMuchLJCrypto === "NaN" || howMuchLJCrypto === undefined
                    ? "0.0"
                    : howMuchLJCrypto
                }
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
                placeholder={
                  howMuchLJStable === "NaN" || howMuchLJStable === undefined
                    ? "0.0"
                    : howMuchLJStable
                }
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSecondAmountOne(e.target.value)
                }
                placeholder={
                  howMuchLJCrypto2 === "NaN" || howMuchLJCrypto2 === undefined
                    ? "0.0"
                    : howMuchLJCrypto2
                }
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
                  <span className="pl-1 font-bold text-red-600">
                    {ljcryptoBalance}
                  </span>
                </div>
              </div>
            </div>
            <div className="h-28 w-80 flex bg-yellow-500 rounded-2xl mb-2">
              <input
                className="pt-4 placeholder:text-black placeholder:opacity-60 font-semibold pl-4 bg-transparent mb-2 relative top-3 w-40 h-20 text-3xl outline-none pb-16 "
                type="number"
                // value={secondAmountTwo === "0.0" || secondAmountTwo === "" ? "0.0" : secondAmountTwo}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSecondAmountTwo(e.target.value)
                }
                placeholder={
                  howMuchPolygon === "NaN" || howMuchPolygon === undefined
                    ? "0.0"
                    : howMuchPolygon
                }
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
                  <span className="pl-1 font-bold text-red-600">
                    {maticBalance}
                  </span>
                </div>
              </div>
            </div>
          </>
        );
      }
      if (changeLiquidityPair === "LJStable/Polygon") {
        return (
          <>
            <div className="h-28 w-80 flex bg-yellow-500 rounded-2xl mb-2">
              <input
                className="pt-4 placeholder:text-black placeholder:opacity-60 font-semibold pl-4 bg-transparent mb-2 relative top-3 w-40 h-20 text-3xl outline-none pb-16 "
                type="number"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setThirdAmountOne(e.target.value)
                }
                placeholder={
                  howMuchLJStable2 === "NaN" || howMuchLJStable2 === undefined
                    ? "0.0"
                    : howMuchLJStable2
                }
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
            <div className="h-28 w-80 flex bg-yellow-500 rounded-2xl mb-2">
              <input
                className="pt-4 placeholder:text-black placeholder:opacity-60 font-semibold pl-4 bg-transparent mb-2 relative top-3 w-40 h-20 text-3xl outline-none pb-16 "
                type="number"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setThirdAmountTwo(e.target.value)
                }
                placeholder={
                  howMuchPolygon2 === "NaN" || howMuchPolygon2 === undefined
                    ? "0.0"
                    : howMuchPolygon2
                }
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
                  <span className="pl-1 font-bold text-red-600">
                    {maticBalance}
                  </span>
                </div>
              </div>
            </div>
          </>
        );
      }
    }
    if(tab === "Remove Liquidity") {
      if (
        changeLiquidityPair === "LJCrypto/LJStable" ||
        changeLiquidityPair === ""
      ) {
        return (
          <>
            <div className="h-28 w-80 flex bg-yellow-500 rounded-2xl mb-2">
              <input
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setAmountOne(e.target.value)
                }
                className="pt-4 placeholder:text-black placeholder:opacity-60 font-semibold pl-4 bg-transparent mb-2 relative top-3 w-40 h-20 text-3xl outline-none pb-16 "
                type="number"
                placeholder={
                  howMuchLJCrypto === "NaN" || howMuchLJCrypto === undefined
                    ? "0.0"
                    : howMuchLJCrypto
                }
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
                <div className="flex items-center font-semibold text-md whitespace-nowrap pr-3 justify-end text-black">
                  Liquidity Balance:
                  <span className="pl-1  text-ellipsis font-bold text-red-600">
                    {ljcLiquidityBalanceOne}
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
                placeholder={
                  howMuchLJStable === "NaN" || howMuchLJStable === undefined
                    ? "0.0"
                    : howMuchLJStable
                }
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
                <div className="flex items-center font-semibold whitespace-nowrap text-base pr-3 justify-end text-black">
                  Liquidity Balance:
                  <span className="pl-1 font-bold text-red-600">
                    {ljsLiquidityBalanceOne}
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
                 onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                   setSecondAmountOne(e.target.value)
                 }
                 placeholder={
                   howMuchLJCrypto2 === "NaN" || howMuchLJCrypto2 === undefined
                     ? "0.0"
                     : howMuchLJCrypto2
                 }
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
                 <div className="flex items-center whitespace-nowrap font-semibold text-base pr-3 justify-end text-black">
                   Liquidity Balance:
                   <span className="pl-1 font-bold text-red-600">
                     {ljcLiquidityBalanceTwo}
                   </span>
                 </div>
               </div>
             </div>
             <div className="h-28 w-80 flex bg-yellow-500 rounded-2xl mb-2">
               <input
                 className="pt-4 placeholder:text-black placeholder:opacity-60 font-semibold pl-4 bg-transparent mb-2 relative top-3 w-40 h-20 text-3xl outline-none pb-16 "
                 type="number"
                 onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                   setSecondAmountTwo(e.target.value)
                 }
                 placeholder={
                   howMuchPolygon === "NaN" || howMuchPolygon === undefined || howMuchPolygon === ""
                     ? "0.0"
                     : howMuchPolygon
                 }
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
                 <div className="flex items-center whitespace-nowrap font-semibold text-base pr-3 justify-end text-black">
                   Liquidity Balance:
                   <span className="pl-1 font-bold text-red-600">
                     {maticBalanceTwo}
                   </span>
                 </div>
               </div>
             </div>
           </>
         );
       }
        if (changeLiquidityPair === "LJStable/Polygon") {
          return (
            <>
              <div className="h-28 w-80 flex bg-yellow-500 rounded-2xl mb-2">
                <input
                  className="pt-4 placeholder:text-black placeholder:opacity-60 font-semibold pl-4 bg-transparent mb-2 relative top-3 w-40 h-20 text-3xl outline-none pb-16 "
                  type="number"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setThirdAmountOne(e.target.value)
                  }
                  placeholder={
                    howMuchLJStable2 === "NaN" || howMuchLJStable2 === undefined
                      ? "0.0"
                      : howMuchLJStable2
                  }
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
                  <div className="flex items-center whitespace-nowrap font-semibold text-base pr-3 justify-end text-black">
                    Liquidity Balance:
                    <span className="pl-1 font-bold text-red-600">
                      {ljsLiquidityBalanceTwo}
                    </span>
                  </div>
                </div>
              </div>
              <div className="h-28 w-80 flex bg-yellow-500 rounded-2xl mb-2">
                <input
                  className="pt-4 placeholder:text-black placeholder:opacity-60 font-semibold pl-4 bg-transparent mb-2 relative top-3 w-40 h-20 text-3xl outline-none pb-16 "
                  type="number"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setThirdAmountTwo(e.target.value)
                  }
                  placeholder={
                    howMuchPolygon2 === "NaN" || howMuchPolygon2 === undefined
                      ? "0.0"
                      : howMuchPolygon2
                  }
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
                  <div className="flex items-center whitespace-nowrap font-semibold text-base pr-3 justify-end text-black">
                    Liquidity Balance:
                    <span className="pl-1 font-bold text-red-600">
                      {maticBalanceOne}
                    </span>
                  </div>
                </div>
              </div>
            </>
          );
        }
    }
    if(tab === "Stats") {
      if( changeLiquidityPair === "LJCrypto/LJStable" ||
        changeLiquidityPair === "") {
          return (
            <>
              <div className="flex justify-start md:mx-auto w-auto md:w-80 md:justify-center mb-10 items-center rounded-md px-2 h-8 bg-yellow-500 ml-n130 font-semibold  whitespace-nowrap">
                Pool LJCrypto Reserves:
              </div>
              <div className="flex justify-items-start md:w-80 md:justify-center items-center w-auto mb-10 rounded-md px-2 py-3 h-8 bg-black text-yellow-500 ml-n130 font-semibold md:ml-0 whitespace-nowrap">
                Amount: {ljcReserveOne}
              </div>
              <div className="flex justify-start md:w-80 md:justify-center mb-10 md:mx-auto w-auto items-center rounded-md px-2 h-8 bg-yellow-500 ml-n130 font-semibold whitespace-nowrap">
                Pool LJStable Reserves:
              </div>
              <div className="flex justify-items-start md:w-80 md:justify-center items-center w-auto mb-10 rounded-md px-2 py-3 h-8 bg-black text-yellow-500 ml-n130 font-semibold md:ml-0 whitespace-nowrap">
                Amount: {ljsReserveOne}
              </div>
              <div className="flex justify-start mb-10 md:w-80 md:justify-center md:mx-auto w-auto items-center rounded-md px-2 h-8 bg-yellow-500 ml-n130 font-semibold whitespace-nowrap">
                Your LJC Liquidity Balance:
              </div>
              <div className="flex justify-items-start md:w-80 md:justify-center items-center w-auto mb-10 rounded-md px-2 py-3 h-8 bg-black text-yellow-500 ml-n130 font-semibold md:ml-0 whitespace-nowrap">
                Amount: {ljcLiquidityBalanceOne}
              </div>
              <div className="flex justify-start mb-10 md:w-80 md:justify-center md:mx-auto w-auto items-center rounded-md px-2 h-8 bg-yellow-500 ml-n130 font-semibold whitespace-nowrap">
                Your LJS Liquidity Balance:
              </div>
              <div className="flex justify-start mb-10 md:w-80 md:justify-center md:mx-auto w-auto items-center rounded-md px-2 h-8 bg-black text-yellow-500 ml-n130 font-semibold whitespace-nowrap">
                Amount: {ljsLiquidityBalanceOne}
              </div>
            </>
          );
        }
         if (
           changeLiquidityPair === "LJCrypto/Polygon"
         ) {
           return (
             <>
               <main className="mb-5 h-auto">
                 <div className="flex justify-start md:mx-auto w-auto md:w-80 md:justify-center mb-10 items-center rounded-md px-2 h-8 bg-yellow-500 ml-n130 font-semibold  whitespace-nowrap">
                   Pool LJCrypto Reserves:
                 </div>
                 <div className="flex justify-items-start md:w-80 md:justify-center items-center w-auto mb-10 rounded-md px-2 py-3 h-8 bg-black text-yellow-500 ml-n130 font-semibold md:ml-0 whitespace-nowrap">
                   Amount: {ljcReserveTwo}
                 </div>
                 <div className="flex justify-start md:w-80 md:justify-center mb-10 md:mx-auto w-auto items-center rounded-md px-2 h-8 bg-yellow-500 ml-n130 font-semibold whitespace-nowrap">
                   Pool Matic Reserves:
                 </div>
                 <div className="flex justify-items-start md:w-80 md:justify-center items-center w-auto mb-10 rounded-md px-2 py-3 h-8 bg-black text-yellow-500 ml-n130 font-semibold md:ml-0 whitespace-nowrap">
                   Amount: {maticReserveOne}
                 </div>
                 <div className="flex justify-start mb-10 md:w-80 md:justify-center md:mx-auto w-auto items-center rounded-md px-2 h-8 bg-yellow-500 ml-n130 font-semibold whitespace-nowrap">
                   Your LJC Liquidity Balance:
                 </div>
                 <div className="flex justify-items-start md:w-80 md:justify-center items-center w-auto mb-10 rounded-md px-2 py-3 h-8 bg-black text-yellow-500 ml-n130 font-semibold md:ml-0 whitespace-nowrap">
                   Amount: {ljcLiquidityBalanceTwo}
                 </div>
                 <div className="flex justify-start mb-10 md:w-80 md:justify-center md:mx-auto w-auto items-center rounded-md px-2 h-8 bg-yellow-500 ml-n130 font-semibold whitespace-nowrap">
                   Your Matic Liquidity Balance:
                 </div>
                 <div className="flex justify-start mb-10 md:w-80 md:justify-center md:mx-auto w-auto items-center rounded-md px-2 h-8 bg-black text-yellow-500 ml-n130 font-semibold whitespace-nowrap">
                   Amount: {maticBalanceTwo}
                 </div>
               </main>
             </>
           );
         }
          if (changeLiquidityPair === "LJStable/Polygon") {
            return (
              <>
                <div className="flex justify-start md:mx-auto w-auto md:w-80 md:justify-center mb-10 items-center rounded-md px-2 h-8 bg-yellow-500 ml-n130 font-semibold  whitespace-nowrap">
                  Pool LJStable Reserves:
                </div>
                <div className="flex justify-items-start md:w-80 md:justify-center items-center w-auto mb-10 rounded-md px-2 py-3 h-8 bg-black text-yellow-500 ml-n130 font-semibold md:ml-0 whitespace-nowrap">
                  Amount: {ljsReserveTwo}
                </div>
                <div className="flex justify-start md:w-80 md:justify-center mb-10 md:mx-auto w-auto items-center rounded-md px-2 h-8 bg-yellow-500 ml-n130 font-semibold whitespace-nowrap">
                  Pool Matic Reserves:
                </div>
                <div className="flex justify-items-start md:w-80 md:justify-center items-center w-auto mb-10 rounded-md px-2 py-3 h-8 bg-black text-yellow-500 ml-n130 font-semibold md:ml-0 whitespace-nowrap">
                  Amount: {maticReserveTwo}
                </div>
                <div className="flex justify-start mb-10 md:w-80 md:justify-center md:mx-auto w-auto items-center rounded-md px-2 h-8 bg-yellow-500 ml-n130 font-semibold whitespace-nowrap">
                  Your LJS Liquidity Balance:
                </div>
                <div className="flex justify-items-start md:w-80 md:justify-center items-center w-auto mb-10 rounded-md px-2 py-3 h-8 bg-black text-yellow-500 ml-n130 font-semibold md:ml-0 whitespace-nowrap">
                  Amount: {ljsLiquidityBalanceTwo}
                </div>
                <div className="flex justify-start mb-10 md:w-80 md:justify-center md:mx-auto w-auto items-center rounded-md px-2 h-8 bg-yellow-500 ml-n130 font-semibold whitespace-nowrap">
                  Your Matic Liquidity Balance:
                </div>
                <div className="flex justify-start mb-10 md:w-80 md:justify-center md:mx-auto w-auto items-center rounded-md px-2 h-8 bg-black text-yellow-500 ml-n130 font-semibold whitespace-nowrap">
                  Amount: {maticBalanceOne}
                </div>
              </>
            );
          }
    }
  };

  const renderAddLiquidity = () => {
    if (
      changeLiquidityPair === "LJCrypto/LJStable" ||
      changeLiquidityPair === ""
    ) {
      return (
        <button
        onClick={() => addLJSLJCLiquidity(amountOne, amountTwo)}
        className="h-14 w-80 rounded-2xl bg-black font-semibold hover:text-white text-yellow-500 mb-5"
      >
        Add Liquidity
      </button>
      )
    }
    if(changeLiquidityPair === "LJCrypto/Polygon") {
      return (
        <button
          onClick={() => addLJCMaticLiquidity(secondAmountOne, secondAmountTwo)}
          className="h-14 w-80 rounded-2xl bg-black font-semibold hover:text-white text-yellow-500 mb-5"
        >
          Add Liquidity
        </button>
      )
    }
    if (changeLiquidityPair === "LJStable/Polygon") {
      return (
        <button
          onClick={() => addLJSMaticLiquidity(thirdAmountOne, thirdAmountTwo)}
          className="h-14 w-80 rounded-2xl bg-black font-semibold hover:text-white text-yellow-500 mb-5"
        >
          Add Liquidity
        </button>
      );
    }
  }

  const renderRemoveLiquidity = () => {
    if(tab === "" || tab === "Remove Liquidity") {
       if (
        changeLiquidityPair === "LJCrypto/LJStable" ||
        changeLiquidityPair === ""
      ) {
        return (
          <button
            onClick={() => removeLJSLJCLiquidity(amountOne, amountTwo)}
            className="h-14 w-80 rounded-2xl bg-black font-semibold hover:text-white text-yellow-500 mb-5"
          >
            Remove Liquidity
          </button>
        );
      }
      if(changeLiquidityPair === "LJStable/Polygon") {
        return (
          <button
            onClick={() => removeLJSMaticLiquidity(thirdAmountOne, thirdAmountTwo)}
            className="h-14 w-80 rounded-2xl bg-black font-semibold hover:text-white text-yellow-500 mb-5"
          >
            Remove Liquidity
          </button>
        )
      }
      if (changeLiquidityPair === "LJCrypto/Polygon") {
        return (
          <button
            onClick={() =>
              removeLJCMaticLiquidity(secondAmountOne, secondAmountTwo)
            }
            className="h-14 w-80 rounded-2xl bg-black font-semibold hover:text-white text-yellow-500 mb-5"
          >
            Remove Liquidity
          </button>
        );
      }
    }
  }
  

  useEffect(() => {
    getBalances();
    getLiquidityBalances()
  });

  useEffect(() => {
    calculateLJCLJSAmount();
    calculateLJCMaticAmount();
    calculateLJSMaticAmount()
  }, [amountOne, amountTwo, secondAmountTwo, secondAmountOne, thirdAmountOne, thirdAmountTwo]);

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
            <button
              onClick={() => setTab("Add Liquidity")}
              className={`${
                tab === "Add Liquidity" || tab === ""
                  ? "md:w-107 w-1/3 rounded-3xl font-bold h-12 bg-black text-yellow-500"
                  : "md:w-107 w-1/3 whitespace-nowrap font-bold rounded-3xl h-12 text-black"
              }`}
            >
              Add Liquidity
            </button>
            <button
              onClick={() => setTab("Remove Liquidity")}
              className={`${
                tab === "Remove Liquidity"
                  ? "md:w-107 w-1/2 rounded-3xl whitespace-nowrap font-bold h-12 bg-black text-yellow-500"
                  : "md:w-107 w-1/3 whitespace-nowrap font-bold rounded-3xl h-12 text-black"
              }`}
            >
              Remove Liquidity
            </button>
            <button
              onClick={() => setTab("Stats")}
              className={`${
                tab === "Stats"
                  ? "md:w-107 w-1/3 rounded-3xl whitespace-nowrap font-bold h-12 bg-black text-yellow-500"
                  : "md:w-107 w-1/3 whitespace-nowrap font-bold rounded-3xl h-12 text-black"
              }`}
            >
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
              <>{renderAddLiquidity()}</>
            ) : (
              <>{renderRemoveLiquidity()}</>
            )}
          </div>
        </>
      )}
      {!loading && (
        <div
          className={`${
            tab === "Stats"
              ? "flex flex-row justify-between mx-auto justify-self-center max-w-xs md:max-w-lg bg-black text-white rounded-2xl border border-solid border-yellow-400 z-50 relative top-300 pr-4 whitespace-nowrap overflow-x-scroll"
              : "flex flex-row justify-between mx-auto  justify-self-center max-w-xs md:max-w-lg bg-black text-white rounded-2xl border border-solid border-yellow-400  pr-4 whitespace-nowrap overflow-x-scroll"
          }`}
        >
          <a className=" text-black font-semibold mr-4 px-2 rounded-3xl bg-yellow-400 flex items-center justify-center">
           Liquidity Pools
          </a>
          <Link href="/lotterygame">
            <a className="pr-4 hover:text-yellow-500 cursor-pointer">
              Lottery Game
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
          <Link href="/dao">
            <a className="pr-4 hover:text-yellow-500 cursor-pointer">
             Governance
            </a>
          </Link>
          <Link href="/swap">
            <a className="pr-4 hover:text-yellow-500 cursor-pointer">Swap</a>
          </Link>
        </div>
      )}
    </main>
  );
};

export default LiquidityPools
