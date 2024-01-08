import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import Head from "next/head";
import { MainWrapper } from "../components/styled";
import api from "../services/api";
import { GlobalStakingActionsTable } from "../components/GlobalStakingActionsTable";
import { GlobalStakedTokensTable } from "../components/GlobalStakedTokensTable";

const Staking = () => {
  const [stakingActions, setStakingActions] = useState(null);
  const [stakedTokens, setStakedTokens] = useState(null);
  useEffect(() => {
    const fetchStakingActions = async () => {
      const actions = await api.get_staking_actions();
      setStakingActions(actions);
    };
    const fetchStakedTokens = async () => {
      const tokens = await api.get_staked_tokens();
      setStakedTokens(tokens);
    };
    fetchStakingActions();
    fetchStakedTokens();
  }, []);

  return (
    <>
      <Head>
        <title>Staking | Cosmic Signature</title>
        <meta name="description" content="" />
      </Head>
      <MainWrapper>
        <Typography variant="h5" mb={4}>
          Staking Actions
        </Typography>
        {stakingActions === null ? (
          <Typography variant="h6">Loading...</Typography>
        ) : (
          <GlobalStakingActionsTable list={stakingActions} />
        )}
        <Typography variant="h5" mt={8} mb={4}>
          Staked Tokens
        </Typography>
        {stakedTokens === null ? (
          <Typography variant="h6">Loading...</Typography>
        ) : (
          <GlobalStakedTokensTable list={stakedTokens} />
        )}
      </MainWrapper>
    </>
  );
};

export default Staking;
