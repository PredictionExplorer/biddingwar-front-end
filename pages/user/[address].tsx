import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import Head from "next/head";
import { MainWrapper } from "../../components/styled";
import { GetServerSidePropsContext } from "next";
import api from "../../services/api";
import BiddingHistoryTable from "../../components/BiddingHistoryTable";
import WinningHistoryTable from "../../components/WinningHistoryTable";

const UserInfo = ({ address, Bids, UserInfo }) => {
  const [claimHistory, setClaimHistory] = useState(null);
  useEffect(() => {
    const fetchClaimHistory = async () => {
      const res = await fetch(`/api/claimHistoryByUser/?address=${address}`);
      const history = await res.json();
      setClaimHistory(history);
    };
    if (address) {
      fetchClaimHistory();
    }
  }, []);

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
            Maximum amount gained (in prize winnings):
          </Typography>
          &nbsp;
          <Typography component="span">
            {UserInfo.MaxWinAmount.toFixed(6)} ETH
          </Typography>
        </Box>
        <Box mb={1}>
          <Typography color="primary" component="span">
            Amount of winnings in ETH raffles:
          </Typography>
          &nbsp;
          <Typography component="span">
            {UserInfo.SumRaffleEthWinnings.toFixed(6)} ETH
          </Typography>
        </Box>
        <Box mb={1}>
          <Typography color="primary" component="span">
            Amount withdrawn from ETH raffles:
          </Typography>
          &nbsp;
          <Typography component="span">
            {UserInfo.SumRaffleEthWithdrawal.toFixed(6)} ETH
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
            {(
              UserInfo.SumRaffleEthWinnings + UserInfo.SumRaffleEthWithdrawal
            ).toFixed(6)}{" "}
            ETH
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
        <Box mt={6}>
          <Typography variant="h6" lineHeight={1}>
            Bid History
          </Typography>
          <BiddingHistoryTable biddingHistory={Bids} />
        </Box>
        <Box>
          <Typography variant="h6" lineHeight={1} mt={8} mb={2}>
            Winning history by the User
          </Typography>
          {claimHistory === null ? (
            <Typography>Loading...</Typography>
          ) : (
            <WinningHistoryTable
              winningHistory={claimHistory}
              showClaimedStatus={true}
            />
          )}
        </Box>
      </MainWrapper>
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const params = context.params!.address;
  const address = Array.isArray(params) ? params[0] : params;
  const { Bids, UserInfo } = await api.get_user_info(address);
  return {
    props: {
      address,
      Bids,
      UserInfo,
    },
  };
}

export default UserInfo;
