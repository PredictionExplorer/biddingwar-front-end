import React, { useEffect, useState } from "react";
import { TableBody, Typography } from "@mui/material";
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
        {formatSeconds(row.championDuration)}
      </TablePrimaryCell>
    </TablePrimaryRow>
  );
};

const EnduranceChampionsTable = ({ list }) => {
  const perPage = 5;
  const [page, setPage] = useState(1);
  const [championList, setChampionList] = useState(null);
  let reversed = [...list];
  reversed.sort((a, b) => a.TimeStamp - b.TimeStamp);

  useEffect(() => {
    const getEnduranceChampions = () => {
      let maxDuration = 0;
      let currentChampion = null;
      const champions = new Map();

      for (let i = 1; i < reversed.length; i++) {
        const duration = Math.abs(
          reversed[i].TimeStamp - reversed[i - 1].TimeStamp
        );
        const bidder = reversed[i - 1].BidderAddr;
        if (duration > maxDuration) {
          maxDuration = duration;
          if (currentChampion) {
            const championData = champions.get(currentChampion) || {
              championDuration: 0,
              championTime: 0,
            };
            champions.set(currentChampion, championData);
          }
          currentChampion = bidder;
          champions.set(currentChampion, {
            championDuration: duration,
            championTime: duration,
          });
        } else if (currentChampion) {
          const championData = champions.get(currentChampion);
          championData.championDuration += duration;
          champions.set(currentChampion, championData);
        }
      }

      const result = Array.from(
        champions,
        ([bidder, { championDuration, championTime }]) => ({
          bidder,
          championDuration,
          championTime,
        })
      ).sort((a, b) => b.championTime - a.championTime);
      return result;
    };

    const champions = getEnduranceChampions();
    setChampionList(champions);
  }, [list]);

  console.log("Current championList:", championList); // Debug log

  if (!list || list.length === 0) {
    console.log("List is empty or undefined"); // Debug log
    return <Typography>No data available.</Typography>;
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
                  Champion Time
                </TablePrimaryHeadCell>
                <TablePrimaryHeadCell align="center">
                  Time Warrior Time
                </TablePrimaryHeadCell>
              </Tr>
            </TablePrimaryHead>
            <TableBody>
              {championList
                .slice((page - 1) * perPage, page * perPage)
                .map((row) => (
                  <EnduranceChampionsRow key={row.bidder} row={row} />
                ))}
            </TableBody>
          </TablePrimary>
        </TablePrimaryContainer>
      )}
      {championList && championList.length > 0 && (
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
