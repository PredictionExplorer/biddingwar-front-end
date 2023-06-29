import React from "react";
import { Typography, List, ListItem, styled } from "@mui/material";
import Head from "next/head";
import { MainWrapper } from "../components/styled";
import api from "../services/api";

export const ContractListItem = styled(ListItem)({
  justifyContent: "center",
});

const Contracts = ({ data }) => (
  <>
    <Head>
      <title>Withdraw | CosmicSignature NFT</title>
      <meta
        name="description"
        content="Programmatically generated CosmicSignature image and video NFTs. ETH spent on minting goes back to the minters."
      />
    </Head>
    <MainWrapper>
      <Typography variant="h4" color="primary" align="center">
        Contract Addresses
      </Typography>
      <List sx={{ mt: 8 }}>
        <ContractListItem>
          <Typography variant="subtitle1" color="primary" mr={2}>
            CosmicGame Address:
          </Typography>
          <Typography variant="subtitle1">
            {data.ContractAddrs.CosmicGameAddr}
          </Typography>
        </ContractListItem>
        <ContractListItem>
          <Typography variant="subtitle1" color="primary" mr={2}>
            CosmicToken Address:
          </Typography>
          <Typography variant="subtitle1">
            {data.ContractAddrs.CosmicTokenAddr}
          </Typography>
        </ContractListItem>
        <ContractListItem>
          <Typography variant="subtitle1" color="primary" mr={2}>
            CosmicSignature Address:
          </Typography>
          <Typography variant="subtitle1">
            {data.ContractAddrs.CosmicSignatureAddr}
          </Typography>
        </ContractListItem>
        <ContractListItem>
          <Typography variant="subtitle1" color="primary" mr={2}>
            CosmicDAO Address:
          </Typography>
          <Typography variant="subtitle1">
            {data.ContractAddrs.CosmicDaoAddr}
          </Typography>
        </ContractListItem>
        <ContractListItem>
          <Typography variant="subtitle1" color="primary" mr={2}>
            CharityWallet Address:
          </Typography>
          <Typography variant="subtitle1">
            {data.ContractAddrs.CharityWalletAddr}
          </Typography>
        </ContractListItem>
        <ContractListItem>
          <Typography variant="subtitle1" color="primary" mr={2}>
            RaffleWallet Address:
          </Typography>
          <Typography variant="subtitle1">
            {data.ContractAddrs.RaffleWalletAddr}
          </Typography>
        </ContractListItem>
      </List>
    </MainWrapper>
  </>
);

export async function getServerSideProps() {
  const dashboardData = await api.get_dashboard_info();

  return {
    props: {
      data: dashboardData,
    },
  };
}

export default Contracts;
