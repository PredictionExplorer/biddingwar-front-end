import React, { useState, useEffect } from "react";
import Image from "next/image";

import {
  Toolbar,
  IconButton,
  Drawer,
  ListItem,
  Container,
  Link,
  Badge,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import NAV_SECTIONS from "../config/nav";
import ConnectWalletButton from "../components/ConnectWalletButton";

import { NavLink, AppBarWrapper, DrawerList } from "./styled";
import ListNavItem from "./ListNavItem";
import ListItemButton from "./ListItemButton";
import { useApiData } from "../contexts/ApiDataContext";

const Header = () => {
  const [state, setState] = useState({
    mobileView: false,
    drawerOpen: false,
  });
  const { apiData: status } = useApiData();
  const { mobileView, drawerOpen } = state;

  useEffect(() => {
    const setResponsiveness = () => {
      return window.innerWidth < 992
        ? setState((prevState) => ({ ...prevState, mobileView: true }))
        : setState((prevState) => ({ ...prevState, mobileView: false }));
    };

    setResponsiveness();

    window.addEventListener("resize", () => setResponsiveness());

    return () => {
      window.removeEventListener("resize", () => setResponsiveness());
    };
  }, []);

  const renderDesktop = () => {
    return (
      <Toolbar disableGutters>
        <Link href="/">
          <Image src="/images/logo2.svg" width={240} height={48} alt="logo" />
        </Link>
        {NAV_SECTIONS.map((nav, i) => (
          <ListNavItem key={i} nav={nav} />
        ))}
        {(status.ETHRaffleToClaim > 0 || status.NumDonatedNFTToClaim > 0) && (
          <Box ml={3}>
            <Badge color="secondary" variant="dot">
              <NavLink href="/my-winnings">
                <EmojiEventsIcon />
              </NavLink>
            </Badge>
          </Box>
        )}
        <ConnectWalletButton isMobileView={false} />
      </Toolbar>
    );
  };

  const renderMobile = () => {
    const handleDrawerOpen = () =>
      setState((prevState) => ({ ...prevState, drawerOpen: true }));
    const handleDrawerClose = () =>
      setState((prevState) => ({ ...prevState, drawerOpen: false }));

    return (
      <Toolbar>
        <Link href="/">
          <Image src="/images/logo2.svg" width={240} height={48} alt="logo" />
        </Link>
        <IconButton
          aria-label="menu"
          aria-haspopup="true"
          edge="start"
          color="inherit"
          onClick={handleDrawerOpen}
          style={{ marginLeft: "auto" }}
        >
          <MenuIcon />
        </IconButton>

        <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerClose}>
          <DrawerList>
            <ListItem>
              <ConnectWalletButton isMobileView />
            </ListItem>
            {NAV_SECTIONS.map((nav, i) => (
              <ListItemButton
                key={i}
                nav={nav}
                sx={{ justifyContent: "center" }}
              >
                <NavLink href={nav.route}>{nav.title}</NavLink>
              </ListItemButton>
            ))}
          </DrawerList>
        </Drawer>
      </Toolbar>
    );
  };

  return (
    <AppBarWrapper position="fixed">
      <Container>{mobileView ? renderMobile() : renderDesktop()}</Container>
    </AppBarWrapper>
  );
};

export default Header;
