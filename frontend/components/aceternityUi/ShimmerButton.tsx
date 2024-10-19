import React, { useState } from 'react'
import { GiReceiveMoney } from 'react-icons/gi'
import { PiHandDeposit } from 'react-icons/pi'

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

  return (
    <div className='relative inline-block text-center'>
      <div>
        <button
          className={`inline-flex h-10 animate-shimmer items-center justify-center  border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 gap-3 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-1 focus:ring-slate-400  ${otherClasses}`}
          onClick={()=>{
          }}
        >
          {position === 'left' && icon}
          {title}
          {position === 'right' && icon}
        </button>
      </div>
    </div>

  )
}
