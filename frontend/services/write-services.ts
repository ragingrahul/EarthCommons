import { Address } from '@/state/types'
import { PAYROLL_CONTRACT_ADDRESS } from '@/config/constants'
// import { publicClient } from '@/config/client'
import { useWallet } from '@/hooks/WalletContext'
import { PublicClient, WalletClient } from 'viem'
import abi from '@/config/payrollAbi'
import { sepolia } from 'viem/chains'

export async function createOrg(name: string, walletClient:WalletClient, publicClient: PublicClient) {
    const [address] = await walletClient.requestAddresses();
    const { request } = await publicClient.simulateContract({
        account: address,
        address: PAYROLL_CONTRACT_ADDRESS,
        abi: abi,
        functionName: 'addCompany',
        args:[name],
    })
    const result = await walletClient!.writeContract(request)
    console.log('add new org', result)
    return result
}

export async function fundCompany(amountInEth: number,walletClient: WalletClient, publicClient: PublicClient) {
    try {
      const amountInWei = BigInt(Number(amountInEth) * 10 ** 18); 
  
      const [address] = await walletClient.requestAddresses();
      const { request } = await publicClient.simulateContract({
        account:address,
        address: PAYROLL_CONTRACT_ADDRESS,
        abi: abi,
        functionName: 'fundCompany',
        args: [],
        value: amountInWei,
      });
  
      // Execute the transaction
      const txHash = await walletClient.writeContract(request);
      console.log('Transaction sent:', txHash);
    } catch (error) {
      console.error("Error funding company:", error);
    }
  }

// export async function addNewEmployee(address: Address, salary: number, activity: string) {
//     const {walletClient} = useWallet()
//     const [signerAddress] = await walletClient!.requestAddresses();
//     const { request } = await publicClient.simulateContract({
//         account: signerAddress,
//         address: PAYROLL_CONTRACT_ADDRESS,
//         abi: abi,
//         functionName: 'addEmployee',
//         args: [`0x${address}`, BigInt(salary), activity],

//     })
//     const result = await walletClient!.writeContract(request)
//     console.log('add new Employee transaction', result)
//     return result
// }

// export async function verifyEmployee(address: Address) {
//     const result = await writeContract(config, {
//         chainId: baseSepolia.id,
//         abi: payrollAbi,
//         functionName: 'verifyEmployee',
//         args: [address],
//         address: PAYROLL_CONTRACT_ADDRESS,
//     })
//     console.log('verifying employee', result)
//     return result
// }

// export async function paySalary(address: Address, orgAddress: Address) {
//     const {walletClient} = useWallet()
//     const [signerAddress] = await walletClient!.requestAddresses();
//     const { request } = await publicClient.simulateContract({
//         account: signerAddress,
//         address: PAYROLL_CONTRACT_ADDRESS,
//         abi: abi,
//         functionName: 'payout',
//         args: [`0x${address}`,`0x${orgAddress}`],

//     })
//     const result = await walletClient!.writeContract(request)
//     console.log('payout to employee', result)
//     return result
// }