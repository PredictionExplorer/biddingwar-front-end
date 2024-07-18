import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import NFTTrait from "../../components/NFTTrait";
import { MainWrapper } from "../../components/styled";
import { formatId } from "../../utils";

const Detail = ({ tokenId }) => {
  return (
    <>
      <Head>
        <title>NFT #{tokenId} | Cosmic Signature Token</title>
        <meta
          property="og:title"
          content={`Cosmic Signature Token: Details for ${formatId(tokenId)}`}
        />
        <meta
          property="og:image"
          content={`https://cosmic-game2.s3.us-east-2.amazonaws.com/${tokenId
            .toString()
            .padStart(6, "0")}.png`}
        />
        <meta
          property="og:description"
          content={`Programmatically generated CosmicSignature image and video NFTs. ETH spent on minting goes back to the minters. These are the details for ${formatId(
            tokenId
          )}`}
        />

        <meta name="twitter:card" content="summary" />
        <meta
          name="twitter:title"
          content={`Cosmic Signature Token: Details for ${formatId(tokenId)}`}
        />
        <meta
          name="twitter:image"
          content={`https://cosmic-game2.s3.us-east-2.amazonaws.com/${tokenId
            .toString()
            .padStart(6, "0")}.png`}
        />
        <meta
          name="twitter:description"
          content={`Programmatically generated CosmicSignature image and video NFTs. ETH spent on minting goes back to the minters. These are the details for ${formatId(
            tokenId
          )}`}
        />
      </Head>
      <MainWrapper
        maxWidth={false}
        style={{
          paddingLeft: 0,
          paddingRight: 0,
        }}
      >
        <NFTTrait tokenId={tokenId} />
      </MainWrapper>
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const id = context.params!.id;
  const tokenId = Array.isArray(id) ? id[0] : id;
  return { props: { tokenId: parseInt(tokenId) } };
}

export default Detail;
