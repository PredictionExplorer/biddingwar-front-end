import React, { useState } from "react";
import {
  Box,
  Table,
  TableRow,
  TableBody,
  TableCell,
  Typography,
  Link,
} from "@mui/material";
import {
  TablePrimaryContainer,
  TablePrimaryCell,
  TablePrimaryHead,
  TablePrimaryRow,
} from "./styled";
import Pagination from "@mui/material/Pagination";

const convertTimestampToDateTime = (timestamp: any) => {
  var date_ob = new Date(timestamp * 1000);
  var year = date_ob.getFullYear();
  var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  var date = ("0" + date_ob.getDate()).slice(-2);
  var hours = ("0" + date_ob.getHours()).slice(-2);
  var minutes = ("0" + date_ob.getMinutes()).slice(-2);
  var seconds = ("0" + date_ob.getSeconds()).slice(-2);
  var result = `${month}/${date}/${year} ${hours}:${minutes}:${seconds}`;
  return result;
};

const HistoryRow = ({ history }) => {
  if (!history) {
    return <TablePrimaryRow></TablePrimaryRow>;
  }

  return (
    <TablePrimaryRow>
      <TablePrimaryCell>
        {history.RecordType === 0
          ? "ETH Deposit"
          : history.RecordType === 1
          ? "Cosmic Signature token"
          : "Donated NFT"}
      </TablePrimaryCell>
      <TablePrimaryCell>
        {convertTimestampToDateTime(history.TimeStamp)}
      </TablePrimaryCell>
      <TablePrimaryCell align="center">{history.RoundNum}</TablePrimaryCell>
      <TablePrimaryCell align="right">
        {history.AmountEth.toFixed(4)}
      </TablePrimaryCell>
      <TablePrimaryCell>{history.TokenAddress}</TablePrimaryCell>
      <TablePrimaryCell align="right">
        {history.TokenId >= 0 &&
          (history.RecordType === 1 ? (
            <Link
              href={`/detail/${history.TokenId}`}
              sx={{
                textDecoration: "none",
                fontSize: "inherit",
                color: "inherit",
              }}
            >
              {history.TokenId}
            </Link>
          ) : (
            history.TokenId
          ))}
      </TablePrimaryCell>
      <TablePrimaryCell align="right">
        {history.WinnerIndex >= 0 && history.WinnerIndex}
      </TablePrimaryCell>
    </TablePrimaryRow>
  );
};

const HistoryTable = ({ winningHistory, perPage, curPage }) => {
  return (
    <TablePrimaryContainer>
      <Table>
        <TablePrimaryHead>
          <TableRow>
            <TableCell>Record Type</TableCell>
            <TableCell>Datetime</TableCell>
            <TableCell align="center">Round</TableCell>
            <TableCell align="right">Amount (ETH)</TableCell>
            <TableCell>Token Address</TableCell>
            <TableCell align="right">Token ID</TableCell>
            <TableCell align="right">Position</TableCell>
          </TableRow>
        </TablePrimaryHead>
        <TableBody>
          {winningHistory
            .slice((curPage - 1) * perPage, curPage * perPage)
            .map((history, i) => (
              <HistoryRow history={history} key={i} />
            ))}
        </TableBody>
      </Table>
    </TablePrimaryContainer>
  );
};

const WinningHistoryTable = ({ winningHistory }) => {
  const perPage = 5;
  const [curPage, setCurrentPage] = useState(1);
  if (winningHistory.length === 0) {
    return <Typography>No history yet.</Typography>;
  }
  return (
    <Box mt={2}>
      <HistoryTable
        winningHistory={winningHistory}
        perPage={perPage}
        curPage={curPage}
      />
      <Box display="flex" justifyContent="center" mt={4}>
        <Pagination
          color="primary"
          page={curPage}
          onChange={(e, page) => setCurrentPage(page)}
          count={Math.ceil(winningHistory.length / perPage)}
          hideNextButton
          hidePrevButton
          shape="rounded"
        />
      </Box>
    </Box>
  );
};

export default WinningHistoryTable;
