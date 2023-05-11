import { useState, useEffect } from "react";
import api from "../services/api";

export const useNFT = (tokenId) => {
  const [nft, setNft] = useState(null);

  useEffect(() => {
    const getNFT = async () => {
      try {
        const nft = await api.get_cst_info(tokenId);
        const fileName = tokenId.toString().padStart(6, "0");
        const image = `https://cosmic-game.s3.us-east-2.amazonaws.com/${fileName}.png`;
        const video = `https://cosmic-game.s3.us-east-2.amazonaws.com/${fileName}.mp4`;

        setNft({
          id: parseInt(tokenId),
          owner: nft.CurOwnerAddr,
          seed: nft.Seed,
          timestamp: nft.TimeStamp,
          image,
          video,
        });
      } catch (err) {
        console.log(err);
      }
    };

    if (tokenId !== null) {
      getNFT();
    }
  }, [tokenId]);

  return nft;
};
