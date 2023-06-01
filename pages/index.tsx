import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Button,
  Box,
  Typography,
  TextField,
  CardActionArea,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Container,
  Grid,
  Popover,
} from "@mui/material";
import {
  GradientBorder,
  GradientText,
  MainWrapper,
  NFTImage,
  StyledCard,
} from "../components/styled";
import BiddingHistory from "../components/BiddingHistoryTable";
import api from "../services/api";
import useBiddingWarContract from "../hooks/useBiddingWarContract";
import { Contract, constants, ethers } from "ethers";
import useRWLKNFTContract from "../hooks/useRWLKNFTContract";
import { useActiveWeb3React } from "../hooks/web3";
import { BIDDINGWAR_ADDRESS } from "../config/app";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FAQ from "../components/FAQ";
import { ArrowForward } from "@mui/icons-material";
import NFT_ABI from "../contracts/NFT.json";
import PaginationRWLKGrid from "../components/PaginationRWLKGrid";
import useCosmicSignatureContract from "../hooks/useCosmicSignatureContract";
import Winners from "../components/Winners";
import Prize from "../components/Prize";
import LatestNFTs from "../components/LatestNFTs";
import router from "next/router";
import Countdown from "react-countdown";
import Counter from "../components/Counter";
import DonatedNFT from "../components/DonatedNFT";
import {
  Chart,
  ChartLegend,
  ChartSeries,
  ChartSeriesItem,
} from "@progress/kendo-react-charts";
import "@progress/kendo-theme-default/dist/all.css";
import "@egjs/hammerjs";

