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

const StakedTokensRow = ({ row, handleStake, handleUnstake }) => {
  if (!row) {
    return <TablePrimaryRow></TablePrimaryRow>;
  }

  return (
    <TablePrimaryRow>
      <TablePrimaryCell>
        {convertTimestampToDateTime(row.StakeTimeStamp)}
      </TablePrimaryCell>
      <TablePrimaryCell>
        {row.UnstakeTimeStamp !== 0 &&
          convertTimestampToDateTime(row.UnstakeTimeStamp)}
      </TablePrimaryCell>
      <TablePrimaryCell align="center">
        <Link
          href={`/detail/${row.TokenInfo.TokenId}`}
          sx={{
            color: "inherit",
            fontSize: "inherit",
          }}
        >
          {row.TokenInfo.TokenId}
        </Link>
      </TablePrimaryCell>
      <TablePrimaryCell align="center">
        {row.UnstakeTimeStamp !== 0 ? (
          <Button
            variant="text"
            onClick={() => handleStake(row.TokenInfo.TokenId)}
          >
            Stake
          </Button>
        ) : (
          <Button
            variant="text"
            onClick={() => handleUnstake(row.TokenInfo.TokenId)}
          >
            Unstake
          </Button>
        )}
      </TablePrimaryCell>
    </TablePrimaryRow>
  );
};

export const StakedTokensTable = ({ list }) => {
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
            <col width="25%" />
            <col width="25%" />
            <col width="25%" />
            <col width="25%" />
          </colgroup>
          <TablePrimaryHead>
            <TableRow>
              <TableCell>Stake Datetime</TableCell>
              <TableCell>Unstake Datetime</TableCell>
              <TableCell align="center">Token ID</TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
          </TablePrimaryHead>
          <TableBody>
            {list
              .slice((page - 1) * perPage, page * perPage)
              .map((row, index) => (
                <StakedTokensRow
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
