import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import Head from "next/head";

import PaginationMarketplaceGrid from "../components/PaginationMarketplaceGrid";
import { MainWrapper } from "../components/styled";
import { GetServerSidePropsContext } from "next";
import api from "../services/api";

const Marketplace = ({ nfts }) => {
  const [collection, setCollection] = useState([]);

  useEffect(() => {
    const sorted = nfts.sort((a, b) => Number(b.TokenId) - Number(a.TokenId));
    setCollection(sorted);
  }, []);

  return (
    <>
      <Head>
        <title>Marketplace | Cosmic Signature NFT</title>
        <meta name="description" content="" />
      </Head>
      <MainWrapper>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexWrap="wrap"
        >
          <Typography variant="h4" component="span" color="primary">
            CosmicSignature
          </Typography>
          &nbsp;
          <Typography variant="h4" component="span">
            NFT for Marketplace
          </Typography>
        </Box>
        <PaginationMarketplaceGrid data={collection} />
      </MainWrapper>
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const nfts = await api.get_cst_list();
  return {
    props: { nfts },
  };
}

export default Marketplace;
