import React from 'react'
import { IState as Props } from './index';
import type { NextPage } from "next";

const links = () => {
  `mb-5 hover:opacity-50`
}

interface IProps {
  setModal: React.Dispatch<React.SetStateAction<Props["modal"]>>;
  modal: Props["modal"];
  modalToggle: () => void ;
}

const SideBarMenu: React.FC<IProps> = ({modalToggle}) => {
  return (
    <main className="fixed top-0 left-0 w-full h-full grid z-50 bg-gray-800 bg-gradient-to-r from-yellow-400 to-black p-7">
      <div className="flex justify-between text-3xl text-white font-bold">
        <div className="flex justify-start flex-col cursor-pointer">
          <h1 className="mb-5 hover:text-black">Swap</h1>
          <h1 className="mb-5">Liquidity Pools</h1>
          <h1 className="mb-5">Staking</h1>
          <h1 className="mb-5">Governance</h1>
          <h1 className="mb-5">Tokens And NFTs</h1>
          <h1 className="mb-5">LotteryGame</h1>
          <h1 className="mb-5">GuessingGame</h1>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32px"
          height="32px"
          viewBox="0 0 24 24"
          fill=""
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          className="cursor-pointer hover:scale-75"
          onClick={modalToggle}
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </div>
    </main>
  );
}

export default SideBarMenu



 