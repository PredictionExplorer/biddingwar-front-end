import axios from "axios";
import { cosmicGameBaseUrl } from "../../services/api";

export default async function handler(req, res) {
  const { data } = await axios.get(cosmicGameBaseUrl + 'time/until_prize');
  res.status(200).json(data.TimeUntilPrize);
}
