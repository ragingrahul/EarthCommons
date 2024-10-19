import React from 'react'
import {Roboto_Mono} from '@next/font/google'

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

  return (
    <div className='relative inline-block text-center'>
      <div>
        <button
          className={`inline-flex h-10 animate-shimmer items-center justify-center  border border-slate-800 bg-[linear-gradient(110deg,#af7eff,45%,#c1a3f2,55%,#af7eff)] bg-[length:200%_100%] px-4 gap-1 font-medium text-sm text-black transition-colors focus:outline-none focus:ring-1 focus:ring-purple-800  ${roboto.className}`}
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
