import { NFT_ADDRESS } from "../config/app";
import NFT_ABI from "../contracts/NFT.json";
import useContract from "./useContract";

export default function useNFTContract() {
  return useContract(NFT_ADDRESS, NFT_ABI);
}
