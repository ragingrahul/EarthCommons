import { Address, Employee, Organization } from '@/state/types'
import { PAYROLL_CONTRACT_ADDRESS } from '@/config/constants'
import { publicClient } from '@/config/client'
import abi from '@/config/payrollAbi'


export async function fetchEmployee(address: `0x${string}`) {
    console.log('fetch', address)

    const result = await publicClient.readContract({
        address: PAYROLL_CONTRACT_ADDRESS,
        abi: abi,
        functionName: 'getEmployee',
        args: [address]
    })

    console.log('fetchEmployee', result)
    return {
        address: result.employeeAddress,
        orgAddress: result.companyAddress,
        salary: Number(result.dailyWageWei),
        verified: false,
        activity: result.activity,
        daysWorked: Number(result.lastPayed),
    } as Employee
}

export async function fetchOrganization(address: `0x${string}`) {
    const result = await publicClient.readContract({
        address: PAYROLL_CONTRACT_ADDRESS,
        abi: abi,
        functionName: 'getCompany',
        args: [address]
    })

    return {
        orgAddress: result.companyAddress,
        orgName: result.companyName,
        orgTreasury: Number(result.treasury),
    } as Organization
}