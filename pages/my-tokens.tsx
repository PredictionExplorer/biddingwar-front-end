import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Box,
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
import { useRouter } from "next/router";
import { useApiData } from "../contexts/ApiDataContext";
import Fireworks, { FireworksHandlers } from "@fireworks-js/react";
import api from "../services/api";

const MyWinningsRow = ({ winning }) => {
  if (!winning) {
    return <TablePrimaryRow></TablePrimaryRow>;
  }

  return (
    <TablePrimaryRow>
      <TablePrimaryCell>
        {convertTimestampToDateTime(winning.TimeStamp)}
      </TablePrimaryCell>
      <TablePrimaryCell align="center">
        <Link
          href={`/prize/${winning.RoundNum}`}
          style={{
            color: "inherit",
            fontSize: "inherit",
          }}
          target="_blank"
        >
          {winning.RoundNum}
        </Link>
      </TablePrimaryCell>
      <TablePrimaryCell align="right">
        {winning.Amount.toFixed(4)}
      </TablePrimaryCell>
    </TablePrimaryRow>
  );
};

export const MyWinningsTable = ({ list }) => {
  const perPage = 5;
  const [curPage, setCurPage] = useState(1);
  if (list.length === 0) {
    return <Typography>No Raffle ETH yet.</Typography>;
  }
  return (
    <>
      <TablePrimaryContainer>
        <Table>
          <colgroup>
            <col width="20%" />
            <col width="60%" />
            <col width="20%" />
          </colgroup>
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
          hideNextButton
          hidePrevButton
          shape="rounded"
        />
      </Box>
    </>
  );
};

const CSTRow = ({ nft }) => {
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
          style={{
            color: "inherit",
            fontSize: "inherit",
            fontFamily: "monospace",
          }}
        >
          {nft.WinnerAddr}
        </Link>
      </TablePrimaryCell>
      <TablePrimaryCell align="center">
        <Link
          href={`/detail/${nft.TokenId}`}
          style={{ color: "inherit", fontSize: "inherit" }}
        >
          {nft.TokenId}
        </Link>
      </TablePrimaryCell>
      <TablePrimaryCell align="right">
        {nft.RecordType === 3 ? (
          <Link
            href={`/prize/${nft.RoundNum}`}
            style={{ color: "inherit", fontSize: "inherit" }}
          >
            Prize Winner (#{nft.RoundNum})
          </Link>
        ) : nft.RecordType === 4 ? (
          "Staking Deposit / Reward"
        ) : (
          "Raffle Winner"
        )}
      </TablePrimaryCell>
    </TablePrimaryRow>
  );
};

const CSTTable = ({ list }) => {
  const perPage = 5;
  const [curPage, setCurPage] = useState(1);
  if (list.length === 0) {
    return <Typography>No tokens yet.</Typography>;
  }

  return (
    <>
      <TablePrimaryContainer>
        <Table>
          <colgroup>
            <col width="15%" />
            <col width="55%" />
            <col width="10%" />
            <col width="30%" />
          </colgroup>
          <TablePrimaryHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell align="center">Winner Address</TableCell>
              <TableCell align="center">Token ID</TableCell>
              <TableCell align="right">Prize Type</TableCell>
            </TableRow>
          </TablePrimaryHead>
          <TableBody>
            {list
              .slice((curPage - 1) * perPage, curPage * perPage)
              .map((nft) => (
                <CSTRow key={nft.EvtLogId} nft={nft} />
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
          hideNextButton
          hidePrevButton
          shape="rounded"
        />
      </Box>
    </>
  );
};

const MyWallet = () => {
  const router = useRouter();
  const ref = useRef<FireworksHandlers>(null);
  const { account } = useActiveWeb3React();
  const { apiData: status } = useApiData();
  const [CSTList, setCSTList] = useState({
    data: [],
    loading: false,
  });
  const [finishFireworks, setFinishFireworks] = useState(false);

  const handleFireworksClick = () => {
    ref.current.stop();
    setFinishFireworks(true);
  };

  const fetchCSTList = async (updateStatus) => {
    setCSTList((prev) => ({ ...prev, loading: updateStatus && true }));
    let cstList = await api.get_cst_list_by_user(account);
    setCSTList({ data: cstList, loading: false });
  };
  useEffect(() => {
    fetchCSTList(false);
  }, [status]);
  useEffect(() => {
    fetchCSTList(true);
  }, []);

  return (
    <>
      <Head>
        <title>My Tokens | Cosmic Signature</title>
        <meta name="description" content="" />
      </Head>
      <MainWrapper>
        {router.query && router.query.message && (
          <>
            <Box px={8} mb={8} sx={{ zIndex: 10002, position: "relative" }}>
              <Alert
                variant="filled"
                severity="success"
                sx={{ boxShadow: "3px 3px 4px 1px #ffffff7f" }}
              >
                {router.query.message === "success"
                  ? "Congratulations! You claimed the prize successfully."
                  : ""}
              </Alert>
            </Box>
            {!finishFireworks && (
              <Fireworks
                ref={ref}
                options={{ opacity: 0.5 }}
                style={{
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  position: "fixed",
                  zIndex: 10000,
                }}
                onClick={handleFireworksClick}
              />
            )}
          </>
        )}
        <Typography
          variant="h4"
          color="primary"
          gutterBottom
          textAlign="center"
        >
          My Cosmic Signature (ERC721) Tokens
        </Typography>
        {!account ? (
          <Typography variant="subtitle1">
            Please login to Metamask to see your tokens.
          </Typography>
        ) : (
          <>
            <Box mt={6}>
              <Typography variant="h5" mb={2}>
                Cosmic Signature Tokens I Own
              </Typography>
              {CSTList.loading ? (
                <Typography variant="h6">Loading...</Typography>
              ) : (
                <CSTTable list={CSTList.data} />
              )}
            </Box>
          </>
        )}
      </MainWrapper>
    </>
  );
};

export default MyWallet;
