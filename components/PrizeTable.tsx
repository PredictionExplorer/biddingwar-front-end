import React, { useState } from "react";
import {
  Box,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableRow,
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
      <TablePrimaryCell>{prize.PrizeNum}</TablePrimaryCell>
      <TablePrimaryCell>{prize.AmountEth.toFixed(4)} ETH</TablePrimaryCell>
      <TablePrimaryCell>{prize.RoundStats.TotalBids}</TablePrimaryCell>
      <TablePrimaryCell>{prize.RoundStats.TotalDonatedNFTs}</TablePrimaryCell>
      <TablePrimaryCell>
        {prize.RoundStats.TotalRaffleEthDepositsEth.toFixed(4)} ETH
      </TablePrimaryCell>
      <TablePrimaryCell>{prize.RoundStats.TotalRaffleNFTs}</TablePrimaryCell>
    </TablePrimaryRow>
  );
};

export const PrizeTable = ({ list }) => {
  const perPage = 5;
  const [page, setPage] = useState(1);
  return (
    <>
      <TablePrimaryContainer>
        <Table>
          <TablePrimaryHead>
            <TableRow>
              <TableCell>Datetime</TableCell>
              <TableCell>Winner</TableCell>
              <TableCell>Round #</TableCell>
              <TableCell>Prize Amount</TableCell>
              <TableCell>Bids</TableCell>
              <TableCell>Donated NFTs</TableCell>
              <TableCell>Raffle Deposits</TableCell>
              <TableCell>Raffle NFTs</TableCell>
            </TableRow>
          </TablePrimaryHead>
          <TableBody>
            {list.length > 0 ? (
              list
                .slice((page - 1) * perPage, page * perPage)
                .map((prize) => <PrizeRow prize={prize} key={prize.EvtLogId} />)
            ) : (
              <TableRow>
                <TablePrimaryCell align="center" colSpan={8}>
                  No winners yet.
                </TablePrimaryCell>
              </TableRow>
            )}
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
