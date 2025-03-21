import axios from "axios";

// const baseUrl = "https://randomwalknft-api.com/";
const baseUrl = "http://69.10.55.2/";
const proxyUrl = "/api/proxy?url=";
export const cosmicGameBaseUrl = "http://161.129.67.42:9191/api/cosmicgame/";

const getAPIUrl = (url: string) => {
  return `${proxyUrl}${encodeURIComponent(cosmicGameBaseUrl + url)}`;
};

const getCosmicSignatureAPIUrl = (url: string) => {
  return `${proxyUrl}${encodeURIComponent(baseUrl + url)}`;
};

class ApiService {
  public async create(token_id: number, seed: string, special: boolean) {
    try {
      const { data } = await axios.post(
        getCosmicSignatureAPIUrl("cosmicgame_tokens"),
        { token_id, seed, special }
      );
      return data?.task_id || -1;
    } catch (err) {
      console.log(err);
      throw new Error("Network response was not OK");
    }
  }

  public async get_banned_bids() {
    try {
      const { data } = await axios.get(
        getCosmicSignatureAPIUrl("get_banned_bids")
      );
      return data;
    } catch (err) {
      console.log(err);
      throw new Error("Network response was not OK");
    }
  }

  public async ban_bid(bid_id: number, user_addr: string) {
    try {
      const { data } = await axios.post(
        getCosmicSignatureAPIUrl("ban_bid"),
        { bid_id, user_addr }
      );
      return data;
    } catch (err) {
      console.log(err);
      throw new Error("Network response was not OK");
    }
  }

  public async unban_bid(bid_id: number) {
    try {
      const { data } = await axios.post(
        getCosmicSignatureAPIUrl("unban_bid"),
        { bid_id }
      );
      return data;
    } catch (err) {
      console.log(err);
      throw new Error("Network response was not OK");
    }
  }

  public async get_info(token_id: number | string) {
    try {
      const { data } = await axios.get(
        getCosmicSignatureAPIUrl(`token_info/${token_id}`)
      );
      return data.TokenInfo;
    } catch (err) {
      console.log(err);
      throw new Error("Network response was not OK");
    }
  }

  public async get_bid_list() {
    try {
      const { data } = await axios.get(getAPIUrl("bid/list/0/1000000"));
      return data.Bids;
    } catch (err) {
      console.log(err);
      throw new Error("Network response was not OK");
    }
  }

  public async get_bid_list_by_round(round: number, sortDir: string) {
    try {
      const dir = sortDir === "asc" ? 0 : 1;
      const { data } = await axios.get(
        getAPIUrl(`bid/list_by_round/${round}/${dir}/0/1000000`)
      );
      return data.BidsByRound;
    } catch (err) {
      console.log(err);
      throw new Error("Network response was not OK");
    }
  }

  public async get_bid_info(evtLogID: number) {
    try {
      const { data } = await axios.get(getAPIUrl(`bid/info/${evtLogID}`));
      return data.BidInfo;
    } catch (err) {
      console.log(err);
      throw new Error("Network response was not OK");
    }
  }

  public async get_dashboard_info() {
    try {
      const { data } = await axios.get(getAPIUrl("statistics/dashboard"));
      return data;
    } catch (err) {
      // If you do want to log the error, keep console.log(err)
      console.log(err);
      throw new Error("Network response was not OK");
    }
  }

  public async get_unique_bidders() {
    try {
      const { data } = await axios.get(getAPIUrl("user/unique_bidders"));
      return data.UniqueBidders;
    } catch (err) {
      console.log(err);
      throw new Error("Network response was not OK");
    }
  }

  public async get_unique_winners() {
    try {
      const { data } = await axios.get(getAPIUrl("user/unique_winners"));
      return data.UniqueWinners;
    } catch (err) {
      console.log(err);
      throw new Error("Network response was not OK");
    }
  }

