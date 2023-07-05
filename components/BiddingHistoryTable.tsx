import React, { useState } from "react";
import {
  Box,
  Table,
  TableRow,
  TableBody,
  Link,
  TableCell,
  Typography,
} from "@mui/material";
import {
  TablePrimaryContainer,
  TablePrimaryCell,
  TablePrimaryHead,
  TablePrimaryRow,
} from "./styled";
import Pagination from "@mui/material/Pagination";
import { shortenHex, convertTimestampToDateTime } from "../utils";
import router from "next/router";

const HistoryRow = ({ history }) => {
  const [expanded, setExpanded] = useState(false);

  if (!history) {
    return <TablePrimaryRow></TablePrimaryRow>;
  }

  return (
    <TablePrimaryRow
      sx={{ cursor: "pointer" }}
      onClick={() => {
        router.push(`/bid/${history.EvtLogId}`);
      }}
    >
      <TablePrimaryCell sx={{ whiteSpace: "nowrap" }}>
        {convertTimestampToDateTime(history.TimeStamp)}
      </TablePrimaryCell>
      <TablePrimaryCell>{shortenHex(history.BidderAddr, 6)}</TablePrimaryCell>
      <TablePrimaryCell>
        {history.BidPriceEth &&
          `${
            history.BidPriceEth < 1
              ? history.BidPriceEth?.toFixed(7)
              : history.BidPriceEth?.toFixed(2)
          }Ξ`}
      </TablePrimaryCell>
      <TablePrimaryCell>
        {history.RWalkNFTId < 0 ? "" : history.RWalkNFTId}
      </TablePrimaryCell>
      <TablePrimaryCell>
        {history.NFTDonationTokenAddr
          ? shortenHex(history.NFTDonationTokenAddr)
          : ""}
      </TablePrimaryCell>
      <TablePrimaryCell>
        {history.NFTDonationTokenId < 0 ? "" : history.NFTDonationTokenId}
      </TablePrimaryCell>
      <TablePrimaryCell>
        <Link
          sx={{ textDecoration: "none", color: "rgba(255, 255, 255, 0.68)" }}
          onClick={() => setExpanded((expanded) => !expanded)}
        >
          <Typography
            sx={{
              maxWidth: expanded ? "auto" : "400px",
              overflow: "hidden",
              whiteSpace: expanded ? "normal" : "nowrap",
              display: "inline-block",
              textOverflow: "ellipsis",
            }}
            component="span"
          >
            {history.Message}
          </Typography>
        </Link>
      </TablePrimaryCell>
    </TablePrimaryRow>
  );
};

const HistoryTable = ({ biddingHistory, perPage, curPage }) => {
  return (
    <TablePrimaryContainer>
      <Table>
        <TablePrimaryHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Bidder</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>RWLK ID</TableCell>
            <TableCell>Donated NFT Address</TableCell>
            <TableCell>Donated NFT ID</TableCell>
            <TableCell>Message</TableCell>
          </TableRow>
        </TablePrimaryHead>
        <TableBody>
          {biddingHistory.length > 0 ? (
            biddingHistory
              .slice((curPage - 1) * perPage, curPage * perPage)
              .map((history, i) => <HistoryRow history={history} key={i} />)
          ) : (
            <TableRow>
              <TablePrimaryCell align="center" colSpan={8}>
                No history yet.
              </TablePrimaryCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TablePrimaryContainer>
  );
};

const BiddingHistoryTable = ({ biddingHistory }) => {
  const perPage = 5;
  const [curPage, setCurrentPage] = useState(1);

  return (
    <Box mt={4}>
      <HistoryTable
        biddingHistory={biddingHistory}
        perPage={perPage}
        curPage={curPage}
      />
      <Box display="flex" justifyContent="center" mt={4}>
        <Pagination
          color="primary"
          page={curPage}
          onChange={(e, page) => setCurrentPage(page)}
          count={Math.ceil(biddingHistory.length / perPage)}
          hideNextButton
          hidePrevButton
          shape="rounded"
        />
      </Box>
    </Box>
  );
};

export default BiddingHistoryTable;
