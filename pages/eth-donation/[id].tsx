import React, { useEffect, useState } from "react";
import { Box, Link, Typography } from "@mui/material";
import { MainWrapper } from "../../components/styled";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { convertTimestampToDateTime, getMetadata } from "../../utils";

const sample = {
  EvtLogId: 69287,
  BlockNum: 314,
  TxId: 21343,
  TxHash: "0xac6158478e44bc7d25d98adae9cf76500973e6b249bf0f77c2916bfa84d8cde1",
  TimeStamp: 1723062133,
  DateTime: "2024-08-07T20:22:13Z",
  DonorAid: 1,
  DonorAddr: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  Amount: "8000000000000000000",
  AmountEth: 8,
  RoundNum: 4,
  CGRecordId: 2,
  DataJson:
    '{"version":1,"title":"EF donation","message":"Ethereum Foundation is a non-profit and part of a community of organizations and people working to fund protocol development, grow the ecosystem, and advocate for Ethereum.","url":"http://ethereum.org/en"}',
};

const EthDonationDetail = ({ id }) => {
  const [loading, setLoading] = useState(true);
  const [donationInfo, setDonationInfo] = useState(null);
  const [dataJson, setDataJson] = useState(null);
  const [metaData, setMetaData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // const info = await api.get_bid_info(id);
      const info = sample;
      setDonationInfo(info);
      if (info?.DataJson) {
        const jsonData = JSON.parse(info.DataJson);
        setDataJson(jsonData);
        const meta = await getMetadata(jsonData.url);
        setMetaData(meta);
      }
      setLoading(false);
    };
    fetchData();
  }, []);
  return (
    <>
      <MainWrapper>
        <Typography
          variant="h4"
          color="primary"
          gutterBottom
          textAlign="center"
          mb={4}
        >
          Direct (ETH) Donation Detail
        </Typography>
        {loading ? (
          <Typography variant="h6">Loading...</Typography>
        ) : (
          <>
            <Box mb={1} display="flex" flexWrap="wrap">
              <Typography color="primary">Bid Datetime:</Typography>
              &nbsp;
              <Link
                href={`https://arbiscan.io/tx/${donationInfo.TxHash}`}
                style={{ color: "inherit" }}
                target="_blank"
              >
                <Typography>
                  {convertTimestampToDateTime(donationInfo.TimeStamp)}
                </Typography>
              </Link>
            </Box>
            <Box mb={1} display="flex" flexWrap="wrap">
              <Typography color="primary">Donor Address:</Typography>
              &nbsp;
              <Link
                href={`/user/${donationInfo.DonorAddr}`}
                style={{ color: "rgb(255, 255, 255)" }}
              >
                <Typography fontFamily="monospace">
                  {donationInfo.DonorAddr}
                </Typography>
              </Link>
            </Box>
            <Box mb={1} display="flex" flexWrap="wrap">
              <Typography color="primary">Round Number:</Typography>
              &nbsp;
              <Link
                href={`/prize/${donationInfo.RoundNum}`}
                sx={{
                  fontSize: "inherit",
                  color: "inherit",
                }}
              >
                <Typography>{donationInfo.RoundNum}</Typography>
              </Link>
            </Box>
            <Box mb={1} display="flex" flexWrap="wrap">
              <Typography color="primary">Amount:</Typography>
              &nbsp;
              <Typography>{donationInfo.AmountEth.toFixed(2)} ETH</Typography>
            </Box>
            <Box mb={1} display="flex" flexWrap="wrap">
              <Typography color="primary">Title:</Typography>
              &nbsp;
              <Typography>{dataJson?.title}</Typography>
            </Box>
            <Box mb={1} display="flex" flexWrap="wrap">
              <Typography color="primary">Message:</Typography>
              &nbsp;
              <Typography>{dataJson?.message}</Typography>
            </Box>
            <Box mb={1} display="flex" flexWrap="wrap">
              <Typography color="primary">URL:</Typography>
              &nbsp;
              <Typography>
                <Link
                  sx={{ color: "inherit", fontSize: "inherit" }}
                  href={dataJson?.url}
                  target="_blank"
                >
                  {dataJson?.url}
                </Link>
              </Typography>
            </Box>
            <Box mb={1} display="flex" flexWrap="wrap">
              <Typography color="primary">Meta Description:</Typography>
              &nbsp;
              <Typography>{metaData?.description}</Typography>
            </Box>
            <Box mb={1} display="flex" flexWrap="wrap">
              <Typography color="primary">Meta Keywords:</Typography>
              &nbsp;
              <Typography>{metaData?.Keywords}</Typography>
            </Box>
            <Box>
              <Typography color="primary" mb={1}>Meta Image:</Typography>
              <img src={metaData?.image} width="100%" alt="meta image" />
            </Box>
          </>
        )}
      </MainWrapper>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const params = context.params!.id;
  const id = Array.isArray(params) ? params[0] : params;
  const title = "Direct (ETH) Donations | Cosmic Signature";
  const description = "Direct (ETH) Donations";
  const imageUrl = "https://cosmic-game2.s3.us-east-2.amazonaws.com/logo.png";

  const openGraphData = [
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: imageUrl },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: imageUrl },
  ];

  return { props: { title, description, openGraphData, id } };
};

export default EthDonationDetail;
