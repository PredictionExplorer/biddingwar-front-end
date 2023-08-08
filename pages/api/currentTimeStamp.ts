import axios from "axios";
import { cosmicGameBaseUrl } from "../../services/api";

export default async function handler(req, res) {
  const { data } = await axios.get(cosmicGameBaseUrl + 'time/current');
  res.status(200).json(data.CurrentTimeStamp);
}
