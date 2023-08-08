import React, { useState } from "react";

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
} from "../components/styled";

const MyWinningsRow = ({ winning }) => {
  if (!winning) {
    return <TablePrimaryRow></TablePrimaryRow>;
  }

  return (
    <TablePrimaryRow>
      <TablePrimaryCell>{winning.type}</TablePrimaryCell>
      <TablePrimaryCell>{winning.tokenId}</TablePrimaryCell>
      <TablePrimaryCell>{winning.price}</TablePrimaryCell>
    </TablePrimaryRow>
  );
};

const MyWinningsTable = ({ list }) => {
  return (
    <TablePrimaryContainer>
      <Table>
        <TablePrimaryHead>
          <TableRow>
            <TableCell>Type</TableCell>
            <TableCell>Token</TableCell>
            <TableCell>Price</TableCell>
          </TableRow>
        </TablePrimaryHead>
        <TableBody>
          {list.length > 0 ? (
            list.map((winning, i) => <MyWinningsRow winning={winning} key={i} />)
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

const MyWinnings = ({ list }) => {
  const perPage = 20;
  const [curPage, setCurPage] = useState(1);
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
          <MyWinningsTable list={list} />
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
      </MainWrapper>
    </>
  );
};

export async function getServerSideProps() {
  return {
    props: { list: [] },
  };
}

export default MyWinnings;