  public async get_donations_nft_by_round(round: number) {
    try {
      const { data } = await axios.get(getAPIUrl(`donations/nft/by_prize/${round}`));
      // If the server returns { status: 0 }, that isn't necessarily a network error;
      // decide whether to throw or just return an empty array in that scenario.
      if (data.status === 0) return [];
      return data.NFTDonations;
    } catch (err) {
      console.log(err);
      throw new Error("Network response was not OK");
    }
  }

  public async get_donations_nft_unclaimed_by_round(round: number) {
    try {
      const { data } = await axios.get(
        getAPIUrl(`donations/nft/unclaimed_by_prize/${round}`)
      );
      if (data.status === 0) return [];
      return data.NFTDonations;
    } catch (err) {
      console.log(err);
      throw new Error("Network response was not OK");
    }
  }

  public async get_donations_nft_list() {
    try {
      const { data } = await axios.get(
        getAPIUrl("donations/nft/list/0/1000000")
      );
      return data.NFTDonations;
    } catch (err) {
      console.log(err);
      throw new Error("Network response was not OK");
    }
  }

  public async get_claimed_donated_nft_by_user(address: string) {
    try {
      const { data } = await axios.get(getAPIUrl(`user/nft/claims/${address}`));
      return data.DonatedNFTClaims;
    } catch (err) {
      console.log(err);
      throw new Error("Network response was not OK");
    }
  }

  public async get_unclaimed_donated_nft_by_user(address: string) {
    try {
      const { data } = await axios.get(
        getAPIUrl(`user/nft/unclaimed_by_user/${address}`)
      );
      return data.UnclaimedDonatedNFTs;
    } catch (err) {
      console.log(err);
      throw new Error("Network response was not OK");
    }
  }

  public async get_unclaimed_raffle_deposits_by_user(address: string) {
    try {
      const { data } = await axios.get(
        getAPIUrl(`user/unclaimed_raffle_deposits/${address}/0/1000000`)
      );
      return data.UnclaimedDeposits;
    } catch (err) {
      console.log(err);
      throw new Error("Network response was not OK");
    }
  }

  public async get_prize_list() {
    try {
      const { data } = await axios.get(getAPIUrl("prize/list/0/1000000"));
      return data.PrizeClaims;
    } catch (err) {
      console.log(err);
      throw new Error("Network response was not OK");
    }
  }

  public async get_prize_info(roundNum: number) {
    const id = roundNum < 0 ? 0 : roundNum;
    try {
      const { data } = await axios.get(getAPIUrl(`prize/info/${id}`));
      const prizeInfo = data.PrizeInfo;
      return prizeInfo;
    } catch (err) {
      console.log(err);
      throw new Error("Network response was not OK");
    }
  }

  public async get_cst_list() {
    try {
      const { data } = await axios.get(getAPIUrl("cst/list/0/1000000"));
      return data.CosmicSignatureTokenList;
    } catch (err) {
      console.log(err);
      throw new Error("Network response was not OK");
    }
  }

  public async get_cst_info(tokenId: number) {
    try {
      const { data } = await axios.get(getAPIUrl(`cst/info/${tokenId}`));
      return data;
    } catch (err) {
      console.log(err);
      throw new Error("Network response was not OK");
    }
  }

  public async get_user_info(address: string) {
    try {
      const { data } = await axios.get(getAPIUrl(`user/info/${address}`));
      return data;
    } catch (err) {
      console.log(err);
      throw new Error("Network response was not OK");
    }
  }

  public async get_raffle_deposits_by_user(address: string) {
    try {
      const { data } = await axios.get(
        getAPIUrl(`user/raffle_deposits/${address}`)
      );
      return data.UserRaffleDeposits;
    } catch (err) {
      console.log(err);
      throw new Error("Network response was not OK");
    }
  }

