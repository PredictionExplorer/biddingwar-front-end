import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Button,
  Box,
  Typography,
  Grid,
  TextField,
  CardActionArea,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Container,
} from "@mui/material";
import Countdown from "react-countdown";
import {
  GradientText,
  MainWrapper,
  NFTImage,
  StyledCard,
  StyledLink,
} from "../components/styled";
import Counter from "../components/Counter";
import BiddingHistory from "../components/BiddingHistory";
import api from "../services/api";
import useBiddingWarContract from "../hooks/useBiddingWarContract";
import { Contract, ethers } from "ethers";
import useRWLKNFTContract from "../hooks/useRWLKNFTContract";
import { useActiveWeb3React } from "../hooks/web3";
import dayjs, { Dayjs } from "dayjs";
import { BIDDINGWAR_ADDRESS } from "../config/app";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FAQ from "../components/FAQ";
import { ArrowForward } from "@mui/icons-material";
import useNFTContract from "../hooks/useNFTContract";
import NFT_ABI from "../contracts/NFT.json";
import PaginationNFTGrid from "../components/PaginationNFTGrid";

const NewHome = ({ biddingHistory, page, totalCount, data, donatedNfts }) => {
  const [withdrawalSeconds, setWithdrawalSeconds] = useState(null);
  const [activationTime, setActivationTime] = useState(1682377200);
  const [message, setMessage] = useState("");
  const [nftDonateAddress, setNftDonateAddress] = useState("");
  const [nftId, setNftId] = useState(-1);
  const [rwlkId, setRwlkId] = useState();

  const [open, setOpen] = useState(false);
  const [donatedNFTOpen, setDonatedNFTOpen] = useState(false);
  const [rwlknftIds, setRwlknftIds] = useState([]);
  const [bidOptions, setBidOptions] = useState({
    withRWLK: false,
    withDonation: false,
  });
  const [newActivationTime, setNewActivationTime] = useState<Dayjs | null>(
    dayjs(Date.now() + 3600000)
  );
  const [contractOwner, setContractOwner] = useState("");
  const { library, account } = useActiveWeb3React();
  const biddingWarContract = useBiddingWarContract();
  const nftRWLKContract = useRWLKNFTContract();

  // const handleBid = async (
  //   message: string,
  //   rwlkID?: number,
  //   nftAddress?: string,
  //   nftID?: number,
  //   nftContract?: any
  // ) => {
  //   try {
  //     const bidPrice = await biddingWarContract.getBidPrice();
  //     const newBidPrice = parseFloat(ethers.utils.formatEther(bidPrice)) * 1.01;
  //     let receipt;
  //     if (!bidOptions.withDonation) {
  //       if (!bidOptions.withRWLK) {
  //         receipt = await biddingWarContract
  //           .bid(message, {
  //             value: ethers.utils.parseEther(newBidPrice.toFixed(6)),
  //           })
  //           .then((tx) => tx.wait());
  //       } else {
  //         receipt = await biddingWarContract
  //           .bidWithRWLK(rwlkID, message)
  //           .then((tx) => tx.wait());
  //       }
  //     } else {
  //       // setApprovalForAll
  //       const response = await nftContract
  //         .setApprovalForAll(BIDDINGWAR_ADDRESS, true)
  //         .then((tx) => tx.wait());
  //       console.log(response);
  //       if (!bidOptions.withRWLK) {
  //         receipt = await biddingWarContract
  //           .bidAndDonateNFT(message, nftAddress, nftID, {
  //             value: ethers.utils.parseEther(newBidPrice.toFixed(6)),
  //           })
  //           .then((tx) => tx.wait());
  //       } else {
  //         receipt = await biddingWarContract
  //           .bidWithRWLKAndDonateNFT(rwlkID, message, nftAddress, nftID)
  //           .then((tx) => tx.wait());
  //       }
  //     }
  //     console.log(receipt);
  //     getData();
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  // const openBidDialog = (bidType: string) => {
  //   if (bidType === "Bid") {
  //     setBidOptions({
  //       withDonation: false,
  //       withRWLK: false,
  //     });
  //   } else if (bidType === "Bid with RWLK") {
  //     setBidOptions({
  //       withDonation: false,
  //       withRWLK: true,
  //     });
  //   } else if (bidType === "Bid & Donate") {
  //     setBidOptions({
  //       withDonation: true,
  //       withRWLK: false,
  //     });
  //   } else if (bidType === "Bid with RWLK & Donate") {
  //     setBidOptions({
  //       withDonation: true,
  //       withRWLK: true,
  //     });
  //   }
  //   setOpen(true);
  // };

  // const openClaimDialog = () => {
  //   setDonatedNFTOpen(true);
  // };

  const onClaimPrize = async () => {
    try {
      const receipt = await biddingWarContract
        .claimPrize()
        .then((tx) => tx.wait());
      console.log(receipt);
      getData();
    } catch (err) {
      console.log(err);
      alert(err.message);
    }
  };

  // const claimDonatedNFT = async (token) => {
  //   try {
  //     const receipt = await biddingWarContract
  //       .claimDonatedNFT(token.RecordId)
  //       .then((tx) => tx.wait());
  //     console.log(receipt);
  //     getData();
  //   } catch (err) {
  //     console.log(err);
  //     alert(err.message);
  //   }
  // };

  // const onSetActivationTime = async () => {
  //   try {
  //     const receipt = await biddingWarContract
  //       .setActivationTime(newActivationTime.unix())
  //       .then((tx) => tx.wait());
  //     console.log(receipt);
  //     getData();
  //   } catch (err) {
  //     console.log(err);
  //     alert(err.message);
  //   }
  // };

  const onBid = async () => {
    try {
      const bidPrice = await biddingWarContract.getBidPrice();
      const newBidPrice = parseFloat(ethers.utils.formatEther(bidPrice)) * 1.01;
      let receipt;
      if (!nftDonateAddress || nftId === -1) {
        receipt = await biddingWarContract
          .bid(message, {
            value: ethers.utils.parseEther(newBidPrice.toFixed(6)),
          })
          .then((tx) => tx.wait());
      } else {
        // setApprovalForAll
        const nftDonateContract = new Contract(
          nftDonateAddress,
          NFT_ABI,
          library.getSigner(account)
        );
        const response = await nftDonateContract
          .setApprovalForAll(BIDDINGWAR_ADDRESS, true)
          .then((tx) => tx.wait());
        console.log(response);
        receipt = await biddingWarContract
          .bidAndDonateNFT(message, nftDonateAddress, nftId, {
            value: ethers.utils.parseEther(newBidPrice.toFixed(6)),
          })
          .then((tx) => tx.wait());
      }
      console.log(receipt);
      getData();
    } catch (err) {
      console.log(err);
    }
  };

  const onBidWithRWLK = async () => {
    try {
      let receipt;
      if (!bidOptions.withDonation) {
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
        const response = await nftDonateContract
          .setApprovalForAll(BIDDINGWAR_ADDRESS, true)
          .then((tx) => tx.wait());
        console.log(response);

        receipt = await biddingWarContract
          .bidWithRWLKAndDonateNFT(rwlkId, message, nftDonateAddress, nftId)
          .then((tx) => tx.wait());
      }
      console.log(receipt);
      getData();
    } catch (err) {
      console.log(err);
    }
  };

  const getData = async () => {
    if (biddingWarContract) {
      const seconds = (await biddingWarContract.timeUntilPrize()).toNumber();
      setWithdrawalSeconds(seconds);

      const activationTime = (
        await biddingWarContract.activationTime()
      ).toNumber();
      setActivationTime(activationTime);

      const owner = await biddingWarContract.owner();
      setContractOwner(owner);
    }
    if (nftRWLKContract && account) {
      const tokens = await nftRWLKContract.walletOfOwner(account);
      const nftIds = tokens.map((t) => t.toNumber()).reverse();
      setRwlknftIds(nftIds);
    }
  };

  useEffect(() => {
    getData();
  }, [biddingWarContract, nftRWLKContract, account]);

  if (withdrawalSeconds === null) return null;
  if (activationTime > Date.now()) {
    return (
      <MainWrapper>
        <Box mb={2}>
          <Countdown date={activationTime * 1000} renderer={Counter} />
        </Box>
      </MainWrapper>
    );
  }

  return (
    <>
      <MainWrapper>
        <Box sx={{ display: "flex", gap: "70px" }}>
          <Box sx={{ flex: 1 }}>
            <StyledCard>
              <CardActionArea>
                <NFTImage image="https://randomwalknft.s3.us-east-2.amazonaws.com/000496_black_thumb.jpg" />
              </CardActionArea>
            </StyledCard>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4">Current Bid</Typography>
            <Box sx={{ display: "flex" }}>
              <Typography color="primary">BID PRICE:</Typography>
              &nbsp;
              <Typography>{data.BidPriceEth.toFixed(6)}</Typography>
            </Box>
            <Box sx={{ display: "flex" }}>
              <Typography color="primary">REWARD:</Typography>
              &nbsp;
              <Typography>{data.PrizeAmountEth.toFixed(4)}</Typography>
            </Box>
            <Box sx={{ display: "flex" }}>
              <Typography color="primary">Charity Address:</Typography>
              &nbsp;
              <Typography>{data.CharityAddr}</Typography>
            </Box>
            <Box sx={{ display: "flex" }}>
              <Typography color="primary">Percentage of Donation:</Typography>
              &nbsp;
              <Typography>{data.CharityPercentage}%</Typography>
            </Box>
            <Box sx={{ my: "24px" }}>
              <Typography color="primary">Last Bidder Address:</Typography>
              <Typography>
                <StyledLink href={`/gallery?address=${data.LastBidderAddr}`}>
                  {data.LastBidderAddr}
                </StyledLink>
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
              <Box sx={{ display: "flex", mt: "45px" }}>
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForward />}
                  sx={{ width: "33%", marginRight: "24px" }}
                  onClick={onBid}
                >
                  Bid Now
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  endIcon={<ArrowForward />}
                  sx={{ flex: 1 }}
                  onClick={onBidWithRWLK}
                >
                  Bid with Random Walk NFT
                </Button>
              </Box>
              <Button
                variant="outlined"
                size="large"
                endIcon={<ArrowForward />}
                sx={{ width: "33%", mt: "20px" }}
                onClick={onClaimPrize}
              >
                Claim Prize
              </Button>
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
              >
                <Typography variant="h6">Random Walk NFT Gallery</Typography>
                <Typography variant="body2">
                  If you own some RandomWalkNFTs, you can use them to bid for
                  free! Each NFT can be used only once!
                </Typography>
                <PaginationNFTGrid
                  loading={false}
                  data={[0, 1, 2, 3, 4, 6, 7, 8, 9]}
                  selectedToken={rwlkId}
                  setSelectedToken={setRwlkId}
                />
              </Box>
            </Box>
            <Typography variant="body2">
              When you bid, you will get 100 tokens as a reward. These tokens
              allow you to participate in the DAO.
            </Typography>
          </Box>
        </Box>

        <Box mt="130px">
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexWrap="wrap"
          >
            <Typography variant="h4" component="span">
              The
            </Typography>
            <Typography
              variant="h4"
              component="span"
              color="primary"
              sx={{ ml: 1.5 }}
            >
              Winner
            </Typography>
            <Typography variant="h4" component="span" sx={{ ml: 1.5 }}>
              will Receive
            </Typography>
          </Box>
          <Box textAlign="center" marginBottom="56px">
            <Image
              src={"/images/divider.svg"}
              width={93}
              height={3}
              alt="divider"
            />
          </Box>
          <Box sx={{ display: "flex", gap: "60px" }}>
            <StyledCard sx={{ flex: 1 }}>
              <CardActionArea
                sx={{ display: "flex", justifyContent: "start", p: "16px" }}
              >
                <Image
                  src={"/images/CosmicSignatureNFT.png"}
                  width={88}
                  height={88}
                  alt="cosmic signature nft"
                />
                <GradientText variant="h5" marginLeft="16px">
                  1 Cosmic Signature NFT
                </GradientText>
              </CardActionArea>
            </StyledCard>
            <StyledCard sx={{ flex: 1 }}>
              <CardActionArea
                sx={{ display: "flex", justifyContent: "start", p: "16px" }}
              >
                <Image
                  src={"/images/Ethereum.png"}
                  width={88}
                  height={88}
                  alt="cosmic signture nft"
                />
                <GradientText variant="h5" marginLeft="16px">
                  1 Cosmic Signature NFT
                </GradientText>
              </CardActionArea>
            </StyledCard>
          </Box>
        </Box>

        <Grid container spacing={2} marginTop="138px">
          <Grid item xs={4}>
            <StyledCard>
              <CardActionArea>
                <NFTImage image="https://randomwalknft.s3.us-east-2.amazonaws.com/000496_black_thumb.jpg" />
              </CardActionArea>
              <Box
                sx={{
                  display: "flex",
                  position: "absolute",
                  inset: "16px",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="caption">#000176</Typography>
                <Typography color="primary">Donated</Typography>
              </Box>
            </StyledCard>
          </Grid>
          <Grid item xs={4}>
            <StyledCard>
              <CardActionArea>
                <NFTImage image="https://randomwalknft.s3.us-east-2.amazonaws.com/000496_black_thumb.jpg" />
              </CardActionArea>
              <Box
                sx={{
                  display: "flex",
                  position: "absolute",
                  inset: "16px",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="caption">#000176</Typography>
                <Typography color="primary">Donated</Typography>
              </Box>
            </StyledCard>
          </Grid>
          <Grid item xs={4}>
            <StyledCard>
              <CardActionArea>
                <NFTImage image="https://randomwalknft.s3.us-east-2.amazonaws.com/000496_black_thumb.jpg" />
              </CardActionArea>
              <Box
                sx={{
                  display: "flex",
                  position: "absolute",
                  inset: "16px",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="caption">#000176</Typography>
                <Typography color="primary">Donated</Typography>
              </Box>
            </StyledCard>
          </Grid>
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
          <BiddingHistory
            curPage={page}
            biddingHistory={biddingHistory}
            totalCount={totalCount}
          />
        </Box>
      </MainWrapper>

      <Box
        sx={{
          backgroundColor: "#101441",
        }}
      >
        <Container sx={{ padding: "80px 0 150px" }}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexWrap="wrap"
          >
            <Typography variant="h4" component="span">
              Latest NFT&#39;s
            </Typography>
          </Box>
          <Box textAlign="center" marginBottom="56px">
            <Image
              src={"/images/divider.svg"}
              width={93}
              height={3}
              alt="divider"
            />
          </Box>

          <Grid container spacing={2} marginTop="58px">
            <Grid item xs={4} sx={{ position: "relative" }}>
              <StyledCard>
                <CardActionArea>
                  <NFTImage image="https://randomwalknft.s3.us-east-2.amazonaws.com/000496_black_thumb.jpg" />
                </CardActionArea>
              </StyledCard>
              <Box
                sx={{
                  display: "flex",
                  position: "absolute",
                  top: "32px",
                  left: "32px",
                  right: "16px",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="caption" component="p">
                    #000176
                  </Typography>
                  <Box sx={{ display: "flex" }}>
                    <Image
                      src={"/images/Ethereum_small.svg"}
                      width={16}
                      height={16}
                      alt="ethereum"
                    />
                    <Typography variant="caption" color="primary" component="p">
                      3.2 NFT
                    </Typography>
                  </Box>
                </Box>
                <Button
                  variant="contained"
                  endIcon={<ArrowForward />}
                  sx={{ width: "140px" }}
                >
                  Bid Now
                </Button>
              </Box>
            </Grid>
            <Grid item xs={4} sx={{ position: "relative" }}>
              <StyledCard>
                <CardActionArea>
                  <NFTImage image="https://randomwalknft.s3.us-east-2.amazonaws.com/000496_black_thumb.jpg" />
                </CardActionArea>
              </StyledCard>
              <Box
                sx={{
                  display: "flex",
                  position: "absolute",
                  top: "32px",
                  left: "32px",
                  right: "16px",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="caption" component="p">
                    #000176
                  </Typography>
                  <Box sx={{ display: "flex" }}>
                    <Image
                      src={"/images/Ethereum_small.svg"}
                      width={16}
                      height={16}
                      alt="ethereum"
                    />
                    <Typography variant="caption" color="primary" component="p">
                      3.2 NFT
                    </Typography>
                  </Box>
                </Box>
                <Button
                  variant="contained"
                  endIcon={<ArrowForward />}
                  sx={{ width: "140px" }}
                >
                  Bid Now
                </Button>
              </Box>
            </Grid>
            <Grid item xs={4} sx={{ position: "relative" }}>
              <StyledCard>
                <CardActionArea>
                  <NFTImage image="https://randomwalknft.s3.us-east-2.amazonaws.com/000496_black_thumb.jpg" />
                </CardActionArea>
              </StyledCard>
              <Box
                sx={{
                  display: "flex",
                  position: "absolute",
                  top: "32px",
                  left: "32px",
                  right: "16px",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="caption" component="p">
                    #000176
                  </Typography>
                  <Box sx={{ display: "flex" }}>
                    <Image
                      src={"/images/Ethereum_small.svg"}
                      width={16}
                      height={16}
                      alt="ethereum"
                    />
                    <Typography variant="caption" color="primary" component="p">
                      3.2 NFT
                    </Typography>
                  </Box>
                </Box>
                <Button
                  variant="contained"
                  endIcon={<ArrowForward />}
                  sx={{ width: "140px" }}
                >
                  Bid Now
                </Button>
              </Box>
            </Grid>
            <Grid item xs={4} sx={{ position: "relative" }}>
              <StyledCard>
                <CardActionArea>
                  <NFTImage image="https://randomwalknft.s3.us-east-2.amazonaws.com/000496_black_thumb.jpg" />
                </CardActionArea>
              </StyledCard>
              <Box
                sx={{
                  display: "flex",
                  position: "absolute",
                  top: "32px",
                  left: "32px",
                  right: "16px",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="caption" component="p">
                    #000176
                  </Typography>
                  <Box sx={{ display: "flex" }}>
                    <Image
                      src={"/images/Ethereum_small.svg"}
                      width={16}
                      height={16}
                      alt="ethereum"
                    />
                    <Typography variant="caption" color="primary" component="p">
                      3.2 NFT
                    </Typography>
                  </Box>
                </Box>
                <Button
                  variant="contained"
                  endIcon={<ArrowForward />}
                  sx={{ width: "140px" }}
                >
                  Bid Now
                </Button>
              </Box>
            </Grid>
            <Grid item xs={4} sx={{ position: "relative" }}>
              <StyledCard>
                <CardActionArea>
                  <NFTImage image="https://randomwalknft.s3.us-east-2.amazonaws.com/000496_black_thumb.jpg" />
                </CardActionArea>
              </StyledCard>
              <Box
                sx={{
                  display: "flex",
                  position: "absolute",
                  top: "32px",
                  left: "32px",
                  right: "16px",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="caption" component="p">
                    #000176
                  </Typography>
                  <Box sx={{ display: "flex" }}>
                    <Image
                      src={"/images/Ethereum_small.svg"}
                      width={16}
                      height={16}
                      alt="ethereum"
                    />
                    <Typography variant="caption" color="primary" component="p">
                      3.2 NFT
                    </Typography>
                  </Box>
                </Box>
                <Button
                  variant="contained"
                  endIcon={<ArrowForward />}
                  sx={{ width: "140px" }}
                >
                  Bid Now
                </Button>
              </Box>
            </Grid>
            <Grid item xs={4} sx={{ position: "relative" }}>
              <StyledCard>
                <CardActionArea>
                  <NFTImage image="https://randomwalknft.s3.us-east-2.amazonaws.com/000496_black_thumb.jpg" />
                </CardActionArea>
              </StyledCard>
              <Box
                sx={{
                  display: "flex",
                  position: "absolute",
                  top: "32px",
                  left: "32px",
                  right: "16px",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="caption" component="p">
                    #000176
                  </Typography>
                  <Box sx={{ display: "flex" }}>
                    <Image
                      src={"/images/Ethereum_small.svg"}
                      width={16}
                      height={16}
                      alt="ethereum"
                    />
                    <Typography variant="caption" color="primary" component="p">
                      3.2 NFT
                    </Typography>
                  </Box>
                </Box>
                <Button
                  variant="contained"
                  endIcon={<ArrowForward />}
                  sx={{ width: "140px" }}
                >
                  Bid Now
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <FAQ />
    </>
  );
};

export async function getServerSideProps(context) {
  const page = context.query.page ?? 1;
  const res = await api.biddingHistory(page);
  const dashboardData = await api.dashboardInfo();
  const { NFTDonations: donatedNfts } = await api.donatedNFTs();
  return {
    props: {
      biddingHistory: res.biddingHistory,
      totalCount: res.totalCount,
      page,
      data: dashboardData,
      donatedNfts,
    },
  };
}

export default NewHome;
