import React from "react";
import { Box, Typography } from "@mui/material";
import Head from "next/head";
import { MainWrapper } from "../components/styled";
const Marketplace = () => {
  return (
    <>
      <Head>
        <title>DAO | Bidding War</title>
        <meta name="description" content="" />
      </Head>
      <MainWrapper>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexWrap="wrap"
        >
          <Typography variant="h4" component="span">
            BIDDING WAR DAO
          </Typography>
        </Box>
      </MainWrapper>
    </>
  );
};

export default Marketplace;
