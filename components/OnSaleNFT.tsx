import React from "react";
import Image from "next/image";
import { Typography, CardActionArea, Box, Button, useTheme, useMediaQuery } from "@mui/material";
import { formatId } from "../utils";
import { NFTImage, StyledCard } from "./styled";
import router from "next/router";
import { ArrowForward } from "@mui/icons-material";

const OnSaleNFT = ({ nft }) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("md"));
  const fileName = nft.TokenId.toString().padStart(6, "0");
  const image = `https://cosmic-game.s3.us-east-2.amazonaws.com/${fileName}.png`;
  return (
    <>
      <StyledCard>
        <CardActionArea onClick={() => router.push(`/marketplace/${nft.TokenId}`)}>
          <NFTImage image={image} />
        </CardActionArea>
      </StyledCard>
      <Box
        sx={{
          display: "flex",
          position: "absolute",
          top: matches ? "32px" : "16px",
          left: matches ? "32px" : "16px",
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

export default OnSaleNFT;
