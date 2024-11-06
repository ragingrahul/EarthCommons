import React, { useMemo } from 'react'
import { DataTableDemo } from './EmployeeTable'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Button } from "./ui/button"
import { CheckIcon, DotsHorizontalIcon } from '@radix-ui/react-icons'
import { ColumnDef } from '@tanstack/react-table'
import { useQuery } from '@apollo/client'
// import { EMPLOYEE_ADDED_MOVE, ORG_ADDED_MOVE, ORG_FUNDED_MOVE } from '@/utils/graph-queries'
import { Address } from '@/state/types'
import moment from 'moment'
import { formatAddress, getColorClass, extractTransactionId } from '@/utils/helper'
import {events} from '@/data/index'
import { Event } from '@/state/types'
import { EMPLOYEE_ADDS, ORG_ADDED, ORG_FUNDED } from '@/services/graph-queries'
import { useAppDispatch, useAppSelector } from '@/state/hooks'
import { selectOrganization } from '@/state/selectors'
import { formatEther } from 'viem'

export const columns: ColumnDef<Event>[] = [
    {
        accessorKey: "transactionId",
        header: "Transaction Id",
        cell: ({ row }) => (
            <div className="capitalize">{formatAddress(extractTransactionId(row.getValue("transactionId")))}</div>
        ),
    },
    {
        accessorKey: "eventName",
        header: () => <div className="text-center">Name</div>,
        cell: ({ row }) => (
            <div className="capitalize text-center">{row.getValue("eventName")}</div>
        ),
    },
    {
        accessorKey: "status",
        header: () => <div className="text-center">Status</div>,
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            const eventName = row.getValue("eventName") as string
            const type = row.original.type 
            return (
                <div className="flex text-center w-full justify-center">
                    <CheckIcon className={`h-5 w-5 text-green-500`} />
                    <span className="ml-2 capitalize">
                        {status}
                    </span>
                </div>
            )
        },
    },
    {
        accessorKey: "eventTime",
        header: () => <div className="text-center">Time</div>,
        cell: ({ row }) => {
            const eventTime = row.getValue("eventTime") as number
            return (
                <div className="flex text-center w-full justify-center">
                    <span className="ml-2 capitalize ">
                        {moment.unix(eventTime).format('Do MMMM YYYY')}
                    </span>
                </div>
            )
        },
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const event = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <DotsHorizontalIcon className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            onClick={() => window.open(`https://sepolia.etherscan.io/tx/${extractTransactionId(event.transactionId)}`, '_blank')}
                        >
                            Show Transaction
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]

type AddressProp = {
    address: Address
    data: Event[]
}


const EmployerTimeline = ({address,data}:AddressProp) => {
    const dispatch = useAppDispatch()
    const org = useAppSelector(selectOrganization)

    // const { data: employeesAdded } = useQuery(EMPLOYEE_ADDS, {
    //     variables: {
    //     companyAddress: address,
    //     },
    // })
    // const { data: orgAdded } = useQuery(ORG_ADDED, { variables: { address } })
    // const { data: orgFunded } = useQuery(ORG_FUNDED, { variables: { address } })
    
    //   console.log(address,employeesAdded,orgAdded,orgFunded)
    //   const data = useMemo(() => {
    //     const results = []
    //     if (orgAdded && orgAdded.companyAddeds?.length) {
    //       results.push({
    //         transactionId:orgAdded.companyAddeds[0].id,
    //         eventName: 'Organization Created',
    //         eventTime: orgAdded.companyAddeds[0].blockTimestamp,
    //         status:"Success",
    //         type: "order1",
    //       })
    //     }
    //     if (orgFunded) {
    //       for (const funded of orgFunded.companyFundeds) {
    //         results.push({
    //           transactionId:funded.id,
    //           eventName: `Organization Funded ${formatEther(funded.amount)} ETH`,
    //           eventTime: funded.blockTimestamp,
    //           status:"Success",
    //           type: "order2",
    //         })
    //       }
    //     }
    //     if (employeesAdded) {
    //       for (const employee of employeesAdded.employeeAddeds) {
    //         results.push({
    //           transactionId:employee.id,
    //           eventName: 'Employee Added',
    //           eventTime: employee.blockTimestamp,
    //           status:"Success",
    //           type: "order3",
    //         })
    //       }
    //     }
    //     console.log(results)
    //     return results.sort((a, b) => b.eventTime - a.eventTime)
    //   }, [employeesAdded, orgAdded, orgFunded])
      
    return (
        <div>
            <div
                className="relative p-6 h-[298px] overflow-hidden border border-white/[0.6] bg-[#181522]/60 col-span-3"
            >
                <DataTableDemo data={data} columns={columns} />
            </div>
        </div>
    )
}

export default EmployerTimeline