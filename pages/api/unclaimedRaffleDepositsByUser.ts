import axios from "axios";
import { cosmicGameBaseUrl } from "../../services/api";

export default async function handler(req, res) {
  const { address } = req.query;
  const { data } = await axios.get(cosmicGameBaseUrl + `user/unclaimed_raffle_deposits/${address}/0/1000000`);
  res.status(200).json(data.UnclaimedDeposits);
}
