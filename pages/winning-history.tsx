import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import Head from "next/head";
import { MainWrapper } from "../components/styled";
import { useActiveWeb3React } from "../hooks/web3";
import WinningHistoryTable from "../components/WinningHistoryTable";

const WinningHistory = () => {
  const { account } = useActiveWeb3React();
  const [claimHistory, setClaimHistory] = useState(null);
  useEffect(() => {
    const fetchClaimHistory = async () => {
      const res = await fetch(`/api/claimHistoryByUser/?address=${account}`);
      const history = await res.json();
      setClaimHistory(history);
    };
    if (account) {
      fetchClaimHistory();
    }
  }, []);

  return (
    <>
      <Head>
        <title>History of Winnings | Cosmic Signature</title>
        <meta name="description" content="" />
      </Head>
      <MainWrapper>
        <Typography variant="h4" color="primary" textAlign="center" mb={4}>
          History of Winnings
        </Typography>
        {claimHistory === null ? (
          <Typography>Loading...</Typography>
        ) : (
          <WinningHistoryTable
            winningHistory={claimHistory}
            showClaimedStatus={true}
          />
        )}
      </MainWrapper>
    </>
  );
};

export default WinningHistory;
