import React from "react";
import { Box, Typography } from "@mui/material";
import Head from "next/head";
import { MainWrapper } from "../../components/styled";
import { GetServerSidePropsContext } from "next";
import api from "../../services/api";
import BiddingHistoryTable from "../../components/BiddingHistoryTable";
import { PrizeTable } from "../../components/PrizeTable";
import RaffleWinnerTable from "../../components/RaffleWinnerTable";
import { ClaimedRaffleNFTTable } from "../../components/ClaimedRaffleNFTTable";

const UserInfo = ({
  address,
  Bids,
  Prizes,
  UserInfo,
  RaffleETHDeposits,
  RaffleNFTWinners,
  claimedRaffleNFTs,
}) => {
  return (
    <>
      <Head>
        <title>User Info | Cosmic Signature</title>
        <meta name="description" content="" />
      </Head>
      <MainWrapper>
        <Box mb={4}>
          <Typography variant="h6" color="primary" component="span" mr={2}>
            User
          </Typography>
          <Typography variant="h6" component="span">
            {address}
          </Typography>
        </Box>
        <Box mb={1}>
          <Typography color="primary" component="span">
            Number of Bids:
          </Typography>
          &nbsp;
          <Typography component="span">{UserInfo.NumBids}</Typography>
        </Box>
        <Box mb={1}>
          <Typography color="primary" component="span">
            Maximum Bid Amount:
          </Typography>
          &nbsp;
          <Typography component="span">
            {UserInfo.MaxBidAmount.toFixed(6)} ETH
          </Typography>
        </Box>
        <Box mb={1}>
          <Typography color="primary" component="span">
            Number of Prizes taken:
          </Typography>
          &nbsp;
          <Typography component="span">{UserInfo.NumPrizes}</Typography>
        </Box>
        <Box mb={1}>
          <Typography color="primary" component="span">
            Maximum Prize won:
          </Typography>
          &nbsp;
          <Typography component="span">
            {UserInfo.MaxWinAmount.toFixed(6)} ETH
          </Typography>
        </Box>
        <Box mb={1}>
          <Typography color="primary" component="span">
            Unclaimed donated NFTs:
          </Typography>
          &nbsp;
          <Typography component="span">{UserInfo.UnclaimedNFTs}</Typography>
        </Box>
        <Box mb={1}>
          <Typography color="primary" component="span">
            Total ETH won in raffles:
          </Typography>
          &nbsp;
          <Typography component="span">
            {UserInfo.SumRaffleEthWinnings.toFixed(6)} ETH
          </Typography>
        </Box>
        <Box mb={1}>
          <Typography color="primary" component="span">
            Number of (ETH) raffles participated in:
          </Typography>
          &nbsp;
          <Typography component="span">
            {UserInfo.NumRaffleEthWinnings}
          </Typography>
        </Box>
        <Box mb={1}>
          <Typography color="primary" component="span">
            Number of Raffle NFTs won:
          </Typography>
          &nbsp;
          <Typography component="span">{UserInfo.RaffleNFTWon}</Typography>
        </Box>
        <Box mb={1}>
          <Typography color="primary" component="span">
            Number of Raffle NFTs claimed:
          </Typography>
          &nbsp;
          <Typography component="span">{UserInfo.RaffleNFTClaimed}</Typography>
        </Box>
        <Box mt={6}>
          <Typography variant="h6" lineHeight={1}>
            Bid History
          </Typography>
          <BiddingHistoryTable biddingHistory={Bids} />
        </Box>
        <Box>
          <Typography variant="h6" lineHeight={1} mt={8} mb={2}>
            Prizes won by the User
          </Typography>
          <PrizeTable list={Prizes} />
        </Box>
        {/* <Box>
          <Typography variant="h6" lineHeight={1} mt={8} mb={4}>
            Claims of donated NFTs for User
          </Typography>
          <ClaimedRaffleNFTTable list={claimedRaffleNFTs} />
        </Box> */}
        <Box>
          <Typography variant="h6" lineHeight={1} mt={8} mb={2}>
            Raffles won by the User
          </Typography>
          <RaffleWinnerTable
            RaffleETHDeposits={RaffleETHDeposits}
            RaffleNFTWinners={RaffleNFTWinners}
          />
        </Box>
        <Box>
          <Typography variant="h6" lineHeight={1} mt={8} mb={2}>
            Raffle NFT claims by User
          </Typography>
          <ClaimedRaffleNFTTable list={claimedRaffleNFTs} />
        </Box>
      </MainWrapper>
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const params = context.params!.address;
  const address = Array.isArray(params) ? params[0] : params;
  const { Bids, Prizes, UserInfo } = await api.get_user_info(address);
  const RaffleETHDeposits = await api.get_raffle_deposits_by_user(address);
  const RaffleNFTWinners = await api.get_raffle_nft_winners_by_user(address);
  const claimedRaffleNFTs = await api.get_raffle_nft_claims_by_user(address);
  return {
    props: {
      address,
      Bids,
      Prizes,
      UserInfo,
      RaffleETHDeposits,
      RaffleNFTWinners,
      claimedRaffleNFTs,
    },
  };
}

export default UserInfo;
