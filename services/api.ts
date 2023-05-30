import axios from "axios";

const baseUrl = "https://randomwalknft-api.com/";
const biddingwarBaseUrl = "http://170.187.142.12:9090/api/cosmicgame/";

class ApiService {
  public async create(token_id: number, seed: string) {
    const { data } = await axios.post(baseUrl + "cosmicgame_tokens", { token_id, seed });
    return data?.task_id || -1;
  }

  public async get_bid_list() {
    const { data } = await axios.get(biddingwarBaseUrl + "bid/list/0/1000000");
    return data.Bids;
  }

  public async get_bid_list_by_round(round: number) {
    const { data } = await axios.get(biddingwarBaseUrl + `bid/list_by_round/${round}/0/0/1000000`);
    return data.BidsByRound;
  }

  public async get_dashboard_info() {
    const { data } = await axios.get(biddingwarBaseUrl + "statistics/dashboard");
    return data;
  }

  public async get_donations_nft_list() {
    const { data } = await axios.get(biddingwarBaseUrl + "donations/nft/list/0/1000000");
    return data.NFTDonations;
  }

  public async get_donation_nft_info(index: number) {
    const { data } = await axios.get(biddingwarBaseUrl + "donations/nft/info/" + index);
    return data.NFTDonation;
  }

  public async get_prize_list() {
    const { data } = await axios.get(biddingwarBaseUrl + "prize/list/0/1000000");
    return data.PrizeClaims;
  }

  public async get_prize_info(prizeNum: number) {
    const id = prizeNum < 0 ? 0 : prizeNum;
    const { data } = await axios.get(biddingwarBaseUrl + `prize/info/${id}`);
    const prizeInfo = data.PrizeInfo;
    return prizeInfo;
  }

  public async get_cst_list() {
    const { data } = await axios.get(biddingwarBaseUrl + 'cst/list/0/1000000');
    const cstList = data.CosmicSignatureTokenList;
    return cstList;
  }

  public async get_cst_info(tokenId: number) {
    const { data } = await axios.get(biddingwarBaseUrl + `cst/info/${tokenId}`);
    const cstList = data.TokenInfo;
    return cstList;
  }



  public async get_info(token_id: number | string) {
    const { data } = await axios.get(baseUrl + "token_info/" + token_id);
    return data;
  }

  public async get(token_id: number | string) {
    const { data } = await axios.get(baseUrl + "tokens/" + token_id);
    const url = `http://198.58.105.159:9094/api/rwalk/tokens/history/${token_id}/0x895a6F444BE4ba9d124F61DF736605792B35D66b/0/1000`;
    const res = await axios.get(url);
    if (data) {
      data.tokenHistory = res?.data?.TokenHistory;
    }
    return data;
  }

  public async get_sell(id = -1) {
    let { data } = await axios.get(baseUrl + "sell_offer");
    data = data.sort((a: any, b: any) => a.Price - b.Price);
    if (id == -1) return data;
    const result = data.filter((x) => {
      return x.TokenId == id;
    });
    return result;
  }

  public async get_buy(id = -1) {
    let { data } = await axios.get(baseUrl + "buy_offer");
    data = data.sort((a: any, b: any) => a.Price - b.Price);
    if (id == -1) return data;
    const result = data.filter((x) => {
      return x.TokenId == id;
    });
    return result;
  }
}

export default new ApiService();
