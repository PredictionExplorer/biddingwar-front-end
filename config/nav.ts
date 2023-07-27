type NavItem = {
  title: string;
  route: string;
  children?: Array<NavItem>;
};

const NAVS: NavItem[] = [
  { title: "Gallery", route: "/gallery" },
  { title: "Contracts", route: "/contracts" },
  { title: "Prizes", route: "/prize" },
  { title: "FAQ", route: "/faq" },
];

export default NAVS;
