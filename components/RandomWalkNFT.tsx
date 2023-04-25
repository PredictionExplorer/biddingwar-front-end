import React from "react";
import { Typography, CardActionArea, Card } from "@mui/material";

import { useNFT } from "../hooks/useNFT";
import { formatId } from "../utils";
import { NFTImage, NFTSkeleton, NFTInfoWrapper, NFTCheckMark } from "./styled";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const RandomWalkNFT = ({ tokenId, selectable = false, selected = false }) => {
  const nft = useNFT(tokenId);
  return (
    <Card
      sx={{
        border: "1px solid",
        borderColor: selected ? "#FFFFFF" : "#181F64",
      }}
    >
      <CardActionArea href={nft && !selectable ? `/detail/${nft.id}` : ""}>
        {!nft ? (
          <NFTSkeleton animation="wave" variant="rectangular" />
        ) : (
          <NFTImage image={nft.black_image_thumb} />
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
