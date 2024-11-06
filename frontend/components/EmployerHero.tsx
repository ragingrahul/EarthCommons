import React, { useMemo } from 'react'
import { GridBackground } from './aceternityUi/GridBackground'
import EmployerGraphs from './EmployerGraphs'
import { Spotlight } from './aceternityUi/Spotlight'
import EmployerTimeline from './EmployerTimeline'
import { Address } from '@/state/types'
import { EmployerBento } from './EmployerBento'
import { formatEther } from 'viem'
import { useQuery } from '@apollo/client'
import { EMPLOYEE_ADDS, ORG_ADDED, ORG_FUNDED } from '@/services/graph-queries'

type AddressProp = {
    address: Address
}
const EmployerHero = ({address}:AddressProp) => {
    const { data: employeesAdded } = useQuery(EMPLOYEE_ADDS, {
        variables: {
        companyAddress: address,
        },
    })
    const { data: orgAdded } = useQuery(ORG_ADDED, { variables: { address } })
    const { data: orgFunded } = useQuery(ORG_FUNDED, { variables: { address } })
    
      console.log(address,employeesAdded,orgAdded,orgFunded)
      const data = useMemo(() => {
        const results = []
        if (orgAdded && orgAdded.companyAddeds?.length) {
          results.push({
            transactionId:orgAdded.companyAddeds[0].id,
            eventName: 'Organization Created',
            eventTime: orgAdded.companyAddeds[0].blockTimestamp,
            status:"Success",
            type: "order1",
          })
        }
        if (orgFunded) {
          for (const funded of orgFunded.companyFundeds) {
            results.push({
              transactionId:funded.id,
              eventName: `Organization Funded ${formatEther(funded.amount)} ETH`,
              eventTime: funded.blockTimestamp,
              status:"Success",
              type: "order2",
            })
          }
        }
        if (employeesAdded) {
          for (const employee of employeesAdded.employeeAddeds) {
            results.push({
              transactionId:employee.id,
              eventName: 'Employee Added',
              eventTime: employee.blockTimestamp,
              status:"Success",
              type: "order3",
            })
          }
        }
        console.log(results)
        return results.sort((a, b) => b.eventTime - a.eventTime)
      }, [employeesAdded, orgAdded, orgFunded])
    return (
        <div className='pb-20 pt-10 h-100vh'>
            <div>
                <Spotlight className='-top-40 -left-10 md:-left-32 md:-top-20 h-screen' fill='pink' />
                <Spotlight className='top-10 left-full h-[80vh] w-[50vw]' fill='purple' />
                <Spotlight className='top-28 left-80 h-[80vh] w-[50vw]' fill='blue' />
            </div>
            <GridBackground />
            <EmployerBento />
            <EmployerGraphs address={address}/>
            <EmployerTimeline address={address} data={data}/> 
        </div>
    )
}

export default EmployerHero