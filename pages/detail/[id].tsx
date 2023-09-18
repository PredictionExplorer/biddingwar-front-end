import { GetServerSidePropsContext } from "next";
import React from "react";
import Head from "next/head";
import NFTTrait from "../../components/NFTTrait";
import { MainWrapper } from "../../components/styled";
import api from "../../services/api";

const Detail = ({ nft, prizeInfo, numCSTokenMints }) => {
  return (
    <>
      <Head>
        <title>NFT #{nft.TokenId} | CosmicSignature Token</title>
      </Head>
      <MainWrapper
        maxWidth={false}
        style={{
          paddingLeft: 0,
          paddingRight: 0,
        }}
      >
        <NFTTrait
          nft={nft}
          prizeInfo={prizeInfo}
          numCSTokenMints={numCSTokenMints}
        />
      </MainWrapper>
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const id = context.params!.id;
  const tokenId = Array.isArray(id) ? id[0] : id;
  const dashboardData = await api.get_dashboard_info();
  let nft = null;
  if (dashboardData.MainStats.NumCSTokenMints > parseInt(tokenId)) {
    nft = await api.get_cst_info(parseInt(tokenId));
  }
  let prizeInfo = null;
  if (nft?.PrizeNum >= 0) {
    prizeInfo = await api.get_prize_info(nft.PrizeNum);
  }
  return {
    props: {
      nft,
      prizeInfo,
      numCSTokenMints: dashboardData.MainStats.NumCSTokenMints,
    },
  };
}

export default Detail;
