import axios from "axios";
import bids from "./mockData/bid.json"
import dashboard from "./mockData/dashboard.json"

const baseUrl = "https://randomwalknft-api.com/";

class ApiService {
  public async biddingHistory(page: number) {
    let perPage = 20;
    return {
      biddingHistory: bids.Bids,
      totalCount: bids.Bids.length
    };
  }

  public async dashboardInfo() {
    return dashboard;
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
