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
import { shortenHex } from "../utils";

const HistoryRow = ({ history }) => {
  const [expanded, setExpanded] = useState(false);
  const convertTimestampToDateTime = (timestamp: any) => {
    let month_names = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    let date_ob = new Date(timestamp * 1000);
    let month = month_names[date_ob.getMonth()];
    let date = ("0" + date_ob.getDate()).slice(-2);
    let hours = ("0" + date_ob.getHours()).slice(-2);
    let minutes = ("0" + date_ob.getMinutes()).slice(-2);
    let result = month + " " + date + ", " + hours + ":" + minutes;
    return result;
  };

  if (!history) {
    return <TablePrimaryRow></TablePrimaryRow>;
  }

  return (
    <TablePrimaryRow>
      <TablePrimaryCell sx={{ whiteSpace: "nowrap" }}>
        {convertTimestampToDateTime(history.TimeStamp)}
      </TablePrimaryCell>
      <TablePrimaryCell>
        <Link
          href={`/gallery?address=${history.BidderAddr}`}
          style={{ color: "rgba(255, 255, 255, 0.68)", fontSize: 14 }}
        >
          {shortenHex(history.BidderAddr, 6)}
        </Link>
      </TablePrimaryCell>
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
        />
      </Box>
    </Box>
  );
};

export default BiddingHistoryTable;
