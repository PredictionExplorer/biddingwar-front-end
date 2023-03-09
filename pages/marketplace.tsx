import React from "react";
import { Box, Typography } from "@mui/material";
import Head from "next/head";
import { MainWrapper } from "../components/styled";
const Marketplace = () => {
  return (
    <>
      <Head>
        <title>Marketplace | Bidding War</title>
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
            BIDDING
          </Typography>
          <Typography
            variant="h4"
            component="span"
            color="primary"
            sx={{ ml: 1.5 }}
          >
            WAR
          </Typography>
          <Typography
            variant="h4"
            component="span"
            color="secondary"
            sx={{ ml: 1.5 }}
          >
            MARKETPLACE
          </Typography>
        </Box>
      </MainWrapper>
    </>
  );
};

export default Marketplace;
