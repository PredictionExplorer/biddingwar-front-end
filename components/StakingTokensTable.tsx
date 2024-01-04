import React, { useState } from "react";
import {
  Box,
  Button,
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
import useStakingWalletContract from "../hooks/useStakingWalletContract";

const StakingTokensRow = ({ row, handleStake, handleUnstake }) => {
  if (!row) {
    return <TablePrimaryRow></TablePrimaryRow>;
  }

  return (
    <TablePrimaryRow>
      <TablePrimaryCell>
        {convertTimestampToDateTime(row.TimeStamp)}
      </TablePrimaryCell>
      <TablePrimaryCell align="center">
        {row.ActionType === 1 ? "Stake" : "Unstake"}
      </TablePrimaryCell>
      <TablePrimaryCell align="center">{row.TokenId}</TablePrimaryCell>
      <TablePrimaryCell>
        {row.ActionType === 0 &&
          convertTimestampToDateTime(row.UnstakeTimeStamp)}
      </TablePrimaryCell>
      <TablePrimaryCell align="center">
        {row.ActionType === 0 ? (
          <Button variant="text" onClick={() => handleStake(row.TokenId)}>
            Stake
          </Button>
        ) : (
          <Button variant="text" onClick={() => handleUnstake(row.TokenId)}>
            Unstake
          </Button>
        )}
      </TablePrimaryCell>
    </TablePrimaryRow>
  );
};

export const StakingTokensTable = ({ list }) => {
  const perPage = 5;
  const [page, setPage] = useState(1);
  const stakingContract = useStakingWalletContract();
  const handleStake = async (tokenId) => {
    const res = await stakingContract.stake(tokenId).then((tx) => tx.wait());
    console.log(res);
  };
  const handleUnstake = async (tokenId) => {
    const res = await stakingContract.unstake(tokenId).then((tx) => tx.wait());
    console.log(res);
  };
  if (list.length === 0) {
    return <Typography>No tokens yet.</Typography>;
  }
  return (
    <>
      <TablePrimaryContainer>
        <Table>
          <colgroup>
            <col width="20%" />
            <col width="20%" />
            <col width="20%" />
            <col width="20%" />
            <col width="20%" />
          </colgroup>
          <TablePrimaryHead>
            <TableRow>
              <TableCell>Datetime</TableCell>
              <TableCell align="center">Action Type</TableCell>
              <TableCell align="center">Token ID</TableCell>
              <TableCell>Unstake Datetime</TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
          </TablePrimaryHead>
          <TableBody>
            {list.slice((page - 1) * perPage, page * perPage).map((row) => (
              <StakingTokensRow
                key={row.EvtLogId}
                row={row}
                handleStake={handleStake}
                handleUnstake={handleUnstake}
              />
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
