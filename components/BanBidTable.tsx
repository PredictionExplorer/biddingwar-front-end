import React, { useEffect, useState } from "react";
import {
  Box,
  TableBody,
  Link,
  Typography,
  Tooltip,
  Button,
} from "@mui/material";
import {
  TablePrimaryContainer,
  TablePrimaryCell,
  TablePrimaryHead,
  TablePrimaryRow,
  TablePrimaryHeadCell,
  TablePrimary,
} from "./styled";
import { convertTimestampToDateTime } from "../utils";
import { Tr } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { CustomPagination } from "./CustomPagination";
import { AddressLink } from "./AddressLink";
import api from "../services/api";
import { useActiveWeb3React } from "../hooks/web3";

const HistoryRow = ({ history }) => {
  const { account } = useActiveWeb3React();
  const handleBan = async () => {
    const res = await api.ban_bid(history.EvtLogId, account);
    console.log(res);
  };
  const handleUnban = async () => {
    const res = await api.unban_bid(history.EvtLogId);
    console.log(res);
  };
  if (!history) {
    return <TablePrimaryRow />;
  }

  return (
    <TablePrimaryRow
      sx={{
        background:
          history.BidType === 2
            ? "rgba(0,128,128, 0.1)"
            : history.BidType === 1
            ? "rgba(128,128,128, 0.1)"
            : "rgba(0,0,0, 0.1)",
      }}
    >
      <TablePrimaryCell>
        <Link
          color="inherit"
          fontSize="inherit"
          href={`https://arbiscan.io/tx/${history.TxHash}`}
          target="__blank"
        >
          {convertTimestampToDateTime(history.TimeStamp)}
        </Link>
      </TablePrimaryCell>
      <TablePrimaryCell align="center">
        <AddressLink
          address={history.BidderAddr}
          url={`/url/${history.BidderAddr}`}
        />
      </TablePrimaryCell>
      <TablePrimaryCell align="center">
        <Link
          color="inherit"
          fontSize="inherit"
          href={`/prize/${history.RoundNum}`}
          target="__blank"
        >
          {history.RoundNum}
        </Link>
      </TablePrimaryCell>
      <TablePrimaryCell align="center">
        {history.BidType === 2
          ? "CST Bid"
          : history.BidType === 1
          ? "RWLK Token Bid"
          : "ETH Bid"}
      </TablePrimaryCell>
      <TablePrimaryCell>
        <Link
          sx={{ textDecoration: "none", color: "inherit", fontSize: "inherit" }}
        >
          <Tooltip title={history.Message}>
            <Typography
              sx={{
                fontSize: "inherit !important",
                maxWidth: "180px",
                overflow: "hidden",
                whiteSpace: "nowrap",
                display: "inline-block",
                textOverflow: "ellipsis",
                lineHeight: 1,
              }}
              component="span"
            >
              {history.Message}
            </Typography>
          </Tooltip>
        </Link>
      </TablePrimaryCell>
      <TablePrimaryCell align="center">
        <Button size="small" onClick={handleBan}>
          Ban
        </Button>
      </TablePrimaryCell>
    </TablePrimaryRow>
  );
};

const HistoryTable = ({ biddingHistory, perPage, curPage }) => {
  useEffect(() => {
    const fetchData = async () => {
      const bids = await api.get_banned_bids();
      console.log(bids);
    };
    fetchData();
  }, []);

  return (
    <TablePrimaryContainer>
      <TablePrimary>
        <TablePrimaryHead>
          <Tr>
            <TablePrimaryHeadCell align="left">Date</TablePrimaryHeadCell>
            <TablePrimaryHeadCell>Bidder</TablePrimaryHeadCell>
            <TablePrimaryHeadCell>Round</TablePrimaryHeadCell>
            <TablePrimaryHeadCell>Bid Type</TablePrimaryHeadCell>
            <TablePrimaryHeadCell align="left">Message</TablePrimaryHeadCell>
            <TablePrimaryHeadCell />
          </Tr>
        </TablePrimaryHead>
        <TableBody>
          {biddingHistory
            .slice((curPage - 1) * perPage, curPage * perPage)
            .map((history) => (
              <HistoryRow history={history} key={history.EvtLogId} />
            ))}
        </TableBody>
      </TablePrimary>
    </TablePrimaryContainer>
  );
};

const BanBidTable = ({ biddingHistory }) => {
  const perPage = 5;
  const [curPage, setCurrentPage] = useState(1);

  return (
    <Box mt={2}>
      {biddingHistory.length > 0 ? (
        <>
          <HistoryTable
            biddingHistory={biddingHistory}
            perPage={perPage}
            curPage={curPage}
          />
          <CustomPagination
            page={curPage}
            setPage={setCurrentPage}
            totalLength={biddingHistory.length}
            perPage={perPage}
          />
        </>
      ) : (
        <Typography>No bid history yet.</Typography>
      )}
    </Box>
  );
};

export default BanBidTable;
