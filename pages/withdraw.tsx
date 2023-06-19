import React from "react";
import { Box, Typography, Grid, Button } from "@mui/material";
import Head from "next/head";
import { MainWrapper } from "../components/styled";
import { ArrowForward } from "@mui/icons-material";
import Countdown from "react-countdown";
import Counter from "../components/Counter";
import { styled } from "@mui/material/styles";
import { isSafari } from "react-device-detect";

const GradientWrapper = styled(Box)(
  !isSafari && {
    position: "relative",
    padding: "60px",
    border: 0,
    "--border": "1px",
    "--radius": "16px",
    "--t": 0,
    "--path": "0 0,32px 0,100% 0,100% 45%,92% 100%,0 100%",
    WebkitMask: "paint(rounded-shape)",
    background: "rgba(255, 255, 255, 0.05)",
    "&:before": {
      content: '""',
      position: "absolute",
      inset: 0,
      background:
        "linear-gradient(152.14deg, rgba(156, 55, 253, 0.7) 9.96%, rgba(21, 191, 253, 0.7) 100%)",
      "--t": 1,
      WebkitMask: "paint(rounded-shape)",
    },
  }
);

const Withdraw = () => (
  <>
    <Head>
      <title>Withdraw | Random Walk NFT</title>
      <meta
        name="description"
        content="Programmatically generated Random Walk image and video NFTs. ETH spent on minting goes back to the minters."
      />
    </Head>
    <MainWrapper>
      <Typography variant="h4" color="primary" align="center">
        Withdrawal opens in
      </Typography>
      <GradientWrapper sx={{ marginTop: "30px" }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={6}>
            <Countdown
              date={Date.now() + 1000000000 * 1000}
              renderer={Counter}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <Box sx={{ display: "flex", my: "10px" }}>
              <Typography color="primary">Last Minter Address:</Typography>
              &nbsp;
              <Typography>0xB9A66Fe7C1B7b8b3f14F68399AD1202</Typography>
            </Box>
            <Box sx={{ display: "flex" }}>
              <Typography color="primary">Withdrawal Amount:</Typography>
              &nbsp;
              <Typography>0.1213 Ξ</Typography>
            </Box>
          </Grid>
        </Grid>
      </GradientWrapper>
      <Box sx={{ margin: "40px 100px 0", textAlign: "center" }}>
        <Typography variant="body2" mb="30px">
          If somebody mints an NFT, then there is no mint for 30 days, the last
          minter can withdraw a large percentage of all the ETH that was spent
          on minting. The ETH spent on minting does not go to the creator of the
          NFT, it goes back to the minters through this mechanism
        </Typography>
        <Button variant="contained" size="large" endIcon={<ArrowForward />}>
          Withdraw Now
        </Button>
      </Box>
    </MainWrapper>
  </>
);

export default Withdraw;
