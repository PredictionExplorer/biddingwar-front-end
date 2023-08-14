import React, { useState } from "react";

import {
  Box,
  Button,
  Grid,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";

import Head from "next/head";

import {
  MainWrapper,
  TablePrimaryCell,
  TablePrimaryContainer,
  TablePrimaryHead,
  TablePrimaryRow,
} from "../components/styled";
import { convertTimestampToDateTime } from "../utils";
import DonatedNFT from "../components/DonatedNFT";
import NFT from "../components/NFT";
import api from "../services/api";
import { ClaimableNFTTable } from "../components/ClaimableNFTTable";

const MyWinningsRow = ({ winning, handleETHClaim }) => {
  if (!winning) {
    return <TablePrimaryRow></TablePrimaryRow>;
  }

  return (
    <TablePrimaryRow>
      <TablePrimaryCell>
        {convertTimestampToDateTime(winning.timestamp)}
      </TablePrimaryCell>
      <TablePrimaryCell>{winning.roundNum}</TablePrimaryCell>
      <TablePrimaryCell>{winning.amount}</TablePrimaryCell>
      <TablePrimaryCell>
        <Button onClick={() => handleETHClaim(winning.roundNum)}>Claim</Button>
      </TablePrimaryCell>
    </TablePrimaryRow>
  );
};

const MyWinningsTable = ({ list, handleETHClaim }) => {
  return (
    <TablePrimaryContainer>
      <Table>
        <TablePrimaryHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Round</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TablePrimaryHead>
        <TableBody>
          {list.length > 0 ? (
            list.map((winning, i) => (
              <MyWinningsRow
                key={i}
                winning={winning}
                handleETHClaim={handleETHClaim}
              />
            ))
          ) : (
            <TableRow>
              <TablePrimaryCell align="center" colSpan={8}>
                No winnings yet.
              </TablePrimaryCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TablePrimaryContainer>
  );
};

const MyWinnings = ({ list, RaffleNFTs, PrizeNFTs, DonatedNFTs }) => {
  const perPage = 20;
  const [curPage, setCurPage] = useState(1);
  const handleETHClaim = async (roundNum) => {};
  const handleAllETHClaim = async () => {};
  const handleRaffleNFTClaim = async (nftId) => {};
  const handleAllRaffleNFTsClaim = async () => {};
  const handleDonatedNFTClaim = async (nftId) => {};
  const handleAllDonatedNFTsClaim = async () => {};
  const handlePrizeNFTClaim = async (nftId) => {};
  const handleAllPrizeNFTsClaim = async () => {};
  return (
    <>
      <Head>
        <title>My Winnings | Cosmic Signature</title>
        <meta name="description" content="" />
      </Head>
      <MainWrapper>
        <Typography
          variant="h4"
          color="primary"
          gutterBottom
          textAlign="center"
        >
          My Winnings
        </Typography>
        <Box mt={6}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h5">Raffle ETH</Typography>
            <Button onClick={handleAllETHClaim} variant="contained">
              Claim All
            </Button>
          </Box>
          <MyWinningsTable list={list} handleETHClaim={handleETHClaim} />
          <Box display="flex" justifyContent="center" mt={4}>
            <Pagination
              color="primary"
              page={curPage}
              onChange={(_e, page) => setCurPage(page)}
              count={Math.ceil(list.length / perPage)}
              showFirstButton
              showLastButton
            />
          </Box>
        </Box>
        <Box mt={6}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h5">Winnings from Raffle NFTs</Typography>
            <Button onClick={handleAllRaffleNFTsClaim} variant="contained">
              Claim All
            </Button>
          </Box>
          {/* Table */}
          <ClaimableNFTTable list={[]} />
        </Box>
        <Box mt={6}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h5">NFTs from Prize winnings</Typography>
            <Button onClick={handleAllPrizeNFTsClaim} variant="contained">
              Claim All
            </Button>
          </Box>
          {/* Table */}
          <ClaimableNFTTable list={[]} />
        </Box>
        <Box mt={6}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h5">Donated NFTs</Typography>
            <Button onClick={handleAllDonatedNFTsClaim} variant="contained">
              Claim All
            </Button>
          </Box>
          {/* Table */}
          <ClaimableNFTTable list={[]} />
        </Box>
      </MainWrapper>
    </>
  );
};

export async function getServerSideProps() {
  const nfts = await api.get_cst_list();
  const nftDonations = await api.get_donations_nft_by_round(3);
  return {
    props: {
      list: [],
      RaffleNFTs: nfts.slice(6, 9),
      PrizeNFTs: nfts.slice(0, 3),
      DonatedNFTs: nftDonations,
    },
  };
}

export default MyWinnings;