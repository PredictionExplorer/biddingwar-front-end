import axios from "axios";
import { cosmicGameBaseUrl } from "../../services/api";

export default async function handler(req, res) {
  const { tokenId } = req.query;
  const { data } = await axios.get(cosmicGameBaseUrl + `cst/names/${tokenId}`);
  res.status(200).json(data.TokenNameHistory);
}
