import React from "react";
import {
  Box,
  Container,
  Table,
  TableHead,
  TableRow,
  TableBody,
  Link,
} from "@mui/material";
import {
  SectionWrapper,
  TablePrimaryContainer,
  TablePrimaryCell,
  TablePrimaryHead,
} from "./styled";
// import { useTokenPrice } from "../hooks/useTokenInfo";
import Pagination from "@mui/material/Pagination";
import { useRouter } from "next/router";

const HistoryRow = ({ history }) => {
  // const ethPrice = useTokenPrice();

  const convertTimestampToDateTime = (timestamp: any) => {
    var months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    var date_ob = new Date(timestamp * 1000);
    var year = date_ob.getFullYear();
    var month = date_ob.getMonth();
    var date = ("0" + date_ob.getDate()).slice(-2);

    var result = months[month] + " " + date + ", " + year;
    return result;
  };

  if (!history) {
    return <TableRow></TableRow>;
  }

  return (
    <TableRow>
      <TablePrimaryCell>
        {convertTimestampToDateTime(history.TimeStamp)}
      </TablePrimaryCell>
      <TablePrimaryCell>
        <Link
          href={`/gallery?address=${history.BidderAddr}`}
          style={{ color: "#fff" }}
        >
          {history.BidderAddr}
        </Link>
      </TablePrimaryCell>
      <TablePrimaryCell>
        {history.BidPriceEth && `${history.BidPriceEth?.toFixed(6)}Ξ`}
      </TablePrimaryCell>
      <TablePrimaryCell>
        {history.RWalkNFTId < 0 ? '' : history.RWalkNFTId}
      </TablePrimaryCell>
      <TablePrimaryCell>
        {history.ERC20_AmountEth && history.ERC20_AmountEth?.toFixed(3)}
      </TablePrimaryCell>
      <TablePrimaryCell>
        {history.NFTDonationTokenAddr}
      </TablePrimaryCell>
      <TablePrimaryCell>
        {history.NFTDonationTokenId < 0 ? '': history.NFTDonationTokenId}
      </TablePrimaryCell>
    </TableRow>
  );
};

const HistoryTable = ({ biddingHistory }) => {
  return (
    <TablePrimaryContainer>
      <Table>
        <TablePrimaryHead>
          <TableRow>
            <TablePrimaryCell>Date</TablePrimaryCell>
            <TablePrimaryCell>Bidder</TablePrimaryCell>
            <TablePrimaryCell>Price</TablePrimaryCell>
            <TablePrimaryCell>RWLK ID</TablePrimaryCell>
            <TablePrimaryCell>ERC20 Amount</TablePrimaryCell>
            <TablePrimaryCell>Donated NFT Address</TablePrimaryCell>
            <TablePrimaryCell>Donated NFT ID</TablePrimaryCell>
          </TableRow>
        </TablePrimaryHead>
        <TableBody>
          {biddingHistory.length > 0 ? (
            biddingHistory.map((history, i) => (
              <HistoryRow history={history} key={i} />
            ))
          ) : (
            <TableRow>
              <TablePrimaryCell align="center" colSpan={8}>
                No history yet.
              </TablePrimaryCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TablePrimaryContainer>
  );
};

const BiddingHistory = ({ curPage, biddingHistory, totalCount }) => {
  const perPage = 20;
  const router = useRouter();
  const handleNextPage = (page) => {
    router.query["page"] = page;
    router.push({ pathname: router.pathname, query: router.query });
  };

  return (
    <SectionWrapper>
      <Container>
        <HistoryTable biddingHistory={biddingHistory} />
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
      </Container>
    </SectionWrapper>
  );
};

export default BiddingHistory;
