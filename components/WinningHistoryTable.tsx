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
          ? "CS NFT"
          : "Donated NFT"}
      </TablePrimaryCell>
      <TablePrimaryCell>
        {convertTimestampToDateTime(history.TimeStamp)}
      </TablePrimaryCell>
      <TablePrimaryCell>{history.RoundNum}</TablePrimaryCell>
      <TablePrimaryCell>{history.AmountEth.toFixed(4)}</TablePrimaryCell>
      <TablePrimaryCell>{history.TokenAddress}</TablePrimaryCell>
      <TablePrimaryCell>
        {history.TokenId >= 0 && history.TokenId}
      </TablePrimaryCell>
      <TablePrimaryCell>
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
            <TableCell>Round</TableCell>
            <TableCell>Amount (ETH)</TableCell>
            <TableCell>Token Address</TableCell>
            <TableCell>Token ID</TableCell>
            <TableCell>Winner Index</TableCell>
          </TableRow>
        </TablePrimaryHead>
        <TableBody>
          {winningHistory.length > 0 ? (
            winningHistory
              .slice((curPage - 1) * perPage, curPage * perPage)
              .map((history, i) => <HistoryRow history={history} key={i} />)
          ) : (
            <TableRow>
              <TablePrimaryCell align="center" colSpan={7}>
                No history yet.
              </TablePrimaryCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TablePrimaryContainer>
  );
};

const WinningHistoryTable = ({ winningHistory }) => {
  const perPage = 5;
  const [curPage, setCurrentPage] = useState(1);

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
