import React, { useContext, useEffect, useState } from 'react'
import Image from 'next/image'
// import { VerifyEmployee } from './ui/VerifyEmployee'
import { Employee } from '@/state/types'
import { formatAddress } from '@/utils/helper'
// import { Progress } from './ui/progress'
import { Roboto_Mono } from '@next/font/google'
import { MdPersonOutline } from "react-icons/md";
import { ShimmerButton } from './aceternityUi/ShimmerButton'
import { EASContext } from '@/app/provider'
import easConfig from "@/EAS.config"
import { SchemaEncoder } from '@ethereum-attestation-service/eas-sdk'
import { ethers } from "ethers";
import { useChainId } from 'wagmi'

const roboto = Roboto_Mono({
    subsets: ['latin'],
    weight: ['300', '400', '500', '700',]
})


type EmployeeProp = {
    employee: Employee
    totalPayment: number
}
const EmployeeCardDetails = ({ employee, totalPayment }: EmployeeProp) => {
    const [progress, setProgress] = React.useState(13)
    const { eas, isReady } = useContext(EASContext);
    //const chainId = useChainId(wagmiConfig as UseChainIdParameters<Config>);

    const handleSubmit = async () => {
        if (!isReady) {
            return;
        }

        try {
            const schemaEncoder = new SchemaEncoder(easConfig.schema.rawString);
            const schemaUID = easConfig.chains[String(11155111) as keyof typeof easConfig.chains]?.schemaUID ?? "defaultSchemaUID";
            const longitude = "-9.3539"; // decimal degrees, formatted as strings
            const latitude = "51.4747";
            const mediaLink = "<IPFS CID, or a URL>";
            const memo = "Your memo";

            // Define encodeData function to structure the data for attestation
            const encodedData = schemaEncoder.encodeData([
                { name: "eventTimestamp", value: Math.floor(Date.now() / 1000), type: "uint256" },
                { name: "srs", value: "EPSG:4326", type: "string" },
                { name: "locationType", value: "DecimalDegrees<string>", type: "string" },
                { name: "location", value: `${longitude}, ${latitude}`, type: "string" },
                { name: "recipeType", value: ["Type1", "Type2"], type: "string[]" },
                { name: "recipePayload", value: [ethers.toUtf8Bytes("Payload1")], type: "bytes[]" },
                { name: "mediaType", value: ["image/jpeg"], type: "string[]" },
                { name: "mediaData", value: ["CID1", "CID2"], type: "string[]" },
                { name: "memo", value: "Test memo", type: "string" },
            ]);

            const tx = await eas?.attest({
                schema: schemaUID,
                data: {
                  recipient: easConfig.chains[String(11155111) as keyof typeof easConfig.chains].easContractAddress, // To be read by chainId: easConfig.chains[chainId].EAScontract;
                  expirationTime: 0n,
                  revocable: true, // Be aware that if your schema is not revocable, this MUST be false
                  data: encodedData,
                },
              });
        
              const newAttestationUID = await tx?.wait();
              console.log("Attestation created successfully: ", newAttestationUID);
        } catch (error) {

        }
    }

    React.useEffect(() => {
        const timer = setTimeout(() => setProgress((totalPayment / ((employee?.salary / 10e8) * 30)) * 100), 700)
        return () => clearTimeout(timer)
    }, [])


    return (
        <div className='flex justify-center relative mt-20 mb-2 z-10'>
            <div className='w-full flex flex-col items-center justify-center  bg-[#181522]/60 backdrop-blur-sm border border-zinc-400 p-5'>
                <div className='w-full flex flex-row justify-between'>
                    <h1 className='text-xl font-bold text-purple-300'>
                        Employee Card
                    </h1>
                    {/* {employee.verified ? (
                        <div className= "text-green-500 font-bold text-center rounded">
                            ZK Verification Done
                        </div>
                    ) : (
                        <VerifyEmployee />
                    )} */}
                    <button className={`w-fit bg-[#7a51bc] p-2 rounded-3xl font-light text-lg hover:bg-[#5c4187] ${roboto.className}`}
                        onClick={()=>{
                            handleSubmit()
                        }}
                    >
                        Verify Employee
                    </button>
                </div>
                <div className='w-full flex flex-col md:flex-row justify-between items-center my-6 p-4 rounded-3xl bg-[#36324c9b]'>
                    <div className='flex flex-col'>
                        <div className="w-[440px] h-[280px] rounded-3xl  bg-purple-300 my-2 relative" >
                            {/* <div className="h-28 w-44 relative flex justify-end items-end"> */}
                            <Image src="/aptos-white.png" alt='card chip' width={50} height={100} className='absolute top-4 left-4' />
                            {/* </div> */}
                            <h1 className={`text-black absolute bottom-24 z-10 left-4 font-light text-2xl ${roboto.className}`}>{formatAddress("0x2160D41c9D711Ca3fA7777211148538eeb431970", 5, 6)}</h1>
                            <div className={`w-full h-[80px] text-white absolute flex justify-between items-center p-4 bottom-0 bg-purple-100 rounded-b-3xl ${roboto.className}`}>
                                <div className='text-xl'>
                                    Ramson Jason
                                </div>
                                <div>
                                    21/24
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col h-[280px] my-2 rounded-3xl justify-between w-[300px] p-4  bg-purple-300'>
                        <div className="flex gap-3 items-center">
                            <div className='bg-purple-100 rounded-full p-1'>
                                <MdPersonOutline size={32} fill='#FFFFFF'/>
                            </div>
                            <span className="font-normal text-3xl text-black ">Card Details</span>
                        </div>
                        <div className='flex flex-col gap-2 bg-[#9768e3] p-4 rounded-3xl'>
                            <div className="flex justify-between">
                                <span className="font-light text-black ">Name</span>
                                {employee && <span className="font-light">{employee?.employeeName}</span>}
                            </div>

                            <div className="flex justify-between">
                                <span className="font-light text-black ">Address</span>
                                {employee && <span className="font-light">{formatAddress(employee?.address)}</span>}
                            </div>

                            <div className="flex justify-between">
                                <span className="font-light text-black ">Role</span>
                                {employee && <span className="font-light">{employee?.activity}</span>}
                            </div>

                            <div className="flex justify-between">
                                <span className="font-light text-black ">Salary</span>
                                <span className="font-light">{employee?.salary / 10e8} APT</span>
                            </div>
                        </div>
                        <button className={`w-full text-white bg-[#7a51bc] p-2 rounded-3xl font-light text-lg hover:bg-[#5c4187] ${roboto.className}`}>
                            Verify Employee
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EmployeeCardDetails