const NewHome = ({
  biddingHistory,
  initialData,
  nfts,
  prizeInfo,
  biddedRWLKIds,
  nftDonations,
}) => {
  const [data, setData] = useState(initialData);
  const [curBidList, setCurBidList] = useState(biddingHistory);
  const [withdrawalSeconds, setWithdrawalSeconds] = useState(null);
  const [prizeTime, setPrizeTime] = useState(0);
  const [countdownCompleted, setCountdownCompleted] = useState(false);
  const [message, setMessage] = useState("");
  const [nftDonateAddress, setNftDonateAddress] = useState("");
  const [nftId, setNftId] = useState(-1);
  const [rwlkId, setRwlkId] = useState(-1);
  const [galleryVisibility, setGalleryVisibility] = useState(false);
  const [isBidding, setIsBidding] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const [rwlknftIds, setRwlknftIds] = useState([]);
  const { library, account } = useActiveWeb3React();
  const biddingWarContract = useBiddingWarContract();
  const nftRWLKContract = useRWLKNFTContract();
  const cosmicSignatureContract = useCosmicSignatureContract();

  const series = [
    { category: "Prize", value: 25 },
    { category: "Raffle", value: 5 },
    { category: "Charity", value: 10 },
    { category: "Next round", value: 60 },
  ];

  const labelContent = (props) => {
    return `${props.dataItem.category}: ${props.dataItem.value}`;
  };

  const open = Boolean(anchorEl);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const onClaimPrize = async () => {
    try {
      await biddingWarContract.claimPrize().then((tx) => tx.wait());
      const balance = await cosmicSignatureContract.totalSupply();
      const token_id = balance.toNumber() - 1;
      const seed = await cosmicSignatureContract.seeds(token_id);
      await api.create(token_id, seed);
      router.push({
        pathname: `/detail/${token_id}`,
        query: {
          message: "success",
        },
      });
    } catch (err) {
      console.log(err);
      alert(err.message);
    }
  };

  const onBid = async () => {
    try {
      setIsBidding(true);
      const bidPrice = await biddingWarContract.getBidPrice();
      const newBidPrice = parseFloat(ethers.utils.formatEther(bidPrice)) * 1.01;
      let receipt;
      if (!nftDonateAddress || nftId === -1) {
        receipt = await biddingWarContract
          .bid(message, {
            value: ethers.utils.parseEther(newBidPrice.toFixed(10)),
          })
          .then((tx) => tx.wait());
      } else {
        // setApprovalForAll
        const nftDonateContract = new Contract(
          nftDonateAddress,
          NFT_ABI,
          library.getSigner(account)
        );
        await nftDonateContract
          .setApprovalForAll(BIDDINGWAR_ADDRESS, true)
          .then((tx) => tx.wait());
        receipt = await biddingWarContract
          .bidAndDonateNFT(message, nftDonateAddress, nftId, {
            value: ethers.utils.parseEther(newBidPrice.toFixed(6)),
          })
          .then((tx) => tx.wait());
      }
      console.log(receipt);
      setTimeout(() => {
        setIsBidding(false);
      }, 3000);
    } catch (err) {
      console.log(err);
      setIsBidding(false);
    }
  };

  const onBidWithRWLK = async () => {
    try {
      let receipt;
      setIsBidding(true);
      if (!nftDonateAddress || nftId === -1) {
        receipt = await biddingWarContract
          .bidWithRWLK(rwlkId, message)
          .then((tx) => tx.wait());
      } else {
        // setApprovalForAll
        const nftDonateContract = new Contract(
          nftDonateAddress,
          NFT_ABI,
          library.getSigner(account)
        );
        await nftDonateContract
          .setApprovalForAll(BIDDINGWAR_ADDRESS, true)
          .then((tx) => tx.wait());
        receipt = await biddingWarContract
          .bidWithRWLKAndDonateNFT(rwlkId, message, nftDonateAddress, nftId)
          .then((tx) => tx.wait());
      }
      console.log(receipt);
      setTimeout(() => {
        setIsBidding(false);
      }, 3000);
    } catch (err) {
      console.log(err);
      setIsBidding(false);
    }
  };

  const getTimeUntilPrize = async () => {
    if (biddingWarContract) {
      const seconds = (await biddingWarContract.timeUntilPrize()).toNumber();
      setWithdrawalSeconds(seconds);
    }
  };

  const getData = async () => {
    if (biddingWarContract) {
      const result = (await biddingWarContract.prizeTime()).toNumber();
      setPrizeTime((result + 24 * 3600) * 1000);
    }
    if (nftRWLKContract && account) {
      const tokens = await nftRWLKContract.walletOfOwner(account);
      const nftIds = tokens
        .map((t) => t.toNumber())
        .filter((t) => !biddedRWLKIds.includes(t))
        .reverse();
      setRwlknftIds(nftIds);
    }
  };

  useEffect(() => {
    getTimeUntilPrize();
    getData();
  }, [biddingWarContract, nftRWLKContract, account]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const response = await fetch("/api/dashboard");
      const newData = await response.json();
      setData(newData);
    };
    const fetchBidData = async () => {
      const response = await fetch(
        `/api/bid/?round=${data.CurRoundNum - 1}&sortDir=desc`
      );
      const newData = await response.json();
      setCurBidList(newData);
    };

    // Fetch data every 30 seconds
    const interval = setInterval(() => {
      fetchDashboardData();
      fetchBidData();
      getTimeUntilPrize();
    }, 15000);

    // Clean up the interval when the component is unmounted
    return () => {
      clearInterval(interval);
    };
  }, []);

  if (withdrawalSeconds === null) return null;

  return (
    <>
      <MainWrapper>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <StyledCard>
              <CardActionArea>
                <NFTImage image="https://cosmic-game.s3.us-east-2.amazonaws.com/000000.png" />
              </CardActionArea>
            </StyledCard>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Typography variant="h4">Current Bid</Typography>
            {!!(withdrawalSeconds && !countdownCompleted) && (
              <Countdown
                date={Date.now() + withdrawalSeconds * 1000}
                renderer={Counter}
                onComplete={() => setCountdownCompleted(true)}
              />
            )}
            <Box>
              <Typography color="primary" component="span">
                BID PRICE:
              </Typography>
              &nbsp;
              <Typography component="span">
                {data.BidPriceEth.toFixed(6)}
              </Typography>
            </Box>
            <Box>
              <Typography color="primary" component="span">
                REWARD:
              </Typography>
              &nbsp;
              <Typography component="span">
                {data.PrizeAmountEth.toFixed(4)}
              </Typography>
            </Box>
            <Box>
              <Typography color="primary">Charity Address:</Typography>
              <Typography>{data.CharityAddr}</Typography>
            </Box>
            <Box>
              <Typography
                color="primary"
                component="span"
                onMouseEnter={handlePopoverOpen}
              >
                Percentage of Donation:
              </Typography>
              &nbsp;
              <Typography component="span">
                {data.CharityPercentage}%
              </Typography>
              <Popover
                id="mouse-over-popover"
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                onClose={handlePopoverClose}
                disableRestoreFocus
              >
                <Box
                  sx={{ width: "540px", height: "400px", overflow: "hidden" }}
                >
                  <Chart>
                    <ChartLegend position="bottom" />
                    <ChartSeries>
                      <ChartSeriesItem
                        type="pie"
                        data={series}
                        field="value"
                        categoryField="category"
                        labels={{ visible: true, content: labelContent }}
                      />
                    </ChartSeries>
                  </Chart>
                </Box>
              </Popover>
            </Box>
            <Box sx={{ my: "24px" }}>
              <Typography color="primary">Last Bidder Address:</Typography>
              <Typography>
                {data.LastBidderAddr === constants.AddressZero
                  ? "There is no bidder yet."
                  : data.LastBidderAddr}
              </Typography>
            </Box>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Advanced Options</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
                  eget.
                </Typography>
                <TextField
                  placeholder="NFT contract address"
                  size="small"
                  fullWidth
                  sx={{ marginTop: 2 }}
                  onChange={(e) => setNftDonateAddress(e.target.value)}
                />
                <TextField
                  placeholder="NFT number"
                  size="small"
                  fullWidth
                  sx={{ marginTop: 2 }}
                  onChange={(e) => setNftId(Number(e.target.value))}
                />
                <TextField
                  placeholder="Message (280 characters)"
                  size="small"
                  multiline
                  fullWidth
                  rows={4}
                  sx={{ marginTop: 2 }}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </AccordionDetails>
            </Accordion>
            <Box mb={2} position="relative">
              <Grid container spacing={2} mt="25px">
                <Grid item xs={12} sm={12} md={4} lg={4}>
                  <Button
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForward />}
                    onClick={onBid}
                    fullWidth
                    disabled={isBidding}
                  >
                    Bid Now
                  </Button>
                </Grid>
                <Grid item xs={12} sm={12} md={8} lg={8}>
                  <Button
                    variant="outlined"
                    size="large"
                    endIcon={<ArrowForward />}
                    onClick={() => setGalleryVisibility(!galleryVisibility)}
                    fullWidth
                    disabled={isBidding}
                  >
                    Bid with Random Walk NFT
                  </Button>
                </Grid>
              </Grid>
              {!(withdrawalSeconds && !countdownCompleted) && (
                <Grid container columnSpacing={2} mt="20px">
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Button
                      variant="outlined"
                      size="large"
                      endIcon={<ArrowForward />}
                      onClick={onClaimPrize}
                      fullWidth
                    >
                      Claim Prize &nbsp; (
                      <Countdown date={prizeTime} />)
                    </Button>
                  </Grid>
                </Grid>
              )}
              {/* Random Walk NFT list */}
              <Box
                sx={{
                  border: "1px solid rgba(255, 255, 255, 0.09)",
                  borderRadius: "5px",
                  background: "#101441",
                  padding: "24px",
                  position: "absolute",
                  zIndex: 1,
                  top: "64px",
                }}
                visibility={galleryVisibility ? "visible" : "hidden"}
              >
                <Typography variant="h6">Random Walk NFT Gallery</Typography>
                <Typography variant="body2">
                  If you own some RandomWalkNFTs, you can use them to bid for
                  free! Each NFT can be used only once!
                </Typography>
                <PaginationRWLKGrid
                  loading={false}
                  data={rwlknftIds}
                  selectedToken={rwlkId}
                  setSelectedToken={setRwlkId}
                />
                {rwlkId !== -1 && (
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ position: "absolute", bottom: "24px", right: "24px" }}
                    onClick={onBidWithRWLK}
                  >
                    Done
                  </Button>
                )}
              </Box>
            </Box>
            <Typography variant="body2">
              When you bid, you will get 100 tokens as a reward. These tokens
              allow you to participate in the DAO.
            </Typography>
            <Box mt={2}>
              <Typography variant="body2" color="primary" component="span">
                *
              </Typography>
              <Typography variant="body2" component="span">
                When you bid, you are also buying a raffle ticket. 3 raffle
                tickets will be chosen and these people will win 5% of the pot
                each. Also, 5 additional winners will be chosen which will
                receive a Cosmic Signature NFT.
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Prize prizeAmount={data.PrizeAmountEth} />

        <Grid container spacing={2} marginTop="100px">
          {nftDonations &&
            nftDonations.slice(-3).map((nft) => (
              <Grid key={nft.RecordId} item xs={12} sm={12} md={4} lg={4}>
                <DonatedNFT nft={nft} />
              </Grid>
            ))}
        </Grid>

        <Box mt="120px">
          <Box display="flex" alignItems="center" flexWrap="wrap">
            <Typography variant="h6" component="span">
              CURRENT ROUND
            </Typography>
            <Typography
              variant="h6"
              component="span"
              color="primary"
              sx={{ ml: 1.5 }}
            >
              BID HISTORY
            </Typography>
          </Box>
          <BiddingHistory biddingHistory={curBidList} />
        </Box>
      </MainWrapper>

      <LatestNFTs nfts={nfts} />

      <Container>
        <Box margin="100px 0">
          <Typography variant="h4" textAlign="center">
            Every time you bid
          </Typography>
          <Typography
            fontSize={22}
            color="rgba(255, 255, 255, 0.68)"
            textAlign="center"
          >
            you are also buying a raffle ticket. When the round ends, there are
            8 raffle winners:
          </Typography>
          <Box textAlign="center" marginBottom="56px">
            <Image
              src={"/images/divider.svg"}
              width={93}
              height={3}
              alt="divider"
            />
          </Box>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <GradientBorder sx={{ padding: "50px" }}>
                <Typography fontSize={26} textAlign="center">
                  3 will receive
                </Typography>
                <GradientText variant="h4" fontSize={49} textAlign="center">
                  5% of the ETH
                </GradientText>
                <Typography
                  fontSize={22}
                  color="rgba(255, 255, 255, 0.68)"
                  textAlign="center"
                >
                  in the pot each
                </Typography>
              </GradientBorder>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <GradientBorder sx={{ padding: "50px" }}>
                <Typography fontSize={26} textAlign="center">
                  5 will receive
                </Typography>
                <GradientText variant="h4" fontSize={49} textAlign="center">
                  1 Cosmic NFT
                </GradientText>
                <Typography
                  fontSize={22}
                  color="rgba(255, 255, 255, 0.68)"
                  textAlign="center"
                >
                  each
                </Typography>
              </GradientBorder>
            </Grid>
          </Grid>
        </Box>
        {prizeInfo && <Winners prizeInfo={prizeInfo} />}
        <FAQ />
      </Container>
    </>
  );
};

export async function getServerSideProps() {
  const dashboardData = await api.get_dashboard_info();
  const bidList = await api.get_bid_list();
  const biddedRWLKIds = bidList.map((bid) => bid.RWalkNFTId);
  const biddingHistory = await api.get_bid_list_by_round(
    dashboardData.CurRoundNum - 1,
    "desc"
  );
  const nfts = await api.get_cst_list();
  const prizeList = await api.get_prize_list();
  let prizeInfo;
  if (prizeList.length) {
    prizeInfo = await api.get_prize_info(prizeList.length - 1);
  } else {
    prizeInfo = null;
  }
  const nftDonations = await api.get_donations_nft_list();

  return {
    props: {
      biddingHistory,
      initialData: dashboardData,
      nfts,
      prizeInfo,
      biddedRWLKIds,
      nftDonations,
    },
  };
}

export default NewHome;
