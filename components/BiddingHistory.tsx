import React from "react";
import {
  Box,
  Table,
  TableRow,
  TableBody,
  Link,
  TableCell,
} from "@mui/material";
import {
  TablePrimaryContainer,
  TablePrimaryCell,
  TablePrimaryHead,
  TablePrimaryRow,
} from "./styled";
import Pagination from "@mui/material/Pagination";
import { useRouter } from "next/router";

const HistoryRow = ({ history }) => {
  const convertTimestampToDateTime = (timestamp: any) => {
    var date_ob = new Date(timestamp * 1000);
    var year = date_ob.getFullYear();
    var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    var date = ("0" + date_ob.getDate()).slice(-2);
    var hours = ("0" + date_ob.getHours()).slice(-2);
    var minutes = ("0" + date_ob.getMinutes()).slice(-2);
    var seconds = ("0" + date_ob.getSeconds()).slice(-2);
    var result =
      year +
      "-" +
      month +
      "-" +
      date +
      " " +
      hours +
      ":" +
      minutes +
      ":" +
      seconds;
    return result;
  };

  if (!history) {
    return <TablePrimaryRow></TablePrimaryRow>;
  }

  return (
    <TablePrimaryRow>
      <TablePrimaryCell>
        {convertTimestampToDateTime(history.TimeStamp)}
      </TablePrimaryCell>
      <TablePrimaryCell>
        <Link
          href={`/gallery?address=${history.BidderAddr}`}
          style={{ color: "rgba(255, 255, 255, 0.68)" }}
        >
          {history.BidderAddr}
        </Link>
      </TablePrimaryCell>
      <TablePrimaryCell>
        {history.BidPriceEth && `${history.BidPriceEth?.toFixed(6)}Ξ`}
      </TablePrimaryCell>
      <TablePrimaryCell>
        {history.RWalkNFTId < 0 ? "" : history.RWalkNFTId}
      </TablePrimaryCell>
      <TablePrimaryCell>
        {history.ERC20_AmountEth && history.ERC20_AmountEth?.toFixed(3)}
      </TablePrimaryCell>
      <TablePrimaryCell>{history.NFTDonationTokenAddr}</TablePrimaryCell>
      <TablePrimaryCell>
        {history.NFTDonationTokenId < 0 ? "" : history.NFTDonationTokenId}
      </TablePrimaryCell>
    </TablePrimaryRow>
  );
};

const HistoryTable = ({ biddingHistory }) => {
  return (
    <TablePrimaryContainer>
      <Table>
        <TablePrimaryHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Bidder</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>RWLK ID</TableCell>
            <TableCell>ERC20 Amount</TableCell>
            <TableCell>Donated NFT Address</TableCell>
            <TableCell>Donated NFT ID</TableCell>
          </TableRow>
        </TablePrimaryHead>
        <TableBody>
          {biddingHistory.length > 0 ? (
            biddingHistory.map((history, i) => (
              <HistoryRow history={history} key={i} />
            ))
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

const BiddingHistory = ({ curPage, biddingHistory, totalCount }) => {
  const perPage = 20;
  const router = useRouter();
  const handleNextPage = (page) => {
    router.query["page"] = page;
    router.push({ pathname: router.pathname, query: router.query });
  };

  return (
    <Box mt={4}>
      <HistoryTable biddingHistory={biddingHistory} />
      <Box display="flex" justifyContent="center" mt={4}>
        <Pagination
          color="primary"
          page={parseInt(curPage)}
          onChange={(e, page) => handleNextPage(page)}
          count={Math.ceil(totalCount / perPage)}
          showFirstButton
          showLastButton
        />
      </Box>
    </Box>
  );
};

export default BiddingHistory;
