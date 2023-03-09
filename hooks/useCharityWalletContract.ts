import { CHARITY_WALLET_ADDRESS } from "../config/app";
import CHARITYWALLET_ABI from "../contracts/CharityWallet.json";
import useContract from "./useContract";

export default function useNFTContract() {
  return useContract(CHARITY_WALLET_ADDRESS, CHARITYWALLET_ABI);
}