  public async get_raffle_nft_winnings_by_user(address: string) {
    try {
      const { data } = await axios.get(
        getAPIUrl(`user/raffle_nft_winnings/${address}`)
      );
      return data.UserRaffleNFTWinnings;
    } catch (err) {
      console.log(err);
      throw new Error("Network response was not OK");
    }
  }

  public async notify_red_box(address: string) {
    try {
      const { data } = await axios.get(
        getAPIUrl(`user/notif_red_box/${address}`)
      );
      return data.Winnings;
    } catch (err) {
      console.log(err);
      throw new Error("Network response was not OK");
    }
  }

  public async get_name_history(token_id: number) {
    try {
      const { data } = await axios.get(
        getAPIUrl(`cst/names/history/${token_id}`)
      );
      return data.TokenNameHistory;
    } catch (err) {
      console.log(err);
      throw new Error("Network response was not OK");
    }
  }

  public async get_token_by_name(token_name: string) {
    try {
      const { data } = await axios.get(
        getAPIUrl(`cst/names/search/${token_name}`)
      );
      return data.TokenNameSearchResults;
    } catch (err) {
      console.log(err);
      throw new Error("Network response was not OK");
    }
  }

  public async get_transfer_history(token_id: number) {
    try {
      const { data } = await axios.get(
        getAPIUrl(`cst/transfers/${token_id}/0/1000000`)
      );
      return data.TokenTransfers;
    } catch (err) {
      console.log(err);
      throw new Error("Network response was not OK");
    }
  }

  public async get_claim_history() {
    try {
      const { data } = await axios.get(
        getAPIUrl("prize/claim_history/0/1000000")
      );
      return data.GlobalClaimHistory;
    } catch (err) {
      console.log(err);
      throw new Error("Network response was not OK");
    }
  }

  public async get_claim_history_by_user(address: string) {
    try {
      const { data } = await axios.get(
        getAPIUrl(`user/claim_history/${address}/0/1000000`)
      );
      return data.ClaimHistory;
    } catch (err) {
      console.log(err);
      throw new Error("Network response was not OK");
    }
  }

  public async get_prize_time() {
    try {
      const { data } = await axios.get(getAPIUrl("prize/cur_round/time"));
      return data.CurRoundPrizeTime;
    } catch (err) {
      console.log(err);
      throw new Error("Network response was not OK");
    }
  }

  public async get_current_time() {
    try {
      const { data } = await axios.get(getAPIUrl("time/current"));
      return data.CurrentTimeStamp;
    } catch (err) {
      console.log(err);
      throw new Error("Network response was not OK");
    }
  }

  public async get_charity_cg_deposits() {
    try {
      const { data } = await axios.get(getAPIUrl("donations/charity/cg_deposits"));
      return data.CharityDonations;
    } catch (err) {
      console.log(err);
      throw new Error("Network response was not OK");
    }
  }

  public async get_charity_voluntary() {
    try {
      const { data } = await axios.get(
        getAPIUrl("donations/charity/voluntary")
      );
      return data.CharityDonations;
    } catch (err) {
      console.log(err);
      throw new Error("Network response was not OK");
    }
  }

  public async get_charity_withdrawals() {
    try {
      const { data } = await axios.get(
        getAPIUrl("donations/charity/withdrawals")
      );
      return data.CharityWithdrawals;
    } catch (err) {
      console.log(err);
      throw new Error("Network response was not OK");
    }
  }

  public async get_named_nfts() {
    try {
      const { data } = await axios.get(getAPIUrl("cst/names/named_only"));
      return data.NamedTokens;
    } catch (err) {
      console.log(err);
      throw new Error("Network response was not OK");
    }
  }

  public async get_cst_distribution() {
    try {
      const { data } = await axios.get(getAPIUrl("cst/distribution"));
      return data.CosmicSignatureTokenDistribution;
    } catch (err) {
      console.log(err);
      throw new Error("Network response was not OK");
    }
  }

