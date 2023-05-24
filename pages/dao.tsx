import React from "react";
import { Box, Typography } from "@mui/material";
import Head from "next/head";
import { MainWrapper } from "../components/styled";
const Dao = () => {
  return (
    <>
      <Head>
        <title>DAO | Cosmic Signature</title>
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
            COSMIC SIGNATURE DAO
          </Typography>
        </Box>
      </MainWrapper>
    </>
  );
};

export default Dao;
