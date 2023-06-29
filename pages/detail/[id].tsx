import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import React from "react";
import { Box, Alert, Container, Typography, Grid } from "@mui/material";
import Head from "next/head";
import NFTTrait from "../../components/NFTTrait";
import { MainWrapper } from "../../components/styled";
import Prize from "../../components/Prize";
import Winners from "../../components/Winners";
import api from "../../services/api";
import BiddingHistoryTable from "../../components/BiddingHistoryTable";
import DonatedNFT from "../../components/DonatedNFT";

const Detail = ({
  nft,
  prizeInfo,
  data,
  nftDonations,
  raffleDeposits,
  raffleNFTWinners,
}) => {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>NFT #{nft.TokenId} | CosmicSignature Token</title>
      </Head>
      <MainWrapper
        maxWidth={false}
        style={{
          paddingLeft: 0,
          paddingRight: 0,
        }}
      >
        {router.query && router.query.message && (
          <Box px={8} mb={2}>
            <Alert variant="outlined" severity="success">
              {router.query.message === "success"
                ? "Media files are being generated. Please refrersh the page in a few minutes."
                : ""}
            </Alert>
          </Box>
        )}
        <NFTTrait
          nft={nft}
          prizeInfo={prizeInfo}
          raffleDeposits={raffleDeposits}
          raffleNFTWinners={raffleNFTWinners}
        />
        <Container>
          <Prize prizeAmount={data.PrizeAmountEth} />
          <Grid container spacing={2} mt={2}>
            {nftDonations &&
              nftDonations.slice(-3).map((nft) => (
                <Grid key={nft.RecordId} item xs={12} sm={12} md={4} lg={4}>
                  <DonatedNFT nft={nft} />
                </Grid>
              ))}
          </Grid>
        </Container>
      </MainWrapper>
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const id = context.params!.id;
  const tokenId = Array.isArray(id) ? id[0] : id;
  const nft = await api.get_cst_info(parseInt(tokenId));
  let prizeInfo;
  if (nft.PrizeNum >= 0) {
    prizeInfo = await api.get_prize_info(nft.PrizeNum);
  } else {
    prizeInfo = null;
  }
  const dashboardData = await api.get_dashboard_info();
  const nftDonations = await api.get_donations_nft_list();
  const raffleDeposits = await api.get_raffle_deposits_by_round(nft.PrizeNum);
  const raffleNFTWinners = await api.get_raffle_nft_winners_by_round(
    nft.PrizeNum
  );
  return {
    props: {
      nft,
      prizeInfo,
      data: dashboardData,
      nftDonations,
      raffleDeposits,
      raffleNFTWinners,
    },
  };
}

export default Detail;
