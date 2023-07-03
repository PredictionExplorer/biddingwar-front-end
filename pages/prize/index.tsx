import React from "react";

import {
  Box,
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
} from "../../components/styled";
import { useRouter } from "next/router";
import { GetServerSidePropsContext } from "next";
import api from "../../services/api";
import { convertTimestampToDateTime, shortenHex } from "../../utils";

const PrizeRow = ({ prize }) => {
  const router = useRouter();
  if (!prize) {
    return <TablePrimaryRow></TablePrimaryRow>;
  }

  return (
    <TablePrimaryRow
      sx={{ cursor: "pointer" }}
      onClick={() => {
        router.push(`/prize/${prize.PrizeNum}`);
      }}
    >
      <TablePrimaryCell>
        {convertTimestampToDateTime(prize.TimeStamp)}
      </TablePrimaryCell>
      <TablePrimaryCell>{shortenHex(prize.WinnerAddr)}</TablePrimaryCell>
      <TablePrimaryCell>{prize.PrizeNum}</TablePrimaryCell>
      <TablePrimaryCell>{prize.AmountEth.toFixed(4)} ETH</TablePrimaryCell>
      <TablePrimaryCell>{prize.RoundStats.TotalBids}</TablePrimaryCell>
      <TablePrimaryCell>{prize.RoundStats.TotalDonatedNFTs}</TablePrimaryCell>
      <TablePrimaryCell>
        {prize.RoundStats.TotalRaffleEthDepositsEth.toFixed(4)} ETH
      </TablePrimaryCell>
      <TablePrimaryCell>{prize.RoundStats.TotalRaffleNFTs}</TablePrimaryCell>
    </TablePrimaryRow>
  );
};

const PrizeTable = ({ list }) => {
  return (
    <TablePrimaryContainer>
      <Table>
        <TablePrimaryHead>
          <TableRow>
            <TableCell>Datetime</TableCell>
            <TableCell>Winner</TableCell>
            <TableCell>Round #</TableCell>
            <TableCell>Prize Amount</TableCell>
            <TableCell>Bids</TableCell>
            <TableCell>Donated NFTs</TableCell>
            <TableCell>Raffle Deposits</TableCell>
            <TableCell>Raffle NFTs</TableCell>
          </TableRow>
        </TablePrimaryHead>
        <TableBody>
          {list.length > 0 ? (
            list.map((prize) => <PrizeRow prize={prize} key={prize.EvtLogId} />)
          ) : (
            <TableRow>
              <TablePrimaryCell align="center" colSpan={8}>
                No winners yet.
              </TablePrimaryCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TablePrimaryContainer>
  );
};

const PrizeWinners = ({ prizeClaims, totalCount, curPage, nftDonations }) => {
  const perPage = 20;
  const router = useRouter();
  const handleNextPage = (page) => {
    router.query["page"] = page;
    router.push({ pathname: router.pathname, query: router.query });
  };

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
          <Box display="flex" justifyContent="center" mt={4}>
            <Pagination
              color="primary"
              page={parseInt(curPage)}
              onChange={(_e, page) => handleNextPage(page)}
              count={Math.ceil(totalCount / perPage)}
              showFirstButton
              showLastButton
            />
          </Box>
        </Box>
        {/* <Grid container spacing={2} mt={8}>
          {nftDonations &&
            nftDonations.slice(-3).map((nft) => (
              <Grid key={nft.RecordId} item xs={12} sm={12} md={4} lg={4}>
                <DonatedNFT nft={nft} />
              </Grid>
            ))}
        </Grid> */}
      </MainWrapper>
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const page = context.query.page ?? 1;
  const prizeClaims = await api.get_prize_list();
  const nftDonations = await api.get_donations_nft_list();
  return {
    props: {
      prizeClaims,
      totalCount: prizeClaims.length,
      curPage: page,
      nftDonations,
    },
  };
}

export default PrizeWinners;
