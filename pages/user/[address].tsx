import React, { useEffect, useState } from "react";
import { Box, Link, Typography } from "@mui/material";
import Head from "next/head";
import { MainWrapper } from "../../components/styled";
import { GetServerSidePropsContext } from "next";
import api from "../../services/api";
import BiddingHistoryTable from "../../components/BiddingHistoryTable";
import WinningHistoryTable from "../../components/WinningHistoryTable";
import { ethers } from "ethers";

const UserInfo = ({ address }) => {
  const [claimHistory, setClaimHistory] = useState(null);
  const [bidHistory, setBidHistory] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [invalidAddress, setInvalidAddress] = useState(false);

  useEffect(() => {
    const fetchData = async (addr: string) => {
      setLoading(true);
      const history = await api.get_claim_history_by_user(addr);
      setClaimHistory(history);
      const { Bids, UserInfo } = await api.get_user_info(addr);
      setBidHistory(Bids);
      setUserInfo(UserInfo);
      const balance = await api.get_user_balance(addr);
      setBalance(Number(ethers.utils.formatEther(balance)));
      setLoading(false);
    };
    if (address) {
      if (address !== "Invalid Address") {
        fetchData(address);
      } else {
        setInvalidAddress(true);
      }
    }
  }, [address]);

  return (
    <>
      <Head>
        <title>User Info | Cosmic Signature</title>
        <meta name="description" content="" />
      </Head>
      <MainWrapper>
        {invalidAddress ? (
          <Typography variant="h6">Invalid Address</Typography>
        ) : (
          <>
            <Box mb={4}>
              <Typography variant="h6" color="primary" component="span" mr={2}>
                User
              </Typography>
              <Typography variant="h6" component="span">
                {address}
              </Typography>
            </Box>
            {loading ? (
              <Typography variant="h6">Loading...</Typography>
            ) : (
              <>
                {balance !== 0 && (
                  <Box mb={1}>
                    <Typography color="primary" component="span">
                      Cosmic Tokens Balance:
                    </Typography>
                    &nbsp;
                    <Typography component="span">
                      {balance.toFixed(2)}
                    </Typography>
                  </Box>
                )}
                <Box mb={1}>
                  <Typography color="primary" component="span">
                    Number of Bids:
                  </Typography>
                  &nbsp;
                  <Typography component="span">{userInfo.NumBids}</Typography>
                </Box>
                <Box mb={1}>
                  <Typography color="primary" component="span">
                    Maximum Bid Amount:
                  </Typography>
                  &nbsp;
                  <Typography component="span">
                    {userInfo.MaxBidAmount.toFixed(6)} ETH
                  </Typography>
                </Box>
                <Box mb={1}>
                  <Typography color="primary" component="span">
                    Number of Prizes taken:
                  </Typography>
                  &nbsp;
                  <Typography component="span">{userInfo.NumPrizes}</Typography>
                </Box>
                <Box mb={1}>
                  <Typography color="primary" component="span">
                    Maximum amount gained (in prize winnings):
                  </Typography>
                  &nbsp;
                  <Typography component="span">
                    {userInfo.MaxWinAmount.toFixed(6)} ETH
                  </Typography>
                </Box>
                <Box mb={1}>
                  <Typography color="primary" component="span">
                    Amount of winnings in ETH raffles:
                  </Typography>
                  &nbsp;
                  <Typography component="span">
                    {userInfo.SumRaffleEthWinnings.toFixed(6)} ETH
                  </Typography>
                </Box>
                <Box mb={1}>
                  <Typography color="primary" component="span">
                    Amount withdrawn from ETH raffles:
                  </Typography>
                  &nbsp;
                  <Typography component="span">
                    {userInfo.SumRaffleEthWithdrawal.toFixed(6)} ETH
                  </Typography>
                </Box>
                <Box mb={1}>
                  <Typography color="primary" component="span">
                    Unclaimed donated NFTs:
                  </Typography>
                  &nbsp;
                  <Typography component="span">
                    {userInfo.UnclaimedNFTs}
                  </Typography>
                </Box>
                <Box mb={1}>
                  <Typography color="primary" component="span">
                    Total ETH won in raffles:
                  </Typography>
                  &nbsp;
                  <Typography component="span">
                    {(
                      userInfo.SumRaffleEthWinnings +
                      userInfo.SumRaffleEthWithdrawal
                    ).toFixed(6)}{" "}
                    ETH
                  </Typography>
                </Box>
                <Box mb={1}>
                  <Typography color="primary" component="span">
                    Number of (ETH) raffles participated in:
                  </Typography>
                  &nbsp;
                  <Typography component="span">
                    {userInfo.NumRaffleEthWinnings}
                  </Typography>
                </Box>
                <Box mb={1}>
                  <Typography color="primary" component="span">
                    Number of Raffle NFTs won:
                  </Typography>
                  &nbsp;
                  <Typography component="span">
                    {userInfo.RaffleNFTWon}
                  </Typography>
                </Box>
                <Typography mt={1}>
                  This account has {userInfo.CosmicTokenNumTransfers}{" "}
                  CosmicToken (ERC20), click{" "}
                  <Link href={`/cosmic-token-transfers/${address}`}>here</Link>{" "}
                  to see all the transfers made by this account.
                </Typography>
                <Typography mt={1}>
                  This account has {userInfo.CosmicSignatureNumTransfers}{" "}
                  CosmicSignature (ERC721), click{" "}
                  <Link href={`/cosmic-signature-transfers/${address}`}>
                    here
                  </Link>{" "}
                  to see all the transfers made by this account.
                </Typography>
                <Box mt={6}>
                  <Typography variant="h6" lineHeight={1}>
                    Bid History
                  </Typography>
                  <BiddingHistoryTable biddingHistory={bidHistory} />
                </Box>
                <Box>
                  <Typography variant="h6" lineHeight={1} mt={8} mb={2}>
                    History of Winnings
                  </Typography>
                  <WinningHistoryTable
                    winningHistory={claimHistory}
                    showClaimedStatus={true}
                  />
                </Box>
              </>
            )}
          </>
        )}
      </MainWrapper>
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const params = context.params!.address;
  let address = Array.isArray(params) ? params[0] : params;
  if (ethers.utils.isAddress(address.toLowerCase())) {
    address = ethers.utils.getAddress(address.toLowerCase());
  } else {
    address = "Invalid Address";
  }
  return { props: { address } };
}

export default UserInfo;
