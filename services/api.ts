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
}

export default new ApiService();
