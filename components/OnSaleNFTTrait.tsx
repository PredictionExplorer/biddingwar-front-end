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
} from "@mui/material";

import Lightbox from "react-awesome-lightbox";
import "react-awesome-lightbox/build/style.css";

import ModalVideo from "react-modal-video";
import "react-modal-video/css/modal-video.min.css";

import NFTVideo from "./NFTVideo";
import { formatId } from "../utils";
import { StyledCard, SectionWrapper, NFTImage, NFTInfoWrapper } from "./styled";

const OnSaleNFTTrait = ({ nft }) => {
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
                <NFTImage image={image} />
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
              fontSize={19}
              color="textSecondary"
              component="span"
              lineHeight={2}
            >
              Programmatically generated image and video Random Walk NFT. ETH
              spent on minting goes back to the minters through an
            </Typography>
            &nbsp;
            <Typography fontSize={19} color="primary" component="span">
              interesting mechanism
            </Typography>
            <Box mt={2}>
              <Typography color="primary" component="span">
                BID PRICE:
              </Typography>
              &nbsp;
              <Typography component="span">0.002084</Typography>
            </Box>
            <Box>
              <Typography color="primary" component="span">
                REWARD:
              </Typography>
              &nbsp;
              <Typography component="span">0.8024</Typography>
            </Box>
            <Box sx={{ display: "flex" }}>
              <Typography color="primary">Charity Address:</Typography>
              &nbsp;
              <Typography>0xB9A66Fe7C1B7b8b3f14F68399AD1202</Typography>
            </Box>
            <Box sx={{ display: "flex" }}>
              <Typography color="primary">Percentage of Donation:</Typography>
              &nbsp;
              <Typography>10.00%</Typography>
            </Box>
            <Box sx={{ my: "24px" }}>
              <Typography color="primary">Last Bidder Address:</Typography>
              <Typography>
                0xA867454690CA5142917165FB2dBb08ccaEb303df
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Box mt="100px">
          <Box width="60%" mx="auto">
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
            <Typography
              fontSize={19}
              color="textSecondary"
              component="span"
              lineHeight={2}
            >
              Programmatically generated image and video Random Walk NFT. ETH
              spent on minting goes back to the minters through an
            </Typography>
            &nbsp;
            <Typography fontSize={19} color="primary" component="span">
              interesting mechanism
            </Typography>
          </Box>
          <Box sx={{ display: "flex", gap: "24px" }}>
            <NFTVideo image_thumb={image} onClick={() => handlePlay(video)} />
            <NFTVideo image_thumb={image} onClick={() => handlePlay(video)} />
          </Box>
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
