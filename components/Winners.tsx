import React from "react";
import Image from "next/image";
import {
  Box,
  Typography,
  Container,
  Grid,
  CardActionArea,
} from "@mui/material";
import { NFTImage, StyledCard } from "./styled";

const Winners = () => {
  return (
    <Box sx={{ marginTop: "70px" }}>
      <Typography variant="h4" width={500} textAlign="center" marginX="auto">
        Previous Round Raffle Winners
      </Typography>
      <Grid container spacing={2} marginTop="48px">
        <Grid item xs={4} sx={{ position: "relative" }}>
          <StyledCard>
            <CardActionArea>
              <NFTImage image="https://randomwalknft.s3.us-east-2.amazonaws.com/000496_black_thumb.jpg" />
            </CardActionArea>
          </StyledCard>
          <Box mt={2}>
            <Typography variant="body2" textAlign="center">
              0xA867454690CA5142917165FB2dBb08ccaEb303df
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Typography variant="caption" marginRight={1}>
                Prize Won:
              </Typography>
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
        </Grid>
        <Grid item xs={4} sx={{ position: "relative" }}>
          <StyledCard>
            <CardActionArea>
              <NFTImage image="https://randomwalknft.s3.us-east-2.amazonaws.com/000496_black_thumb.jpg" />
            </CardActionArea>
          </StyledCard>
          <Box mt={2}>
            <Typography variant="body2" textAlign="center">
              0xA867454690CA5142917165FB2dBb08ccaEb303df
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Typography variant="caption" marginRight={1}>
                Prize Won:
              </Typography>
              <Image
                src={"/images/Ethereum_small.svg"}
                width={16}
                height={16}
                alt="ethereum"
              />
              <Typography variant="caption" color="primary">
                7.2 NFT
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={4} sx={{ position: "relative" }}>
          <StyledCard>
            <CardActionArea>
              <NFTImage image="https://randomwalknft.s3.us-east-2.amazonaws.com/000496_black_thumb.jpg" />
            </CardActionArea>
          </StyledCard>
          <Box mt={2}>
            <Typography variant="body2" textAlign="center">
              0xA867454690CA5142917165FB2dBb08ccaEb303df
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Typography variant="caption" marginRight={1}>
                Prize Won:
              </Typography>
              <Image
                src={"/images/Ethereum_small.svg"}
                width={16}
                height={16}
                alt="ethereum"
              />
              <Typography variant="caption" color="primary">
                5.2 NFT
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Winners;
