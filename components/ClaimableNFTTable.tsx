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
} from "@mui/material";
import {
  TablePrimaryCell,
  TablePrimaryContainer,
  TablePrimaryHead,
  TablePrimaryRow,
} from "../components/styled";
import { convertTimestampToDateTime, shortenHex } from "../utils";

const NFTRow = ({ nft, handleClaim }) => {
  if (!nft) {
    return <TablePrimaryRow></TablePrimaryRow>;
  }

  return (
    <TablePrimaryRow>
      <TablePrimaryCell>
        {convertTimestampToDateTime(nft.TimeStamp)}
      </TablePrimaryCell>
      <TablePrimaryCell>
        <Link
          href={`/user/${nft.DonorAddr}`}
          style={{ color: "rgba(255, 255, 255, 0.68)", fontSize: 14 }}
        >
          {shortenHex(nft.DonorAddr, 6)}
        </Link>
      </TablePrimaryCell>
      <TablePrimaryCell align="center">{nft.RoundNum}</TablePrimaryCell>
      <TablePrimaryCell>{nft.TokenAddr}</TablePrimaryCell>
      <TablePrimaryCell align="right">{nft.NFTTokenId}</TablePrimaryCell>
      <TablePrimaryCell>
        <Button variant="contained" onClick={(e) => handleClaim(e, nft.Index)}>
          Claim
        </Button>
      </TablePrimaryCell>
    </TablePrimaryRow>
  );
};

export const ClaimableNFTTable = ({ list, handleClaim }) => {
  const perPage = 5;
  const [page, setPage] = useState(1);

  return (
    <>
      <TablePrimaryContainer>
        <Table>
          <TablePrimaryHead>
            <TableRow>
              <TableCell>Datetime</TableCell>
              <TableCell>Donor Address</TableCell>
              <TableCell align="center">Round #</TableCell>
              <TableCell>Token Address</TableCell>
              <TableCell align="right">Token ID</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TablePrimaryHead>
          <TableBody>
            {list.length > 0 ? (
              list
                .slice((page - 1) * perPage, page * perPage)
                .map((nft) => (
                  <NFTRow
                    nft={nft}
                    key={nft.EvtLogId}
                    handleClaim={handleClaim}
                  />
                ))
            ) : (
              <TableRow>
                <TablePrimaryCell align="center" colSpan={6}>
                  No NFTs yet.
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
