import React from "react";
import Image from "next/image";

import { VideoCard, NFTImage, NFTImageWrapper } from "./styled";

const handleImageError = (event) => {
  event.target.src = "/images/qmark.png";
};
const NFTVideo = ({ image_thumb, onClick }) => (
  <VideoCard>
    <NFTImageWrapper>
      <NFTImage
        src={image_thumb}
        style={{ opacity: 0.55 }}
        onError={handleImageError}
      />
    </NFTImageWrapper>
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        cursor: "pointer",
      }}
    >
      <Image
        src={"/images/play.svg"}
        alt="play"
        onClick={onClick}
        width={85}
        height={84}
      />
    </div>
  </VideoCard>
);

export default NFTVideo;
