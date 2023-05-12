import React, { useState } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Typography,
  CardActionArea,
  Button,
  TextField,
  Grid,
  Link,
  Container,
  Menu,
  MenuItem,
} from "@mui/material";

import { CopyToClipboard } from "react-copy-to-clipboard";
import Lightbox from "react-awesome-lightbox";
import "react-awesome-lightbox/build/style.css";

import ModalVideo from "react-modal-video";
import "react-modal-video/css/modal-video.min.css";

import NFTVideo from "./NFTVideo";
import useBiddingWarContract from "../hooks/useBiddingWarContract";
import { useActiveWeb3React } from "../hooks/web3";
import { formatId } from "../utils";
import { StyledCard, SectionWrapper, NFTImage, NFTInfoWrapper } from "./styled";
import {
  ArrowBack,
  ArrowForward,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";

const NFTTrait = ({ nft }) => {
  const fileName = nft.TokenId.toString().padStart(6, "0");
  const image = `https://cosmic-game.s3.us-east-2.amazonaws.com/${fileName}.png`;
  const video = `https://cosmic-game.s3.us-east-2.amazonaws.com/${fileName}.mp4`;
  const [open, setOpen] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);
  const [videoPath, setVideoPath] = useState(null);
  const [address, setAddress] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const router = useRouter();
  const nftContract = useBiddingWarContract();
  const { account } = useActiveWeb3React();

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

  const handleTransfer = async () => {
    try {
      await nftContract
        .transferFrom(account, address, nft.TokenId)
        .then((tx) => tx.wait());

      router.push("/my-nfts");
    } catch (err) {
      console.log(err);
    }
  };

  const handlePrev = () =>
    router.push(`/detail/${Math.max(nft.TokenId - 1, 0)}`);

  const handleNext = async () => {
    const totalSupply = await nftContract.totalSupply();
    router.push(
      `/detail/${Math.min(nft.TokenId + 1, totalSupply.toNumber() - 1)}`
    );
  };

  const handleMenuOpen = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = (e) => {
    setAnchorEl(null);
  };

  const convertTimestampToDateTime = (timestamp: any) => {
    var date_ob = new Date(timestamp * 1000);
    var year = date_ob.getFullYear();
    var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    var date = ("0" + date_ob.getDate()).slice(-2);
    var hours = ("0" + date_ob.getHours()).slice(-2);
    var minutes = ("0" + date_ob.getMinutes()).slice(-2);
    var seconds = ("0" + date_ob.getSeconds()).slice(-2);
    var result =
      year +
      "-" +
      month +
      "-" +
      date +
      " " +
      hours +
      ":" +
      minutes +
      ":" +
      seconds;
    return result;
  };

  return (
    <Container>
      <SectionWrapper>
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
            <Box mt={2}>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Button variant="text" fullWidth onClick={handleMenuOpen}>
                    Copy link
                    {anchorEl ? <ExpandLess /> : <ExpandMore />}
                  </Button>

                  <Menu
                    elevation={0}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "center",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "center",
                    }}
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                  >
                    <CopyToClipboard text={video}>
                      <MenuItem onClick={handleMenuClose}>Video</MenuItem>
                    </CopyToClipboard>
                    <CopyToClipboard text={image}>
                      <MenuItem onClick={handleMenuClose}>Image</MenuItem>
                    </CopyToClipboard>
                    <CopyToClipboard text={window.location.href}>
                      <MenuItem onClick={handleMenuClose}>Detail Page</MenuItem>
                    </CopyToClipboard>
                  </Menu>
                </Grid>
                <Grid item xs={4}>
                  <Button
                    variant="outlined"
                    color="info"
                    fullWidth
                    startIcon={<ArrowBack />}
                    onClick={handlePrev}
                  >
                    Prev
                  </Button>
                </Grid>
                <Grid item xs={4}>
                  <Button
                    variant="contained"
                    color="primary"
                    style={{ width: "100%" }}
                    endIcon={<ArrowForward />}
                    onClick={handleNext}
                  >
                    Next
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={12} sm={8} md={6}>
            {nft.timestamp && (
              <Box>
                <Typography color="primary" component="span">
                  Minted Date:
                </Typography>
                &nbsp;
                <Typography component="span">
                  {convertTimestampToDateTime(nft.timestamp)}
                </Typography>
              </Box>
            )}
            <Box>
              <Typography color="primary" component="span">
                Beauty Score:
              </Typography>
              &nbsp;
              <Typography component="span">1200</Typography>
            </Box>
            <Box>
              <Typography color="primary" component="span">
                Owner:
              </Typography>
              &nbsp;
              <Typography component="span">
                <Link
                  style={{ color: "#fff" }}
                  href={`/gallery?address=${nft.CurOwnerAddr}`}
                >
                  {nft.CurOwnerAddr}
                </Link>
              </Typography>
            </Box>
            <Box>
              <Typography color="primary" component="span">
                Percentage of Donation:
              </Typography>
              &nbsp;
              <Typography component="span">10.00%</Typography>
            </Box>
            <Box>
              <Typography color="primary">ETH donated to:</Typography>
              <Typography>
                0xA867454690CA5142917165FB2dBb08ccaEb303df
              </Typography>
            </Box>
            <Box>
              {account === nft.CurOwnerAddr && (
                <>
                  <Box display="flex" mt={3}>
                    <TextField
                      variant="filled"
                      color="secondary"
                      placeholder="Enter address here"
                      fullWidth
                      size="small"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                    <Button
                      color="secondary"
                      variant="contained"
                      onClick={handleTransfer}
                      endIcon={<ArrowForward />}
                      sx={{ ml: 1 }}
                    >
                      Transfer
                    </Button>
                  </Box>
                </>
              )}
            </Box>
          </Grid>
        </Grid>
        <Box mt={2}>
          <NFTVideo image_thumb={image} onClick={() => handlePlay(video)} />
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

export default NFTTrait;
