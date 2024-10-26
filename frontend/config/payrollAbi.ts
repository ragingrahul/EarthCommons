const abi = [
    {
        type: "receive",
        stateMutability: "payable",
    },
    {
        type: "function",
        name: "addCompany",
        inputs: [
            {
                name: "_companyName",
                type: "string",
                internalType: "string",
            },
        ],
        outputs: [],
        stateMutability: "nonpayable",
    },
    {
        type: "function",
        name: "addEmployee",
        inputs: [
            {
                name: "_employeeAddress",
                type: "address",
                internalType: "address",
            },
            {
                name: "_dailyWageWei",
                type: "uint256",
                internalType: "uint256",
            },
            {
                name: "_activity",
                type: "string",
                internalType: "string",
            },
        ],
        outputs: [],
        stateMutability: "nonpayable",
    },
    {
        type: "function",
        name: "companies",
        inputs: [
            {
                name: "",
                type: "address",
                internalType: "address",
            },
        ],
        outputs: [
            {
                name: "companyAddress",
                type: "address",
                internalType: "address",
            },
            {
                name: "companyName",
                type: "string",
                internalType: "string",
            },
            {
                name: "treasury",
                type: "uint256",
                internalType: "uint256",
            },
        ],
        stateMutability: "view",
    },
    {
        type: "function",
        name: "employees",
        inputs: [
            {
                name: "",
                type: "address",
                internalType: "address",
            },
        ],
        outputs: [
            {
                name: "employeeAddress",
                type: "address",
                internalType: "address",
            },
            {
                name: "companyAddress",
                type: "address",
                internalType: "address",
            },
            {
                name: "dailyWageWei",
                type: "uint256",
                internalType: "uint256",
            },
            {
                name: "lastPayed",
                type: "uint256",
                internalType: "uint256",
            },
            {
                name: "activity",
                type: "string",
                internalType: "string",
            },
        ],
        stateMutability: "view",
    },
    {
        type: "function",
        name: "fundCompany",
        inputs: [],
        outputs: [],
        stateMutability: "payable",
    },
    {
        type: "function",
        name: "getCompany",
        inputs: [
            {
                name: "_companyAddress",
                type: "address",
                internalType: "address",
            },
        ],
        outputs: [
            {
                name: "",
                type: "tuple",
                internalType: "struct Payright.Company",
                components: [
                    {
                        name: "companyAddress",
                        type: "address",
                        internalType: "address",
                    },
                    {
                        name: "companyName",
                        type: "string",
                        internalType: "string",
                    },
                    {
                        name: "treasury",
                        type: "uint256",
                        internalType: "uint256",
                    },
                ],
            },
        ],
        stateMutability: "view",
    },
    {
        type: "function",
        name: "getEmployee",
        inputs: [
            {
                name: "_employeeAddress",
                type: "address",
                internalType: "address",
            },
        ],
        outputs: [
            {
                name: "",
                type: "tuple",
                internalType: "struct Payright.Employee",
                components: [
                    {
                        name: "employeeAddress",
                        type: "address",
                        internalType: "address",
                    },
                    {
                        name: "companyAddress",
                        type: "address",
                        internalType: "address",
                    },
                    {
                        name: "dailyWageWei",
                        type: "uint256",
                        internalType: "uint256",
                    },
                    {
                        name: "lastPayed",
                        type: "uint256",
                        internalType: "uint256",
                    },
                    {
                        name: "activity",
                        type: "string",
                        internalType: "string",
                    },
                ],
            },
        ],
        stateMutability: "view",
    },
    {
        type: "function",
        name: "payout",
        inputs: [
            {
                name: "employeeAddress",
                type: "address",
                internalType: "address",
            },
            {
                name: "owner",
                type: "address",
                internalType: "address",
            },
        ],
        outputs: [],
        stateMutability: "nonpayable",
    },
    {
        type: "event",
        name: "CompanyAdded",
        inputs: [
            {
                name: "companyAddress",
                type: "address",
                indexed: true,
                internalType: "address",
            },
            {
                name: "companyName",
                type: "string",
                indexed: false,
                internalType: "string",
            },
        ],
        anonymous: false,
    },
    {
        type: "event",
        name: "CompanyFunded",
        inputs: [
            {
                name: "companyAddress",
                type: "address",
                indexed: true,
                internalType: "address",
            },
            {
                name: "amount",
                type: "uint256",
                indexed: false,
                internalType: "uint256",
            },
        ],
        anonymous: false,
    },
    {
        type: "event",
        name: "EmployeeAdded",
        inputs: [
            {
                name: "employeeAddress",
                type: "address",
                indexed: true,
                internalType: "address",
            },
            {
                name: "companyAddress",
                type: "address",
                indexed: true,
                internalType: "address",
            },
            {
                name: "dailyWageWei",
                type: "uint256",
                indexed: false,
                internalType: "uint256",
            },
            {
                name: "activity",
                type: "string",
                indexed: false,
                internalType: "string",
            },
        ],
        anonymous: false,
    },
    {
        type: "event",
        name: "EmployeeVerified",
        inputs: [
            {
                name: "employeeAddress",
                type: "address",
                indexed: true,
                internalType: "address",
            },
        ],
        anonymous: false,
    },
    {
        type: "event",
        name: "PayoutMade",
        inputs: [
            {
                name: "employeeAddress",
                type: "address",
                indexed: true,
                internalType: "address",
            },
            {
                name: "amount",
                type: "uint256",
                indexed: false,
                internalType: "uint256",
            },
        ],
        anonymous: false,
    },
] as const

export default abi;