import React, { useEffect, useState } from "react";
import { Typography, CardActionArea, Box } from "@mui/material";
import { NFTImage, StyledCard } from "./styled";
import axios from "axios";

const DonatedNFT = ({ nft }) => {
  const [tokenURI, setTokenURI] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get(nft.NFTTokenURI);
      setTokenURI(data);
    };
    if (nft.NFTTokenURI) {
      fetchData();
    }
  }, []);

  return (
    <StyledCard>
      <CardActionArea>
        {tokenURI && (
          <NFTImage
            image={tokenURI?.image}
            sx={{ backgroundSize: "contain" }}
          />
        )}
      </CardActionArea>
      <Box
        sx={{
          display: "flex",
          position: "absolute",
          inset: "16px",
          justifyContent: "space-between",
          pointerEvents: "none",
        }}
      >
        <Typography
          variant="caption"
          style={{ textShadow: "0px 0px 2px #080B2A" }}
        >
          #{nft.NFTTokenId}
        </Typography>
        <Typography
          color="primary"
          style={{ textShadow: "0px 0px 2px #080B2A" }}
        >
          Donated
        </Typography>
      </Box>
    </StyledCard>
  );
};

export default DonatedNFT;
