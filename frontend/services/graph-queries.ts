import { gql } from '@apollo/client'

export const EMPLOYEE_ADDS = gql`
  query EmployeeAdds($companyAddress: String!) {
    employeeAddeds(where: { companyAddress: $companyAddress }) {
      id
      activity
      employeeAddress
      companyAddress
      dailyWageWei
      blockTimestamp
    }
  }
`

export const GET_EMPLOYEES = gql`
  query Employees($companyAddress: String!) {
    employeeAddeds(where: { companyAddress: $companyAddress }) {
      id
      activity
      employeeAddress
      companyAddress
      dailyWageWei
      blockTimestamp
    }
  }
`

export const ORG_ADDED = gql`
  query OrgAdded($address: Bytes!) {
    companyAddeds(where: { companyAddress: $address }) {
      id
      companyName
      companyAddress
      blockTimestamp
    }
  }
`

export const ORG_FUNDED = gql`
  query OrgFunded($address: Bytes!) {
    companyFundeds(where: { companyAddress: $address }) {
      id
      companyAddress
      amount
      blockTimestamp
    }
  }
`

export const PAYOUT_MADE = gql`
  query PayoutMade($address: Bytes!, $limit: Int) {
    payoutMades(where: {employeeAddress: $address}, first: $limit){
      id
      employeeAddress
      amount
      blockTimestamp
    }
  }
` 