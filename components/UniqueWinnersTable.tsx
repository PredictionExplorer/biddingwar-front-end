import React, { useState } from "react";
import {
  Box,
  Link,
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
} from "./styled";

const UniqueWinnersRow = ({ winner }) => {
  if (!winner) {
    return <TablePrimaryRow></TablePrimaryRow>;
  }

  return (
    <TablePrimaryRow>
      <TablePrimaryCell>
        <Link
          href={`/user/${winner.WinnerAddr}`}
          style={{ color: "rgba(255, 255, 255, 0.68)", fontSize: 14 }}
        >
          {winner.WinnerAddr}
        </Link>
      </TablePrimaryCell>
      <TablePrimaryCell>{winner.PrizesCount}</TablePrimaryCell>
      <TablePrimaryCell>{winner.MaxWinAmountEth.toFixed(6)}</TablePrimaryCell>
      <TablePrimaryCell>{winner.PrizesSum.toFixed(6)}</TablePrimaryCell>
    </TablePrimaryRow>
  );
};

export const UniqueWinnersTable = ({ list }) => {
  const perPage = 5;
  const [page, setPage] = useState(1);
  return (
    <>
      <TablePrimaryContainer>
        <Table>
          <TablePrimaryHead>
            <TableRow>
              <TableCell>Winner Address</TableCell>
              <TableCell>Prizes Taken</TableCell>
              <TableCell>Max Prize</TableCell>
              <TableCell>Prizes sum (ETH)</TableCell>
            </TableRow>
          </TablePrimaryHead>
          <TableBody>
            {list.length > 0 ? (
              list
                .slice((page - 1) * perPage, page * perPage)
                .map((winner) => (
                  <UniqueWinnersRow winner={winner} key={winner.WinnerAid} />
                ))
            ) : (
              <TableRow>
                <TablePrimaryCell align="center" colSpan={3}>
                  No bidders yet.
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