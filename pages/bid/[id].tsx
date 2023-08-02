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
        <Box mb={1}>
          <Typography color="primary" component="span">
            Transaction Hash:
          </Typography>
          &nbsp;
          <Typography component="span">
            <Link
              href={`https://arbiscan.io/tx/${BidInfo.TxHash}`}
              style={{ color: "rgb(255, 255, 255)" }}
              target="_blank"
            >
              {BidInfo.TxHash}
            </Link>
          </Typography>
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
            Was bid with RandomWalkNFT:
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
                <Grid container spacing={4}>
                  <Grid item xs={12} md={4}>
                    <NFTImage
                      src={tokenURI?.image}
                      sx={{ backgroundSize: "contain" }}
                    />
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Box mb={1}>
                      <Typography color="primary" component="span">
                        Collection Name:
                      </Typography>
                      &nbsp;
                      <Typography component="span">
                        {tokenURI?.collection_name}
                      </Typography>
                    </Box>
                    <Box mb={1}>
                      <Typography color="primary" component="span">
                        Artist:
                      </Typography>
                      &nbsp;
                      <Typography component="span">
                        {tokenURI?.artist}
                      </Typography>
                    </Box>
                    <Box mb={1}>
                      <Typography color="primary" component="span">
                        Platform:
                      </Typography>
                      &nbsp;
                      <Typography component="span">
                        {tokenURI?.platform}
                      </Typography>
                    </Box>
                    <Box mb={1}>
                      <Typography color="primary" component="span">
                        Description:
                      </Typography>
                      &nbsp;
                      <Typography component="span">
                        {tokenURI?.description}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </>
          )}
        <Box mb={1}>
          <Typography color="primary" component="span">
            Message:
          </Typography>
          &nbsp;
          <Typography component="span">{BidInfo.Message}</Typography>
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