  public async get_ct_balances_distribution() {
    try {
      const { data } = await axios.get(getAPIUrl("ct/balances"));
      return data.CosmicTokenBalances;
    } catch (err) {
      console.log(err);
      throw new Error("Network response was not OK");
    }
  }

  public async get_user_balance(address: string) {
    try {
      const { data } = await axios.get(getAPIUrl(`user/balances/${address}`));
      return data;
    } catch (err) {
      console.log(err);
      throw new Error("Network response was not OK");
    }
  }

  public async get_ct_transfers(address: string) {
    try {
      const { data } = await axios.get(
        getAPIUrl(`user/cosmictoken/transfers/${address}/0/1000000`)
      );
      return data.CosmicTokenTransfers;
    } catch (err) {
      console.log(err);
      throw new Error("Network response was not OK");
    }
  }

  public async get_cst_transfers(address: string) {
    try {
      const { data } = await axios.get(
        getAPIUrl(`user/cosmicsignature/transfers/${address}/0/1000000`)
      );
      return data.CosmicSignatureTransfers;
    } catch (err) {
      console.log(err);
      throw new Error("Network response was not OK");
    }
  }

  public async get_used_rwlk_nfts() {
    try {
      const { data } = await axios.get(getAPIUrl("bid/used_rwalk_nfts"));
      return data.UsedRwalkNFTs;
    } catch (err) {
      console.log(err);
      throw new Error("Network response was not OK");
    }
  }

  public async get_unclaimed_staking_rewards_by_user(address: string) {
    try {
      const { data } = await axios.get(
        getAPIUrl(`staking/cst/rewards/to_claim/by_user/${address}`)
      );
      return data.UnclaimedEthDeposits;
    } catch (err) {
      console.log(err);
      throw new Error("Network response was not OK");
    }
  }

  public async get_staking_cst_actions_info(actionId: number) {
    try {
      const { data } = await axios.get(
        getAPIUrl(`staking/cst/actions/info/${actionId}`)
      );
      return data.CombinedStakingRecordInfo;
    } catch (err) {
      console.log(err);
      throw new Error("Network response was not OK");
    }
  }

  public async get_staking_rwalk_actions_info(actionId: number) {
    try {
      const { data } = await axios.get(
        getAPIUrl(`staking/rwalk/actions/info/${actionId}`)
      );
      return data.CombinedStakingRecordInfo;
    } catch (err) {
      console.log(err);
      throw new Error("Network response was not OK");
    }
  }

  public async get_collected_staking_rewards_by_user(address: string) {
    try {
      const { data } = await axios.get(
        getAPIUrl(`staking/cst/rewards/collected/by_user/${address}/0/1000000`)
      );
      return data.CollectedStakingCSTRewards;
    } catch (err) {
      console.log(err);
      throw new Error("Network response was not OK");
    }
  }

  public async get_cst_action_ids_by_deposit_with_claim_info(address: string, depositId: number) {
    try {
      const { data } = await axios.get(
        getAPIUrl(
          `staking/cst/rewards/action_ids_by_deposit_with_claim_info/${address}/${depositId}`
        )
      );
      return data.ActionIdsWithClaimInfo;
    } catch (err) {
      console.log(err);
      throw new Error("Network response was not OK");
    }
  }

  public async get_staking_cst_actions_by_user(address: string) {
    try {
      const { data } = await axios.get(
        getAPIUrl(`staking/cst/actions/by_user/${address}/0/1000000`)
      );
      return data.StakingCSTActions;
    } catch (err) {
      console.log(err);
      throw new Error("Network response was not OK");
    }
  }

  public async get_staking_rwalk_actions_by_user(address: string) {
    try {
      const { data } = await axios.get(
        getAPIUrl(`staking/rwalk/actions/by_user/${address}/0/1000000`)
      );
      return data.UserStakingActionsRWalk;
    } catch (err) {
      console.log(err);
      throw new Error("Network response was not OK");
    }
  }

