import React, { useContext, useEffect, useState } from 'react'
import Image from 'next/image'
import lighthouse from '@lighthouse-web3/sdk'
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
import { ethers, formatEther } from "ethers";

import { useAppSelector } from '@/state/hooks'
import { selectConnection } from '@/state/selectors'
import { PAYOUT_MADE } from '@/services/graph-queries'
import { useQuery } from '@apollo/client'

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
    const connection = useAppSelector(selectConnection)
    const [location, setLocation] = useState({ longitude: '', latitude: '' });
    const { eas, isReady } = useContext(EASContext);

    const { data: paymentMade } = useQuery(PAYOUT_MADE, {
        variables: {
            address: connection?.userAddress,
            limit: 1,
        }
    })

    const makeAttestation = async () => {
        console.log("Attestation ", isReady)
        if (!isReady) {
            return;
        }

        try {
            const schemaEncoder = new SchemaEncoder(easConfig.schema.rawString);
            const schemaUID = easConfig.chains[String(11155111) as keyof typeof easConfig.chains]?.schemaUID ?? "defaultSchemaUID";
            const longitude = "-19.3539"; // decimal degrees, formatted as strings
            const latitude = "54.4747";
            const mediaLink = "<IPFS CID, or a URL>";
            const memo = "Your memo";

            // Define encodeData function to structure the data for attestation
            const encodedData = schemaEncoder.encodeData([
                { name: "eventTimestamp", value: Math.floor(Date.now() / 1000), type: "uint256" },
                { name: "srs", value: "EPSG:4326", type: "string" },
                { name: "locationType", value: "DecimalDegrees<string>", type: "string" },
                { name: "location", value: `${location.longitude}, ${location.longitude}`.toString(), type: "string" },
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

            console.log(tx);
            const newAttestationUID = (await tx?.wait()).toString;
            console.log("Attestation created successfully: ", newAttestationUID);
            return newAttestationUID;
        } catch (error) {
            console.error("Error during attestation:", error);

        }
    }

    async function uploadToLighthouse(text: string) {
        try {
            const response = await lighthouse.uploadText(text, process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY!)
            console.log("Upload response:", response)
            return response
        } catch (err) {
            console.error("Error uploading to Lighthouse:", err)
        }
    }

    const EmployeeDataUpload = async () => {
        // Fetch last payment

        if (paymentMade?.payoutMades?.length) {
            const lastPayment = paymentMade.payoutMades[0]
            const formattedPayment = `Payment ID: ${lastPayment.id}, Amount: ${formatEther(lastPayment.amount)} ETH, Timestamp: ${lastPayment.blockTimestamp}`

            // Placeholder for attestation UID
            const attestationUid = "0xAttestationUid"


            // Fetch location attestation data
            const attestationData = await makeAttestation()

            // if (attestationData) {
            const attestationInfo = `
                    Attestation ID: ${attestationData},
                `
            const combinedText = `${formattedPayment}\n${attestationInfo}\n${Date.now()}`

            // Upload combined data to Lighthouse
            const uploadResponse = await uploadToLighthouse(combinedText)
            return uploadResponse
            // }
        } else {
            console.log("No payment data available.")
        }
    }


    const handleSubmit = async () => {
        console.log(paymentMade)
        await EmployeeDataUpload()
    }

    useEffect(() => {
        const timer = setTimeout(() => setProgress((totalPayment / ((employee?.salary / 10e8) * 30)) * 100), 700)
        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        latitude: position.coords.latitude.toString(),
                        longitude: position.coords.longitude.toString()
                    });
                },
                (error) => console.error("Error fetching location:", error)
            );
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    }, []);


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
                    <button className={`w-fit bg-[#7a51bc] text-white px-5 p-2 rounded-3xl font-light text-lg hover:bg-[#5c4187] ${roboto.className}`}
                        onClick={() => {
                            handleSubmit()
                        }}
                    >
                        Payroll Attestation
                    </button>
                </div>
                <div className='w-full flex flex-col md:flex-row justify-between items-center my-6 p-4 rounded-3xl bg-[#36324c9b]'>
                    <div className='flex flex-col'>
                        <div className="w-[440px] h-[280px] rounded-3xl  bg-purple-300 my-2 relative" >
                            {/* <div className="h-28 w-44 relative flex justify-end items-end"> */}
                            <Image src="/c-logo-1.png" alt='card chip' width={70} height={150} className='absolute top-4 left-4' />
                            {/* </div> */}
                            <h1 className={`text-black absolute bottom-24 z-10 left-4 font-light text-2xl ${roboto.className}`}>{formatAddress(employee?.address)}</h1>
                            <div className={`w-full h-[80px] text-white absolute flex justify-between items-center p-4 bottom-0 bg-purple-100 rounded-b-3xl ${roboto.className}`}>
                                <div className='text-xl'>
                                    {employee?.employeeName || "Justin"}
                                </div>
                                <div>
                                    06/24
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col h-[280px] my-2 rounded-3xl justify-between w-[300px] p-4  bg-purple-300'>
                        <div className="flex gap-3 items-center">
                            <div className='bg-purple-100 rounded-full p-1'>
                                <MdPersonOutline size={32} fill='#FFFFFF' />
                            </div>
                            <span className="font-normal text-3xl text-black ">Card Details</span>
                        </div>
                        <div className='flex flex-col gap-2 bg-[#9768e3] p-4 rounded-3xl'>
                            <div className="flex justify-between">
                                <span className="font-light text-black ">Name</span>
                                <span className="font-light">{employee?.employeeName || "Justin"}</span>
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
                                <span className="font-light">{formatEther(employee?.salary)} ETH</span>
                            </div>
                        </div>
                        <button className={`w-full text-white bg-[#7a51bc] p-2 rounded-3xl font-light text-lg hover:bg-[#5c4187] ${roboto.className}`}
                           onClick={() => {
                            window.open(`https://silksecure.net/holonym/silk/phone/issuance/prereqs`, "_blank");
                          }}
                        >
                            Verify Employee
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EmployeeCardDetails