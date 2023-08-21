import axios from "axios";
import { cosmicGameBaseUrl } from "../../services/api";

export default async function handler(req, res) {
  const { address } = req.query;
  const { data } = await axios.get(cosmicGameBaseUrl + `user/notif_red_box/${address}`);
  res.status(200).json(data.Winnings);
}
