import React from "react";
import Image from "next/image";
import { Box, Paper, Typography, Link, styled } from "@mui/material";
import { MainWrapper } from "../components/styled";
import FAQ from "../components/FAQ";
import { isFirefox, isMobile } from "react-device-detect";
import { GetServerSideProps } from "next";
import { getAssetsUrl } from "../utils";

const StyledPaper = styled(Paper)(
  !(isMobile || isFirefox) && {
    position: "relative",
    padding: "20px 120px",
    border: 0,
    "--border": "1px",
    "--radius": "16px",
    "--t": 0,
    "--path":
      "0 0,32px 0,100% 0,100% calc(100% - 32px),100% 100%,120px 100%,0 calc(100% - 70px)",
    WebkitMask: "paint(rounded-shape)",
    background:
      "linear-gradient(90deg, rgba(21, 191, 253, 0.7) 0%, rgba(156, 55, 253, 0.7) 70%)",
  }
);

const FAQPage = () => {
  return (
    <MainWrapper>
      <Typography variant="h4" color="primary" textAlign="center" gutterBottom>
        FAQ
      </Typography>
      <Box mt={4}>
        <FAQ />
        <StyledPaper sx={{ display: "flex", alignItems: "center" }}>
          <Box>
            <Typography variant="h4">Have a question?</Typography>
            <Box marginBottom="16px">
              <Image
                src={"/images/divider.svg"}
                width={93}
                height={3}
                alt="divider"
              />
            </Box>
            <Typography fontSize={19}>
              For any other questions, reach out to us on&nbsp;
              <Link
                style={{
                  textDecoration: "none",
                  fontWeight: 800,
                  color: "#fff",
                }}
                href="https://x.com/CosmicSignature"
              >
                Twitter
              </Link>
              &nbsp;or&nbsp;
              <Link
                style={{
                  textDecoration: "none",
                  fontWeight: 800,
                  color: "#fff",
                }}
                href="https://discord.com/channels/892288714007539722/896092674472423484"
              >
                Discord
              </Link>
            </Typography>
          </Box>
          <Box marginLeft="60px">
            <Image
              src={"/images/question2.png"}
              width={215}
              height={269}
              alt="questions"
            />
          </Box>
        </StyledPaper>
      </Box>
    </MainWrapper>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const title = "FAQ | Cosmic Signature";
  const description = "Frequenly Asked Questions (FAQ)";
  const imageUrl = getAssetsUrl("cosmicsignature/logo.png");

  const openGraphData = [
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: imageUrl },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: imageUrl },
  ];

  return { props: { title, description, openGraphData } };
};

export default FAQPage;
