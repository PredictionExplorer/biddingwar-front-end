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

const MyWinnings = ({
  list,
  RaffleNFTs,
  DonatedNFTs,
  RWLKHolderNFTs,
  CSHolderNFTs,
}) => {
  const perPage = 20;
  const [curPage, setCurPage] = useState(1);
  const handleETHClaim = async (roundNum) => {};
  const handleAllETHClaim = async () => {};
  const handleRaffleNFTClaim = async (nftId) => {};
  const handleAllRaffleNFTsClaim = async () => {};
  const handleDonatedNFTClaim = async (nftId) => {};
  const handleAllDonatedNFTsClaim = async () => {};
  const handleRWLKHolderNFTClaim = async (nftId) => {};
  const handleAllRWLKHolderNFTsClaim = async () => {};
  const handleCSHolderNFTClaim = async (nftId) => {};
  const handleAllCSHolderNFTsClaim = async () => {};
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
            <Typography variant="h5">Raffle NFTs</Typography>
            <Button onClick={handleAllRaffleNFTsClaim} variant="contained">
              Claim All
            </Button>
          </Box>
          <Grid container spacing={2} mt={2}>
            {RaffleNFTs.map((nft, i) => (
              <Grid
                key={i}
                sx={{ position: "relative" }}
                item
                xs={12}
                sm={6}
                md={3}
                lg={3}
              >
                <NFT nft={nft} />
              </Grid>
            ))}
          </Grid>
        </Box>
        <Box mt={6}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h5">Donated NFTs</Typography>
            <Button onClick={handleAllDonatedNFTsClaim} variant="contained">
              Claim All
            </Button>
          </Box>
          <Grid container spacing={2} mt={2}>
            {DonatedNFTs.map((nft) => (
              <Grid item key={nft.RecordId} xs={12} sm={6} md={3} lg={3}>
                <DonatedNFT nft={nft} />
              </Grid>
            ))}
          </Grid>
        </Box>
        <Box mt={6}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h5">RWLK Holder Winning NFTs</Typography>
            <Button onClick={handleAllRWLKHolderNFTsClaim} variant="contained">
              Claim All
            </Button>
          </Box>
          <Grid container spacing={2} mt={2}>
            {RWLKHolderNFTs.map((nft, i) => (
              <Grid
                key={i}
                sx={{ position: "relative" }}
                item
                xs={12}
                sm={6}
                md={3}
                lg={3}
              >
                <NFT nft={nft} />
              </Grid>
            ))}
          </Grid>
        </Box>
        <Box mt={6}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h5">CS Holder Winning NFTs</Typography>
            <Button onClick={handleAllCSHolderNFTsClaim} variant="contained">
              Claim All
            </Button>
          </Box>
          <Grid container spacing={2} mt={2}>
            {CSHolderNFTs.map((nft, i) => (
              <Grid
                key={i}
                sx={{ position: "relative" }}
                item
                xs={12}
                sm={6}
                md={3}
                lg={3}
              >
                <NFT nft={nft} />
              </Grid>
            ))}
          </Grid>
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
      DonatedNFTs: nftDonations,
      RWLKHolderNFTs: nfts.slice(0, 3),
      CSHolderNFTs: nfts.slice(3, 6),
    },
  };
}

export default MyWinnings;
