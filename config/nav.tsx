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
  if (account) {
    NAVS.push({
      title: (
        <>
          {status?.ETHRaffleToClaim > 0 || status?.NumDonatedNFTToClaim > 0 ? (
            <Badge variant="dot" color="error">Claim</Badge>
          ) : (
            "Claim"
          )}
        </>
      ),
      route: "/my-winnings",
    });
  }
  return NAVS;
};

export default getNAVs;
