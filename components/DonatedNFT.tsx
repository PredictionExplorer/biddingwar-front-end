import React from "react";
import { Typography, CardActionArea } from "@mui/material";

import { formatId } from "../utils";
import {
  NFTImage,
  NFTSkeleton,
  NFTInfoWrapper,
  StyledCard,
  NFTCheckMark,
} from "./styled";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const DonatedNFT = ({ token, selected = false }) => {
  return (
    <StyledCard>
      <CardActionArea>
        {selected && (
          <NFTCheckMark>
            <CheckCircleOutlineIcon color="success" />
          </NFTCheckMark>
        )}
        {!token ? (
          <NFTSkeleton animation="wave" variant="rectangular" />
        ) : (
          <NFTImage image={token.NFTTokenURI} />
        )}
        {token && (
          <NFTInfoWrapper>
            <Typography variant="body1">{formatId(token.RecordId)}</Typography>
          </NFTInfoWrapper>
        )}
      </CardActionArea>
    </StyledCard>
  );
};

export default DonatedNFT;
