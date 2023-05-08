import React, { useState, useEffect } from "react";
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
import useRWLKNFTContract from "../hooks/useRWLKNFTContract";
import { useActiveWeb3React } from "../hooks/web3";
import { formatId } from "../utils";
import { StyledCard, SectionWrapper, NFTImage, NFTInfoWrapper } from "./styled";
import { ArrowBack, ArrowForward, ExpandLess, ExpandMore } from "@mui/icons-material";

const NFTTrait = ({ nft }) => {
  const {
    id,
    name,
    seed,
    black_image_url,
    black_image_thumb_url,
    black_triple_video_url,
  } = nft;
  const [open, setOpen] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);
  const [videoPath, setVideoPath] = useState(null);
  const [address, setAddress] = useState("");
  const [realOwner, setRealOwner] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const router = useRouter();
  const nftContract = useRWLKNFTContract();
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
        .transferFrom(account, address, id)
        .then((tx) => tx.wait());

      router.push("/my-nfts");
    } catch (err) {
      console.log(err);
    }
  };

  const handleClaimPrize = () => {

  };

  const handlePrev = () => router.push(`/detail/${Math.max(id - 1, 0)}`);

  const handleNext = async () => {
    const totalSupply = await nftContract.totalSupply();
    router.push(`/detail/${Math.min(id + 1, totalSupply.toNumber() - 1)}`);
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

  useEffect(() => {
    const getOwner = async () => {
      if (nftContract) {
        const owner = await nftContract.ownerOf(nft.id);
        setRealOwner(owner);
      }
    };
    getOwner();
  }, [nftContract, nft]);

  useEffect(() => {
    const { hash } = location;
    if (hash === "#black_image") {
      setImageOpen(true);
    } else if (hash === "#black_triple_video") {
      handlePlay(black_triple_video_url);
    }
  }, [black_triple_video_url]);

  return (
    <Container>
      <SectionWrapper>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={8} md={6}>
            <StyledCard>
              <CardActionArea onClick={() => setImageOpen(true)}>
                <NFTImage image={black_image_thumb_url} />
                <NFTInfoWrapper>
                  <Typography
                    variant="body1"
                    gutterBottom
                    sx={{
                      color: "#FFFFFF",
                    }}
                  >
                    {formatId(id)}
                  </Typography>
                </NFTInfoWrapper>
              </CardActionArea>
            </StyledCard>
            <Box mt={2}>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Button
                    variant="text"
                    fullWidth
                    onClick={handleMenuOpen}
                  >
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
                    <CopyToClipboard text={black_triple_video_url}>
                      <MenuItem onClick={handleMenuClose}>Video</MenuItem>
                    </CopyToClipboard>
                    <CopyToClipboard text={black_image_url}>
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
            {nft.tokenHistory[0]?.Record?.TimeStamp && (
              <Box>
                <Typography color="primary" component="span">
                  Minted Date:
                </Typography>
                &nbsp;
                <Typography component="span">
                  {convertTimestampToDateTime(
                    nft.tokenHistory[0]?.Record?.TimeStamp
                  )}
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
                  href={`/gallery?address=${realOwner}`}
                >
                  {realOwner}
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
              {account === realOwner && (
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
                      sx={{ml: 1}}
                    >
                      Transfer
                    </Button>
                  </Box>
                </>
              )}
            </Box>

            <Button
              variant="outlined"
              onClick={handleClaimPrize}
              sx={{mt: 2}}
              endIcon={<ArrowForward />}
            >
              Claim Prize
            </Button>
          </Grid>
        </Grid>
        <Box mt={2}>
          <NFTVideo
            image_thumb={black_image_thumb_url}
            onClick={() => handlePlay(black_triple_video_url)}
          />
        </Box>
        {imageOpen && (
          <Lightbox
            image={black_image_url}
            onClose={() => setImageOpen(false)}
          />
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
