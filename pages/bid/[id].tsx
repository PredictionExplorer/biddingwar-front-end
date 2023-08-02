import React, { useEffect, useState } from "react";
import { Box, Grid, Link, Typography } from "@mui/material";
import Head from "next/head";
import { MainWrapper } from "../../components/styled";
import { GetServerSidePropsContext } from "next";
import api from "../../services/api";
import axios from "axios";
import RandomWalkNFT from "../../components/RandomWalkNFT";
import NFTImage from "../../components/NFTImage";

const convertTimestampToDateTime = (timestamp: any) => {
  var date_ob = new Date(timestamp * 1000);
  var year = date_ob.getFullYear();
  var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  var date = ("0" + date_ob.getDate()).slice(-2);
  var hours = ("0" + date_ob.getHours()).slice(-2);
  var minutes = ("0" + date_ob.getMinutes()).slice(-2);
  var seconds = ("0" + date_ob.getSeconds()).slice(-2);
  var result =
    year +
    "-" +
    month +
    "-" +
    date +
    " " +
    hours +
    ":" +
    minutes +
    ":" +
    seconds;
  return result;
};

const BidInfo = ({ BidInfo }) => {
  const [tokenURI, setTokenURI] = useState(null);
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
        <Box mb={1} display="flex" flexWrap="wrap">
          <Typography color="primary">
            Transaction Hash:
          </Typography>
          &nbsp;
          <Link
            href={`https://arbiscan.io/tx/${BidInfo.TxHash}`}
            style={{ color: "rgb(255, 255, 255)" }}
            target="_blank"
          >
            <Typography>{BidInfo.TxHash}</Typography>
          </Link>
        </Box>
        <Box mb={1}  display="flex" flexWrap="wrap">
          <Typography color="primary">
            Round Number:
          </Typography>
          &nbsp;
          <Typography>{BidInfo.RoundNum}</Typography>
        </Box>
        <Box mb={1} display="flex" flexWrap="wrap">
          <Typography color="primary">
            Bid Datetime:
          </Typography>
          &nbsp;
          <Typography>
            {convertTimestampToDateTime(BidInfo.TimeStamp)}
          </Typography>
        </Box>
        <Box mb={1} display="flex" flexWrap="wrap">
          <Typography color="primary">
            Bidder Address:
          </Typography>
          &nbsp;
          <Link
            href={`/user/${BidInfo.BidderAddr}`}
            style={{ color: "rgb(255, 255, 255)" }}
          >
            <Typography>{BidInfo.BidderAddr}</Typography>
          </Link>
        </Box>
        <Box mb={1} display="flex" flexWrap="wrap">
          <Typography color="primary">
            Bid Price:
          </Typography>
          &nbsp;
          <Typography>
            {BidInfo.BidPriceEth.toFixed(6)} ETH
          </Typography>
        </Box>
        <Box mb={1} display="flex" flexWrap="wrap">
          <Typography color="primary">
            Was bid with RandomWalkNFT:
          </Typography>
          &nbsp;
          <Typography>
            {BidInfo.RWalkNFTId < 0 ? "No" : "Yes"}
          </Typography>
        </Box>
        {BidInfo.RWalkNFTId >= 0 && (
          <Box mb={1} display="flex" flexWrap="wrap">
            <Typography color="primary">
              RandomWalkNFT ID:
            </Typography>
            &nbsp;
            <Typography>{BidInfo.RWalkNFTId}</Typography>
          </Box>
        )}

        {BidInfo.NFTDonationTokenAddr !== "" &&
          BidInfo.NFTDonationTokenId !== -1 && (
            <>
              <Box mb={1} display="flex" flexWrap="wrap">
                <Typography color="primary">
                  Donated NFT Contract Address (aka Token):
                </Typography>
                &nbsp;
                <Typography>
                  {BidInfo.NFTDonationTokenAddr}
                </Typography>
              </Box>
              <Box mb={1} display="flex" flexWrap="wrap">
                <Typography color="primary">
                  Donated NFT Token Id:
                </Typography>
                &nbsp;
                <Typography>
                  {BidInfo.NFTDonationTokenId}
                </Typography>
              </Box>
              <Box mb={1} display="flex" flexWrap="wrap">
                <Typography color="primary">
                  Donated NFT Token URI:
                </Typography>
                &nbsp;
                <Typography>{BidInfo.NFTTokenURI}</Typography>
              </Box>
              <Box mb={1} display="flex" flexWrap="wrap">
                <Typography color="primary">
                  Image:
                </Typography>
                <Grid container spacing={4}>
                  <Grid item xs={12} md={4}>
                    <NFTImage
                      src={tokenURI?.image}
                      sx={{ backgroundSize: "contain" }}
                    />
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Box mb={1} display="flex" flexWrap="wrap">
                      <Typography color="primary">
                        Collection Name:
                      </Typography>
                      &nbsp;
                      <Typography>
                        {tokenURI?.collection_name}
                      </Typography>
                    </Box>
                    <Box mb={1} display="flex" flexWrap="wrap">
                      <Typography color="primary">
                        Artist:
                      </Typography>
                      &nbsp;
                      <Typography>
                        {tokenURI?.artist}
                      </Typography>
                    </Box>
                    <Box mb={1} display="flex" flexWrap="wrap">
                      <Typography color="primary">
                        Platform:
                      </Typography>
                      &nbsp;
                      <Typography>
                        {tokenURI?.platform}
                      </Typography>
                    </Box>
                    <Box mb={1} display="flex" flexWrap="wrap">
                      <Typography color="primary">
                        Description:
                      </Typography>
                      &nbsp;
                      <Typography>
                        {tokenURI?.description}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </>
          )}
        <Box mb={1} display="flex" flexWrap="wrap">
          <Typography color="primary">
            Message:
          </Typography>
          &nbsp;
          <Typography>{BidInfo.Message}</Typography>
        </Box>
        {BidInfo.RWalkNFTId >= 0 && (
          <Box width="400px" mt={4}>
            <RandomWalkNFT tokenId={BidInfo.RWalkNFTId} selectable={false} />
          </Box>
        )}
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
