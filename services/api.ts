import axios from "axios";

const baseUrl = "https://randomwalknft-api.com/";
const biddingwarBaseUrl = "http://170.187.142.12:9090/api/biddingwar/";

class ApiService {
  public async create(token_id: number, seed: string) {
    const { data } = await axios.post(baseUrl + "cosmicgame_tokens", { token_id, seed });
    return data?.task_id || -1;
  }

  public async biddingHistory(page: number) {
    let perPage = 20;
    const { data } = await axios.get(biddingwarBaseUrl + "bids/0/1000000");
    const biddingHistory = data?.Bids.slice(perPage * (page - 1), perPage * page)
    return {
      biddingHistory,
      totalCount: data?.Bids.length
    };
  }

  public async dashboardInfo() {
    const { data } = await axios.get(biddingwarBaseUrl + "dashboard");
    return data;
  }

  public async donatedNFTs() {
    const { data } = await axios.get(biddingwarBaseUrl + "nftdonations/0/1000000");
    return data;
  }

  public async getDonatedNFTbyIndex(index: number) {
    const { data } = await axios.get(biddingwarBaseUrl + "donatednft_info/" + index);
    return data;
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
