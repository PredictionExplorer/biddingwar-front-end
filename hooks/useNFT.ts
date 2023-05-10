import { useState, useEffect } from "react";
import api from "../services/api";

export const useNFT = (tokenId) => {
  const [nft, setNft] = useState(null);

  useEffect(() => {
    const getNFT = async () => {
      try {
        const nft = await api.get_prizeinfo(tokenId);
        const fileName = tokenId.toString().padStart(6, "0");
        const image = `https://cosmic-game.s3.us-east-2.amazonaws.com/${fileName}.png`;
        const video = `https://cosmic-game.s3.us-east-2.amazonaws.com/${fileName}.mp4`;

        setNft({
          id: parseInt(tokenId),
          name: nft.CurName,
          owner: nft.CurOwnerAddr,
          seed: nft.Seed,
          amount: nft.Amount,
          amountEth: nft.AmountEth,
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
