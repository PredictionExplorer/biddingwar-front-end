import axios from "axios";
import { cosmicGameBaseUrl } from "../../services/api";

export default async function handler(req, res) {
  const { round } = req.query;
  const { data } = await axios.get(cosmicGameBaseUrl + `donations/nft/by_prize/${round}`);
  res.status(200).json(data.status === 0 ? [] : data.NFTDonations);
}
