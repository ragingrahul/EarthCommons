"use client"


import { Navbar } from '@/components/Navbar'
import React, { useEffect, useState } from 'react'
import EmployerHero from '@/components/EmployerHero';
import { RxAvatar } from "react-icons/rx";
import { setOrganization } from "@/state/app";
import { useAppDispatch, useAppSelector } from "@/state/hooks";
import { selectOrganization, selectRole, selectConnection } from "@/state/selectors";
import { fetchOrganization } from '@/services/read-services';
import { AddOrg } from '@/components/AddOrg';


const Employer = () => {
  const dispatch = useAppDispatch();
  const connection = useAppSelector(selectConnection);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  const role = useAppSelector(selectRole);
  const org = useAppSelector(selectOrganization);
  const isEmployer = role === 'employer'

  useEffect(() => {
    async function fetchData() {
      if (!connection?.userAddress) return
      try {
        // if(role === 'employee'){
        //   //window.location.href = '/employee'
        //   router.push('/employee')
        // }
        const org = await fetchOrganization(connection?.userAddress)
        dispatch(setOrganization(org))
        console.log(connection)
      } catch (error) {
        console.error(error)
      }
      //setLoading(false)
    }
    fetchData()
  }, [connection?.userAddress, dispatch])

  if (!isMounted) {
    return null; // or a loader/spinner
  }


  return (
    <main className='relative bg-purple-200 flex justify-center items-center flex-col overflow-hidden mx-auto sm:px-10 px-5'>
      <div className='max-w-7xl w-full'>
        {connection && org && 
          <>
            <Navbar
              title='Disconnect'
              icon={<RxAvatar />}
              position='left'
            />
            <EmployerHero address={connection?.userAddress} />
          </>
        }
        {
          connection && !org && isMounted &&
          <>
            <AddOrg />
          </>
        }
      </div>
    </main>
  )
}

export default Employer