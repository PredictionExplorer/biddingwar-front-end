import axios from "axios";
import { cosmicGameBaseUrl } from "../../services/api";

export default async function handler(req, res) {
  const { data } = await axios.get(cosmicGameBaseUrl + 'prize/cur_round/time');
  res.status(200).json(data.CurRoundPrizeTime);
}
