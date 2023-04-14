import React, { useState, useEffect } from "react";
import {
  Button,
  Box,
  Typography,
  Grid,
  TextField,
  CardActionArea,
} from "@mui/material";
import Countdown from "react-countdown";
import {
  CenterBox,
  MainWrapper,
  NFTImage,
  NFTInfoWrapper,
  StyledCard,
  StyledLink,
} from "../components/styled";
import Counter from "../components/Counter";
import BiddingHistory from "../components/BiddingHistory";
import api from "../services/api";
import useBiddingWarContract from "../hooks/useBiddingWarContract";
import { ethers } from "ethers";
import NFTDialog from "../components/BidDialog";
import useRWLKNFTContract from "../hooks/useRWLKNFTContract";
import { useActiveWeb3React } from "../hooks/web3";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { BIDDINGWAR_ADDRESS } from "../config/app";
import DonatedNFTDialog from "../components/DonatedNFTDialog";
import styled from "@emotion/styled";
import { formatId } from "../utils";

const NewHome = ({ biddingHistory, page, totalCount, data, donatedNfts }) => {
  const [withdrawalSeconds, setWithdrawalSeconds] = useState(null);
  const [activationTime, setActivationTime] = useState(1682377200);
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
  const { account } = useActiveWeb3React();
  const biddingWarContract = useBiddingWarContract();
  const nftRWLKContract = useRWLKNFTContract();
  const handleBid = async (
    message: string,
    rwlkID?: number,
    nftAddress?: string,
    nftID?: number,
    nftContract?: any
  ) => {
    try {
      const bidPrice = await biddingWarContract.getBidPrice();
      const newBidPrice = parseFloat(ethers.utils.formatEther(bidPrice)) * 1.01;
      let receipt;
      if (!bidOptions.withDonation) {
        if (!bidOptions.withRWLK) {
          receipt = await biddingWarContract
            .bid(message, {
              value: ethers.utils.parseEther(newBidPrice.toFixed(6)),
            })
            .then((tx) => tx.wait());
        } else {
          receipt = await biddingWarContract
            .bidWithRWLK(rwlkID, message)
            .then((tx) => tx.wait());
        }
      } else {
        // setApprovalForAll
        const response = await nftContract
          .setApprovalForAll(BIDDINGWAR_ADDRESS, true)
          .then((tx) => tx.wait());
        console.log(response);
        if (!bidOptions.withRWLK) {
          receipt = await biddingWarContract
            .bidAndDonateNFT(message, nftAddress, nftID, {
              value: ethers.utils.parseEther(newBidPrice.toFixed(6)),
            })
            .then((tx) => tx.wait());
        } else {
          receipt = await biddingWarContract
            .bidWithRWLKAndDonateNFT(rwlkID, message, nftAddress, nftID)
            .then((tx) => tx.wait());
        }
      }
      console.log(receipt);
      getData();
    } catch (err) {
      console.log(err);
    }
  };

  const openBidDialog = (bidType: string) => {
    if (bidType === "Bid") {
      setBidOptions({
        withDonation: false,
        withRWLK: false,
      });
    } else if (bidType === "Bid with RWLK") {
      setBidOptions({
        withDonation: false,
        withRWLK: true,
      });
    } else if (bidType === "Bid & Donate") {
      setBidOptions({
        withDonation: true,
        withRWLK: false,
      });
    } else if (bidType === "Bid with RWLK & Donate") {
      setBidOptions({
        withDonation: true,
        withRWLK: true,
      });
    }
    setOpen(true);
  };

  const openClaimDialog = () => {
    setDonatedNFTOpen(true);
  };

  const handleClaimPrize = async () => {
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

  const claimDonatedNFT = async (token) => {
    try {
      const receipt = await biddingWarContract
        .claimDonatedNFT(token.RecordId)
        .then((tx) => tx.wait());
      console.log(receipt);
      getData();
    } catch (err) {
      console.log(err);
      alert(err.message);
    }
  };

  const onSetActivationTime = async () => {
    try {
      const receipt = await biddingWarContract
        .setActivationTime(newActivationTime.unix())
        .then((tx) => tx.wait());
      console.log(receipt);
      getData();
    } catch (err) {
      console.log(err);
      alert(err.message);
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
              <Typography>0.002064</Typography>
            </Box>
            <Box sx={{ display: "flex" }}>
              <Typography color="primary">REWARD:</Typography>
              &nbsp;
              <Typography>0.8024</Typography>
            </Box>
            <Box sx={{ display: "flex" }}>
              <Typography color="primary">Charity Address:</Typography>
              &nbsp;
              <Typography>0xB9A66Fe7C1B7b8b3f14F68399AD1202</Typography>
            </Box>
            <Box sx={{ display: "flex" }}>
              <Typography color="primary">Percentage of Donation:</Typography>
              &nbsp;
              <Typography>10.00%</Typography>
            </Box>
            <Box sx={{ my: "24px" }}>
              <Typography color="primary">Last Bidder Address:</Typography>
              <Typography>
                0xA867454690CA5142917165FB2dBb08ccaEb303df
              </Typography>
            </Box>
          </Box>
        </Box>
      </MainWrapper>
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

// Need Cosmic Signature NFT settings Dialog

// Bid with RWLK nft and donate Dialog
