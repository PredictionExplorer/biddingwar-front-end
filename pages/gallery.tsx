import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Box, Typography } from "@mui/material";
import Head from "next/head";

import PaginationGrid from "../components/PaginationGrid";
import { MainWrapper } from "../components/styled";
import useCosmicSignatureContract from "../hooks/useCosmicSignatureContract";

const Gallery = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [collection, setCollection] = useState([]);
  const [address, setAddress] = useState(null);
  const contract = useCosmicSignatureContract();

  useEffect(() => {
    const address = router.query["address"] as string;

    const getTokens = async () => {
      try {
        setLoading(true);
        let tokenIds = [];
        if (address) {
          const tokens = await contract.walletOfOwner(address);
          tokenIds = tokens.map((t) => t.toNumber());
          tokenIds = tokenIds.sort((a, b) => {
            return parseInt(b) - parseInt(a);
          });
        } else {
          const balance = await contract.totalSupply();
          tokenIds = Object.keys(new Array(balance.toNumber()).fill(0));
          tokenIds = tokenIds.reverse();
        }

        setAddress(address);
        setCollection(tokenIds);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    getTokens();
  }, [contract, router]);

  return (
    <>
      <Head>
        <title>Gallery | Bidding War</title>
        <meta name="description" content="" />
      </Head>
      <MainWrapper>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexWrap="wrap"
        >
          <Typography variant="h4" component="span">
            BIDDING WAR GALLERY
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

        <PaginationGrid loading={loading} data={collection} />
      </MainWrapper>
    </>
  );
};

export default Gallery;
