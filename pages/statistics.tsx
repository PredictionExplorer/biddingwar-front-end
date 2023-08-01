import React from "react";
import { Box, Typography } from "@mui/material";
import Head from "next/head";
import { MainWrapper } from "../components/styled";
import api from "../services/api";

const convertTimestampToDateTime = (timestamp: any) => {
  var date_ob = new Date(timestamp * 1000);
  var year = date_ob.getFullYear();
  var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  var date = ("0" + date_ob.getDate()).slice(-2);
  var hours = ("0" + date_ob.getHours()).slice(-2);
  var minutes = ("0" + date_ob.getMinutes()).slice(-2);
  var seconds = ("0" + date_ob.getSeconds()).slice(-2);
  var result =
    year +
    "-" +
    month +
    "-" +
    date +
    " " +
    hours +
    ":" +
    minutes +
    ":" +
    seconds;
  return result;
};

const StatisticsItem = ({ title, value }) => {
  return (
    <Box display="flex" my={1}>
      <Typography color="primary" width="300px">
        {title}
      </Typography>
      <Typography>{value}</Typography>
    </Box>
  );
};

const Statistics = ({ data }) => {
  return (
    <>
      <Head>
        <title>Statistics | Cosmic Signature</title>
        <meta name="description" content="" />
      </Head>
      <MainWrapper>
        <Typography variant="h5">Current Round Statistics</Typography>
        <Box my={4}>
          <StatisticsItem title="Current Round" value={data.CurRoundNum} />
          <StatisticsItem
            title="Round Start Date"
            value={convertTimestampToDateTime(data.TsRoundStart)}
          />
          <StatisticsItem
            title="Current Bid Price"
            value={`${data.BidPriceEth.toFixed(6)} ETH`}
          />
          <StatisticsItem
            title="Num Bids Since Round Start"
            value={data.CurNumBids}
          />
          <StatisticsItem
            title="Total CS tokens minted"
            value={data.MainStats.NumCSTokenMints}
          />
          <StatisticsItem
            title="Prize Amount"
            value={`${data.PrizeAmountEth.toFixed(6)} ETH`}
          />
          <StatisticsItem
            title="Prize Claim Date"
            value={convertTimestampToDateTime(data.PrizeClaimTs)}
          />
          <StatisticsItem title="Last Bidder" value={data.LastBidderAddr} />
        </Box>
        <Typography variant="h5">Overall Statistics</Typography>
        <Box mt={4}>
          <StatisticsItem title="Num Prizes Given" value={data.TotalPrizes} />
          <StatisticsItem
            title="Total Amount Paid in Prizes"
            value={`${data.TotalPrizesPaidAmountEth.toFixed(6)} ETH`}
          />
          <StatisticsItem
            title="Voluntary Donations Received"
            value={`${data.NumVoluntaryDonations} totalling ${data.SumVoluntaryDonationsEth} ETH`}
          />
          <StatisticsItem
            title="RandomWalk Tokens Used"
            value={data.NumRwalkTokensUsed}
          />
          <StatisticsItem
            title="Price Increase"
            value="1%"
          />
          <StatisticsItem
            title="Time Increase"
            value="0.01%"
          />
          <StatisticsItem
            title="Prize Percentage"
            value={`${data.PrizePercentage} %`}
          />
          <StatisticsItem
            title="Raffle Percentage"
            value={`${data.RafflePercentage} %`}
          />
          <StatisticsItem
            title="NFT Holder Winners"
            value={data.NumHolderNFTWinners}
          />
          <StatisticsItem
            title="Raffle ETH Winners"
            value={data.NumRaffleEthWinners}
          />
          <StatisticsItem
            title="Raffle NFT Winners"
            value={data.NumRaffleNFTWinners}
          />
          <StatisticsItem
            title="Raffle Holder NFT Winners"
            value={data.CurRoundNum}
          />
          <StatisticsItem title="Charity Address" value={data.CharityAddr} />
          <StatisticsItem
            title="Charity Percentage"
            value={`${data.CharityPercentage} %`}
          />
          <StatisticsItem
            title="Charity Balance"
            value={`${data.CharityBalanceEth.toFixed(6)} ETH`}
          />
          <StatisticsItem
            title="Number of Unique Bidders"
            value={data.MainStats.NumUniqueBidders}
          />
          <StatisticsItem
            title="Number of Unique Winners"
            value={data.MainStats.NumUniqueWinners}
          />
          <StatisticsItem
            title="Number of Donated NFTs"
            value={data.NumDonatedNFTs}
          />
        </Box>
      </MainWrapper>
    </>
  );
};

export async function getServerSideProps() {
  const data = await api.get_dashboard_info();
  return {
    props: { data },
  };
}

export default Statistics;
