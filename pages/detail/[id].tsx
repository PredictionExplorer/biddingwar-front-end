import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import React from "react";
import { Box, Alert, Container, Typography } from "@mui/material";
import Head from "next/head";
import NFTTrait from "../../components/NFTTrait";
import { MainWrapper } from "../../components/styled";
import Prize from "../../components/Prize";
import Winners from "../../components/Winners";
import BiddingHistory from "../../components/BiddingHistory";
import { useNFT } from "../../hooks/useNFT";
import api from "../../services/api";

const Detail = ({ tokenId, data }) => {
  const router = useRouter();
  const nft = useNFT(tokenId);
  if (!nft) return <></>;

  return (
    <>
      <Head>
        <title>NFT #{nft.id} | Random Walk NFT</title>
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
            <BiddingHistory curPage={0} biddingHistory={[]} totalCount={0} />
          </Container>
        </Box>
        <Container>
          <Prize prizeAmount={0} />
          <Winners roundNum={data.CurRoundNum - 1} />
        </Container>
      </MainWrapper>
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const id = context.params!.id;
  const tokenId = Array.isArray(id) ? id[0] : id;
  const dashboardData = await api.get_dashboard_info();
  return {
    props: { tokenId: parseInt(tokenId), data: dashboardData },
  };
}

export default Detail;
