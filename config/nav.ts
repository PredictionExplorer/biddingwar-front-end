type NavItem = {
  title: string;
  route: string;
  children?: Array<NavItem>;
};

const NAVS: NavItem[] = [
  { title: "Home", route: "/" },
  { title: "Gallery", route: "/gallery" },
  { title: "Marketplace", route: "/marketplace" },
  { title: "Giveaway", route: "/giveaway" },
  { title: "Withdraw", route: "/withdraw" },
  { title: "FAQ", route: "/faq" },
  { title: "RWLK Mint", route: "/mint" },
];

export default NAVS;
