import React, { useEffect, useState } from 'react'
import { Roboto_Mono } from '@next/font/google'
import {
  createWalletClient,
  custom,
} from "viem";
import { sepolia } from "viem/chains";
import { useRouter } from 'next/navigation';
import { useWallet } from "@/hooks/WalletContext";
import { formatAddress } from '@/utils/helper';
import { setConnection, setOrganization, setRole } from "@/state/app";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { selectConnection } from "@/state/selectors";
import { Role } from '@/state/types';

const roboto = Roboto_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700',]
})

type Props = {
  title: string
  icon: React.ReactNode
  position: string
  handleClick?: () => void
  otherClasses?: string
  openWalletDialog?: () => void;
}
export const ShimmerButton = ({
  title, icon, position, handleClick, otherClasses, openWalletDialog
}: Props) => {
  const router = useRouter();
  const dispatch = useAppDispatch()
  const {
    walletClient,
    setWalletClient,
  } = useWallet();
  const connection = useAppSelector(selectConnection);
  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => setIsOpen(!isOpen);

  async function login(e: any,role: Role){
    e.preventDefault();
    try {
      // @ts-ignore
      await window.silk.login();
      const newWalletClient = createWalletClient({
        chain: sepolia,
        // @ts-ignore
        transport: custom(window.silk as any),
      });
      setWalletClient(newWalletClient);

      const [address] = await newWalletClient.requestAddresses();
      const connect = {
        connected: true,
        userAddress: address
      } 
      dispatch(setRole(role))
      dispatch(setConnection(connect))
      router.push('/'+role);
    } catch (err: any) {
      console.error(err);
    }
  }

  async function logout(e: React.MouseEvent) {
    e.preventDefault();
    setWalletClient(undefined);
    dispatch(setConnection(undefined));
    dispatch(setRole('nill'))
    dispatch(setOrganization(undefined))
    router.push('/');
  }

  console.log(connection?.userAddress)
  return (
    <div className={`relative inline-block text-center ${roboto.className}`}>
      {
        !connection?.connected && connection?.userAddress == undefined ? (
          <div>
            <button
              className={`inline-flex h-10 animate-shimmer items-center justify-center  border border-slate-800 bg-[linear-gradient(110deg,#af7eff,45%,#c1a3f2,55%,#af7eff)] bg-[length:200%_100%] px-4 gap-1 font-medium text-sm text-black transition-colors focus:outline-none focus:ring-1 focus:ring-purple-800 `}
              onClick={() => {
                if (title == 'Connect') {
                  toggleDropdown()
                  console.log("Connect", isOpen)
                }
              }}
            >
              {position === 'left' && icon}
              {title}
              {position === 'right' && icon}
            </button>
          </div>
        ) : (
          <button
            className={`inline-flex h-10 animate-shimmer items-center justify-center  border border-slate-800 bg-[linear-gradient(110deg,#af7eff,45%,#c1a3f2,55%,#af7eff)] bg-[length:200%_100%] px-4 gap-1 font-medium text-sm text-black transition-colors focus:outline-none focus:ring-1 focus:ring-purple-800 `}
            onClick={() => {
              if (title == 'Disconnect') {
                toggleDropdown()
                console.log("Here", isOpen)
              }
            }}
          >
            {position === 'left' && icon}
            {connection && formatAddress(connection.userAddress)}
            {position === 'right' && icon}
          </button>
        )
      }

      {title === 'Connect' && isOpen && (
        <div className={`origin-top-right absolute right-0 mt-2 w-full rounded-md shadow-lg ring-1 ring-black ring-opacity-5 gap-0`}>
          <div
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            <button
              className={`inline-flex w-full h-10  items-center justify-center bg-[#af7eff] px-4 gap-1 font-medium text-sm text-black transition-colors `}
              onClick={(e)=>{
                login(e,"employer")
              }}
            >
              Employeer
            </button>
            <button
              className={`inline-flex w-full h-10  items-center justify-center bg-[#af7eff] px-4 gap-1 font-medium text-sm text-black transition-colors `}
              onClick={(e)=>{
                login(e,"employee")
              }}
            >
              Employee
            </button>
          </div>
        </div>
      )}
      {title !=='Connect' && isOpen && (
          <div className={`origin-top-right absolute right-0 mt-2 w-full rounded-md shadow-lg ring-1 ring-black ring-opacity-5 gap-0`}>
          <div
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            <button
              className={`inline-flex w-full h-10  items-center justify-center bg-[#af7eff] px-4 gap-1 font-medium text-sm text-black transition-colors `}
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </div>
      )}

    </div>

  )
}

