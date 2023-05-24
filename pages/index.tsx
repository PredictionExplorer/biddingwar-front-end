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

const NewHome = ({ biddingHistory, data, nfts, prizeInfo }) => {
  const [withdrawalSeconds, setWithdrawalSeconds] = useState(null);
  const [countdownCompleted, setCountdownCompleted] = useState(false);
  // const [activationTime, setActivationTime] = useState(1702377200);
  const [message, setMessage] = useState("");
  const [nftDonateAddress, setNftDonateAddress] = useState("");
  const [nftId, setNftId] = useState(-1);
  const [rwlkId, setRwlkId] = useState(-1);
  const [galleryVisibility, setGalleryVisibility] = useState(false);

  const [rwlknftIds, setRwlknftIds] = useState([]);
  // const [newActivationTime, setNewActivationTime] = useState<Dayjs | null>(
  //   dayjs(Date.now() + 3600000)
  // );
  // const [contractOwner, setContractOwner] = useState("");
  const { library, account } = useActiveWeb3React();
  const biddingWarContract = useBiddingWarContract();
  const nftRWLKContract = useRWLKNFTContract();
  const cosmicSignatureContract = useCosmicSignatureContract();

  const onClaimPrize = async () => {
    try {
      const receipt = await biddingWarContract
        .claimPrize()
        .then((tx) => tx.wait());
      console.log(receipt);
      const balance = await cosmicSignatureContract.totalSupply();
      const token_id = balance.toNumber() - 1;
      console.log(balance.toNumber());
      const seed = await cosmicSignatureContract.seeds(token_id);
      await api.create(token_id, seed);
      setTimeout(() => {
        router.push({
          pathname: `/detail/${token_id}`,
          query: {
            message: "success",
          },
        });
      }, 2000);
      getData();
    } catch (err) {
      console.log(err);
      alert(err.message);
    }
  };

  const onBid = async () => {
    try {
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

      // const activationTime = (
      //   await biddingWarContract.activationTime()
      // ).toNumber();
      // setActivationTime(activationTime);

      // const owner = await biddingWarContract.owner();
      // setContractOwner(owner);
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
  // if (activationTime * 1000 > Date.now()) {
  //   return (
  //     <MainWrapper>
  //       <Box mb={2}>
  //         <Countdown date={activationTime * 1000} renderer={Counter} />
  //       </Box>
  //     </MainWrapper>
  //   );
  // }

  return (
    <>
      <MainWrapper>
        <Box sx={{ display: "flex", gap: "70px" }}>
          <Box sx={{ flex: 1 }}>
            <StyledCard>
              <CardActionArea>
                <NFTImage image="https://cosmic-game.s3.us-east-2.amazonaws.com/000000.png" />
              </CardActionArea>
            </StyledCard>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4">Current Bid</Typography>
            {!!(withdrawalSeconds && !countdownCompleted) && (
              <Countdown
                date={Date.now() + withdrawalSeconds * 1000}
                renderer={Counter}
                onComplete={() => setCountdownCompleted(true)}
              />
            )}
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
                  onClick={() => setGalleryVisibility(!galleryVisibility)}
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
          </Box>
        </Box>

        <Prize prizeAmount={data.PrizeAmountEth} />

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
          <BiddingHistory biddingHistory={biddingHistory} />
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
          <Box sx={{ display: "flex", gap: "28px" }}>
            <GradientBorder sx={{ flex: 1, padding: "50px" }}>
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
            <GradientBorder sx={{ flex: 1, padding: "50px" }}>
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
          </Box>
        </Box>
        {prizeInfo && <Winners prizeInfo={prizeInfo} />}
        <FAQ />
      </Container>
    </>
  );
};

export async function getServerSideProps() {
  const biddingHistory = await api.get_bid_list();
  const dashboardData = await api.get_dashboard_info();
  const nfts = await api.get_cst_list();
  const prizeList = await api.get_prize_list();
  let prizeInfo;
  if (prizeList.length) {
    prizeInfo = await api.get_prize_info(prizeList.length - 1);
  } else {
    prizeInfo = null;
  }
  return {
    props: {
      biddingHistory,
      data: dashboardData,
      nfts,
      prizeInfo,
    },
  };
}

export default NewHome;
