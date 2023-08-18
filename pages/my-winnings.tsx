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
        {convertTimestampToDateTime(winning.TimeStamp)}
      </TablePrimaryCell>
      <TablePrimaryCell>{winning.RoundNum}</TablePrimaryCell>
      <TablePrimaryCell>{winning.Amount.toFixed(4)}</TablePrimaryCell>
      <TablePrimaryCell>
        <Button onClick={() => handleETHClaim(winning.RoundNum)}>Claim</Button>
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
            <TableCell>Amount (ETH)</TableCell>
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

const MyWinnings = () => {
  const { account } = useActiveWeb3React();
  const perPage = 20;
  const [curPage, setCurPage] = useState(1);
  const [status, setStatus] = useState({
    ETHRaffleToClaim: 0,
    ETHRaffleToClaimWei: 0,
    NumDonatedNFTToClaim: 0,
  });
  const [donatedNFTToClaim, setDonatedNFTToClaim] = useState([]);
  const [raffleETHToClaim, setRaffleETHToClaim] = useState([]);
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
      const nfts = await api.get_unclaimed_donated_nft_by_user("0x70997970C51812dc3A010C7d01b50e0d17dc79C8");
      setDonatedNFTToClaim(nfts);
    };
    const fetchUnclaimedRaffleETHDeposits = async () => {
      const deposits = await api.get_unclaimed_raffle_deposits_by_user("0x70997970C51812dc3A010C7d01b50e0d17dc79C8");
      setRaffleETHToClaim(deposits);
    };
    // if (status.NumDonatedNFTToClaim > 0) {
    //   fetchUnclaimedDonatedNFTs();
    // }
    fetchUnclaimedDonatedNFTs();
    fetchUnclaimedRaffleETHDeposits();
    // if (status.ETHRaffleToClaim > 0) {
    //   fetchUnclaimedRaffleETHDeposits();
    // }
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
          <MyWinningsTable
            list={raffleETHToClaim}
            handleETHClaim={handleETHClaim}
          />
          <Box display="flex" justifyContent="center" mt={4}>
            <Pagination
              color="primary"
              page={curPage}
              onChange={(_e, page) => setCurPage(page)}
              count={Math.ceil(raffleETHToClaim.length / perPage)}
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

export default MyWinnings;
