import React, { useState } from "react";
import Image from "next/image";
import {
  Box,
  Typography,
  CardActionArea,
  Grid,
  Container,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import Lightbox from "react-awesome-lightbox";
import "react-awesome-lightbox/build/style.css";

import ModalVideo from "react-modal-video";
import "react-modal-video/css/modal-video.min.css";

import NFTVideo from "./NFTVideo";
import { formatId } from "../utils";
import { StyledCard, SectionWrapper, NFTImage, NFTInfoWrapper } from "./styled";

const OnSaleNFTTrait = ({ nft }) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("md"));
  const fileName = nft.TokenId.toString().padStart(6, "0");
  const image = `https://cosmic-game.s3.us-east-2.amazonaws.com/${fileName}.png`;
  const video = `https://cosmic-game.s3.us-east-2.amazonaws.com/${fileName}.mp4`;
  const [open, setOpen] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);
  const [videoPath, setVideoPath] = useState(null);
  const [notification, setNotification] = useState({
    text: "",
    visible: false,
  });

  const handlePlay = (videoPath) => {
    fetch(videoPath).then((res) => {
      if (res.ok) {
        setVideoPath(videoPath);
        setOpen(true);
      } else {
        alert("Video is being generated, come back later");
      }
    });
  };

  const handleImageError = (event) => {
    event.target.src = "/images/qmark.png";
  };

  return (
    <Container>
      <SectionWrapper>
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          autoHideDuration={10000}
          open={notification.visible}
          onClose={() => setNotification({ text: "", visible: false })}
        >
          <Alert severity="error" variant="filled">
            {notification.text}
          </Alert>
        </Snackbar>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={8} md={6}>
            <StyledCard>
              <CardActionArea onClick={() => setImageOpen(true)}>
                <NFTImage src={image} onError={handleImageError} />
                <NFTInfoWrapper>
                  <Typography
                    variant="body1"
                    gutterBottom
                    sx={{
                      color: "#FFFFFF",
                    }}
                  >
                    {formatId(nft.TokenId)}
                  </Typography>
                </NFTInfoWrapper>
              </CardActionArea>
            </StyledCard>
          </Grid>
          <Grid item xs={12} sm={8} md={6}>
            <Typography variant="h4">Cosmic Signature Marketplace</Typography>
            <Typography
              fontSize={matches ? 19 : 16}
              color="textSecondary"
              component="span"
              lineHeight={2}
            >
              Programmatically generated image and video CosmicSignature NFT.
              ETH spent on minting goes back to the minters through an
            </Typography>
            &nbsp;
            <Typography
              fontSize={matches ? 19 : 16}
              color="primary"
              component="span"
            >
              interesting mechanism
            </Typography>
            <Box mt={2}>
              <Typography
                fontSize={matches ? 16 : 14}
                color="primary"
                component="span"
              >
                BID PRICE:
              </Typography>
              &nbsp;
              <Typography fontSize={matches ? 16 : 14} component="span">
                0.002084
              </Typography>
            </Box>
            <Box>
              <Typography
                fontSize={matches ? 16 : 14}
                color="primary"
                component="span"
              >
                REWARD:
              </Typography>
              &nbsp;
              <Typography fontSize={matches ? 16 : 14} component="span">
                0.8024
              </Typography>
            </Box>
            <Box display="flex" flexDirection={matches ? "row" : "column"}>
              <Typography fontSize={matches ? 16 : 14} color="primary" mr={1}>
                Charity Address:
              </Typography>
              <Typography fontSize={matches ? 16 : 14}>
                0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
              </Typography>
            </Box>
            <Box>
              <Typography
                fontSize={matches ? 16 : 14}
                color="primary"
                component="span"
              >
                Percentage of Donation:
              </Typography>
              &nbsp;
              <Typography fontSize={matches ? 16 : 14} component="span">
                10.00%
              </Typography>
            </Box>
            <Box sx={{ my: "24px" }}>
              <Typography fontSize={matches ? 16 : 14} color="primary">
                Last Bidder Address:
              </Typography>
              <Typography fontSize={matches ? 16 : 14}>
                0xA867454690CA5142917165FB2dBb08ccaEb303df
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Box mt="100px">
          <Box width={matches ? "60%" : "100%"} mx="auto">
            <Typography variant="h4" textAlign="center">
              Video Gallery
            </Typography>
            <Box textAlign="center" marginBottom="16px">
              <Image
                src={"/images/divider.svg"}
                width={93}
                height={3}
                alt="divider"
              />
            </Box>
            <Box textAlign="center">
              <Typography
                fontSize={matches ? 19 : 16}
                color="textSecondary"
                component="span"
                lineHeight={2}
              >
                Programmatically generated image and video CosmicSignature NFT.
                ETH spent on minting goes back to the minters through an
              </Typography>
              &nbsp;
              <Typography
                fontSize={matches ? 19 : 16}
                color="primary"
                component="span"
              >
                interesting mechanism
              </Typography>
            </Box>
          </Box>
          <Grid container spacing={2} mt="40px">
            <Grid item xs={12} md={6}>
              <NFTVideo image_thumb={image} onClick={() => handlePlay(video)} />
            </Grid>
            <Grid item xs={12} md={6}>
              <NFTVideo image_thumb={image} onClick={() => handlePlay(video)} />
            </Grid>
          </Grid>
        </Box>
        {imageOpen && (
          <Lightbox image={image} onClose={() => setImageOpen(false)} />
        )}
        <ModalVideo
          channel="custom"
          url={videoPath}
          isOpen={open}
          onClose={() => setOpen(false)}
        />
      </SectionWrapper>
    </Container>
  );
};

export default OnSaleNFTTrait;
