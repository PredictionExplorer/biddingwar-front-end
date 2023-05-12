import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Box, Typography } from "@mui/material";
import Head from "next/head";

import PaginationGrid from "../components/PaginationGrid";
import { MainWrapper } from "../components/styled";
import { GetServerSidePropsContext } from "next";
import api from "../services/api";

const Gallery = ({ nfts }) => {
  const router = useRouter();
  const [collection, setCollection] = useState([]);
  const [address, setAddress] = useState(null);

  useEffect(() => {
    const address = router.query["address"] as string;

    const getTokens = async () => {
      try {
        if (address) {
          const filtered = nfts.filter((nft) => nft.CurOwnerAddr === address);
          setCollection(filtered);
        } else {
          const sorted = nfts.sort(
            (a, b) => Number(b.TokenId) - Number(a.TokenId)
          );
          setCollection(sorted);
        }
        setAddress(address);
      } catch (err) {
        console.log(err);
      }
    };

    getTokens();
  }, [router]);

  return (
    <>
      <Head>
        <title>Gallery | Cosmic Signature NFT</title>
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
            NFT Gallery
          </Typography>
        </Box>
        {address && (
          <Typography
            variant="body2"
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            Owned by {address}
          </Typography>
        )}

        <PaginationGrid data={collection} />
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

export default Gallery;
