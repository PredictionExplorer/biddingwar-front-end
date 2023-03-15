import { BIDDINGWAR_ADDRESS } from "../config/app";
import BIDDINGWAR_ABI from "../contracts/BiddingWar.json";
import useContract from "./useContract";

export default function useBiddingWarContract() {
  return useContract(BIDDINGWAR_ADDRESS, BIDDINGWAR_ABI);
}
