import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";

import {
  Box,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  Alert,
} from "@mui/material";
import Head from "next/head";

import NFTTrait from "../../components/NFTTrait";
import { MainWrapper } from "../../components/styled";
import { useActiveWeb3React } from "../../hooks/web3";

import api from "../../services/api";

const Detail = ({ nft }) => {
  const router = useRouter();
  const { seller } = router.query;
  const { account } = useActiveWeb3React();
  const [darkTheme, setDarkTheme] = useState(true);
  const [buyOffers, setBuyOffers] = useState([]);
  const [sellOffers, setSellOffers] = useState([]);
  const [userSellOffers, setUserSellOffers] = useState([]);

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

    let hash = router.asPath.match(/#([a-z0-9]+)/gi);
    const darkModes = ["#black_image"];
    const lightModes = ["#white_image"];

    if (hash) {
      if (darkModes.includes(hash[0])) {
        setDarkTheme(true);
      } else if (lightModes.includes(hash[0])) {
        setDarkTheme(false);
      }
    }
    getOffers();
  }, [account, nft, router]);

  if (!nft) return <></>;

  return (
    <>
      <Head>
        <title>NFT #{nft.id} | Random Walk NFT</title>
      </Head>

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
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          style={{ position: "relative", height: 60 }}
        >
          <Divider style={{ background: "#121212", width: "100%" }} />
          <ToggleButtonGroup
            value={darkTheme}
            exclusive
            onChange={() => setDarkTheme(!darkTheme)}
            style={{ position: "absolute" }}
          >
            <ToggleButton value={true}>Dark theme</ToggleButton>
            <ToggleButton value={false}>White theme</ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <NFTTrait
          nft={nft}
          darkTheme={darkTheme}
          seller={seller}
          buy_offers={buyOffers}
          sell_offers={sellOffers}
          user_sell_offers={userSellOffers}
        />
      </MainWrapper>
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const id = context.params!.id;
  const tokenId = Array.isArray(id) ? id[0] : id;
  const nft = await api.get(tokenId);
  return {
    props: { nft },
  };
}

export default Detail;
