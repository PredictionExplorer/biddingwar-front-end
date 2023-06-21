import axios from "axios";
const biddingwarBaseUrl = "http://170.187.142.12:9090/api/cosmicgame/";

export default async function handler(req, res) {
  const { data } = await axios.get(biddingwarBaseUrl + 'time/until_prize');
  res.status(200).json(data.TimeUntilPrize);
}
