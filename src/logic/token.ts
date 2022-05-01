import { Builder, Cell, Slice } from 'ton3'
import { ITokenTransfer } from './types'

class TokenWallet {
    public static transferMsg (options: ITokenTransfer): Cell {
        const {
            queryId,
            amount,
            destination,
            responseDestination,
            customPayload,
            forwardTonAmount,
            forwardPayload = new Builder().cell()
        } = options

        const transferMsg = new Builder()
            .storeUint(0xf8a7ea5, 32)
            .storeUint(queryId, 64)
            .storeCoins(amount)
            .storeAddress(destination)
            .storeAddress(responseDestination)

        if (customPayload) {
            transferMsg.storeBit(1).storeRef(customPayload)
        } else {
            transferMsg.storeBit(0)
        }

        transferMsg.storeCoins(forwardTonAmount)

        if (forwardPayload.bits.length <= transferMsg.remainder) {
            const sfwdp = Slice.parse(forwardPayload)
            transferMsg.storeBit(0).storeSlice(sfwdp)
        } else {
            transferMsg.storeBit(1).storeRef(forwardPayload)
        }

        return transferMsg.cell()
    }
}

export { TokenWallet }
export type { ITokenTransfer }
