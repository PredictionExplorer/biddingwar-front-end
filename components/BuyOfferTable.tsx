import React from "react";
import {
  Box,
  Table,
  TableRow,
  TableBody,
  TableCell,
} from "@mui/material";
import {
  TablePrimaryContainer,
  TablePrimaryCell,
  TablePrimaryHead,
  TablePrimaryRow,
} from "./styled";
import Pagination from "@mui/material/Pagination";
import { useRouter } from "next/router";

const OfferRow = ({ offer }) => {
  if (!offer) {
    return <TablePrimaryRow></TablePrimaryRow>;
  }

  return (
    <TablePrimaryRow>
      <TablePrimaryCell>{offer.buyer}</TablePrimaryCell>
      <TablePrimaryCell>{offer.price}</TablePrimaryCell>
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
          {offers.length > 0 ? (
            offers.map((offer, i) => <OfferRow offer={offer} key={i} />)
          ) : (
            <TableRow>
              <TablePrimaryCell align="center" colSpan={8}>
                No offers yet.
              </TablePrimaryCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TablePrimaryContainer>
  );
};

const BuyOfferTable = ({ curPage, offers, totalCount }) => {
  const perPage = 20;
  const router = useRouter();
  const handleNextPage = (page) => {
    router.query["page"] = page;
    router.push({ pathname: router.pathname, query: router.query });
  };

  return (
    <Box mt={4}>
      <OfferTable offers={offers} />
      <Box display="flex" justifyContent="center" mt={4}>
        <Pagination
          color="primary"
          page={parseInt(curPage)}
          onChange={(e, page) => handleNextPage(page)}
          count={Math.ceil(totalCount / perPage)}
          showFirstButton
          showLastButton
        />
      </Box>
    </Box>
  );
};

export default BuyOfferTable;
