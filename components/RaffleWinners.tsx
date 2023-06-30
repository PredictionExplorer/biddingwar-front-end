import React from "react";
import { Box, Typography } from "@mui/material";
import RaffleWinnerTable from "./RaffleWinnerTable";

const RaffleWinners = ({ prizeInfo }) => {
  const { RaffleETHDeposits, RaffleNFTWinners } = prizeInfo;
  return (
    <Box sx={{ marginTop: "70px" }}>
      <Typography variant="h4" textAlign="center" mb={4}>
        Previous Round Raffle Winners
      </Typography>
      <RaffleWinnerTable
        RaffleETHDeposits={RaffleETHDeposits}
        RaffleNFTWinners={RaffleNFTWinners}
      />
    </Box>
  );
};

export default RaffleWinners;
