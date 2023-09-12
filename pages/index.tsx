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
  InputAdornment,
  Pagination,
  Link,
} from "@mui/material";
import {
  CustomTextField,
  GradientBorder,
  GradientText,
  MainWrapper,
  StyledCard,
  StyledInput,
} from "../components/styled";
import BiddingHistory from "../components/BiddingHistoryTable";
import api from "../services/api";
import useCosmicGameContract from "../hooks/useCosmicGameContract";
import { BigNumber, Contract, constants, ethers } from "ethers";
import useRWLKNFTContract from "../hooks/useRWLKNFTContract";
import { useActiveWeb3React } from "../hooks/web3";
import { COSMICGAME_ADDRESS } from "../config/app";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FAQ from "../components/FAQ";
import { ArrowForward } from "@mui/icons-material";
import NFT_ABI from "../contracts/RandomWalkNFT.json";
import PaginationRWLKGrid from "../components/PaginationRWLKGrid";
import useCosmicSignatureContract from "../hooks/useCosmicSignatureContract";
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
import NFTImage from "../components/NFTImage";
import { calculateTimeDiff } from "../utils";
import { useCookies } from "react-cookie";
import WinningHistoryTable from "../components/WinningHistoryTable";

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
  const [donatedNFTs, setDonatedNFTs] = useState(nftDonations);
  const [prizeTime, setPrizeTime] = useState(0);
  const [message, setMessage] = useState("");
  const [nftDonateAddress, setNftDonateAddress] = useState("");
  const [nftId, setNftId] = useState(-1);
  const [rwlkId, setRwlkId] = useState(-1);
  const [bidPricePlus, setBidPricePlus] = useState(2);
  const [galleryVisibility, setGalleryVisibility] = useState(false);
  const [isBidding, setIsBidding] = useState(false);
  const [notification, setNotification] = useState({
    text: "",
    visible: false,
  });
  const [bannerTokenId, setBannerTokenId] = useState("");
  const [rwlknftIds, setRwlknftIds] = useState([]);
  const [roundStartedAgo, setRoundStartedAgo] = useState("");
  const [curPage, setCurrentPage] = useState(1);
  const [claimHistory, setClaimHistory] = useState(null);
  const perPage = 12;
  // const [blackVideo, setBlackVideo] = useState(null);

  const { library, account } = useActiveWeb3React();
  const cosmicGameContract = useCosmicGameContract();
  const nftRWLKContract = useRWLKNFTContract();
  const cosmicSignatureContract = useCosmicSignatureContract();
  // const ref = useRef(null);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("md"));
  const [cookies, setCookie] = useCookies(["banner_id"]);

  const gridLayout =
    nftDonations.length > 16
      ? { xs: 6, sm: 3, md: 2, lg: 2 }
      : nftDonations.length > 9
      ? { xs: 6, sm: 4, md: 3, lg: 3 }
      : { xs: 12, sm: 6, md: 4, lg: 4 };

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
      const estimageGas = await cosmicGameContract.estimateGas.claimPrize();
      let gasLimit = estimageGas
        .mul(BigNumber.from(115))
        .div(BigNumber.from(100));
      gasLimit = gasLimit.gt(BigNumber.from(2000000))
        ? gasLimit
        : BigNumber.from(2000000);
      await cosmicGameContract.claimPrize({ gasLimit }).then((tx) => tx.wait());
      const balance = await cosmicSignatureContract.totalSupply();
      const token_id = balance.toNumber() - 1;
      const seed = await cosmicSignatureContract.seeds(token_id);
      await api.create(token_id, seed);
      router.push({
        pathname: "/my-wallet",
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
      bidPrice = await cosmicGameContract.getBidPrice();
      newBidPrice =
        parseFloat(ethers.utils.formatEther(bidPrice)) *
        1.01 *
        (1 + bidPricePlus / 100);
      let receipt;
      if (!nftDonateAddress || nftId === -1) {
        receipt = await cosmicGameContract
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
          COSMICGAME_ADDRESS
        );
        if (!isApprovedForAll && approvedBy !== COSMICGAME_ADDRESS) {
          await nftDonateContract
            .setApprovalForAll(COSMICGAME_ADDRESS, true)
            .then((tx) => tx.wait());
        }
        receipt = await cosmicGameContract
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
        receipt = await cosmicGameContract
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
        COSMICGAME_ADDRESS
      );
      if (!isApprovedForAll) {
        await nftDonateContract
          .setApprovalForAll(COSMICGAME_ADDRESS, true)
          .then((tx) => tx.wait());
      }
      receipt = await cosmicGameContract
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

  const playAudio = async () => {
    console.log("play sounds");
    try {
      const audioElement = new Audio("/audio/notification.wav");
      await audioElement.play();
    } catch (error) {
      console.error("Error requesting sound permission:", error);
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

  // useEffect(() => {
  //   if (blackVideo) {
  //     ref.current.load();
  //   }
  // }, [blackVideo]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const response = await fetch("/api/dashboard");
      const newData = await response.json();

      const bidResponse = await fetch(
        `/api/bid/?round=${newData.CurRoundNum - 1}&sortDir=desc`
      );
      const newBidData = await bidResponse.json();
      setCurBidList(newBidData);

      const nftResponse = await fetch(
        `/api/donatedNftByRound/?round=${newData.CurRoundNum - 1}`
      );
      const nftData = await nftResponse.json();
      setDonatedNFTs(nftData);

      setData((prevData) => {
        if (
          account !== newData.LastBidderAddr &&
          prevData.CurNumBids < newData.CurNumBids
        ) {
          playAudio();
        }
        return newData;
      });
    };

    const fetchPrizeTime = async () => {
      const res = await fetch("/api/prizeTime");
      const t = await res.json();
      const response = await fetch("/api/currentTimeStamp");
      const current = await response.json();
      const offset = current * 1000 - Date.now();
      setPrizeTime(t * 1000 - offset);
    };

    fetchPrizeTime();
    let bannerId = cookies.banner_id;
    if (!cookies.banner_id) {
      bannerId = Math.floor(Math.random() * nfts.length);
      const date = new Date();
      date.setHours(date.getHours() + 1);
      setCookie("banner_id", bannerId, { expires: date });
    }
    const fileName = bannerId.toString().padStart(6, "0");
    setBannerTokenId(fileName);

    const fetchClaimHistory = async () => {
      const res = await fetch("/api/claimHistory");
      const history = await res.json();
      setClaimHistory(history);
    };
    fetchClaimHistory();

    // setBlackVideo(
    //   `https://cosmic-game.s3.us-east-2.amazonaws.com/${fileName}.mp4`
    // );
    // Fetch data every 12 seconds
    const interval = setInterval(() => {
      fetchDashboardData();
      fetchPrizeTime();
    }, 12000);

    // Clean up the interval when the component is unmounted
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (data.TsRoundStart) {
        const response = await fetch("/api/currentTimeStamp");
        const current = await response.json();
        const timeDiff = calculateTimeDiff(data.TsRoundStart, current);
        setRoundStartedAgo(timeDiff);
      } else {
        setRoundStartedAgo("");
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      {/* {blackVideo && (
        <div
          style={{
            position: "fixed",
            top: 125,
            bottom: 64,
            left: 0,
            right: 0,
            zIndex: -1,
          }}
        >
          <video
            autoPlay
            muted
            playsInline
            style={{
              position: "absolute",
              width: "100%",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
            ref={ref}
          >
            <source src={blackVideo} type="video/mp4"></source>
          </video>
        </div>
      )} */}
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
                <NFTImage
                  src={
                    bannerTokenId === ""
                      ? "/images/qmark.png"
                      : `https://cosmic-game.s3.us-east-2.amazonaws.com/${bannerTokenId}.png`
                  }
                />
              </CardActionArea>
            </StyledCard>
            <Typography color="primary" mt={4}>
              Random sample of your possible NFT
            </Typography>
            <Box mt={4}>
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
              <Typography color="primary" mt={4}>
                Distribution of Prize funds
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Typography variant="h4" mr={1} component="span">
              Current Bid
            </Typography>
            <Typography variant="h5" component="span">
              (Round #{data.CurRoundNum})
            </Typography>
            {prizeTime > Date.now() ? (
              <Countdown key={0} date={prizeTime} renderer={Counter} />
            ) : (
              <Countdown key={1} date={Date.now()} renderer={Counter} />
            )}
            <Box>
              <Typography color="primary" component="span">
                Bid Price:
              </Typography>
              &nbsp;
              <Typography component="span">
                {data.BidPriceEth.toFixed(6)} ETH
              </Typography>
            </Box>
            <Box>
              <Typography color="primary" component="span">
                Reward:
              </Typography>
              &nbsp;
              <Typography component="span">
                {data.PrizeAmountEth.toFixed(4)} ETH
              </Typography>
            </Box>
            {roundStartedAgo && (
              <Box>
                <Typography color="primary" component="span">
                  Round Started:
                </Typography>
                &nbsp;
                <Typography component="span">{roundStartedAgo} ago</Typography>
              </Box>
            )}
            <Box sx={{ mt: "24px" }}>
              <Typography color="primary">Last Bidder Address:</Typography>
              <Typography>
                {data.LastBidderAddr === constants.AddressZero ? (
                  "There is no bidder yet."
                ) : (
                  <Link
                    href={`/user/${data.LastBidderAddr}`}
                    color="rgb(255, 255, 255)"
                  >
                    {data.LastBidderAddr}
                  </Link>
                )}
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
                      If you want to donate one of your NFTs while bidding, you
                      can put the contract address, NFT id, and comment here.
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
                    <Box
                      sx={{
                        display: "flex",
                        marginTop: 2,
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        whiteSpace="nowrap"
                        color="rgba(255, 255, 255, 0.68)"
                        mr={2}
                      >
                        Rise bid price by
                      </Typography>
                      <CustomTextField
                        type="number"
                        placeholder="Bid Price Plus"
                        value={bidPricePlus}
                        size="small"
                        fullWidth
                        InputProps={{
                          inputComponent: StyledInput,
                          endAdornment: (
                            <InputAdornment position="end">%</InputAdornment>
                          ),
                          inputProps: { min: 0 },
                        }}
                        onChange={(e) =>
                          setBidPricePlus(Number(e.target.value))
                        }
                      />
                      <Typography
                        whiteSpace="nowrap"
                        color="rgba(255, 255, 255, 0.68)"
                        ml={2}
                      >
                        {(data.BidPriceEth * (1 + bidPricePlus / 100)).toFixed(
                          6
                        )}{" "}
                        ETH
                      </Typography>
                    </Box>
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
                            {prizeTime + 300000 > Date.now() &&
                              data.LastBidderAddr !== account && (
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
                Also, {data.NumRaffleNFTWinners} additional winners and{" "}
                {data.NumHolderNFTWinners} Random Walk NFT holders and{" "}
                {data.NumHolderNFTWinners} CosmicSignature token holders will be
                chosen which will receive a Cosmic Signature NFT.
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Prize prizeAmount={data.PrizeAmountEth} />

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
            {data.NumRaffleEthWinners +
              data.NumRaffleNFTWinners +
              data.NumHolderNFTWinners * 2}
            &nbsp;raffle winners:
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
                  {data.NumRaffleNFTWinners + data.NumHolderNFTWinners * 2} will
                  receive
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
        <Box marginTop="80px">
          <Box>
            <Typography variant="h6" component="span">
              DONATED
            </Typography>
            <Typography variant="h6" color="primary" component="span" mx={1}>
              ERC721 TOKENS
            </Typography>
            <Typography variant="h6" component="span">
              FOR CURRENT ROUND
            </Typography>
          </Box>
          {donatedNFTs.length > 0 ? (
            <>
              <Grid container spacing={2} mt={2}>
                {donatedNFTs.map((nft) => (
                  <Grid
                    item
                    key={nft.RecordId}
                    xs={gridLayout.xs}
                    sm={gridLayout.sm}
                    md={gridLayout.md}
                    lg={gridLayout.lg}
                  >
                    <DonatedNFT nft={nft} />
                  </Grid>
                ))}
              </Grid>
              <Box display="flex" justifyContent="center" mt={4}>
                <Pagination
                  color="primary"
                  page={curPage}
                  onChange={(e, page) => setCurrentPage(page)}
                  count={Math.ceil(donatedNFTs.length / perPage)}
                  hideNextButton
                  hidePrevButton
                  shape="rounded"
                />
              </Box>
            </>
          ) : (
            <Typography mt={2}>
              No ERC721 tokens were donated on this round
            </Typography>
          )}
        </Box>
        <Box mt="120px">
          <Box>
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
        <Box mt="60px">
          <Typography variant="h4" textAlign="center" mb={6}>
            History of Winnings
          </Typography>
          {claimHistory === null ? (
            <Typography>Loading...</Typography>
          ) : (
            <WinningHistoryTable winningHistory={claimHistory} />
          )}
        </Box>

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
