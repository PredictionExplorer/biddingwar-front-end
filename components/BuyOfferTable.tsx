import React, { useState } from "react";
import Image from "next/image";
import {
  Box,
  Table,
  TableRow,
  TableBody,
  TableCell,
  Typography,
} from "@mui/material";
import {
  TablePrimaryContainer,
  TablePrimaryCell,
  TablePrimaryHead,
  TablePrimaryRow,
} from "./styled";
import Pagination from "@mui/material/Pagination";

const OfferRow = ({ offer }) => {
  if (!offer) {
    return <TablePrimaryRow></TablePrimaryRow>;
  }

  return (
    <TablePrimaryRow>
      <TablePrimaryCell>{offer.buyer}</TablePrimaryCell>
      <TablePrimaryCell sx={{ display: "flex" }}>
        <Image
          src={"/images/Ethereum_small.svg"}
          width={16}
          height={16}
          alt="ethereum"
        />
        <Typography component="span" color="primary" ml={1}>
          {offer.price}
        </Typography>
      </TablePrimaryCell>
    </TablePrimaryRow>
  );
};

const OfferTable = ({ offers }) => {
  return (
    <TablePrimaryContainer>
      <Table>
        <TablePrimaryHead>
          <TableRow>
            <TableCell>Buyer</TableCell>
            <TableCell>Price</TableCell>
          </TableRow>
        </TablePrimaryHead>
        <TableBody>
          {offers.map((offer, i) => (
            <OfferRow offer={offer} key={i} />
          ))}
        </TableBody>
      </Table>
    </TablePrimaryContainer>
  );
};

const BuyOfferTable = ({ offers }) => {
  const perPage = 20;
  const [curPage, setCurPage] = useState(1);
  if (offers.length === 0) {
    return <Typography>No offers yet.</Typography>;
  }
  return (
    <Box mt={4}>
      <OfferTable
        offers={offers.slice((curPage - 1) * perPage, curPage * perPage)}
      />
      <Box display="flex" justifyContent="center" mt={4}>
        <Pagination
          color="primary"
          page={curPage}
          onChange={(e, page) => setCurPage(page)}
          count={Math.ceil(offers.length / perPage)}
          showFirstButton
          showLastButton
        />
      </Box>
    </Box>
  );
};

export default BuyOfferTable;
