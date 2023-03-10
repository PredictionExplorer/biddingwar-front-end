import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import React, { useState, useEffect, useRef } from "react";

import { Box, Alert } from "@mui/material";
import Head from "next/head";

import NFTTrait from "../../components/NFTTrait";
import { MainWrapper } from "../../components/styled";
import { useActiveWeb3React } from "../../hooks/web3";

import api from "../../services/api";

const Detail = ({ nft }) => {
  const router = useRouter();
  const { seller } = router.query;
  const { account } = useActiveWeb3React();
  const [buyOffers, setBuyOffers] = useState([]);
  const [sellOffers, setSellOffers] = useState([]);
  const [userSellOffers, setUserSellOffers] = useState([]);
  const blackVideo = nft?.black_triple_video_url;
  const ref = useRef(null);

  useEffect(() => {
    if (blackVideo) {
      ref.current.load();
    }
  }, [blackVideo]);

  useEffect(() => {
    const getOffers = async () => {
      const buy_offers = await api.get_buy(nft?.id);
      setBuyOffers(buy_offers);
      const sell_offers = await api.get_sell(nft?.id);
      setSellOffers(sell_offers);
      const userSellOffers = sell_offers.filter((x) => {
        return x.SellerAddr == account;
      });
      setUserSellOffers(userSellOffers);
    };

    getOffers();
  }, [account, nft, router]);

  if (!nft) return <></>;

  return (
    <>
      <Head>
        <title>NFT #{nft.id} | Random Walk NFT</title>
      </Head>
      {blackVideo && (
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
              filter: "blur(3px) opacity(0.5)",
            }}
            ref={ref}
          >
            <source src={blackVideo} type="video/mp4"></source>
          </video>
        </div>
      )}
      <MainWrapper
        maxWidth={false}
        style={{
          paddingLeft: 0,
          paddingRight: 0,
        }}
      >
        {router.query && router.query.message && (
          <Box px={8} mb={2}>
            <Alert variant="outlined" severity="success">
              {router.query.message === "success"
                ? "Media files are being generated. Please refrersh the page in a few minutes."
                : ""}
            </Alert>
          </Box>
        )}
        <NFTTrait nft={nft} />
      </MainWrapper>
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const id = context.params!.id;
  const tokenId = Array.isArray(id) ? id[0] : id;
  const nft = await api.get(tokenId);
  return {
    props: { nft, title: "Detail", description: `NFT#${nft?.id} Details - ` },
  };
}

export default Detail;
