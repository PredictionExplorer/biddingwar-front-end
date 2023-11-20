import { ReactNode } from "react";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { Badge, Typography } from "@mui/material";

type NavItem = {
  title: string | ReactNode;
  route: string;
  children?: Array<NavItem>;
};

const getNAVs = (status, account) => {
  let NAVS: NavItem[] = [
    { title: "Gallery", route: "/gallery" },
    { title: "Contracts", route: "/contracts" },
    { title: "Prizes", route: "/prize" },
    { title: "Statistics", route: "/statistics" },
    { title: "FAQ", route: "/faq" },
  ];
  if (
    account &&
    (status?.ETHRaffleToClaim > 0 || status?.NumDonatedNFTToClaim > 0)
  ) {
    NAVS.push({
      title: (
        <Badge variant="dot" color="error">
          Claim
        </Badge>
      ),
      route: "/my-winnings",
    });
  }
  return NAVS;
};

export default getNAVs;
