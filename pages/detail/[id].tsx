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

const Detail = ({ nft, prizeInfo, data, nftDonations }) => {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>NFT #{nft.TokenId} | Random Walk NFT</title>
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
        <NFTTrait nft={nft} />
        <Box sx={{ background: "#101441", padding: "80px 0" }}>
          <Container>
            <Box display="flex" alignItems="center" flexWrap="wrap">
              <Typography
                variant="h6"
                component="span"
                color="primary"
                sx={{ ml: 1.5 }}
              >
                BID HISTORY
              </Typography>
            </Box>
            <BiddingHistoryTable biddingHistory={[]} />
          </Container>
        </Box>
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
          {prizeInfo && <Winners prizeInfo={prizeInfo} />}
        </Container>
      </MainWrapper>
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const id = context.params!.id;
  const tokenId = Array.isArray(id) ? id[0] : id;
  const nft = await api.get_cst_info(parseInt(tokenId));
  const prizeList = await api.get_prize_list();
  let prizeInfo;
  if (prizeList.length) {
    prizeInfo = await api.get_prize_info(prizeList.length - 1);
  } else {
    prizeInfo = null;
  }
  const dashboardData = await api.get_dashboard_info();
  const nftDonations = await api.get_donations_nft_list();
  return {
    props: { nft, prizeInfo, data: dashboardData, nftDonations },
  };
}

export default Detail;
