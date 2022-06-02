import { Coins } from 'ton3-core'

function calculateToleranceValue (
    price: Coins,
    percent: Number
): Coins {
    const slippageToleranceValue = price.mul(1 + Number(percent) / 100)
    return slippageToleranceValue
}

export { calculateToleranceValue }
