import React, { useState } from "react";
import {
  Box,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import {
  TablePrimaryCell,
  TablePrimaryContainer,
  TablePrimaryHead,
  TablePrimaryRow,
} from "../components/styled";
import { convertTimestampToDateTime, shortenHex } from "../utils";
import { useRouter } from "next/router";

const PrizeRow = ({ prize }) => {
  const router = useRouter();
  if (!prize) {
    return <TablePrimaryRow></TablePrimaryRow>;
  }

  return (
    <TablePrimaryRow
      sx={{ cursor: "pointer" }}
      onClick={() => {
        router.push(`/prize/${prize.PrizeNum}`);
      }}
    >
      <TablePrimaryCell>
        {convertTimestampToDateTime(prize.TimeStamp)}
      </TablePrimaryCell>
      <TablePrimaryCell>{shortenHex(prize.WinnerAddr, 6)}</TablePrimaryCell>
      <TablePrimaryCell align="center">{prize.PrizeNum}</TablePrimaryCell>
      <TablePrimaryCell>{prize.AmountEth.toFixed(4)} ETH</TablePrimaryCell>
      <TablePrimaryCell align="center">{prize.RoundStats.TotalBids}</TablePrimaryCell>
      <TablePrimaryCell align="center">{prize.RoundStats.TotalDonatedNFTs}</TablePrimaryCell>
      <TablePrimaryCell>
        {prize.RoundStats.TotalRaffleEthDepositsEth.toFixed(4)} ETH
      </TablePrimaryCell>
      <TablePrimaryCell align="right">{prize.RoundStats.TotalRaffleNFTs}</TablePrimaryCell>
    </TablePrimaryRow>
  );
};

export const PrizeTable = ({ list }) => {
  const perPage = 5;
  const [page, setPage] = useState(1);
  if (list.length === 0) {
    return <Typography>No winners yet.</Typography>;
  }
  return (
    <>
      <TablePrimaryContainer>
        <Table>
          <TablePrimaryHead>
            <TableRow>
              <TableCell>Datetime</TableCell>
              <TableCell>Winner</TableCell>
              <TableCell align="center">Round #</TableCell>
              <TableCell>Prize Amount</TableCell>
              <TableCell align="center">Bids</TableCell>
              <TableCell align="center">Donated NFTs</TableCell>
              <TableCell>Raffle Deposits</TableCell>
              <TableCell align="right">Raffle NFTs</TableCell>
            </TableRow>
          </TablePrimaryHead>
          <TableBody>
            {list.slice((page - 1) * perPage, page * perPage).map((prize) => (
              <PrizeRow prize={prize} key={prize.EvtLogId} />
            ))}
          </TableBody>
        </Table>
      </TablePrimaryContainer>
      <Box display="flex" justifyContent="center" mt={4}>
        <Pagination
          color="primary"
          page={page}
          onChange={(e, page) => setPage(page)}
          count={Math.ceil(list.length / perPage)}
          hideNextButton
          hidePrevButton
          shape="rounded"
        />
      </Box>
    </>
  );
};
