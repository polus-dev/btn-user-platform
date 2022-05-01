import { Address, Cell, Coins } from 'ton3'

interface ITokenTransfer {
    queryId: bigint
    amount: Coins
    destination: Address
    responseDestination: Address
    customPayload?: Cell
    forwardTonAmount: Coins
    forwardPayload?: Cell
}

export type { ITokenTransfer }
