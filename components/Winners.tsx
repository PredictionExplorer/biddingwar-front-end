import React from "react";
import Image from "next/image";
import { Box, Typography, Grid, CardActionArea } from "@mui/material";
import { NFTImage, StyledCard } from "./styled";

const Winners = ({ prizeInfo }) => {
  const { RaffleETHDeposits: raffleETHDeposits } = prizeInfo;
  return (
    <Box sx={{ marginTop: "70px" }}>
      <Typography variant="h4" textAlign="center" marginX="auto">
        Previous Round Raffle Winners
      </Typography>
      <Grid container spacing={2} marginTop="48px">
        {raffleETHDeposits.map((winner) => (
          <Grid key={winner.EvtLogId} item xs={12} sm={12} md={4} lg={4}>
            <StyledCard>
              <CardActionArea>
                <NFTImage src="https://randomwalknft.s3.us-east-2.amazonaws.com/000496_black_thumb.jpg" />
              </CardActionArea>
            </StyledCard>
            <Box mt={2}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                <Typography variant="body2">{winner.WinnerAddr}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Typography fontSize={22} marginRight={1}>
                  CST Won:
                </Typography>
                <Image
                  src={"/images/Ethereum_small.svg"}
                  width={16}
                  height={16}
                  alt="ethereum"
                />
                <Typography fontSize={22} color="primary" marginLeft={1}>
                  {winner.Amount.toFixed(2)}
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Winners;
