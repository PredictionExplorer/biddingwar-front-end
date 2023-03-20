import axios from "axios";
import bids from "./mockData/bid.json"
import dashboard from "./mockData/dashboard.json"

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
  
}

export default new ApiService();