  public async get_staking_cst_actions() {
    try {
      const { data } = await axios.get(
        getAPIUrl("staking/cst/actions/global/0/1000000")
      );
      return data.StakingCSTActions;
    } catch (err) {
      console.log(err);
      throw new Error("Network response was not OK");
    }
  }

  public async get_staking_rwalk_actions() {
    try {
      const { data } = await axios.get(
        getAPIUrl("staking/rwalk/actions/global/0/1000000")
      );
      return data.GlobalStakingActionsRWalk;
    } catch (err) {
      console.log(err);
      throw new Error("Network response was not OK");
    }
  }

  public async get_marketing_rewards() {
    try {
      const { data } = await axios.get(
        getAPIUrl("marketing/rewards/global/0/1000000")
      );
      return data.MarketingRewards;
    } catch (err) {
      console.log(err);
      throw new Error("Network response was not OK");
    }
  }

  public async get_marketing_rewards_by_user(address: string) {
    try {
      const { data } = await axios.get(
        getAPIUrl(`marketing/rewards/by_user/${address}/0/1000000`)
      );
      return data.UserMarketingRewards;
    } catch (err) {
      console.log(err);
      throw new Error("Network response was not OK");
    }
  }

  public async get_staked_cst_tokens() {
    try {
      const { data } = await axios.get(getAPIUrl("staking/cst/staked_tokens"));
      return data.StakedTokensCST;
    } catch (err) {
      console.log(err);
      throw new Error("Network response was not OK");
    }
  }

  public async get_staked_rwalk_tokens() {
    try {
      const { data } = await axios.get(
        getAPIUrl("staking/rwalk/staked_tokens")
      );
      return data.StakedTokensRWalk;
    } catch (err) {
      console.log(err);
      throw new Error("Network response was not OK");
    }
  }

  public async get_staked_cst_tokens_by_user(address: string) {
    try {
      const { data } = await axios.get(
        getAPIUrl(`user/staked/cst/${address}`)
      );
      return data.StakedTokensCST;
    } catch (err) {
      console.log(err);
      throw new Error("Network response was not OK");
    }
  }

  public async get_staked_rwalk_tokens_by_user(address: string) {
    try {
      const { data } = await axios.get(
        getAPIUrl(`user/staked/rwalk/${address}`)
      );
      return data.StakedTokensRWalk;
    } catch (err) {
      console.log(err);
      throw new Error("Network response was not OK");
    }
  }

  public async get_cst_action_ids_by_deposit_id(
    user_addr: string,
    deposit_id: number
  ) {
    try {
      const { data } = await axios.get(
        getAPIUrl(`staking/cst/rewards/action_ids_by_deposit/${user_addr}/${deposit_id}`)
      );
      return data.ActionIds;
    } catch (err) {
      console.log(err);
      throw new Error("Network response was not OK");
    }
  }

  public async get_cst_tokens_by_user(address: string) {
    try {
      const { data } = await axios.get(
        getAPIUrl(`cst/list_by_user/${address}/0/1000000`)
      );
      return data.UserTokens;
    } catch (err) {
      console.log(err);
      throw new Error("Network response was not OK");
    }
  }

  public async get_staking_cst_rewards() {
    try {
      const { data } = await axios.get(
        getAPIUrl("staking/cst/rewards/global/0/1000000")
      );
      return data.StakingCSTRewards;
    } catch (err) {
      console.log(err);
      throw new Error("Network response was not OK");
    }
  }

  public async get_unique_stakers() {
    try {
      const { data } = await axios.get(getAPIUrl("user/unique_stakers_both"));
      return data.UniqueStakersBoth;
    } catch (err) {
      console.log(err);
      throw new Error("Network response was not OK");
    }
  }

  public async get_unique_cst_stakers() {
    try {
      const { data } = await axios.get(getAPIUrl("user/unique_stakers_cst"));
      return data.UniqueStakersCST;
    } catch (err) {
      console.log(err);
      throw new Error("Network response was not OK");
    }
  }

