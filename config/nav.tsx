import { Badge, Tooltip } from "@mui/material";
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
        <Tooltip title="If you have pending to claim prize, a red dot will be shown here.">
          {status.ETHRaffleToClaim > 0 || status.NumDonatedNFTToClaim > 0 ? (
            <Badge color="error" variant="dot">
              <EmojiEventsIcon />
            </Badge>
          ) : (
            <EmojiEventsIcon />
          )}
        </Tooltip>
      ),
      route: "",
      children: [
        { title: "Pending to Claim", route: "/my-winnings" },
        { title: "My Wallet", route: "/my-wallet" },
        { title: "History of Winnings", route: "/winning-history" },
      ],
    });
  }
  return NAVS;
};

export default getNAVs;
