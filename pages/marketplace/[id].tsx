import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import React from "react";
import { Box, Alert, Container, Typography } from "@mui/material";
import Head from "next/head";
import { MainWrapper } from "../../components/styled";
import api from "../../services/api";
import OnSaleNFTTrait from "../../components/OnSaleNFTTrait";
import BiddingHistoryTable from "../../components/BiddingHistoryTable";
import BuyOfferTable from "../../components/BuyOfferTable";

const Detail = ({ nft, prizeInfo, data }) => {
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
        <OnSaleNFTTrait nft={nft} />
        <Box sx={{ background: "#101441", padding: "80px 0" }}>
          <Container>
            <Box textAlign="center">
              <Typography variant="h4" component="span" color="primary">
                BID
              </Typography>
              &nbsp;
              <Typography variant="h4" component="span">
                HISTORY
              </Typography>
            </Box>
            <BuyOfferTable curPage={0} offers={[]} totalCount={0} />
          </Container>
        </Box>
        <Container sx={{ mt: "100px" }}>
          <Box>
            <Typography variant="h6" component="span" color="primary">
              BID
            </Typography>
            &nbsp;
            <Typography variant="h6" component="span">
              HISTORY
            </Typography>
          </Box>
          <BiddingHistoryTable biddingHistory={[]} />
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
  return {
    props: { nft, prizeInfo, data: dashboardData },
  };
}

export default Detail;
