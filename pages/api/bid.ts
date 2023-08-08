import axios from "axios";
import { cosmicGameBaseUrl } from "../../services/api";

export default async function handler(req, res) {
  const { round, sortDir } = req.query;
  const dir = sortDir === 'asc' ? 0 : 1;
  const { data } = await axios.get(cosmicGameBaseUrl + `bid/list_by_round/${round}/${dir}/0/1000000`);
  res.status(200).json(data.BidsByRound);
}
