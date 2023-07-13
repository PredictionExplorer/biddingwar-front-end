import React, { useState } from "react";
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  Box,
  Pagination,
  Link,
} from "@mui/material";
import {
  TablePrimaryContainer,
  TablePrimaryCell,
  TablePrimaryHead,
  TablePrimaryRow,
} from "./styled";
import { convertTimestampToDateTime, shortenHex } from "../utils";

const WinnerRow = ({ winner, type }) => {
  if (!winner) {
    return <TablePrimaryRow></TablePrimaryRow>;
  }

  return (
    <TablePrimaryRow>
      <TablePrimaryCell>
        {convertTimestampToDateTime(winner.TimeStamp)}
      </TablePrimaryCell>
      <TablePrimaryCell>
        <Link
          href={`/user/${winner.WinnerAddr}`}
          style={{ color: "rgba(255, 255, 255, 0.68)", fontSize: 14 }}
        >
          {shortenHex(winner.WinnerAddr, 6)}
        </Link>
      </TablePrimaryCell>
      <TablePrimaryCell>{winner.RoundNum}</TablePrimaryCell>
      <TablePrimaryCell>{type}</TablePrimaryCell>
      <TablePrimaryCell>
        {winner.Amount ? `${winner.Amount.toFixed(4)}Ξ` : ""}
      </TablePrimaryCell>
    </TablePrimaryRow>
  );
};

const RaffleWinnerTable = ({ RaffleETHDeposits, RaffleNFTWinners }) => {
  const perPage = 5;
  const list = [...RaffleETHDeposits, ...RaffleNFTWinners];
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
              <TableCell>Type</TableCell>
              <TableCell>Amount</TableCell>
            </TableRow>
          </TablePrimaryHead>
          <TableBody>
            {list.length > 0 ? (
              <>
                {list
                  .slice((page - 1) * perPage, page * perPage)
                  .map((winner, i) => (
                    <WinnerRow
                      key={winner.EvtLogId}
                      winner={winner}
                      type={
                        winner.Amount ? "ETH Deposits" : "CosmicSignature Token"
                      }
                    />
                  ))}
              </>
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

export default RaffleWinnerTable;