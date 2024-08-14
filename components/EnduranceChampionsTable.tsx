import React, { useEffect, useState } from "react";
import { Link, TableBody, Typography } from "@mui/material";
import {
  TablePrimaryContainer,
  TablePrimaryCell,
  TablePrimaryHead,
  TablePrimaryRow,
  TablePrimary,
  TablePrimaryHeadCell,
} from "./styled";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { Tr } from "react-super-responsive-table";
import { CustomPagination } from "./CustomPagination";
import { isMobile } from "react-device-detect";
import { AddressLink } from "./AddressLink";
import { formatSeconds } from "../utils";

const EnduranceChampionsRow = ({ row }) => {
  if (!row) {
    return <TablePrimaryRow />;
  }
  return (
    <TablePrimaryRow>
      <TablePrimaryCell align="left">
        <Link
          href={`/prize/${row.round}`}
          style={{
            color: "inherit",
            fontSize: "inherit",
          }}
          target="_blank"
        >
          {row.round}
        </Link>
      </TablePrimaryCell>
      <TablePrimaryCell align="center">
        <AddressLink address={row.bidder} url={`/user/${row.bidder}`} />
      </TablePrimaryCell>
      <TablePrimaryCell align="center">
        {formatSeconds(row.duration)}
      </TablePrimaryCell>
    </TablePrimaryRow>
  );
};

const EnduranceChampionsTable = ({ list }) => {
  const perPage = 5;
  const [page, setPage] = useState(1);
  const [championList, setChampionList] = useState(null);

  useEffect(() => {
    const getEnduranceChampions = () => {
      const rounds: { [key: number]: any } = {};
      list.forEach((item) => {
        if (!rounds[item.RoundNum]) {
          rounds[item.RoundNum] = [];
        }
        rounds[item.RoundNum].push(item);
      });

      const maxTimestampChangesWithAddress = [];

      for (const [round, items] of Object.entries(rounds)) {
        let maxChange = 0;
        let address = "";

        for (let i = 1; i < items.length; i++) {
          const change = Math.abs(items[i].TimeStamp - items[i - 1].TimeStamp);
          if (change > maxChange) {
            maxChange = change;
            address = items[i].BidderAddr;
          }
        }

        maxTimestampChangesWithAddress.push({
          round,
          duration: maxChange,
          bidder: address,
        });
      }
      // maxTimestampChangesWithAddress.pop();
      return maxTimestampChangesWithAddress;
    };
    const champions = getEnduranceChampions();
    setChampionList(champions);
  }, [list]);

  return (
    <>
      {championList === null ? (
        <Typography variant="h6">Loading...</Typography>
      ) : championList.length === 0 ? (
        <Typography>No endurance champions yet.</Typography>
      ) : (
        <>
          <TablePrimaryContainer>
            <TablePrimary>
              {!isMobile && (
                <colgroup>
                  <col width="20%" />
                  <col width="50%" />
                  <col width="30%" />
                </colgroup>
              )}
              <TablePrimaryHead>
                <Tr>
                  <TablePrimaryHeadCell align="left">
                    Round
                  </TablePrimaryHeadCell>
                  <TablePrimaryHeadCell align="center">
                    User Address
                  </TablePrimaryHeadCell>
                  <TablePrimaryHeadCell align="center">
                    Duration
                  </TablePrimaryHeadCell>
                </Tr>
              </TablePrimaryHead>
              <TableBody>
                {championList
                  .slice((page - 1) * perPage, page * perPage)
                  .map((row) => (
                    <EnduranceChampionsRow key={row.round} row={row} />
                  ))}
              </TableBody>
            </TablePrimary>
          </TablePrimaryContainer>
          <CustomPagination
            page={page}
            setPage={setPage}
            totalLength={championList.length}
            perPage={perPage}
          />
        </>
      )}
    </>
  );
};

export default EnduranceChampionsTable;
