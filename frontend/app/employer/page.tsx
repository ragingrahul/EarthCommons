"use client"


import { Navbar } from '@/components/Navbar'
import React, { useEffect } from 'react'
import { IoMdLogOut } from 'react-icons/io'
import { RxAvatar } from "react-icons/rx";


const Employee = () => {
  // const dispatch = useAppDispatch()
  // const {account, connected}=useWallet();
  // const role = useAppSelector(selectRole);
  //const org = useAppSelector(selectOrganization);
  // const isEmployer = role === 'employer'

  // useEffect(() => {
  //   async function fetchData() {
  //     if (!connected){
  //       // window.location.href = '/'
  //       console.log(connected,account?.address)
  //     }
  //   }
  //   fetchData()
  // }, [account?.address, dispatch])

  //console.log('org', org)
  return (
    <div className='w-full'>
        <Navbar 
          title='Disconnect' 
          icon={<RxAvatar />}
          position='left' 
        />
        {/* <EmployeeHero /> */}
    </div>
  )
}

export default Employee