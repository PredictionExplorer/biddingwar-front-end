import React, { useState, useEffect } from "react";
import { Button, Box, Typography, Grid } from "@mui/material";
import Countdown from "react-countdown";
import { CenterBox, MainWrapper, StyledLink } from "../components/styled";
import Counter from "../components/Counter";
import BiddingHistory from "../components/BiddingHistory";
import api from "../services/api";
import useBiddingWarContract from "../hooks/useBiddingWarContract";
import { parseBalance } from "../utils";
import { ethers } from "ethers";
import NFTDialog from "../components/NFTDialog";
import useNFTContract from "../hooks/useNFTContract";
import { formatUnits } from "@ethersproject/units";
import { useActiveWeb3React } from "../hooks/web3";

const NewHome = ({ biddingHistory, page, totalCount }) => {
  const [withdrawalSeconds, setWithdrawalSeconds] = useState(null);
  const [lastBidder, setLastBidder] = useState(null);
  const [newBidPrice, setNewBidPrice] = useState("0");
  const [prize, setPrize] = useState("0");
  const [charityAddress, setCharityAddress] = useState(null);
  const [charityPercentage, setCharityPercentage] = useState("0");
  const [open, setOpen] = useState(false);
  const [rwlknftIds, setRwlknftIds] = useState([]);

  const { account } = useActiveWeb3React();
  const biddingWarContract = useBiddingWarContract();
  const nftContract = useNFTContract();

  const handleBid = async () => {
    try {
      const bidPrice = await biddingWarContract.getBidPrice();
      const newBidPrice = parseFloat(ethers.utils.formatEther(bidPrice)) * 1.01;
      const receipt = await biddingWarContract
        .bid({ value: ethers.utils.parseEther(newBidPrice.toFixed(6)) })
        .then((tx) => tx.wait());
      console.log(receipt);
      getData();
    } catch (err) {
      console.log(err);
    }
  };

  const handleBidWithRWLK = async (tokenId: number) => {
    setOpen(false);
    try {
      const receipt = await biddingWarContract
        .bidWithRWLK(tokenId)
        .then((tx) => tx.wait());
      console.log(receipt);
      getData();
    } catch (err) {
      console.log(err);
      alert(err.message);
    }
  };

  const openNFTDialog = () => {
    setOpen(true);
  };

  const handleClaimPrize = async () => {
    try {
      const receipt = await biddingWarContract
        .claimPrize()
        .then((tx) => tx.wait());
      console.log(receipt);
    } catch (err) {
      console.log(err);
      alert(err.data.message);
    }
  };

  // const handleDonate = async () => {
  //   try {
  //     const receipt = await biddingWarContract
  //       .donate({ value: ethers.utils.parseEther("10") })
  //       .then((tx) => tx.wait());
  //     console.log(receipt);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  const getData = async () => {
    if (biddingWarContract) {
      const bidPrice = await biddingWarContract.getBidPrice();
      setNewBidPrice((parseFloat(formatUnits(bidPrice)) * 1.01).toFixed(6));

      const prize = await biddingWarContract.prizeAmount();
      setPrize(parseBalance(prize));

      const seconds = (await biddingWarContract.timeUntilPrize()).toNumber();
      setWithdrawalSeconds(seconds);

      const lastBidder = await biddingWarContract.lastBidder();
      setLastBidder(lastBidder);

      const charityAddress = await biddingWarContract.charity();
      setCharityAddress(charityAddress);

      const charityPercentage = await biddingWarContract.charityPercentage();
      setCharityPercentage(parseFloat(charityPercentage).toFixed(2));
    }
    if (nftContract) {
      const tokens = await nftContract.walletOfOwner(account);
      const nftIds = tokens.map((t) => t.toNumber()).reverse();
      setRwlknftIds(nftIds);
    }
  };

  useEffect(() => {
    getData();
  }, [biddingWarContract, nftContract]);

  if (withdrawalSeconds === null) return null;

  return (
    <>
      <MainWrapper>
        <Box>
          <Typography variant="body1" color="primary" component="span">
            BID PRICE:
          </Typography>
          &nbsp;&nbsp;
          <Typography variant="body1" component="span">
            {newBidPrice}
          </Typography>
        </Box>
        <Box>
          <Typography variant="body1" color="primary" component="span">
            REWARD:
          </Typography>
          &nbsp;&nbsp;
          <Typography variant="body1" component="span">
            {prize}
          </Typography>
        </Box>
        <Box>
          <Typography variant="body1" color="primary" component="span">
            Charity Address:
          </Typography>
          &nbsp;&nbsp;
          <Typography variant="body1" component="span">
            {charityAddress}
          </Typography>
        </Box>
        <Box>
          <Typography variant="body1" color="primary" component="span">
            Percentage of Donation:
          </Typography>
          &nbsp;&nbsp;
          <Typography variant="body1" component="span">
            {charityPercentage}%
          </Typography>
        </Box>
        {withdrawalSeconds > 0 && (
          <CenterBox>
            <Typography variant="h4" component="span">
              THE CURRENT
            </Typography>
            &nbsp;&nbsp;
            <Typography variant="h4" component="span" color="primary">
              BIDDING ROUND
            </Typography>
            &nbsp;&nbsp;
            <Typography variant="h4" component="span">
              FINISHES IN
            </Typography>
          </CenterBox>
        )}
        <Box mt={3}>
          <Grid container spacing={4}>
            {withdrawalSeconds > 0 && (
              <Grid item xs={12} sm={12} md={6}>
                <Box mb={2}>
                  <Countdown
                    date={Date.now() + withdrawalSeconds * 1000}
                    renderer={Counter}
                  />
                </Box>
              </Grid>
            )}
            <Grid item xs={12} sm={12} md={6}>
              <Box>
                <Typography variant="body1" color="primary">
                  Last Bidder Address
                </Typography>
                <Typography variant="body2">
                  <StyledLink href={`/gallery?address=${lastBidder}`}>
                    {lastBidder}
                  </StyledLink>
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Box my={2}>
          <Button
            onClick={handleBid}
            color="primary"
            variant="contained"
            size="large"
          >
            Bid Now
          </Button>

          <Button
            onClick={openNFTDialog}
            color="primary"
            variant="contained"
            size="large"
            sx={{ ml: 2 }}
          >
            Bid with RWLK
          </Button>

          <Button
            onClick={handleClaimPrize}
            color="primary"
            variant="contained"
            size="large"
            sx={{ ml: 2 }}
          >
            Claim Prize
          </Button>
        </Box>

        {/* <Button
          onClick={handleDonate}
          color="primary"
          variant="contained"
          size="large"
        >
          Donate
        </Button> */}

        <Typography variant="body1" gutterBottom>
          When you bid, you will get 100 tokens as a reward. These tokens allow
          you to participate in the DAO.
        </Typography>

        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexWrap="wrap"
          sx={{ mt: 3 }}
        >
          <Typography variant="h4" component="span">
            CURRENT ROUND
          </Typography>
          <Typography
            variant="h4"
            component="span"
            color="primary"
            sx={{ ml: 1.5 }}
          >
            BID
          </Typography>
          <Typography
            variant="h4"
            component="span"
            color="secondary"
            sx={{ ml: 1.5 }}
          >
            HISTORY
          </Typography>
        </Box>

        <BiddingHistory
          curPage={page}
          biddingHistory={biddingHistory}
          totalCount={totalCount}
        />
      </MainWrapper>
      <NFTDialog
        nfts={rwlknftIds}
        open={open}
        onClose={() => setOpen(false)}
        onSelect={handleBidWithRWLK}
      />
    </>
  );
};

export async function getServerSideProps(context) {
  const page = context.query.page ?? 1;
  const res = await api.biddingHistory(page);
  return {
    props: {
      biddingHistory: res.biddingHistory,
      totalCount: res.totalCount,
      page,
    },
  };
}

export default NewHome;
