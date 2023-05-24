import React from "react";
import Image from "next/image";

import {
  Toolbar,
  Box,
  IconButton,
  Container,
  Typography,
  Link,
} from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faTwitter } from "@fortawesome/free-brands-svg-icons";

import { FooterWrapper } from "./styled";

const Footer = () => (
  <FooterWrapper position="fixed" color="primary">
    <Toolbar>
      <Container maxWidth="lg">
        <Box
          py={1}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Image src="/images/logo2.svg" width={240} height={48} alt="logo" />
          <Box sx={{ display: "flex" }}>
            <Typography variant="body2" color="textSecondary" marginRight={10}>
              Copyright © 2023 Cosmic Signature
            </Typography>
            <Link
              color="textSecondary"
              target="_blank"
              href="#"
              style={{ fontSize: "13px", textDecoration: "none" }}
              marginRight={10}
            >
              Terms and conditions
            </Link>
            <Link
              color="textSecondary"
              target="_blank"
              href="#"
              style={{ fontSize: "13px", textDecoration: "none" }}
            >
              Privacy policy
            </Link>
          </Box>
          <Box>
            <IconButton
              href="https://twitter.com/RandomWalkNFT"
              target="_blank"
            >
              <FontAwesomeIcon
                icon={faTwitter}
                color="#A9AAB5"
                width={24}
                height={24}
              />
            </IconButton>
            <IconButton href="https://discord.gg/bGnPn96Qwt" target="_blank">
              <FontAwesomeIcon
                icon={faDiscord}
                color="#A9AAB5"
                width={24}
                height={24}
              />
            </IconButton>
          </Box>
        </Box>
      </Container>
    </Toolbar>
  </FooterWrapper>
);

export default Footer;
