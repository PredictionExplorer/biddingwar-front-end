import React from "react";
import Image from "next/image";
import {
  Box,
  Typography,
  Container,
  Grid,
  CardActionArea,
  Button,
} from "@mui/material";
import { NFTImage, StyledCard } from "./styled";
import { ArrowForward } from "@mui/icons-material";
import { formatId } from "../utils";

const CGNFT = ({ nft }) => {
  const fileName = nft.TokenId.toString().padStart(6, "0");
  const image = `https://cosmic-game.s3.us-east-2.amazonaws.com/${fileName}.png`;
  return (
    <>
      <StyledCard>
        <CardActionArea>
          <NFTImage image={image} />
        </CardActionArea>
      </StyledCard>
      <Box
        sx={{
          display: "flex",
          position: "absolute",
          top: "32px",
          left: "32px",
          right: "16px",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="caption">{formatId(nft.TokenId)}</Typography>
          <Box sx={{ display: "flex" }}>
            <Image
              src={"/images/Ethereum_small.svg"}
              width={16}
              height={16}
              alt="ethereum"
            />
            <Typography variant="caption" color="primary">
              3.2 NFT
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          endIcon={<ArrowForward />}
          sx={{ width: "140px", fontSize: 14 }}
          size="large"
        >
          Place Bid
        </Button>
      </Box>
    </>
  );
};

const LatestNFTs = ({ nfts }) => {
  const data = nfts.sort(
    (a, b) => Number(b.TokenId) - Number(a.TokenId)
  );
  return (
    <Box
      sx={{
        backgroundColor: "#101441",
      }}
    >
      <Container sx={{ padding: "80px 0 150px" }}>
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
            <Grid item xs={4} sx={{ position: "relative" }} key={i}>
              <CGNFT nft={nft} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default LatestNFTs;
