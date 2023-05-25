import React from "react";
import Image from "next/image";
import { Box, Typography, Container, Grid } from "@mui/material";
import OnSaleNFT from "./OnSaleNFT";

const LatestNFTs = ({ nfts }) => {
  const data = nfts.sort((a, b) => Number(b.TokenId) - Number(a.TokenId));
  return (
    <Box
      sx={{
        backgroundColor: "#101441",
      }}
    >
      <Container sx={{ padding: "80px 10px 150px" }}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexWrap="wrap"
        >
          <Typography variant="h4" component="span">
            Latest NFT&#39;s
          </Typography>
        </Box>
        <Box textAlign="center" marginBottom="56px">
          <Image
            src={"/images/divider.svg"}
            width={93}
            height={3}
            alt="divider"
          />
        </Box>
        <Grid container spacing={2} marginTop="58px">
          {data.slice(0, 6).map((nft, i) => (
            <Grid
              key={i}
              sx={{ position: "relative" }}
              item
              xs={12}
              sm={12}
              md={4}
              lg={4}
            >
              <OnSaleNFT nft={nft} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default LatestNFTs;
