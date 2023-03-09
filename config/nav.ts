type NavItem = {
  title: string;
  route: string;
  children?: Array<NavItem>;
};

const NAVS: NavItem[] = [
  { title: "Home", route: "/" },
  { title: "Gallery", route: "/gallery" },
  { title: "My NFTs", route: "/my-nfts" },
  { title: "FAQ", route: "/faq" },
  // { title: "Marketplace", route: "/marketplace" },
  // { title: "DAO", route: "/dao" },
];

export default NAVS;
