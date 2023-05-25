import React from "react";
import Image from "next/image";
import { Box, Typography, CardActionArea, Grid } from "@mui/material";
import { GradientText, NFTImage, StyledCard, StyledCard2 } from "./styled";

const Prize = ({ prizeAmount }) => {
  return (
    <Box mt="130px">
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexWrap="wrap"
      >
        <Typography variant="h4" component="span">
          The
        </Typography>
        <Typography
          variant="h4"
          component="span"
          color="primary"
          sx={{ ml: 1.5 }}
        >
          Winner
        </Typography>
        <Typography variant="h4" component="span" sx={{ ml: 1.5 }}>
          will Receive
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

      <Grid container spacing={4}>
        <Grid item xs={12} sm={12} md={6} lg={6}>
          <StyledCard2>
            <CardActionArea
              sx={{ display: "flex", justifyContent: "start", p: "16px" }}
            >
              <Image
                src={"/images/CosmicSignatureNFT.png"}
                width={88}
                height={88}
                alt="cosmic signature nft"
              />
              <GradientText variant="h5" marginLeft="16px">
                1 Cosmic Signature NFT
              </GradientText>
            </CardActionArea>
          </StyledCard2>
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6}>
          <StyledCard2>
            <CardActionArea
              sx={{ display: "flex", justifyContent: "start", p: "16px" }}
            >
              <Image
                src={"/images/Ethereum.png"}
                width={88}
                height={88}
                alt="cosmic signture nft"
              />
              <GradientText variant="h5" marginLeft="16px">
                {prizeAmount.toFixed(1)} ETH
              </GradientText>
            </CardActionArea>
          </StyledCard2>
        </Grid>
      </Grid>

      <Grid container spacing={2} marginTop="100px">
        <Grid item xs={12} sm={12} md={4} lg={4}>
          <StyledCard>
            <CardActionArea>
              <NFTImage image="https://randomwalknft.s3.us-east-2.amazonaws.com/000496_black_thumb.jpg" />
            </CardActionArea>
            <Box
              sx={{
                display: "flex",
                position: "absolute",
                inset: "16px",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="caption">#000176</Typography>
              <Typography color="primary">Donated</Typography>
            </Box>
          </StyledCard>
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={4}>
          <StyledCard>
            <CardActionArea>
              <NFTImage image="https://randomwalknft.s3.us-east-2.amazonaws.com/000496_black_thumb.jpg" />
            </CardActionArea>
            <Box
              sx={{
                display: "flex",
                position: "absolute",
                inset: "16px",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="caption">#000176</Typography>
              <Typography color="primary">Donated</Typography>
            </Box>
          </StyledCard>
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={4}>
          <StyledCard>
            <CardActionArea>
              <NFTImage image="https://randomwalknft.s3.us-east-2.amazonaws.com/000496_black_thumb.jpg" />
            </CardActionArea>
            <Box
              sx={{
                display: "flex",
                position: "absolute",
                inset: "16px",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="caption">#000176</Typography>
              <Typography color="primary">Donated</Typography>
            </Box>
          </StyledCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Prize;
