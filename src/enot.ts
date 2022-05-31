import { Cell, Contracts, Builder, Coins, Address } from 'ton3-core'

interface GM {
    owner:Address,
    master: Address,
    jcode: Cell
}

class Enot extends Contracts.ContractBase {
    constructor (code:Cell, opt:GM) {
        const storage = new Builder()
            .storeCoins(new Coins(0))
            .storeAddress(opt.owner)
            .storeAddress(opt.master)
            .storeRef(opt.jcode)
        super(0, code, storage.cell())
    }
}

export { Enot }
