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
  useTheme,
  useMediaQuery,
  Snackbar,
  Alert,
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
import RaffleWinners from "../components/RaffleWinners";
import Prize from "../components/Prize";
import LatestNFTs from "../components/LatestNFTs";
import router from "next/router";
import Countdown from "react-countdown";
import Counter from "../components/Counter";
import DonatedNFT from "../components/DonatedNFT";
import {
  Chart,
  ChartArea,
  ChartLegend,
  ChartSeries,
  ChartSeriesItem,
} from "@progress/kendo-react-charts";
import "@progress/kendo-theme-default/dist/all.css";
import "@egjs/hammerjs";
import getErrorMessage from "../utils/alert";

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
  const [prizeTime, setPrizeTime] = useState(0);
  const [message, setMessage] = useState("");
  const [nftDonateAddress, setNftDonateAddress] = useState("");
  const [nftId, setNftId] = useState(-1);
  const [rwlkId, setRwlkId] = useState(-1);
  const [galleryVisibility, setGalleryVisibility] = useState(false);
  const [isBidding, setIsBidding] = useState(false);
  const [notification, setNotification] = useState({
    text: "",
    visible: false,
  });

  const [rwlknftIds, setRwlknftIds] = useState([]);
  const { library, account } = useActiveWeb3React();
  const biddingWarContract = useBiddingWarContract();
  const nftRWLKContract = useRWLKNFTContract();
  const cosmicSignatureContract = useCosmicSignatureContract();

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("md"));

  const series = [
    { category: "Prize", value: data.PrizePercentage },
    { category: "Raffle", value: data.RafflePercentage },
    { category: "Charity", value: data.CharityPercentage },
    {
      category: "Next round",
      value:
        100 -
        data.CharityPercentage -
        data.RafflePercentage -
        data.PrizePercentage,
    },
  ];

  const labelContent = (props) => {
    return `${props.dataItem.category}: ${props.dataItem.value}%`;
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
      setNotification({
        visible: true,
        text: err.message,
      });
    }
  };

  const checkIfContractExist = async (address) => {
    try {
      const byteCode = await library.getCode(address);
      if (byteCode === "0x") {
        return false;
      }
    } catch (err) {
      return false;
    }
    return true;
  };

  const checkTokenOwnership = async (address, tokenId) => {
    try {
      const nftDonateContract = new Contract(
        address,
        NFT_ABI,
        library.getSigner(account)
      );
      const addr = await nftDonateContract.ownerOf(tokenId);
      if (addr !== account) {
        setNotification({
          visible: true,
          text: "You aren't the owner of the token!",
        });
        return false;
      }
    } catch (err) {
      if (err?.data?.message) {
        const msg = getErrorMessage(err?.data?.message);
        setNotification({
          visible: true,
          text: msg,
        });
      }
      console.log(err);
      return false;
    }
    return true;
  };

  const onBid = async () => {
    let bidPrice, newBidPrice;
    setIsBidding(true);
    try {
      bidPrice = await biddingWarContract.getBidPrice();
      newBidPrice = parseFloat(ethers.utils.formatEther(bidPrice)) * 1.01;
      let receipt;
      if (!nftDonateAddress || nftId === -1) {
        receipt = await biddingWarContract
          .bid(message, {
            value: ethers.utils.parseEther(newBidPrice.toFixed(10)),
          })
          .then((tx) => tx.wait());
        console.log(receipt);
        setTimeout(() => {
          router.reload();
        }, 3000);
        return;
      }
    } catch (err) {
      if (err?.data?.message) {
        const msg = getErrorMessage(err?.data?.message);
        setNotification({
          visible: true,
          text: msg,
        });
      }
      console.log(err);
      setIsBidding(false);
      return;
    }

    // check if the contract exists
    const isExist = await checkIfContractExist(nftDonateAddress);
    if (!isExist) {
      setNotification({
        visible: true,
        text: "You selected address that doesn't belong to a contract address!",
      });
      setIsBidding(false);
      return;
    }

    // owner of
    const isOwner = await checkTokenOwnership(nftDonateAddress, nftId);
    if (!isOwner) {
      setIsBidding(false);
      return;
    }

    try {
      let receipt;
      if (nftDonateAddress && nftId !== -1) {
        // setApprovalForAll
        const nftDonateContract = new Contract(
          nftDonateAddress,
          NFT_ABI,
          library.getSigner(account)
        );
        const approvedBy = await nftDonateContract.getApproved(nftId);
        const isApprovedForAll = await nftDonateContract.isApprovedForAll(
          account,
          BIDDINGWAR_ADDRESS
        );
        if (!isApprovedForAll && approvedBy !== BIDDINGWAR_ADDRESS) {
          await nftDonateContract
            .setApprovalForAll(BIDDINGWAR_ADDRESS, true)
            .then((tx) => tx.wait());
        }
        receipt = await biddingWarContract
          .bidAndDonateNFT(message, nftDonateAddress, nftId, {
            value: ethers.utils.parseEther(newBidPrice.toFixed(6)),
          })
          .then((tx) => tx.wait());
        console.log(receipt);
        setTimeout(() => {
          router.reload();
        }, 4000);
      }
    } catch (err) {
      if (err?.data?.message) {
        const msg = getErrorMessage(err?.data?.message);
        setNotification({
          visible: true,
          text: msg,
        });
      }
      console.log(err);
      setIsBidding(false);
    }
  };

  const onBidWithRWLK = async () => {
    setIsBidding(true);
    try {
      let receipt;
      if (!nftDonateAddress || nftId === -1) {
        receipt = await biddingWarContract
          .bidWithRWLK(rwlkId, message)
          .then((tx) => tx.wait());
        console.log(receipt);
        setTimeout(() => {
          router.reload();
        }, 5000);
        return;
      }
    } catch (err) {
      if (err?.data?.message) {
        const msg = getErrorMessage(err?.data?.message);
        setNotification({
          visible: true,
          text: msg,
        });
      }
      console.log(err);
      setIsBidding(false);
      return;
    }

    // check if the contract exists
    const isExist = await checkIfContractExist(nftDonateAddress);
    if (!isExist) {
      setNotification({
        visible: true,
        text: "You selected address that doesn't belong to a contract address!",
      });
      setIsBidding(false);
      return;
    }

    // owner of
    const isOwner = await checkTokenOwnership(nftDonateAddress, nftId);
    if (!isOwner) {
      setIsBidding(false);
      return;
    }

    try {
      let receipt;
      setIsBidding(true);
      // setApprovalForAll
      const nftDonateContract = new Contract(
        nftDonateAddress,
        NFT_ABI,
        library.getSigner(account)
      );
      const isApprovedForAll = nftDonateContract.isApprovedForAll(
        account,
        BIDDINGWAR_ADDRESS
      );
      if (!isApprovedForAll) {
        await nftDonateContract
          .setApprovalForAll(BIDDINGWAR_ADDRESS, true)
          .then((tx) => tx.wait());
      }
      receipt = await biddingWarContract
        .bidWithRWLKAndDonateNFT(rwlkId, message, nftDonateAddress, nftId)
        .then((tx) => tx.wait());
      console.log(receipt);
      setTimeout(() => {
        router.reload();
      }, 5000);
    } catch (err) {
      if (err?.data?.message) {
        const msg = getErrorMessage(err?.data?.message);
        setNotification({
          visible: true,
          text: msg,
        });
      }
      console.log(err);
      setIsBidding(false);
    }
  };

  useEffect(() => {
    const getData = async () => {
      if (nftRWLKContract && account) {
        const tokens = await nftRWLKContract.walletOfOwner(account);
        const nftIds = tokens
          .map((t) => t.toNumber())
          .filter((t) => !biddedRWLKIds.includes(t))
          .reverse();
        setRwlknftIds(nftIds);
      }
    };
    getData();
  }, [nftRWLKContract, account]);

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

    const fetchPrizeTime = async () => {
      let response;
      // response = await fetch("/api/prizeTime");
      // const t = await response.json();
      const t = (await biddingWarContract.prizeTime()).toNumber();

      response = await fetch("/api/currentTimeStamp");
      const current = await response.json();
      const offset = current * 1000 - Date.now();
      setPrizeTime(t * 1000 - offset);
    };

    fetchPrizeTime();
    // Fetch data every 15 seconds
    const interval = setInterval(() => {
      fetchDashboardData();
      fetchBidData();
      fetchPrizeTime();
    }, 15000);

    // Clean up the interval when the component is unmounted
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <MainWrapper>
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          autoHideDuration={10000}
          open={notification.visible}
          onClose={() => setNotification({ text: "", visible: false })}
        >
          <Alert severity="error" variant="filled">
            {notification.text}
          </Alert>
        </Snackbar>
        <Grid container spacing={8}>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <StyledCard>
              <CardActionArea>
                <NFTImage src="/images/qmark.png" />
              </CardActionArea>
            </StyledCard>
            <Box>
              <Typography color="primary" mt={4}>
                Distribution of Prize funds
              </Typography>

              <Chart
                transitions={false}
                style={{ width: "100%", height: matches ? 300 : 200 }}
              >
                <ChartLegend position="bottom" labels={{ color: "white" }} />
                <ChartArea background="transparent" />
                <ChartSeries>
                  <ChartSeriesItem
                    type="pie"
                    data={series}
                    field="value"
                    categoryField="category"
                    labels={{
                      visible: true,
                      content: labelContent,
                      color: "white",
                      background: "none",
                    }}
                  />
                </ChartSeries>
              </Chart>
            </Box>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Typography variant="h4" mr={1} component="span">
              Current Bid
            </Typography>
            <Typography variant="h5" component="span">
              (Round #{data.CurRoundNum})
            </Typography>
            {prizeTime > Date.now() && (
              <Countdown date={prizeTime} renderer={Counter} />
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
            {/* <Box>
              <Typography color="primary">Charity Address:</Typography>
              <Typography>{data.CharityAddr}</Typography>
            </Box> */}
            <Box sx={{ mt: "24px" }}>
              <Typography color="primary">Last Bidder Address:</Typography>
              <Typography>
                {data.LastBidderAddr === constants.AddressZero
                  ? "There is no bidder yet."
                  : data.LastBidderAddr}
              </Typography>
            </Box>
            {!!(curBidList.length && curBidList[0].Message !== "") && (
              <Box sx={{ mb: "24px" }}>
                <Typography color="primary" component="span">
                  Last Bidder Message:
                </Typography>
                &nbsp;
                <Typography component="span">
                  {curBidList[0].Message}
                </Typography>
              </Box>
            )}
            {account !== null && (
              <>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Advanced Options</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Suspendisse malesuada lacus ex, sit amet blandit leo
                      lobortis eget.
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
                      inputProps={{ maxLength: 280 }}
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
                  {!(
                    prizeTime > Date.now() ||
                    data.LastBidderAddr === constants.AddressZero
                  ) && (
                    <Grid container columnSpacing={2} mt="20px">
                      <Grid item xs={12} sm={12} md={12} lg={12}>
                        <Button
                          variant="outlined"
                          size="large"
                          onClick={onClaimPrize}
                          fullWidth
                          disabled={
                            data.LastBidderAddr !== account &&
                            prizeTime + 300000 > Date.now()
                          }
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          Claim Prize
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            {prizeTime + 300000 > Date.now() && (
                              <>
                                available in &nbsp;
                                <Countdown date={prizeTime + 300000} />
                              </>
                            )}
                            &nbsp;
                            <ArrowForward sx={{ width: 22, height: 22 }} />
                          </Box>
                        </Button>
                        {data.LastBidderAddr !== account &&
                          prizeTime + 300000 > Date.now() && (
                            <Typography
                              variant="body2"
                              fontStyle="italic"
                              textAlign="right"
                              color="primary"
                            >
                              Please wait until the last bidder claims the
                              prize.
                            </Typography>
                          )}
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
                      top: matches ? "64px" : "128px",
                    }}
                    visibility={galleryVisibility ? "visible" : "hidden"}
                  >
                    <Typography variant="h6">
                      Random Walk NFT Gallery
                    </Typography>
                    <Typography variant="body2">
                      If you own some RandomWalkNFTs, you can use them to bid
                      for free! Each NFT can be used only once!
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
                        sx={{
                          position: "absolute",
                          bottom: "24px",
                          right: "24px",
                        }}
                        onClick={onBidWithRWLK}
                      >
                        Done
                      </Button>
                    )}
                  </Box>
                </Box>
              </>
            )}
            <Typography variant="body2">
              When you bid, you will get 100 tokens as a reward. These tokens
              allow you to participate in the DAO.
            </Typography>
            <Box mt={2}>
              <Typography variant="body2" color="primary" component="span">
                *
              </Typography>
              <Typography variant="body2" component="span">
                When you bid, you are also buying a raffle ticket.{" "}
                {data.NumRaffleEthWinners} raffle tickets will be chosen and
                these people will win {data.RafflePercentage}% of the pot each.
                Also, {data.NumRaffleNFTWinners} additional winners will be
                chosen which will receive a Cosmic Signature NFT.
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Prize prizeAmount={data.PrizeAmountEth} />

        <Box marginTop="80px">
          <Typography variant="h6" component="span">
            DONATED
          </Typography>
          <Typography variant="h6" color="primary" component="span" mx={1}>
            ERC721 TOKENS
          </Typography>
          <Typography variant="h6" component="span">
            FOR CURRENT ROUND
          </Typography>
          <Grid container spacing={2} mt={2}>
            {nftDonations.length ? (
              nftDonations.map((nft) => (
                <Grid key={nft.RecordId} item xs={12} sm={12} md={4} lg={4}>
                  <DonatedNFT nft={nft} />
                </Grid>
              ))
            ) : (
              <Grid item>
                <Typography>
                  No ERC721 tokens were donated on this round
                </Typography>
              </Grid>
            )}
          </Grid>
        </Box>

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
            fontSize={matches ? 22 : 18}
            color="rgba(255, 255, 255, 0.68)"
            textAlign="center"
          >
            you are also buying a raffle ticket. When the round ends, there
            are&nbsp;
            {data.NumRaffleEthWinners + data.NumRaffleNFTWinners} raffle
            winners:
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
                <Typography
                  sx={{ fontSize: "26px !important" }}
                  textAlign="center"
                >
                  {data.NumRaffleEthWinners} will receive
                </Typography>
                <GradientText variant="h3" textAlign="center">
                  {data.RafflePercentage}% of the ETH
                </GradientText>
                <Typography
                  sx={{ fontSize: "22px !important" }}
                  color="rgba(255, 255, 255, 0.68)"
                  textAlign="center"
                >
                  in the pot each
                </Typography>
              </GradientBorder>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <GradientBorder sx={{ padding: "50px" }}>
                <Typography
                  sx={{ fontSize: "26px !important" }}
                  textAlign="center"
                >
                  {data.NumRaffleNFTWinners} will receive
                </Typography>
                <GradientText variant="h3" textAlign="center">
                  1 Cosmic NFT
                </GradientText>
                <Typography
                  sx={{ fontSize: "22px !important" }}
                  color="rgba(255, 255, 255, 0.68)"
                  textAlign="center"
                >
                  each
                </Typography>
              </GradientBorder>
            </Grid>
          </Grid>
        </Box>
        {prizeInfo && <RaffleWinners prizeInfo={prizeInfo} />}

        <Box sx={{ padding: "90px 0 80px" }}>
          <Typography variant="h4" textAlign="center">
            FAQ&#39;S
          </Typography>
          <Box textAlign="center" marginBottom="56px">
            <Image
              src={"/images/divider.svg"}
              width={93}
              height={3}
              alt="divider"
            />
          </Box>
          <FAQ />
        </Box>
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
  const nftDonations = await api.get_donations_nft_by_round(
    dashboardData.CurRoundNum - 1
  );

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
