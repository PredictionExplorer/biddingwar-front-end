import axios from "axios";
const biddingwarBaseUrl = "http://170.187.142.12:9090/api/cosmicgame/";

export default async function handler(req, res) {
  const { round, sortDir } = req.query;
  const dir = sortDir === 'asc' ? 0 : 1;
  const { data } = await axios.get(biddingwarBaseUrl + `bid/list_by_round/${round}/${dir}/0/1000000`);
  res.status(200).json(data.BidsByRound);
}