  public async get_unique_rwalk_stakers() {
    try {
      const { data } = await axios.get(getAPIUrl("user/unique_stakers_rwalk"));
      return data.UniqueStakersRWalk;
    } catch (err) {
      console.log(err);
      throw new Error("Network response was not OK");
    }
  }

  public async get_ct_price() {
    try {
      const { data } = await axios.get(getAPIUrl("bid/cst_price"));
      return data;
    } catch (err) {
      console.log(err);
      throw new Error("Network response was not OK");
    }
  }

  public async get_staking_cst_rewards_by_round(round: number) {
    try {
      const { data } = await axios.get(
        getAPIUrl(`staking/cst/rewards/by_round/${round}`)
      );
      return data.Rewards;
    } catch (err) {
      console.log(err);
      throw new Error("Network response was not OK");
    }
  }

  public async get_system_events(start: number, end: number) {
    try {
      const { data } = await axios.get(
        getAPIUrl(`system/admin_events/${start}/${end}`)
      );
      return data.AdminEvents;
    } catch (err) {
      console.log(err);
      throw new Error("Network response was not OK");
    }
  }

  public async get_system_modelist() {
    try {
      const { data } = await axios.get(getAPIUrl(`system/modelist/0/1000000`));
      return data.SystemModeChanges;
    } catch (err) {
      console.log(err);
      throw new Error("Network response was not OK");
    }
  }

  public async get_donations_by_user(address: string) {
    try {
      const { data } = await axios.get(
        getAPIUrl(`donations/eth/by_user/${address}`)
      );
      return data.CombinedDonationRecords;
    } catch (err) {
      console.log(err);
      throw new Error("Network response was not OK");
    }
  }

  public async get_donations_with_info_by_id(id: number) {
    try {
      const { data } = await axios.get(
        getAPIUrl(`donations/eth/with_info/info/${id}`)
      );
      return data.ETHDonation;
    } catch (err) {
      console.log(err);
      throw new Error("Network response was not OK");
    }
  }

  public async get_donations_both_by_round(round: number) {
    try {
      const { data } = await axios.get(
        getAPIUrl(`donations/eth/both/by_round/${round}`)
      );
      return data.CosmicGameDonations;
    } catch (err) {
      console.log(err);
      throw new Error("Network response was not OK");
    }
  }

  public async get_donations_both() {
    try {
      const { data } = await axios.get(getAPIUrl("donations/eth/both/all"));
      return data.CosmicGameDonations;
    } catch (err) {
      console.log(err);
      throw new Error("Network response was not OK");
    }
  }

  public async get_staking_rwalk_mints_by_user(address: string) {
    try {
      const { data } = await axios.get(
        getAPIUrl(`staking/rwalk/mints/by_user/${address}`)
      );
      return data.RWalkStakingRewardMints;
    } catch (err) {
      console.log(err);
      throw new Error("Network response was not OK");
    }
  }

  public async get_staking_cst_mints_by_user(address: string) {
    try {
      const { data } = await axios.get(
        getAPIUrl(`staking/cst/mints/by_user/${address}`)
      );
      return data.CSTStakingRewardMints;
    } catch (err) {
      console.log(err);
      throw new Error("Network response was not OK");
    }
  }

  public async get_current_special_winners() {
    try {
      const { data } = await axios.get(
        getAPIUrl("bid/current_special_winners")
      );
      return data;
    } catch (err) {
      console.log(err);
      throw new Error("Network response was not OK");
    }
  }

  public async get_unique_donors() {
    try {
      const { data } = await axios.get(getAPIUrl("user/unique_donors"));
      return data.UniqueDonors;
    } catch (err) {
      console.log(err);
      throw new Error("Network response was not OK");
    }
  }
}

export default new ApiService();
