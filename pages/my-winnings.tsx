import React, { useEffect, useState } from "react";

import {
  Box,
  Button,
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
import api from "../services/api";
import { ClaimableNFTTable } from "../components/ClaimableNFTTable";
import { useActiveWeb3React } from "../hooks/web3";
import WinningHistoryTable from "../components/WinningHistoryTable";

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

const MyWinnings = ({ list }) => {
  const { account } = useActiveWeb3React();
  const perPage = 20;
  const [curPage, setCurPage] = useState(1);
  const [status, setStatus] = useState({
    ETHRaffleToClaim: 0,
    ETHRaffleToClaimWei: 0,
    NumDonatedNFTToClaim: 0,
  });
  const [donatedNFTToClaim, setDonatedNFTToClaim] = useState([]);
  const [claimHistory, setClaimHistory] = useState([]);

  const handleETHClaim = async (roundNum) => {};
  const handleAllETHClaim = async () => {};
  const handleAllDonatedNFTsClaim = async () => {};

  useEffect(() => {
    const fetchNotification = async () => {
      const notify = await api.get_notif_red_box(account);
      setStatus(notify);
    };
    const fetchClaimHistory = async () => {
      const history = await api.get_claim_history(account);
      setClaimHistory(history);
    };
    fetchNotification();
    fetchClaimHistory();
  }, []);

  useEffect(() => {
    const fetchUnclaimedDonatedNFTs = async () => {
      const nfts = await api.get_unclaimed_donated_nft_by_user(account);
      setDonatedNFTToClaim(nfts);
    };
    if (status.NumDonatedNFTToClaim > 0) {
      fetchUnclaimedDonatedNFTs();
    }
  }, [status]);
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
            <Typography variant="h5">
              Raffle ETH{" "}
              {status.ETHRaffleToClaim > 0 &&
                `(${status.ETHRaffleToClaim} ETH)`}
            </Typography>
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
            <Typography variant="h5">Donated NFTs</Typography>
            <Button onClick={handleAllDonatedNFTsClaim} variant="contained">
              Claim All
            </Button>
          </Box>
          <ClaimableNFTTable list={donatedNFTToClaim} />
        </Box>
        <Box mt={6}>
          <Typography variant="h5">History of Winnings</Typography>
          <WinningHistoryTable winningHistory={claimHistory} />
        </Box>
      </MainWrapper>
    </>
  );
};

export async function getServerSideProps() {
  const nfts = await api.get_cst_list();
  return {
    props: {
      list: [],
      RaffleNFTs: nfts.slice(6, 9),
      PrizeNFTs: nfts.slice(0, 3),
    },
  };
}

export default MyWinnings;
