import React from "react";
import { Typography, CardActionArea } from "@mui/material";

import { useNFT } from "../hooks/useNFT";
import { formatId } from "../utils";
import {
  NFTImage,
  NFTSkeleton,
  NFTInfoWrapper,
  StyledCard,
  NFTCheckMark,
} from "./styled";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const DonatedNFT = ({ tokenId, selectable = false, selected = false }) => {
  const nft = useNFT(tokenId);
  return (
    <StyledCard>
      <CardActionArea href={nft && !selectable ? `/detail/${nft.id}` : ""}>
        {selected && (
          <NFTCheckMark>
            <CheckCircleOutlineIcon color="success" />
          </NFTCheckMark>
        )}
        {!nft ? (
          <NFTSkeleton animation="wave" variant="rectangular" />
        ) : (
          <NFTImage image={nft.black_image_thumb} />
        )}
        {nft && (
          <NFTInfoWrapper>
            <Typography variant="body1">{formatId(nft.id)}</Typography>
          </NFTInfoWrapper>
        )}
      </CardActionArea>
    </StyledCard>
  );
};

export default DonatedNFT;
