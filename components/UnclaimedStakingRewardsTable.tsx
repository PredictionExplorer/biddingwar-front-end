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
} from "./styled";
import { convertTimestampToDateTime } from "../utils";

const UnclaimedStakingRewardsRow = ({ row }) => {
  if (!row) {
    return <TablePrimaryRow></TablePrimaryRow>;
  }

  return (
    <TablePrimaryRow>
      <TablePrimaryCell>
        {convertTimestampToDateTime(row.TimeStamp)}
      </TablePrimaryCell>
      <TablePrimaryCell align="right">
        {row.DepositAmountEth.toFixed(6)}
      </TablePrimaryCell>
      <TablePrimaryCell align="center">{row.NumStakedNFTs}</TablePrimaryCell>
      <TablePrimaryCell align="right">
        {row.AmountPerTokenEth.toFixed(6)}
      </TablePrimaryCell>
      <TablePrimaryCell align="right">
        {row.YourClaimableAmountEth.toFixed(6)}
      </TablePrimaryCell>
      <TablePrimaryCell align="right">{row.YourTokensStaked}</TablePrimaryCell>
    </TablePrimaryRow>
  );
};

export const UnclaimedStakingRewardsTable = ({ list }) => {
  const perPage = 5;
  const [page, setPage] = useState(1);
  if (list.length === 0) {
    return <Typography>No rewards yet.</Typography>;
  }
  return (
    <>
      <TablePrimaryContainer>
        <Table>
          <colgroup>
            <col width="15%" />
            <col width="14%" />
            <col width="18%" />
            <col width="15%" />
            <col width="19%" />
            <col width="17%" />
          </colgroup>
          <TablePrimaryHead>
            <TableRow>
              <TableCell>Datetime</TableCell>
              <TableCell align="right">Deposit Amount</TableCell>
              <TableCell align="center">Total Staked Tokens by all the Users</TableCell>
              <TableCell align="right">Reward Per Token</TableCell>
              <TableCell align="right">Your Claimable Amount</TableCell>
              <TableCell align="right">Your Staked Tokens</TableCell>
            </TableRow>
          </TablePrimaryHead>
          <TableBody>
            {list
              .slice((page - 1) * perPage, page * perPage)
              .map((row, index) => (
                <UnclaimedStakingRewardsRow row={row} key={index} />
              ))}
          </TableBody>
        </Table>
      </TablePrimaryContainer>
      <Box display="flex" justifyContent="center" mt={4}>
        <Pagination
          color="primary"
          page={page}
          onChange={(_e, page) => setPage(page)}
          count={Math.ceil(list.length / perPage)}
          hideNextButton
          hidePrevButton
          shape="rounded"
        />
      </Box>
    </>
  );
};
