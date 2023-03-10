import { MARKET_ADDRESS } from '../config/app'
import MARKET_ABI from '../contracts/Market.json'

import useContract from './useContract'

export default function useMarketContract() {
  return useContract(MARKET_ADDRESS, MARKET_ABI)
}
