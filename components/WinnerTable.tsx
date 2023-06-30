import React from "react";
import { Box, Table, TableRow, TableBody, TableCell } from "@mui/material";
import {
  TablePrimaryContainer,
  TablePrimaryCell,
  TablePrimaryHead,
  TablePrimaryRow,
} from "./styled";

const WinnerRow = ({ winner, type }) => {
  if (!winner) {
    return <TablePrimaryRow></TablePrimaryRow>;
  }

  return (
    <TablePrimaryRow>
      <TablePrimaryCell>{winner.WinnerAddr}</TablePrimaryCell>
      <TablePrimaryCell>{type}</TablePrimaryCell>
      <TablePrimaryCell>
        {winner.Amount ? `${winner.Amount.toFixed(2)}Ξ` : ""}
      </TablePrimaryCell>
    </TablePrimaryRow>
  );
};

const WinnerTable = ({ RaffleETHDeposits, RaffleNFTWinners }) => {
  return (
    <TablePrimaryContainer>
      <Table>
        <TablePrimaryHead>
          <TableRow>
            <TableCell>Winner</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Amount</TableCell>
          </TableRow>
        </TablePrimaryHead>
        <TableBody>
          {RaffleETHDeposits.length > 0 || RaffleNFTWinners.length > 0 ? (
            <>
              {RaffleETHDeposits.map((winner, i) => (
                <WinnerRow
                  key={winner.EvtLogId}
                  winner={winner}
                  type="ETH Deposits"
                />
              ))}
              {RaffleNFTWinners.map((winner, i) => (
                <WinnerRow
                  key={winner.EvtLogId}
                  winner={winner}
                  type="CosmicSignature Token"
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
  );
};

export default WinnerTable;
