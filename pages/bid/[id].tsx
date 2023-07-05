import React, { useEffect, useState } from "react";
import { Box, Link, Typography } from "@mui/material";
import Head from "next/head";
import { MainWrapper, NFTImage } from "../../components/styled";
import { GetServerSidePropsContext } from "next";
import api from "../../services/api";
import { convertTimestampToDateTime } from "../../utils";
import axios from "axios";

const BidInfo = ({ BidInfo }) => {
  const [tokenURI, setTokenURI] = useState(null);
  const handleImageError = (event) => {
    event.target.src = "/images/qmark.png";
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(BidInfo.NFTTokenURI);
      setTokenURI(data);
    };
    if (BidInfo.NFTTokenURI) {
      fetchData();
    }
  }, []);
  return (
    <>
      <Head>
        <title>Bid Info | Cosmic Signature</title>
        <meta name="description" content="" />
      </Head>
      <MainWrapper>
        <Typography variant="h4" color="primary" mb={4}>
          Bid Info
        </Typography>
        <Box mb={1}>
          <Typography color="primary" component="span">
            EvtLog ID:
          </Typography>
          &nbsp;
          <Typography component="span">{BidInfo.EvtLogId}</Typography>
        </Box>
        <Box mb={1}>
          <Typography color="primary" component="span">
            Round Number:
          </Typography>
          &nbsp;
          <Typography component="span">{BidInfo.RoundNum}</Typography>
        </Box>
        <Box mb={1}>
          <Typography color="primary" component="span">
            Bid Datetime:
          </Typography>
          &nbsp;
          <Typography component="span">
            {convertTimestampToDateTime(BidInfo.TimeStamp)}
          </Typography>
        </Box>
        <Box mb={1}>
          <Typography color="primary" component="span">
            Bidder Address:
          </Typography>
          &nbsp;
          <Typography component="span">
            <Link
              href={`/user/${BidInfo.BidderAddr}`}
              style={{ color: "rgb(255, 255, 255)" }}
            >
              {BidInfo.BidderAddr}
            </Link>
          </Typography>
        </Box>
        <Box mb={1}>
          <Typography color="primary" component="span">
            Bid Price:
          </Typography>
          &nbsp;
          <Typography component="span">
            {BidInfo.BidPriceEth.toFixed(6)} ETH
          </Typography>
        </Box>
        <Box mb={1}>
          <Typography color="primary" component="span">
            Is bidded with RandomWalkNFT:
          </Typography>
          &nbsp;
          <Typography component="span">
            {BidInfo.RWalkNFTId < 0 ? "No" : "Yes"}
          </Typography>
        </Box>
        {BidInfo.RWalkNFTId >= 0 && (
          <Box mb={1}>
            <Typography color="primary" component="span">
              RandomWalkNFT ID:
            </Typography>
            &nbsp;
            <Typography component="span">{BidInfo.RWalkNFTId}</Typography>
          </Box>
        )}

        {BidInfo.NFTDonationTokenAddr !== "" &&
          BidInfo.NFTDonationTokenId !== -1 && (
            <>
              <Box mb={1}>
                <Typography color="primary" component="span">
                  Donated NFT Contract Address (aka Token):
                </Typography>
                &nbsp;
                <Typography component="span">
                  {BidInfo.NFTDonationTokenAddr}
                </Typography>
              </Box>
              <Box mb={1}>
                <Typography color="primary" component="span">
                  Donated NFT Token Id:
                </Typography>
                &nbsp;
                <Typography component="span">
                  {BidInfo.NFTDonationTokenId}
                </Typography>
              </Box>
              <Box mb={1}>
                <Typography color="primary" component="span">
                  Donated NFT Token URI:
                </Typography>
                &nbsp;
                <Typography component="span">{BidInfo.NFTTokenURI}</Typography>
              </Box>
              <Box mb={1}>
                <Typography color="primary" component="span">
                  Image:
                </Typography>
                <Box width="300px">
                  <NFTImage
                    src={tokenURI?.image}
                    sx={{ backgroundSize: "contain" }}
                    onError={handleImageError}
                  />
                </Box>
              </Box>
            </>
          )}
        <Box mb={1}>
          <Typography color="primary" component="span">
            Message:
          </Typography>
          &nbsp;
          <Typography component="span">
            {BidInfo.Message === "" ? "No message!" : BidInfo.Message}
          </Typography>
        </Box>
      </MainWrapper>
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const params = context.params!.id;
  const id = Array.isArray(params) ? params[0] : params;
  const BidInfo = await api.get_bid_info(Number(id));
  return {
    props: { BidInfo },
  };
}

export default BidInfo;
