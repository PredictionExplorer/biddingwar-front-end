import axios from "axios";
import { cosmicGameBaseUrl } from "../../services/api";

export default async function handler(req, res) {
  const { data } = await axios.get(cosmicGameBaseUrl + "prize/claim_history/0/100000");
  res.status(200).json(data.GlobalClaimHistory);
}
