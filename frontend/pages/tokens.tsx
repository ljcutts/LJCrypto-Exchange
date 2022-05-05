import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { providers, Contract, BigNumber, ethers } from "ethers";
import Web3Modal from "web3modal";

import {
  LJCRYPTO_TOKEN_ABI,
  LJCRYPTO_TOKEN_ADDRESS,
} from "../constants/ljcryptotoken";

import {
  LJSTABLE_COIN_ABI,
  LJSTABLE_COIN_ADDRESS,
} from "../constants/ljstablecoin";

type IState = {
  account: string | null;
  setAccount: React.Dispatch<React.SetStateAction<string | null>>;
  ljcryptoPrice: string;
  setLJCryptoPrice: React.Dispatch<React.SetStateAction<string>>;
  ljcryptoBalance: string;
  setLJCryptoBalance: React.Dispatch<React.SetStateAction<string>>;
  ljstablecoinBalance: string;
  setLJStableCoinBalance: React.Dispatch<React.SetStateAction<string>>;
  amount: string;
  setAmount: React.Dispatch<React.SetStateAction<string>>;
};


const Tokens: React.FC = () => {
     const zero = BigNumber.from(0);
     const [account, setAccount] = useState<IState["account"]>(null);
     const [ljcryptoPrice, setLJCryptoPrice] = useState<IState["ljcryptoPrice"]>("0");
     const [ljcryptoBalance, setLJCryptoBalance] = useState<IState["ljcryptoBalance"]>("0");
     const [ljstablecoinBalance, setLJStableCoinBalance] = useState<IState["ljstablecoinBalance"]>("0");
     const [walletConnected, setWalletConnected] = useState(false);
     const [thisAmount, setAmount] = useState<IState["amount"]>("");
     const [buyljCrypto, setbuyLJCrypto] = useState(false);
     const [sellljCrypto, setSellLJCrypto] = useState(false);
     const [buyljStable, setbuyLJStable] = useState(false);
     const [sellljStable, setsellLJStable] = useState(false);

      const web3ModalRef: any = useRef();

      const getLJCryptoTokenInstance = (providerOrSigner: any) => {
        return new Contract(
          LJCRYPTO_TOKEN_ADDRESS,
          LJCRYPTO_TOKEN_ABI,
          providerOrSigner
        );
      };

       const getLJStableCoinInstance = (providerOrSigner: any) => {
         return new Contract(
           LJSTABLE_COIN_ADDRESS,
           LJSTABLE_COIN_ABI,
           providerOrSigner
         );
       };


      const getLJCryptoTokenPrice = async() => {
           const provider = await getProviderOrSigner(true);
           const contract = getLJCryptoTokenInstance(provider);
           const value = await contract.currentPricePerTokenInEther();
           setLJCryptoPrice(ethers.utils.formatEther(value))
           return value;
      }

      const getLJCryptoTokenBalance = async() => {
           const provider = await getProviderOrSigner(true);
           const contract = getLJCryptoTokenInstance(provider);
           const currentAccount = await getAddress()
           const value = await contract.balanceOf(currentAccount);
           setLJCryptoBalance(ethers.utils.formatEther(value));
           return value;
      }

      const toggleBuyLJCrypto = () => {
          setbuyLJCrypto(!buyljCrypto)
      }

       const toggleSellLJCrypto = () => {
         setSellLJCrypto(!sellljCrypto);
       };

         const toggleBuyLJStableCoin = () => {
           setbuyLJStable(!buyljStable);
         };

          const toggleSellLJStableCoin = () => {
            setsellLJStable(!sellljStable);
          };

      const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      ) => {
        setAmount(e.target.value);
      };

      const buyLJCrytptoToken = async(amount:string) => {
        try {
            const number = await getLJCryptoTokenPrice()
            const priceZero = ethers.utils.formatEther(number)
            const thisZero = ethers.utils.formatEther(zero)
            if(priceZero === thisZero) {
                const signer = await getProviderOrSigner(true);
                const contract = getLJCryptoTokenInstance(signer);
                  const tx = await contract.buyTokens(amount, {value: ethers.utils.parseEther(`0.1`)});
                  await tx.wait();
            } else {
                const price:number = await getLJCryptoTokenPrice()
                const signer = await getProviderOrSigner(true);
                const contract = getLJCryptoTokenInstance(signer);
                const paidAmount = parseInt(amount) * price;
                const tx = await contract.buyTokens(amount, {
                  value: ethers.utils.parseEther(`${paidAmount}`),
                });
                await tx.wait();
            }
        } catch (error) {
          console.log(error)
          window.alert("Make Sure You Have Enough Funds For The Amount Of Tokens You Are Buying")
        }
         
      }

      const sellLJCryptoToken = async(amount: string) => {
        try {
           const signer = await getProviderOrSigner(true);
           const contract = getLJCryptoTokenInstance(signer);
           const tx = await contract.sellTokens(amount);
           await tx.wait();
        } catch (error) {
          console.log(error)
        }
      }

      const buyljStableCoin = async(amount: string) => {
        try {
           const signer = await getProviderOrSigner(true);
           const contract = getLJStableCoinInstance(signer);
           const price = 0.0004;
           const paidAmount = parseInt(amount) * price;
           const tx = await contract.buyTokens(amount, {value: ethers.utils.parseEther(`${paidAmount}`)});
           await tx.wait();
        } catch (error) {
          console.log(error)
          window.alert("Make Sure You Have Enough Funds For The Amount Of Tokens You Are Buying");
        }
      }

      const sellLJStableCoin = async(amount: string) => {
        try {
           const signer = await getProviderOrSigner(true);
           const contract = getLJStableCoinInstance(signer);
            const tx = await contract.sellTokens(amount);
            await tx.wait();
        } catch (error) {
          console.error(error)
          window.alert("You Don't Own This Many Tokens")
        }
      }

      const getLJStableCoinBalance = async () => {
        const provider = await getProviderOrSigner(true);
        const contract = getLJStableCoinInstance(provider);
        const currentAccount = await getAddress();
        const value = await contract.balanceOf(currentAccount);
        setLJStableCoinBalance(ethers.utils.formatEther(value));
        return value;
      };


      const getAddress = async () => {
        const provider = await web3ModalRef.current.connect();
        const web3Provider = new providers.Web3Provider(provider);
        const thisAccount = await web3Provider.getSigner().getAddress();
        setAccount(await web3Provider.getSigner().getAddress());
        return thisAccount;
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
         await getLJCryptoTokenPrice()
         await getLJCryptoTokenBalance()
         await getLJStableCoinBalance()
       }, 0.5 * 1000);
     }, [walletConnected, account]);


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
          <p className="">
            Available tokens to buy: ljcryptotoken, ljstablecoin
          </p>
        </div>
      </div>
      <div className="flex justify-start w-32 items-center rounded-md px-2 h-8 bg-yellow-500 ml-4 font-semibold mb-2  whitespace-nowrap">
        Your Balances:
      </div>
      <div className="flex flex-col h-32 w-80 bg-black rounded-md ml-4 relative top-10 mb-20">
        <div className="flex mt-5 ml-3 ">
          <img
            src="/ljcrypto.webp"
            alt=""
            className="rounded-3xl w-8 h-8 mr-3"
          />
          <p className="text-yellow-500 font-semibold capitalize">
            LjcryptoToken: <span>{ljcryptoBalance} Tokens</span>
          </p>
        </div>
        <div className="flex mt-5 ml-3 ">
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
      <div className="flex justify-start w-28 items-center rounded-md px-2 h-8 bg-yellow-500 ml-4 font-semibold  whitespace-nowrap">
        Token Prices:
      </div>
      <div className="flex flex-col h-32 w-80 bg-black rounded-md ml-4 relative top-10 mb-20">
        <div className="flex mt-5 ml-3 ">
          <img
            src="/ljcrypto.webp"
            alt=""
            className="rounded-3xl w-8 h-8 mr-3"
          />
          <p className="text-yellow-500 font-semibold capitalize">
            LjcryptoToken: <span>{ljcryptoPrice} Ether</span>
          </p>
        </div>
        <div className="flex mt-5 ml-3 ">
          <img
            src="/ljstable.png"
            alt=""
            className="rounded-3xl w-8 h-8 mr-3"
          />
          <p className="text-yellow-500 font-semibold capitalize">
            Ljstablecoin: <span>0.0004 Ether</span>
          </p>
        </div>
      </div>
      <div className="flex justify-start w-28 items-center rounded-md px-2 h-8 bg-yellow-500 ml-4 font-semibold mt-15  whitespace-nowrap">
        Buy And Sell:
      </div>
      <div className="flex flex-col  h-32 w-80 bg-black rounded-md ml-4 relative top-10 mb-20">
        <div className="flex mt-5 ml-3 ">
          <img
            src="/ljcrypto.webp"
            alt=""
            className="rounded-3xl w-8 h-8 mr-3"
          />
          <div className="flex items-center">
            <p className="text-yellow-500 font-semibold capitalize">
              LjcryptoToken:
            </p>
            <button
              onClick={toggleBuyLJCrypto}
              className="rounded-md ml-3 mx-auto md:relative md:left-20 bg-yellow-500 text-white h-8 shadow-button w-12 font-semibold transition ease-in-out hover:scale-75"
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
                      placeholder="Amount To Buy"
                      onChange={handleChange}
                      className="px-4 w-40 mx-auto rounded-xl mb-5 focus:outline-none border border-solid border-yellow-500 text-yellow-500"
                    />
                  </div>
                  <button
                    className="rounded-2xl mx-auto bg-black md:relative md:right-40 text-yellow-500 h-8 shadow-button w-40 font-bold transition ease-in-out hover:text-white "
                    onClick={() => buyLJCrytptoToken(thisAmount)}
                  >
                    Buy Tokens
                  </button>
                </div>
              </div>
            )}
            <button
              onClick={toggleSellLJCrypto}
              className=" rounded-md ml-3 mx-auto md:relative md:left-20 bg-yellow-500 text-black h-8 shadow-button w-12 font-bold transition ease-in-out hover:scale-75 "
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
                      placeholder="Amount To Sell"
                      onChange={handleChange}
                      className="px-4 w-40 mx-auto rounded-xl mb-5 focus:outline-none border border-solid border-yellow-500 text-yellow-500"
                    />
                  </div>
                  <button
                    className="rounded-2xl mx-auto bg-black md:relative md:right-40 text-yellow-500 h-8 shadow-button w-40 font-bold transition ease-in-out hover:text-white "
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
              className=" rounded-md ml-3 mx-auto md:relative md:left-20 bg-yellow-500 text-white h-8 shadow-button w-12 font-semibold transition ease-in-out hover:scale-75"
            >
              Buy
            </button>
            {buyljStable && (
              <div className="fixed top-0 left-0 w-full h-full bg-shade grid z-50 place-items-center">
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
                      placeholder="Amount To Buy"
                      onChange={handleChange}
                      className="px-4 w-40 mx-auto rounded-xl mb-5 focus:outline-none border border-solid border-yellow-500 text-yellow-500"
                    />
                  </div>
                  <button
                    className="rounded-2xl mx-auto bg-black md:relative md:right-40 text-yellow-500 h-8 shadow-button w-40 font-bold transition ease-in-out hover:text-white "
                    onClick={() => buyljStableCoin(thisAmount)}
                  >
                    Buy Tokens
                  </button>
                </div>
              </div>
            )}
            <button onClick={toggleSellLJStableCoin} className=" rounded-md ml-3 mx-auto md:relative md:left-20 bg-yellow-500 text-black h-8 shadow-button w-12 font-bold transition ease-in-out hover:scale-75 ">
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
                      placeholder="Amount To Sell"
                      onChange={handleChange}
                      className="px-4 w-40 mx-auto rounded-xl mb-5 focus:outline-none border border-solid border-yellow-500 text-yellow-500"
                    />
                  </div>
                  <button
                    className="rounded-2xl mx-auto bg-black md:relative md:right-40 text-yellow-500 h-8 shadow-button w-40 font-bold transition ease-in-out hover:text-white "
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
    </main>
  );
}

export default Tokens