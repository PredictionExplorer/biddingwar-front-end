import { Badge, Tooltip, Typography } from "@mui/material";
import { ReactNode } from "react";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

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
            <Badge color="error" variant="dot">
              <Typography>Claim</Typography>
            </Badge>
          ) : (
            <Typography>Claim</Typography>
          )}
        </>
      ),
      route: "/my-winnings",
    });
  }
  return NAVS;
};

export default getNAVs;
