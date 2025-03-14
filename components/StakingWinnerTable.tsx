import React, { useState } from "react";
import { TableBody, Link, Typography, Tooltip } from "@mui/material";
import {
  TablePrimaryContainer,
  TablePrimaryCell,
  TablePrimaryHead,
  TablePrimaryRow,
  TablePrimary,
  TablePrimaryHeadCell,
} from "./styled";
import { convertTimestampToDateTime, shortenHex } from "../utils";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { Tr } from "react-super-responsive-table";
import { CustomPagination } from "./CustomPagination";
import { isMobile } from "react-device-detect";

const WinnerRow = ({ winner }) => {
  if (!winner) {
    return <TablePrimaryRow />;
  }

  return (
    <TablePrimaryRow>
      <TablePrimaryCell>
        <Link
          color="inherit"
          fontSize="inherit"
          href={`https://arbiscan.io/tx/${winner.TxHash}`}
          target="__blank"
        >
          {convertTimestampToDateTime(winner.TimeStamp)}
        </Link>
      </TablePrimaryCell>
      <TablePrimaryCell>
        <Tooltip title={winner.WinnerAddr}>
          <Link
            href={`/user/${winner.WinnerAddr}`}
            style={{
              color: "inherit",
              fontSize: "inherit",
              fontFamily: "monospace",
            }}
          >
            {shortenHex(winner.WinnerAddr, 6)}
          </Link>
        </Tooltip>
      </TablePrimaryCell>
      <TablePrimaryCell align="center">
        <Link
          href={`/prize/${winner.RoundNum}`}
          style={{ color: "inherit", fontSize: "inherit" }}
        >
          {winner.RoundNum}
        </Link>
      </TablePrimaryCell>
      <TablePrimaryCell>
        {winner.IsRwalk ? "Random Walk Token" : "Cosmic Signature Token"}
      </TablePrimaryCell>
      <TablePrimaryCell align="center">
        <Link
          href={`/detail/${winner.TokenId}`}
          style={{ color: "inherit", fontSize: "inherit" }}
        >
          {winner.TokenId}
        </Link>
      </TablePrimaryCell>
    </TablePrimaryRow>
  );
};

const StakingWinnerTable = ({ list }) => {
  const perPage = 5;
  const [page, setPage] = useState(1);
  if (list.length === 0) {
    return <Typography>No winners yet.</Typography>;
  }
  return (
    <>
      <TablePrimaryContainer>
        <TablePrimary>
          {!isMobile && (
            <colgroup>
              <col width="20%" />
              <col width="15%" />
              <col width="15%" />
              <col width="32%" />
              <col width="20%" />
            </colgroup>
          )}
          <TablePrimaryHead>
            <Tr>
              <TablePrimaryHeadCell align="left">Datetime</TablePrimaryHeadCell>
              <TablePrimaryHeadCell align="left">Winner</TablePrimaryHeadCell>
              <TablePrimaryHeadCell align="center">
                Round #
              </TablePrimaryHeadCell>
              <TablePrimaryHeadCell align="left">Type</TablePrimaryHeadCell>
              <TablePrimaryHeadCell align="center">
                Token ID
              </TablePrimaryHeadCell>
            </Tr>
          </TablePrimaryHead>
          <TableBody>
            {list.slice((page - 1) * perPage, page * perPage).map((winner) => (
              <WinnerRow key={winner.EvtLogId} winner={winner} />
            ))}
          </TableBody>
        </TablePrimary>
      </TablePrimaryContainer>
      <CustomPagination
        page={page}
        setPage={setPage}
        totalLength={list.length}
        perPage={perPage}
      />
    </>
  );
};

export default StakingWinnerTable;
