import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import Head from "next/head";
import { MainWrapper } from "../components/styled";
import api from "../services/api";
import { GlobalStakingActionsTable } from "../components/GlobalStakingActionsTable";

const StakingActions = () => {
  const [stakingActions, setStakingActions] = useState(null);
  useEffect(() => {
    const fetchStakingActions = async () => {
      const actions = await api.get_staking_actions();
      setStakingActions(actions);
    };
    fetchStakingActions();
  }, []);

  return (
    <>
      <Head>
        <title>Staking Actions | Cosmic Signature</title>
        <meta name="description" content="" />
      </Head>
      <MainWrapper>
        <Typography variant="h4" color="primary" textAlign="center" mb={4}>
          Staking Actions
        </Typography>
        {stakingActions === null ? (
          <Typography variant="h6">Loading...</Typography>
        ) : (
          <GlobalStakingActionsTable list={stakingActions} />
        )}
      </MainWrapper>
    </>
  );
};

export default StakingActions;
