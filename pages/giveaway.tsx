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
} from "../components/styled";
import { useRouter } from "next/router";
import { GetServerSidePropsContext } from "next";

const GivewayRow = ({ minter }) => {
  if (!minter) {
    return <TablePrimaryRow></TablePrimaryRow>;
  }

  return (
    <TablePrimaryRow>
      <TablePrimaryCell>{minter.address}</TablePrimaryCell>
      <TablePrimaryCell>{minter.owner}</TablePrimaryCell>
      <TablePrimaryCell>{minter.tokenId}</TablePrimaryCell>
    </TablePrimaryRow>
  );
};

const GiveawayTable = ({ list }) => {
  return (
    <TablePrimaryContainer>
      <Table>
        <TablePrimaryHead>
          <TableRow>
            <TableCell>Name/Symbol</TableCell>
            <TableCell>Owner</TableCell>
            <TableCell>Token</TableCell>
          </TableRow>
        </TablePrimaryHead>
        <TableBody>
          {list.length > 0 ? (
            list.map((minter, i) => <GivewayRow minter={minter} key={i} />)
          ) : (
            <TableRow>
              <TablePrimaryCell align="center" colSpan={8}>
                No minters yet.
              </TablePrimaryCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TablePrimaryContainer>
  );
};
const Giveaway = ({ list, totalCount, curPage }) => {
  const perPage = 20;
  const router = useRouter();
  const handleNextPage = (page) => {
    router.query["page"] = page;
    router.push({ pathname: router.pathname, query: router.query });
  };

  return (
    <>
      <Head>
        <title>Giveaway | Cosmic Signature</title>
        <meta name="description" content="" />
      </Head>
      <MainWrapper>
        <Typography
          variant="h4"
          color="primary"
          gutterBottom
          textAlign="center"
        >
          Giveaway
        </Typography>
        <Box textAlign="center">
          <Typography fontSize={18} component="span">
            Some minters may be eligible for a giveaway. Check out our
          </Typography>
          &nbsp;
          <Typography fontSize={18} color="primary" component="span">
            Twitter Page
          </Typography>
          &nbsp;
          <Typography fontSize={18} component="span">
            for details.
          </Typography>
        </Box>
        <Box mt={6}>
          <GiveawayTable list={list} />
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
      </MainWrapper>
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const page = context.query.page ?? 1;
  return {
    props: { list: [], totalCount: 0, curPage: page },
  };
}

export default Giveaway;
