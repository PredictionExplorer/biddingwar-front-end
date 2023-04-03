import NFT_ABI from '../contracts/NFT.json'

import useContract from './useContract'

export default function useNFTContract(address) {
  return useContract(address, NFT_ABI)
}
