import React, { useEffect, useState } from "react";
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
import useCosmicSignatureContract from "../hooks/useCosmicSignatureContract";

const CGNFT = ({ tokenId: number }) => {
  return (
    <>
      <StyledCard>
        <CardActionArea>
          <NFTImage image="https://randomwalknft.s3.us-east-2.amazonaws.com/000496_black_thumb.jpg" />
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
          <Typography variant="caption" component="p">
            #000176
          </Typography>
          <Box sx={{ display: "flex" }}>
            <Image
              src={"/images/Ethereum_small.svg"}
              width={16}
              height={16}
              alt="ethereum"
            />
            <Typography variant="caption" color="primary" component="p">
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

const LatestNFTs = () => {
  const [loading, setLoading] = useState(true);
  const [collection, setCollection] = useState([]);
  const contract = useCosmicSignatureContract();

  useEffect(() => {
    const getTokens = async () => {
      try {
        setLoading(true);
        let tokenIds = [];
        const balance = await contract.totalSupply();
        tokenIds = Object.keys(new Array(balance.toNumber()).fill(0));
        tokenIds = tokenIds.reverse().slice(0, 6);
        setCollection(tokenIds);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    getTokens();
  }, [contract]);

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
          {!loading && collection.length && (
            <Grid item xs={4} sx={{ position: "relative" }}>
              <StyledCard>
                <CardActionArea>
                  <NFTImage image="https://randomwalknft.s3.us-east-2.amazonaws.com/000496_black_thumb.jpg" />
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
                  <Typography variant="caption" component="p">
                    #000176
                  </Typography>
                  <Box sx={{ display: "flex" }}>
                    <Image
                      src={"/images/Ethereum_small.svg"}
                      width={16}
                      height={16}
                      alt="ethereum"
                    />
                    <Typography variant="caption" color="primary" component="p">
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
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default LatestNFTs;
