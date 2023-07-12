type NavItem = {
  title: string;
  route: string;
  children?: Array<NavItem>;
};

const NAVS: NavItem[] = [
  { title: "Home", route: "/" },
  { title: "Gallery", route: "/gallery" },
  { title: "Contracts", route: "/contracts" },
  { title: "Prizes", route: "/prize" },
  { title: "FAQ", route: "/faq" },
  { title: "RWLK Mint", route: "/mint" },
];

export default NAVS;
