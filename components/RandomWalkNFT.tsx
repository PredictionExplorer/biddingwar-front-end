import React from "react";
import { Typography, CardActionArea, Card } from "@mui/material";

import { useRWLKNFT } from "../hooks/useRWLKNFT";
import { formatId } from "../utils";
import { NFTImage, NFTSkeleton, NFTInfoWrapper } from "./styled";

const RandomWalkNFT = ({ tokenId, selected = false }) => {
  const nft = useRWLKNFT(tokenId);
  const handleImageError = (event) => {
    event.target.src = "/images/qmark.png";
  };
  return (
    <Card
      sx={{
        border: "1px solid",
        borderColor: selected ? "#FFFFFF" : "#181F64",
      }}
    >
      <CardActionArea>
        {!nft ? (
          <NFTSkeleton animation="wave" variant="rectangular" />
        ) : (
          <NFTImage src={nft.black_image_thumb} onError={handleImageError} />
        )}
        {nft && (
          <NFTInfoWrapper>
            <Typography fontSize={11}>{formatId(nft.id)}</Typography>
          </NFTInfoWrapper>
        )}
      </CardActionArea>
    </Card>
  );
};

export default RandomWalkNFT;
