import React, { useEffect, useState } from "react";
import { Box, Button, Grid, Link, Typography } from "@mui/material";
import Head from "next/head";
import { MainWrapper } from "../../components/styled";
import { GetServerSidePropsContext } from "next";
import api from "../../services/api";
import { convertTimestampToDateTime } from "../../utils";
import DonatedNFT from "../../components/DonatedNFT";
import RaffleWinnerTable from "../../components/RaffleWinnerTable";
import BiddingHistoryTable from "../../components/BiddingHistoryTable";
import { useActiveWeb3React } from "../../hooks/web3";
import useRaffleWalletContract from "../../hooks/useRaffleWalletContract";
import useCosmicGameContract from "../../hooks/useCosmicGameContract";

const PrizeInfo = ({ bidHistory, prizeNum, nftDonations, prizeInfo }) => {
  const { account } = useActiveWeb3React();
  const cosmicGameContract = useCosmicGameContract();
  const raffleWalletContract = useRaffleWalletContract();
  const [status, setStatus] = useState({
    ETHRaffleToClaim: 0,
    ETHRaffleToClaimWei: 0,
    NumDonatedNFTToClaim: 0,
  });
  useEffect(() => {
    const fetchNotification = async () => {
      const res = await fetch(`/api/notifRedBox/?address=${account}`);
      const notify = await res.json();
      setStatus(notify);
    };
    const interval = setInterval(() => {
      fetchNotification();
    }, 30000);
    fetchNotification();
    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleAllETHClaim = async () => {
    try {
      const res = await raffleWalletContract.withdraw();
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };
  const handleAllDonatedNFTsClaim = async () => {
    try {
      const res = await cosmicGameContract.claimManyDonatedNFTs();
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <Head>
        <title>Prize Info | Cosmic Signature</title>
        <meta name="description" content="" />
      </Head>
      <MainWrapper>
        <Box mb={4}>
          <Typography variant="h4" color="primary" component="span" mr={2}>
            {`Round #${prizeNum}`}
          </Typography>
          <Typography variant="h4" component="span">
            Prize Information
          </Typography>
        </Box>
        {prizeInfo ? (
          <Box>
            <Box mb={1}>
              <Typography color="primary" component="span">
                Datetime:
              </Typography>
              &nbsp;
              <Typography component="span">
                {convertTimestampToDateTime(prizeInfo.TimeStamp)}
              </Typography>
            </Box>
            <Box mb={1}>
              <Typography color="primary" component="span">
                Prize Amount:
              </Typography>
              &nbsp;
              <Typography component="span">
                {prizeInfo.AmountEth.toFixed(4)} ETH
              </Typography>
            </Box>
            <Box mb={1}>
              <Typography color="primary" component="span">
                Winner Address:
              </Typography>
              &nbsp;
              <Typography fontFamily="monospace" component="span">
                <Link
                  href={`/user/${prizeInfo.WinnerAddr}`}
                  style={{ color: "rgb(255, 255, 255)" }}
                >
                  {prizeInfo.WinnerAddr}
                </Link>
              </Typography>
            </Box>
            <Box mb={1}>
              <Typography color="primary" component="span">
                Charity Address:
              </Typography>
              &nbsp;
              <Typography fontFamily="monospace" component="span">
                {prizeInfo.CharityAddress}
              </Typography>
            </Box>
            <Box mb={1}>
              <Typography color="primary" component="span">
                Charity Amount:
              </Typography>
              &nbsp;
              <Typography component="span">
                {prizeInfo.CharityAmountETH.toFixed(4)} ETH
              </Typography>
            </Box>
            <Box mb={1}>
              <Typography color="primary" component="span">
                Total Bids:
              </Typography>
              &nbsp;
              <Typography component="span">
                {prizeInfo.RoundStats.TotalBids}
              </Typography>
            </Box>
            <Box mb={1}>
              <Typography color="primary" component="span">
                Total Raffle Eth Deposits:
              </Typography>
              &nbsp;
              <Typography component="span">
                {prizeInfo.RoundStats.TotalRaffleEthDepositsEth.toFixed(4)}
              </Typography>
            </Box>
            <Box mb={1}>
              <Typography color="primary" component="span">
                Total Raffle NFTs:
              </Typography>
              &nbsp;
              <Typography component="span">
                {prizeInfo.RoundStats.TotalRaffleNFTs}
              </Typography>
            </Box>
            <Box mt={4}>
              <Typography variant="h6" lineHeight={1}>
                Bid History
              </Typography>
              <BiddingHistoryTable biddingHistory={bidHistory} />
            </Box>
            <Box mt={4}>
              <Box
                sx={{
                  mb: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6">
                  Raffle Winners{" "}
                  {status.ETHRaffleToClaim > 0 &&
                    `(${status.ETHRaffleToClaim.toFixed(6)} ETH)`}
                </Typography>
                {status.ETHRaffleToClaim > 0 && (
                  <Button variant="contained" onClick={handleAllETHClaim}>
                    Claim All
                  </Button>
                )}
              </Box>
              <RaffleWinnerTable
                RaffleETHDeposits={prizeInfo.RaffleETHDeposits}
                RaffleNFTWinners={prizeInfo.RaffleNFTWinners}
              />
            </Box>
            <Box mt={4}>
              <Box
                sx={{
                  mb: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="h6">Donated NFTs</Typography>
                {status.NumDonatedNFTToClaim > 0 && (
                  <Button
                    variant="contained"
                    onClick={handleAllDonatedNFTsClaim}
                  >
                    Claim All
                  </Button>
                )}
              </Box>
              <Grid container spacing={2}>
                {nftDonations.length ? (
                  nftDonations.map((nft) => (
                    <Grid key={nft.RecordId} item xs={12} sm={12} md={4} lg={4}>
                      <DonatedNFT nft={nft} />
                    </Grid>
                  ))
                ) : (
                  <Grid item>
                    <Typography>
                      No ERC721 tokens were donated on this round
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Box>
          </Box>
        ) : (
          <Typography variant="h6">Prize data not found!</Typography>
        )}
      </MainWrapper>
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const id = context.params!.id;
  const prizeNum = Array.isArray(id) ? id[0] : id;
  const nftDonations = await api.get_donations_nft_by_round(Number(prizeNum));
  const prizeInfo = await api.get_prize_info(Number(prizeNum));
  const bidHistory = await api.get_bid_list_by_round(
    Number(prizeNum) - 1,
    "desc"
  );
  return {
    props: {
      bidHistory,
      prizeNum,
      nftDonations,
      prizeInfo,
    },
  };
}

export default PrizeInfo;
