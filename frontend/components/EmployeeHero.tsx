import React from 'react'
import { GridBackground } from './aceternityUi/GridBackground'
import { Spotlight } from './aceternityUi/Spotlight'
import EmployeeCardDetails from './EmployeeCardDetails'
import { Employee } from '@/state/types'
import { SalaryChart } from './ui/SalaryChart'

const EmployeeHero = () => {

    const totalAmount=1;
    const employeeInfo:Employee={
        address:"0x1akjfh14jj233",
        employeeName:"Ramon",
        orgAddress:"0x1akjfh14jj233",
        verified:false,
        salary:3000000000,
        activity:"HR",
        daysWorked:1729428161
    }
    return (
        <div className='pb-20 pt-10 w-full'>
            <div className="absolute pointer-events-none inset-0 w-full h-100vh flex items-start justify-start bg-black-100 [mask-image:radial-gradient(ellipse_at_center,transparent_60%,black)]"></div>
            <div>
                <Spotlight className='-top-40 -left-10 md:-left-32 md:-top-20 h-screen' fill='pink' />
                <Spotlight className='top-10 left-full h-[80vh] w-[50vw]' fill='purple' />
                <Spotlight className='top-28 left-80 h-[80vh] w-[50vw]' fill='blue' />
            </div>
            <div className={`grid grid-cols-3 gap-10 md:gap-2 max-w-7xl mx-auto `}>
                <div className='col-span-2'>
                    <EmployeeCardDetails employee={employeeInfo} totalPayment={totalAmount} />
                </div>
                
                <SalaryChart />
            </div>
            
             {/*<Timeline employeeInfo={employeeInfo} events={events} /> */}

        </div>
    )
}

export default EmployeeHero