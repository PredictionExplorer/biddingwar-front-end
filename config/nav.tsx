import { Badge, Box } from "@mui/material";
import { ReactNode } from "react";
import { NavLink } from "../components/styled";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

type NavItem = {
  title: string | ReactNode;
  route: string;
  children?: Array<NavItem>;
};

const NAVS: NavItem[] = [
  { title: "Gallery", route: "/gallery" },
  { title: "Contracts", route: "/contracts" },
  { title: "Prizes", route: "/prize" },
  { title: "FAQ", route: "/faq" },
  {
    title: (
      <Badge color="error" variant="dot">
        <EmojiEventsIcon />
      </Badge>
    ),
    route: "",
    children: [
      { title: "Pending to Claim", route: "/my-winnings" },
      { title: "My Wallet", route: "/my-wallet" },
      { title: "History of Winnings", route: "/winning-history" },
    ],
  },
];

export default NAVS;
