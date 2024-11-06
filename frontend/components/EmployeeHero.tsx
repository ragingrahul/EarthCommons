import React, { useEffect, useMemo, useState } from 'react'
import { GridBackground } from './aceternityUi/GridBackground'
import { Spotlight } from './aceternityUi/Spotlight'
import EmployeeCardDetails from './EmployeeCardDetails'
import { Employee } from '@/state/types'
import { SalaryChart } from './SalaryChart'
import { BarChartCard } from './BarChartCard'
import EmployerTimeline from './EmployerTimeline'
import { useQuery } from '@apollo/client'
import { PAYOUT_MADE } from '@/services/graph-queries'
import { useAppSelector } from '@/state/hooks'
import { selectConnection } from '@/state/selectors'
import { fetchEmployee } from '@/services/read-services'
import { formatEther } from 'viem'

const EmployeeHero = () => {
    const connection = useAppSelector(selectConnection);
    const [employeeInfo, setEmployeeInfo] = useState<Employee>()
    const totalAmount = 1;
    useEffect(() => {
        if(connection) {
            fetchEmployee(connection.userAddress as `0x${string}`)
            .then(data => {setEmployeeInfo(data); console.log(data)})
        }
    }, [connection])
    
    const { data: paymentMade } = useQuery(PAYOUT_MADE, {
        variables: {
        address: connection?.userAddress,
        },
    })

    const data = useMemo(() => {
        const results = []
        if (paymentMade) {
            for (const payment of paymentMade.payoutMades) {
              results.push({
                transactionId:payment.id,
                eventName: `Organization Funded ${formatEther(payment.amount)} ETH`,
                eventTime: payment.blockTimestamp,
                status:"Success",
                type: "order2",
              })
            }
          }
        console.log(results)
        return results.sort((a, b) => b.eventTime - a.eventTime)
      }, [paymentMade])

    if (!employeeInfo) {
        return 
    }
    return (
        <div className='pb-20 pt-10 w-full'>
            <div className="absolute pointer-events-none inset-0 w-full h-[110vh] flex items-start justify-start bg-custom-image bg-cover [mask-image:radial-gradient(ellipse_at_center,transparent_1%,black)]"></div>
            <div>
                <Spotlight className='-top-40 -left-10 md:-left-32 md:-top-20 h-screen' fill='pink' />
                <Spotlight className='top-10 left-full h-[80vh] w-[50vw]' fill='purple' />
                <Spotlight className='top-28 left-80 h-[80vh] w-[50vw]' fill='blue' />
            </div>
            <div className={`grid grid-cols-3 gap-10 md:gap-2 max-w-7xl mx-auto `}>
                <div className='col-span-2'>
                    <EmployeeCardDetails employee={employeeInfo} totalPayment={totalAmount} />
                </div>
                {/* <div className='col-span-1 h-full'> */}
                <SalaryChart />
                {/* </div> */}

            </div>
            <div className={`grid grid-cols-3 gap-10 md:gap-2 max-w-7xl mx-auto `}>
                <div className='col-span-1'>
                    <BarChartCard />
                </div>
                <div className='col-span-2'>
                    <EmployerTimeline address={employeeInfo.address as `0x${string}`} data={data}/>
                </div>
            </div>

        </div>
    )
}

export default EmployeeHero