"use client"

import EmployeeHero from '@/components/EmployeeHero'
import EmployerHero from '@/components/EmployerHero'
import { Navbar } from '@/components/Navbar'
import { useAppDispatch, useAppSelector } from '@/state/hooks'
import { selectRole } from '@/state/selectors'

import React, { useEffect, useState } from 'react'
import { IoMdLogOut } from 'react-icons/io'

const Employee = () => {
  const dispatch = useAppDispatch()
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  // const {account, connected}=useWallet();
  // const role = useAppSelector(selectRole);
  // //const org = useAppSelector(selectOrganization);
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

  if (!isMounted) {
    return null; // or a loader/spinner
  }

  //console.log('org', org)
  return (
    <div className='w-full h-fit'>
        <Navbar 
          title='Disconnect' 
          icon={<IoMdLogOut />}
          position='left' 
        />
        <EmployeeHero />
    </div>
  )
}

export default Employee