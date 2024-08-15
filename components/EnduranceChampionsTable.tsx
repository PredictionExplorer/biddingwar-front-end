import React, { useEffect, useState, useRef } from "react";
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
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

const EnduranceChampionsRow = ({ row }) => {
  if (!row) {
    return <TablePrimaryRow />;
  }
  return (
    <TablePrimaryRow>
      <TablePrimaryCell align="center">
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
  const [sortDirection, setSortDirection] = useState("desc");

  // Use useRef and localStorage to maintain page state
  const pageRef = useRef(
    parseInt(localStorage.getItem("enduranceChampionsPage") || "1", 10)
  );
  const [page, setPage] = useState(pageRef.current);

  useEffect(() => {
    const getEnduranceChampions = (bidList) => {
      if (!bidList || bidList.length === 0) {
        console.log("List is empty or undefined");
        return [];
      }

      const currentRound = bidList[bidList.length - 1].RoundNum;
      const currentRoundBids = bidList
        .filter((item) => item.RoundNum === currentRound)
        .sort((a, b) => a.TimeStamp - b.TimeStamp);

      if (currentRoundBids.length < 2) {
        console.log("Not enough bids in the current round");
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
          });
        }
      }

      // Second pass: Calculate chrono warrior time
      for (let i = 0; i < enduranceChampions.length; i++) {
        const chronoDuration =
          i === enduranceChampions.length - 1
            ? currentRoundBids[currentRoundBids.length - 1].TimeStamp -
              enduranceChampions[i].startTime
            : enduranceChampions[i + 1].startTime -
              enduranceChampions[i].startTime;

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

    // Ensure the current page is valid for the new data
    const maxPage = Math.ceil(champions.length / perPage);
    if (pageRef.current > maxPage) {
      pageRef.current = Math.max(1, maxPage);
      setPage(pageRef.current);
    }
  }, [list, perPage]);

  // Update localStorage when page changes
  useEffect(() => {
    localStorage.setItem("enduranceChampionsPage", page.toString());
    pageRef.current = page;
  }, [page]);

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

  const SortIcon = ({ field }) => {
    if (field !== sortField) return null;
    return sortDirection === "asc" ? (
      <ArrowUpwardIcon fontSize="small" />
    ) : (
      <ArrowDownwardIcon fontSize="small" />
    );
  };

  if (!list || list.length === 0) {
    console.log("List is empty or undefined");
    return <Typography>No bid data available.</Typography>;
  }

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Endurance Champions for Current Round
      </Typography>
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
                <TablePrimaryHeadCell align="center">
                  User Address
                </TablePrimaryHeadCell>
                <TablePrimaryHeadCell
                  align="center"
                  onClick={() => handleSort("championTime")}
                  style={{ cursor: "pointer" }}
                >
                  Champion Time <SortIcon field="championTime" />
                </TablePrimaryHeadCell>
                <TablePrimaryHeadCell
                  align="center"
                  onClick={() => handleSort("chronoWarrior")}
                  style={{ cursor: "pointer" }}
                >
                  Chrono Warrior <SortIcon field="chronoWarrior" />
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
