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
import { ClaimableNFTTable } from "../components/ClaimableNFTTable";
import { useActiveWeb3React } from "../hooks/web3";
import WinningHistoryTable from "../components/WinningHistoryTable";
import useCosmicGameContract from "../hooks/useCosmicGameContract";
import useRaffleWalletContract from "../hooks/useRaffleWalletContract";
import router from "next/router";

const MyWinningsRow = ({ winning }) => {
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
    </TablePrimaryRow>
  );
};

const MyWinningsTable = ({ list }) => {
  return (
    <TablePrimaryContainer>
      <Table>
        <TablePrimaryHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Round</TableCell>
            <TableCell>Amount (ETH)</TableCell>
          </TableRow>
        </TablePrimaryHead>
        <TableBody>
          {list.length > 0 ? (
            list.map((winning, i) => (
              <MyWinningsRow key={i} winning={winning} />
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
  const [curPage, setCurPage] = useState(1);
  const [status, setStatus] = useState({
    ETHRaffleToClaim: 0,
    ETHRaffleToClaimWei: 0,
    NumDonatedNFTToClaim: 0,
  });
  const perPage = 5;
  const [donatedNFTToClaim, setDonatedNFTToClaim] = useState([]);
  const [raffleETHToClaim, setRaffleETHToClaim] = useState([]);
  const [claimHistory, setClaimHistory] = useState([]);
  const [isClaiming, setIsClaiming] = useState({
    donatedNFT: false,
    raffleETH: false,
  });

  const cosmicGameContract = useCosmicGameContract();
  const raffleWalletContract = useRaffleWalletContract();

  const handleAllETHClaim = async () => {
    try {
      setIsClaiming({
        ...isClaiming,
        raffleETH: true,
      });
      const res = await raffleWalletContract.withdraw();
      console.log(res);
      setTimeout(() => {
        router.reload();
      }, 4000);
    } catch (err) {
      console.log(err);
      setIsClaiming({
        ...isClaiming,
        raffleETH: false,
      });
    }
  };
  const handleDonatedNFTsClaim = async (e, tokenID) => {
    try {
      e.target.disabled = true;
      e.target.classList.add('.Mui-disabled');
      const res = await cosmicGameContract.claimDonatedNFT(tokenID);
      console.log(res);
      setTimeout(() => {
        router.reload();
      }, 4000);
    } catch (err) {
      console.log(err);
      e.target.disabled = false;
      e.target.classList.remove('Mui-disabled');
    }
  };
  const handleAllDonatedNFTsClaim = async () => {
    try {
      setIsClaiming({
        ...isClaiming,
        donatedNFT: true,
      });
      const indexList = donatedNFTToClaim.map((item) => item.Index);
      const res = await cosmicGameContract.claimManyDonatedNFTs(indexList);
      console.log(res);
      setTimeout(() => {
        router.reload();
      }, 4000);
    } catch (err) {
      console.log(err);
      setIsClaiming({
        ...isClaiming,
        donatedNFT: false,
      });
    }
  };

  useEffect(() => {
    const fetchNotification = async () => {
      const res = await fetch(`/api/notifRedBox/?address=${account}`);
      const notify = await res.json();
      setStatus(notify);
    };
    const fetchClaimHistory = async () => {
      const res = await fetch(`/api/claimHistory/?address=${account}`);
      const history = await res.json();
      setClaimHistory(history);
    };
    const interval = setInterval(() => {
      fetchNotification();
    }, 30000);

    fetchNotification();
    fetchClaimHistory();
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const fetchUnclaimedDonatedNFTs = async () => {
      const res = await fetch(
        `/api/unclaimedDonatedNftByUser/?address=${account}`
      );
      const nfts = await res.json();
      setDonatedNFTToClaim(nfts);
    };
    const fetchUnclaimedRaffleETHDeposits = async () => {
      const res = await fetch(
        `/api/unclaimedRaffleDepositsByUser/?address=${account}`
      );
      const deposits = await res.json();
      setRaffleETHToClaim(deposits);
    };
    if (status.NumDonatedNFTToClaim > 0) {
      fetchUnclaimedDonatedNFTs();
    }
    if (status.ETHRaffleToClaim > 0) {
      fetchUnclaimedRaffleETHDeposits();
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
                `(${status.ETHRaffleToClaim.toFixed(6)} ETH)`}
            </Typography>
            {status.ETHRaffleToClaim > 0 && (
              <Button
                onClick={handleAllETHClaim}
                variant="contained"
                disabled={isClaiming.raffleETH}
              >
                Claim All
              </Button>
            )}
          </Box>
          <MyWinningsTable list={raffleETHToClaim} />
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
            {donatedNFTToClaim.length > 0 && (
              <Button
                onClick={handleAllDonatedNFTsClaim}
                variant="contained"
                disabled={isClaiming.donatedNFT}
              >
                Claim All
              </Button>
            )}
          </Box>
          <ClaimableNFTTable
            list={donatedNFTToClaim}
            handleClaim={handleDonatedNFTsClaim}
          />
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
