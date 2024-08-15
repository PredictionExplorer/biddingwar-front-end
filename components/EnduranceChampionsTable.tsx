import React, { useEffect, useState } from "react";
import { TableBody, TableSortLabel, Typography } from "@mui/material";
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
        <AddressLink address={row.bidder} url={`/user/${row.bidder}`} />
      </TablePrimaryCell>
      <TablePrimaryCell align="center">
        {formatSeconds(row.championTime)}
      </TablePrimaryCell>
      <TablePrimaryCell align="center">
        {formatSeconds(row.chronoWarrior)}
      </TablePrimaryCell>
    </TablePrimaryRow>
  );
};

const EnduranceChampionsTable = ({ list }) => {
  const perPage = 5;
  const [championList, setChampionList] = useState(null);
  const [sortField, setSortField] = useState("championTime");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const getEnduranceChampions = (bidList) => {
      if (!bidList || bidList.length === 0) {
        return [];
      }
      let currentRoundBids = [...bidList].sort(
        (a, b) => a.TimeStamp - b.TimeStamp
      );

      if (currentRoundBids.length < 2) {
        return [];
      }

      let maxEnduranceDuration = 0;
      let enduranceChampions = [];

      // First pass: Calculate endurance champions
      for (let i = 1; i < currentRoundBids.length; i++) {
        const enduranceDuration =
          currentRoundBids[i].TimeStamp - currentRoundBids[i - 1].TimeStamp;
        if (enduranceDuration > maxEnduranceDuration) {
          maxEnduranceDuration = enduranceDuration;
          enduranceChampions.push({
            address: currentRoundBids[i - 1].BidderAddr,
            championTime: enduranceDuration,
            startTime: currentRoundBids[i - 1].TimeStamp,
            endTime: currentRoundBids[i].TimeStamp,
          });
        }
      }

      // Second pass: Calculate chrono warrior time
      for (let i = 0; i < enduranceChampions.length; i++) {
        let chronoDuration;
        if (i === enduranceChampions.length - 1) {
          chronoDuration =
            currentRoundBids[currentRoundBids.length - 1].TimeStamp -
            enduranceChampions[i].endTime;
        } else {
          chronoDuration =
            enduranceChampions[i + 1].startTime - enduranceChampions[i].endTime;
        }
        enduranceChampions[i].chronoWarrior = chronoDuration;
      }

      return enduranceChampions.map((champion) => ({
        bidder: champion.address,
        championTime: champion.championTime,
        chronoWarrior: champion.chronoWarrior,
      }));
    };
    const champions = getEnduranceChampions(list);
    setChampionList(champions);
  }, [list]);

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const sortedChampionList = championList
    ? [...championList].sort((a, b) => {
        if (sortDirection === "asc") {
          return a[sortField] - b[sortField];
        } else {
          return b[sortField] - a[sortField];
        }
      })
    : [];

  const paginatedList = sortedChampionList.slice(
    (page - 1) * perPage,
    page * perPage
  );

  if (!list || list.length === 0) {
    return <Typography>No bid data available.</Typography>;
  }

  return (
    <>
      {championList === null ? (
        <Typography>Loading...</Typography>
      ) : championList.length === 0 ? (
        <Typography>No endurance champions yet.</Typography>
      ) : (
        <TablePrimaryContainer>
          <TablePrimary>
            {!isMobile && (
              <colgroup>
                <col width="50%" />
                <col width="25%" />
                <col width="25%" />
              </colgroup>
            )}
            <TablePrimaryHead>
              <Tr>
                <TablePrimaryHeadCell align="left">
                  User Address
                </TablePrimaryHeadCell>
                <TablePrimaryHeadCell align="center">
                  <TableSortLabel
                    active={sortField === "championTime"}
                    direction={sortDirection}
                    onClick={() => handleSort("championTime")}
                  >
                    Champion Time
                  </TableSortLabel>
                </TablePrimaryHeadCell>
                <TablePrimaryHeadCell align="center">
                  <TableSortLabel
                    active={sortField === "chronoWarrior"}
                    direction={sortDirection}
                    onClick={() => handleSort("chronoWarrior")}
                  >
                    Chrono Warrior
                  </TableSortLabel>
                </TablePrimaryHeadCell>
              </Tr>
            </TablePrimaryHead>
            <TableBody>
              {paginatedList.map((row, index) => (
                <EnduranceChampionsRow
                  key={`${row.bidder}-${index}-${page}`}
                  row={row}
                />
              ))}
            </TableBody>
          </TablePrimary>
        </TablePrimaryContainer>
      )}
      {championList && championList.length > perPage && (
        <CustomPagination
          page={page}
          setPage={setPage}
          totalLength={championList.length}
          perPage={perPage}
        />
      )}
    </>
  );
};

export default EnduranceChampionsTable;
