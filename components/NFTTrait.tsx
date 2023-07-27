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
  useMediaQuery,
  Snackbar,
  Alert,
  List,
  ListItem,
} from "@mui/material";

import { CopyToClipboard } from "react-copy-to-clipboard";
import Lightbox from "react-awesome-lightbox";
import "react-awesome-lightbox/build/style.css";

import ModalVideo from "react-modal-video";
import "react-modal-video/css/modal-video.min.css";

import NFTVideo from "./NFTVideo";
import { useActiveWeb3React } from "../hooks/web3";
import { formatId } from "../utils";
import { StyledCard, SectionWrapper, NFTInfoWrapper } from "./styled";
import {
  ArrowBack,
  ArrowForward,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import useCosmicSignatureContract from "../hooks/useCosmicSignatureContract";
import theme from "../config/styles";
import NFTImage from "./NFTImage";

const NFTTrait = ({ nft, prizeInfo }) => {
  const fileName = nft.TokenId.toString().padStart(6, "0");
  const image = `https://cosmic-game.s3.us-east-2.amazonaws.com/${fileName}.png`;
  const video = `https://cosmic-game.s3.us-east-2.amazonaws.com/${fileName}.mp4`;
  const [open, setOpen] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);
  const [videoPath, setVideoPath] = useState(null);
  const [address, setAddress] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [notification, setNotification] = useState({
    text: "",
    visible: false,
  });
  const [showRaffleTokenWinners, setShowRaffleTokenWinners] = useState(false);
  const [showRaffleETHWinners, setShowRaffleETHWinners] = useState(false);

  const router = useRouter();
  const nftContract = useCosmicSignatureContract();
  const { account } = useActiveWeb3React();
  const matches = useMediaQuery(theme.breakpoints.up("md"));

  const handlePlay = (videoPath) => {
    fetch(videoPath).then((res) => {
      if (res.ok) {
        setVideoPath(videoPath);
        setOpen(true);
      } else {
        setNotification({
          visible: true,
          text: "Video is being generated, come back later",
        });
      }
    });
  };

  const handleTransfer = async () => {
    try {
      await nftContract
        .transferFrom(account, address, nft.TokenId)
        .then((tx) => tx.wait());

      router.reload();
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
    var result = `${month}/${date}/${year} ${hours}:${minutes}:${seconds}`;
    return result;
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
                <NFTImage src={image} />
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
                <Grid item xs={6}>
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
                <Grid item xs={6}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Button
                        variant="contained"
                        fullWidth
                        startIcon={<ArrowBack />}
                        onClick={handlePrev}
                      >
                        Prev
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        endIcon={<ArrowForward />}
                        onClick={handleNext}
                      >
                        Next
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={12} sm={8} md={6}>
            {nft.TimeStamp && (
              <Box mb={1}>
                <Typography color="primary" component="span">
                  Minted Date:
                </Typography>
                &nbsp;
                <Typography component="span">
                  {convertTimestampToDateTime(nft.TimeStamp)}
                </Typography>
              </Box>
            )}
            <Box mb={1}>
              <Typography color="primary" component="span">
                Winner:
              </Typography>
              &nbsp;
              <Typography component="span">
                <Link
                  style={{ color: "#fff", fontSize: matches ? "16px" : "12px" }}
                  href={`/user/${nft.WinnerAddr}`}
                >
                  {nft.WinnerAddr}
                </Link>
              </Typography>
            </Box>
            <Box mb={1}>
              <Typography color="primary" component="span">
                Owner:
              </Typography>
              &nbsp;
              <Typography component="span">
                <Link
                  style={{ color: "#fff", fontSize: matches ? "16px" : "12px" }}
                  href={`/user/${nft.CurOwnerAddr}`}
                >
                  {nft.CurOwnerAddr}
                </Link>
              </Typography>
            </Box>
            <Box mb={1}>
              <Typography color="primary" component="span">
                Prize Type:
              </Typography>
              &nbsp;
              <Typography component="span">
                {nft.PrizeNum === -1
                  ? "Raffle Winner"
                  : `Round Winner (round #${nft.PrizeNum})`}
              </Typography>
            </Box>
            {nft.PrizeNum >= 0 && (
              <>
                <Box mb={3}>
                  <Typography color="primary" component="span">
                    Prize Amount:
                  </Typography>
                  &nbsp;
                  <Typography component="span">
                    {prizeInfo.AmountEth.toFixed(4)} ETH
                  </Typography>
                </Box>
                <Box mb={1}>
                  <Typography color="primary" component="span">
                    Donation Amount:
                  </Typography>
                  &nbsp;
                  <Typography component="span">
                    {prizeInfo.CharityAmountETH.toFixed(4)} ETH
                  </Typography>
                </Box>
                <Box mb={2}>
                  <Typography color="primary" component="span">
                    Charity Address:
                  </Typography>
                  &nbsp;
                  <Typography component="span">
                    {prizeInfo.CharityAddress}
                  </Typography>
                </Box>
                <Grid container spacing={2} mt={2}>
                  <Grid item xs={6}>
                    <Button
                      variant="contained"
                      onClick={() =>
                        setShowRaffleTokenWinners(!showRaffleTokenWinners)
                      }
                    >
                      Raffle Token Winners
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      variant="contained"
                      onClick={() =>
                        setShowRaffleETHWinners(!showRaffleETHWinners)
                      }
                    >
                      Raffle ETH Winners
                    </Button>
                  </Grid>
                </Grid>
                {showRaffleTokenWinners && (
                  <Box mt={2}>
                    <Typography color="primary">
                      Raffle Token Winners:
                    </Typography>
                    <List>
                      {prizeInfo.RaffleNFTWinners.map((winner) => (
                        <ListItem key={winner.EvtLogId} sx={{ padding: 0 }}>
                          <Typography fontFamily="monospace">
                            {winner.WinnerAddr}
                          </Typography>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
                {showRaffleETHWinners && (
                  <Box mt={2}>
                    <Typography color="primary" component="span" mr={1}>
                      Raffle ETH Winners:
                    </Typography>
                    <Typography component="span">
                      {prizeInfo.RaffleETHDeposits[0].Amount.toFixed(4)} ETH
                      (for each winner)
                    </Typography>
                    <List>
                      {prizeInfo.RaffleETHDeposits.map((winner) => (
                        <ListItem key={winner.EvtLogId} sx={{ padding: 0 }}>
                          <Typography fontFamily="monospace">
                            {winner.WinnerAddr}
                          </Typography>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
              </>
            )}
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
        <Box mt="80px">
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
