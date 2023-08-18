import axios from "axios";

const baseUrl = "https://randomwalknft-api.com/";
export const cosmicGameBaseUrl = "http://170.187.142.12:9090/api/cosmicgame/";

class ApiService {
  public async create(token_id: number, seed: string) {
    const { data } = await axios.post(baseUrl + "cosmicgame_tokens", { token_id, seed });
    return data?.task_id || -1;
  }

  public async get_bid_list() {
    const { data } = await axios.get(cosmicGameBaseUrl + "bid/list/0/1000000");
    return data.Bids;
  }

  public async get_bid_list_by_round(round: number, sortDir: string) {
    const dir = sortDir === 'asc' ? 0 : 1;
    const { data } = await axios.get(cosmicGameBaseUrl + `bid/list_by_round/${round}/${dir}/0/1000000`);
    return data.BidsByRound;
  }

  public async get_bid_info(evtLogID: number) {
    const { data } = await axios.get(cosmicGameBaseUrl + `bid/info/${evtLogID}`);
    return data.BidInfo;
  }

  public async get_dashboard_info() {
    const { data } = await axios.get(cosmicGameBaseUrl + "statistics/dashboard");
    return data;
  }

  public async get_unique_bidders() {
    const { data } = await axios.get(cosmicGameBaseUrl + "user/unique_bidders");
    return data.UniqueBidders;
  }

  public async get_unique_winners() {
    const { data } = await axios.get(cosmicGameBaseUrl + "user/unique_winners");
    return data.UniqueWinners;
  }

  public async get_donations_nft_by_round(round: number) {
    const { data } = await axios.get(cosmicGameBaseUrl + `donations/nft/by_prize/${round}`);
    if (data.status === 0) return [];
    return data.NFTDonations;
  }

  public async get_donations_nft_list() {
    const { data } = await axios.get(cosmicGameBaseUrl + "donations/nft/list/0/1000000");
    return data.NFTDonations;
  }

  public async get_donation_nft_info(index: number) {
    const { data } = await axios.get(cosmicGameBaseUrl + "donations/nft/info/" + index);
    return data.NFTDonation;
  }

  public async get_prize_list() {
    const { data } = await axios.get(cosmicGameBaseUrl + "prize/list/0/1000000");
    return data.PrizeClaims;
  }

  public async get_prize_info(prizeNum: number) {
    const id = prizeNum < 0 ? 0 : prizeNum;
    try {
      const { data } = await axios.get(cosmicGameBaseUrl + `prize/info/${id}`);
      const prizeInfo = data.PrizeInfo;
      return prizeInfo;
    } catch(err) {
      return null;
    }
  }

  public async get_cst_list() {
    const { data } = await axios.get(cosmicGameBaseUrl + 'cst/list/0/1000000');
    const cstList = data.CosmicSignatureTokenList;
    return cstList;
  }

  public async get_cst_info(tokenId: number) {
    const { data } = await axios.get(cosmicGameBaseUrl + `cst/info/${tokenId}`);
    const cstList = data.TokenInfo;
    return cstList;
  }

  public async get_user_info(address: string) {
    const { data } = await axios.get(cosmicGameBaseUrl + `user/info/${address}`);
    return data;
  }

  public async get_raffle_deposits_by_round(round: number) {
    const { data } = await axios.get(cosmicGameBaseUrl + `raffle/deposits/by_round/${round}`);
    return data.RaffleDeposits;
  }

  public async get_raffle_deposits_by_user(address: string) {
    const { data } = await axios.get(cosmicGameBaseUrl + `user/raffle_deposits/${address}`);
    return data.UserRaffleDeposits;
  }

  public async get_raffle_nft_winners_by_round(round: number) {
    const { data } = await axios.get(cosmicGameBaseUrl + `raffle/nft_winners/by_round/${round}`);
    return data.RaffleNFTWinners;
  }

  public async get_raffle_nft_winners_by_user(address: string) {
    const { data } = await axios.get(cosmicGameBaseUrl + `user/raffle_nft_winnings/${address}`);
    return data.UserRaffleNFTWinnings;
  }

  public async get_unclaimed_donated_nft_by_user(address: string) {
    const { data } = await axios.get(cosmicGameBaseUrl + `user/nft/unclaimed_by_user/${address}`);
    return data.UnclaimedDonatedNFTs;
  }
  
  public async get_notif_red_box(address: string) {
    const { data } = await axios.get(cosmicGameBaseUrl + `user/notif_red_box/${address}`);
    return data.Winnings;
  }
  
  public async get_claim_history(address: string) {
    const { data } = await axios.get(cosmicGameBaseUrl + `user/claim_history/${address}/0/100000`);
    return data.ClaimHistory;
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
