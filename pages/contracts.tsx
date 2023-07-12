import React from "react";
import {
  Typography,
  List,
  ListItem,
  styled,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Head from "next/head";
import { MainWrapper } from "../components/styled";
import api from "../services/api";

export const ContractListItem = styled(ListItem)({
  justifyContent: "center",
});

const ContractItem = ({ name, value }) => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("md"));
  return (
    <ContractListItem>
      <Typography
        color="primary"
        sx={{ mr: 2, minWidth: matches ? "200px" : "100px" }}
      >
        {name}:
      </Typography>
      <Typography fontFamily="monospace">{value}</Typography>
    </ContractListItem>
  );
};

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
        <ContractItem
          name="CosmicGame Address"
          value={data.ContractAddrs.CosmicGameAddr}
        />
        <ContractItem
          name="CosmicToken Address"
          value={data.ContractAddrs.CosmicTokenAddr}
        />
        <ContractItem
          name="CosmicSignature Address"
          value={data.ContractAddrs.CosmicSignatureAddr}
        />
        <ContractItem
          name="CosmicDAO Address"
          value={data.ContractAddrs.CosmicDaoAddr}
        />
        <ContractItem
          name="CharityWallet Address"
          value={data.ContractAddrs.CharityWalletAddr}
        />
        <ContractItem
          name="RaffleWallet Address"
          value={data.ContractAddrs.RaffleWalletAddr}
        />
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
