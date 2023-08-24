import React from "react";
import { Box, Typography } from "@mui/material";
import Head from "next/head";
import { MainWrapper } from "../../components/styled";
import api from "../../services/api";
import { PrizeTable } from "../../components/PrizeTable";

const PrizeWinners = ({ prizeClaims }) => {
  return (
    <>
      <Head>
        <title>Prize Winners | Cosmic Signature</title>
        <meta name="description" content="" />
      </Head>
      <MainWrapper>
        <Typography
          variant="h4"
          color="primary"
          gutterBottom
          textAlign="center"
        >
          Prize Winners
        </Typography>
        <Box mt={6}>
          <PrizeTable list={prizeClaims} />
        </Box>
      </MainWrapper>
    </>
  );
};

export async function getServerSideProps() {
  let prizeClaims = await api.get_prize_list();
  prizeClaims = prizeClaims.sort((a, b) => b.TimeStamp - a.TimeStamp);
  return {
    props: {
      prizeClaims,
    },
  };
}

export default PrizeWinners;
