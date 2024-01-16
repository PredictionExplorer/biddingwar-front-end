import React, { useState } from "react";
import {
  Box,
  Button,
  Link,
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

const CSTokensRow = ({ row, handleStake, handleUnstake }) => {
  if (!row) {
    return <TablePrimaryRow></TablePrimaryRow>;
  }

  return (
    <TablePrimaryRow>
      <TablePrimaryCell>
        {convertTimestampToDateTime(row.TimeStamp)}
      </TablePrimaryCell>
      <TablePrimaryCell align="center">
        <Link
          href={`/detail/${row.TokenId}`}
          sx={{
            color: "inherit",
            fontSize: "inherit",
          }}
          target="_blank"
        >
          {row.TokenId}
        </Link>
      </TablePrimaryCell>
      <TablePrimaryCell align="center">
        <Link
          href={`/prize/${row.RoundNum}`}
          style={{
            color: "inherit",
            fontSize: "inherit",
          }}
          target="_blank"
        >
          {row.RoundNum}
        </Link>
      </TablePrimaryCell>
      <TablePrimaryCell align="center">
        {row.Staked ? "Stake" : row.WasUnstaked ? "Unstake" : ""}
      </TablePrimaryCell>
      <TablePrimaryCell align="center">
        <Link
          href={`/user/${row.WinnerAddr}`}
          sx={{
            color: "inherit",
            fontSize: "inherit",
          }}
          target="_blank"
        >
          {row.WinnerAddr}
        </Link>
      </TablePrimaryCell>
      <TablePrimaryCell align="center">
        {!row.Staked && (
          <Button
            variant="text"
            sx={{ mr: 1 }}
            onClick={() => handleStake(row.TokenId)}
          >
            Stake
          </Button>
        )}
        {row.Staked && !row.WasUnstaked && (
          <Button
            variant="text"
            onClick={() => handleUnstake(row.StakeActionId)}
          >
            Unstake
          </Button>
        )}
      </TablePrimaryCell>
    </TablePrimaryRow>
  );
};

export const CSTokensTable = ({ list }) => {
  const perPage = 5;
  const [page, setPage] = useState(1);
  const stakingContract = useStakingWalletContract();
  const handleStake = async (tokenId: number) => {
    try {
      const res = await stakingContract.stake(tokenId).then((tx) => tx.wait());
      console.log(res);
    } catch (err) {
      console.error(err);
      alert(err.data.message);
    }
  };
  const handleUnstake = async (actionId: number) => {
    try {
      const res = await stakingContract
        .unstake(actionId)
        .then((tx) => tx.wait());
      console.log(res);
    } catch (err) {
      console.error(err);
      alert(err.data.message);
    }
  };
  if (list.length === 0) {
    return <Typography>No tokens yet.</Typography>;
  }
  return (
    <>
      <TablePrimaryContainer>
        <Table>
          <colgroup>
            <col width="15%" />
            <col width="10%" />
            <col width="10%" />
            <col width="15%" />
            <col width="20%" />
            <col width="20%" />
          </colgroup>
          <TablePrimaryHead>
            <TableRow>
              <TableCell>Mint Datetime</TableCell>
              <TableCell align="center">Token ID</TableCell>
              <TableCell align="center">Round</TableCell>
              <TableCell align="center">Action Type</TableCell>
              <TableCell align="center">Winner Address</TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
          </TablePrimaryHead>
          <TableBody>
            {list
              .slice((page - 1) * perPage, page * perPage)
              .map((row, index) => (
                <CSTokensRow
                  key={index}
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
