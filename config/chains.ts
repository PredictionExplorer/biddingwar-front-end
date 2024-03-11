export enum SupportedChainId {
  ARBITRUM_ONE = 42161,
  ARBITRUM_RINKEBY = 421611,
  ARBITRUM_GOERLI = 421613,
  LOCAL_NETWORK = 31337,
  SEPOLIA = 421614,
  ETH_SEPOLIA = 11155111
}

export const DEFAULT_CHAIN_ID = SupportedChainId.ETH_SEPOLIA;

export const ALL_SUPPORTED_CHAIN_IDS: SupportedChainId[] = [
  SupportedChainId.ARBITRUM_ONE,
  SupportedChainId.ARBITRUM_RINKEBY,
  SupportedChainId.ARBITRUM_GOERLI,
  SupportedChainId.LOCAL_NETWORK,
  SupportedChainId.SEPOLIA,
  SupportedChainId.ETH_SEPOLIA,
];

export const L2_CHAIN_IDS = [
  SupportedChainId.ARBITRUM_ONE,
  SupportedChainId.ARBITRUM_RINKEBY,
  SupportedChainId.ARBITRUM_GOERLI,
  SupportedChainId.LOCAL_NETWORK,
  SupportedChainId.SEPOLIA,
  SupportedChainId.ETH_SEPOLIA,
] as const;

export type SupportedL2ChainId = typeof L2_CHAIN_IDS[number];

interface L1ChainInfo {
  readonly docs: string;
  readonly explorer: string;
  readonly infoLink: string;
  readonly label: string;
}
export interface L2ChainInfo extends L1ChainInfo {
  readonly bridge: string;
}

type ChainInfo = { readonly [chainId: number]: L1ChainInfo | L2ChainInfo } & {
  readonly [chainId in SupportedL2ChainId]: L2ChainInfo;
};

export const CHAIN_INFO: ChainInfo = {
  [SupportedChainId.ARBITRUM_ONE]: {
    bridge: "https://bridge.arbitrum.io/",
    docs: "https://offchainlabs.com/",
    explorer: "https://arbiscan.io/",
    infoLink: "https://info.uniswap.org/#/arbitrum",
    label: "Arbitrum",
  },
  [SupportedChainId.ARBITRUM_RINKEBY]: {
    bridge: "https://bridge.arbitrum.io/",
    docs: "https://offchainlabs.com/",
    explorer: "https://rinkeby-explorer.arbitrum.io/",
    infoLink: "https://info.uniswap.org/#/arbitrum/",
    label: "Arbitrum Rinkeby",
  },
  [SupportedChainId.ARBITRUM_GOERLI]: {
    bridge: "https://bridge.arbitrum.io/",
    docs: "https://offchainlabs.com/",
    explorer: "https://goerli.arbiscan.io/",
    infoLink: "https://info.uniswap.org/#/arbitrum/",
    label: "Arbitrum Goerli",
  },
  [SupportedChainId.LOCAL_NETWORK]: {
    bridge: "https://bridge.arbitrum.io/",
    docs: "https://offchainlabs.com/",
    explorer: "https://goerli.arbiscan.io/",
    infoLink: "https://info.uniswap.org/#/arbitrum/",
    label: "Local Network",
  },
  [SupportedChainId.SEPOLIA]: {
    bridge: "https://bridge.arbitrum.io/",
    docs: "https://offchainlabs.com/",
    explorer: "https://sepolia-explorer.arbitrum.io/",
    infoLink: "https://info.uniswap.org/#/arbitrum/",
    label: "Arbitrum Sepolia",
  },
  [SupportedChainId.ETH_SEPOLIA]: {
    bridge: "https://bridge.arbitrum.io/",
    docs: "https://offchainlabs.com/",
    explorer: "https://sepolia.etherscan.io/",
    infoLink: "https://info.uniswap.org/#/arbitrum/",
    label: "Sepolia",
  },
};
