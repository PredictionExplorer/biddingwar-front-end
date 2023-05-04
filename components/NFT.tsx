import React from "react";
import { Typography, CardActionArea } from "@mui/material";
import { useNFT } from "../hooks/useNFT";
import { formatId } from "../utils";
import { NFTImage, NFTSkeleton, NFTInfoWrapper, StyledCard } from "./styled";
import router from "next/router";

const NFT = ({ tokenId }) => {
  const nft = useNFT(tokenId);
  return (
    <StyledCard>
      <CardActionArea onClick={() => router.push(`/detail/${nft.id}`)}>
        {!nft ? (
          <NFTSkeleton animation="wave" variant="rectangular" />
        ) : (
          <NFTImage image={nft.black_image_thumb} />
        )}
        {nft && (
          <NFTInfoWrapper>
            <Typography variant="caption">{formatId(nft.id)}</Typography>
          </NFTInfoWrapper>
        )}
      </CardActionArea>
    </StyledCard>
  );
};

export default NFT;
