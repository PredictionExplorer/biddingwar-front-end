import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Link,
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
import { useActiveWeb3React } from "../hooks/web3";
import useRaffleWalletContract from "../hooks/useRaffleWalletContract";
import router from "next/router";
import { useApiData } from "../contexts/ApiDataContext";
import useCosmicGameContract from "../hooks/useCosmicGameContract";
import { DonatedNFTTable } from "../components/DonatedNFTTable";

const MyWinningsRow = ({ winning }) => {
  if (!winning) {
    return <TablePrimaryRow></TablePrimaryRow>;
  }

  return (
    <TablePrimaryRow>
      <TablePrimaryCell>
        {convertTimestampToDateTime(winning.TimeStamp)}
      </TablePrimaryCell>
      <TablePrimaryCell align="center">{winning.RoundNum}</TablePrimaryCell>
      <TablePrimaryCell align="right">
        {winning.Amount.toFixed(4)}
      </TablePrimaryCell>
    </TablePrimaryRow>
  );
};

const MyWinningsTable = ({ list }) => {
  const perPage = 5;
  const [curPage, setCurPage] = useState(1);
  return (
    <>
      <TablePrimaryContainer>
        <Table>
          <TablePrimaryHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell align="center">Round</TableCell>
              <TableCell align="right">Amount (ETH)</TableCell>
            </TableRow>
          </TablePrimaryHead>
          <TableBody>
            {list
              .slice((curPage - 1) * perPage, curPage * perPage)
              .map((winning) => (
                <MyWinningsRow key={winning.EvtLogId} winning={winning} />
              ))}
          </TableBody>
        </Table>
      </TablePrimaryContainer>
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
    </>
  );
};

const RaffleNFTRow = ({ nft }) => {
  if (!nft) {
    return <TablePrimaryRow></TablePrimaryRow>;
  }

  return (
    <TablePrimaryRow>
      <TablePrimaryCell>
        {convertTimestampToDateTime(nft.TimeStamp)}
      </TablePrimaryCell>
      <TablePrimaryCell align="center">
        <Link
          href={`/user/${nft.WinnerAddr}`}
          style={{ color: "rgba(255, 255, 255, 0.68)", fontSize: 14 }}
        >
          {nft.WinnerAddr}
        </Link>
      </TablePrimaryCell>
      <TablePrimaryCell align="center">
        <Link
          href={`/detail/${nft.TokenId}`}
          style={{ color: "rgba(255, 255, 255, 0.68)", fontSize: 14 }}
        >
          {nft.TokenId}
        </Link>
      </TablePrimaryCell>
      <TablePrimaryCell align="right">
        {nft.PrizeNum > -1 && (
          <Link
            href={`/prize/${nft.PrizeNum}`}
            style={{ color: "rgba(255, 255, 255, 0.68)", fontSize: 14 }}
          >
            {nft.PrizeNum}
          </Link>
        )}
      </TablePrimaryCell>
    </TablePrimaryRow>
  );
};

const RaffleNFTTable = ({ list }) => {
  const perPage = 5;
  const [curPage, setCurPage] = useState(1);
  if (list.length === 0) {
    return <Typography>No winnings yet.</Typography>;
  }

  return (
    <>
      <TablePrimaryContainer>
        <Table>
          <TablePrimaryHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell align="center">Winner Address</TableCell>
              <TableCell align="center">Token ID</TableCell>
              <TableCell align="right">Prize Num</TableCell>
            </TableRow>
          </TablePrimaryHead>
          <TableBody>
            {list
              .slice((curPage - 1) * perPage, curPage * perPage)
              .map((nft) => (
                <RaffleNFTRow key={nft.EvtLogId} nft={nft} />
              ))}
          </TableBody>
        </Table>
      </TablePrimaryContainer>
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
    </>
  );
};

const MyWallet = () => {
  const { account } = useActiveWeb3React();
  const { apiData: status } = useApiData();
  const [raffleETHToClaim, setRaffleETHToClaim] = useState([]);
  const [CSTList, setCSTList] = useState([]);
  const [claimedDonatedNFTs, setClaimedDonatedNFTs] = useState([]);
  const [unclaimedDonatedNFTs, setUnclaimedDonatedNFTs] = useState([]);
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
      e.target.classList.add("Mui-disabled");
      const res = await cosmicGameContract.claimDonatedNFT(tokenID);
      console.log(res);
      setTimeout(() => {
        router.reload();
      }, 4000);
    } catch (err) {
      console.log(err);
      e.target.disabled = false;
      e.target.classList.remove("Mui-disabled");
    }
  };

  const handleAllDonatedNFTsClaim = async () => {
    try {
      setIsClaiming({
        ...isClaiming,
        donatedNFT: true,
      });
      const indexList = unclaimedDonatedNFTs.map((item) => item.Index);
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
    const fetchRaffleETHDeposits = async () => {
      const res = await fetch(
        `/api/raffleETHDepositsByUser/?address=${account}`
      );
      let deposits = await res.json();
      deposits = deposits.sort((a, b) => b.TimeStamp - a.TimeStamp);
      setRaffleETHToClaim(deposits);
    };
    const fetchCSTList = async () => {
      const res = await fetch(`/api/cstListByUser/?address=${account}`);
      let cstList = await res.json();
      setCSTList(cstList);
    };
    const fetchClaimedDonatedNFTs = async () => {
      const res = await fetch(
        `/api/claimedDonatedNftByUser/?address=${account}`
      );
      let list = await res.json();
      setClaimedDonatedNFTs(list);
    };
    const fetchUnclaimedDonatedNFTs = async () => {
      const res = await fetch(
        `/api/unclaimedDonatedNftByUser/?address=${account}`
      );
      let list = await res.json();
      setUnclaimedDonatedNFTs(list);
    };
    fetchRaffleETHDeposits();
    fetchCSTList();
    fetchClaimedDonatedNFTs();
    fetchUnclaimedDonatedNFTs();
  }, [status]);

  return (
    <>
      <Head>
        <title>My Wallet | Cosmic Signature</title>
        <meta name="description" content="" />
      </Head>
      <MainWrapper>
        <Typography
          variant="h4"
          color="primary"
          gutterBottom
          textAlign="center"
        >
          My Wallet
        </Typography>
        <Box mt={6}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h5">Raffle ETH</Typography>
            {status.ETHRaffleToClaim > 0 && (
              <Box>
                <Typography component="span" mr={2}>
                  Your claimable winnings are{" "}
                  {`${status.ETHRaffleToClaim.toFixed(6)} ETH`}
                </Typography>
                <Button
                  onClick={handleAllETHClaim}
                  variant="contained"
                  disabled={isClaiming.raffleETH}
                >
                  Claim All
                </Button>
              </Box>
            )}
          </Box>
          <MyWinningsTable list={raffleETHToClaim} />
        </Box>
        <Box mt={6}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h5">Raffle NFTs</Typography>
            {status.NumDonatedNFTToClaim > 0 && (
              <Button
                onClick={handleAllDonatedNFTsClaim}
                variant="contained"
                disabled={isClaiming.donatedNFT}
              >
                Claim All
              </Button>
            )}
          </Box>
          <RaffleNFTTable list={CSTList} />
        </Box>
        <Box mt={6}>
          <Typography variant="h5" mb={2}>
            Donated NFTs
          </Typography>
          <DonatedNFTTable
            list={[...unclaimedDonatedNFTs, ...claimedDonatedNFTs]}
            handleClaim={handleDonatedNFTsClaim}
          />
        </Box>
      </MainWrapper>
    </>
  );
};

export default MyWallet;
