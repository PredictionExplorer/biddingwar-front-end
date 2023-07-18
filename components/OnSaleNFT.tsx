import React from "react";
import Image from "next/image";
import { Typography, CardActionArea, Box, Button } from "@mui/material";
import { formatId } from "../utils";
import { NFTImage, StyledCard } from "./styled";
import router from "next/router";
import { ArrowForward } from "@mui/icons-material";

const OnSaleNFT = ({ nft }) => {
  const fileName = nft.TokenId.toString().padStart(6, "0");
  const image = `https://cosmic-game.s3.us-east-2.amazonaws.com/${fileName}.png`;
  const handleImageError = (event) => {
    event.target.src = "/images/qmark.png";
  };
  return (
    <Box sx={{ position: "relative" }}>
      <StyledCard>
        <CardActionArea
          onClick={() => router.push(`/marketplace/${nft.TokenId}`)}
        >
          <NFTImage src={image} onError={handleImageError} />
        </CardActionArea>
      </StyledCard>
      <Box
        sx={{
          display: "flex",
          position: "absolute",
          top: "16px",
          left: "16px",
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
          sx={{ fontSize: 14 }}
          size="large"
        >
          Place Bid
        </Button>
      </Box>
    </Box>
  );
};

export default OnSaleNFT;
