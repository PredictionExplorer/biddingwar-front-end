import { Web3Provider } from '@ethersproject/providers'
import { SafeAppConnector } from '@gnosis.pm/safe-apps-web3-react'
import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'

import { INFURA_KEY, SEPOLIA_KEY } from '../config/app'
import {
  ALL_SUPPORTED_CHAIN_IDS,
  DEFAULT_CHAIN_ID,
  SupportedChainId,
} from '../config/chains'
import getLibrary from '../utils/getLibrary'
import { NetworkConnector } from './NetworkConnector'

const NETWORK_URLS: { [key in SupportedChainId]: string } = {
  [SupportedChainId.ARBITRUM_ONE]: `https://arbitrum-mainnet.infura.io/v3/${INFURA_KEY}`,
  [SupportedChainId.ARBITRUM_RINKEBY]: `https://arbitrum-rinkeby.infura.io/v3/${INFURA_KEY}`,
  [SupportedChainId.ARBITRUM_GOERLI]: `https://arbitrum-goerli.infura.io/v3/${INFURA_KEY}`,
  [SupportedChainId.LOCAL_NETWORK]: 'http://170.187.142.12:11845',
  [SupportedChainId.SEPOLIA]: `https://frosty-bold-pallet.arbitrum-sepolia.quiknode.pro/${SEPOLIA_KEY}`,
  [SupportedChainId.ETH_SEPOLIA]: `https://eth-sepolia.g.alchemy.com/v2/demo`,
}

export const network = new NetworkConnector({
  urls: NETWORK_URLS,
  defaultChainId: DEFAULT_CHAIN_ID,
})

let networkLibrary: Web3Provider | undefined
export function getNetworkLibrary(): Web3Provider {
  return (networkLibrary = networkLibrary ?? getLibrary(network.provider))
}

export const injected = new InjectedConnector({
  supportedChainIds: ALL_SUPPORTED_CHAIN_IDS,
})

export const gnosisSafe =
  typeof window !== 'undefined' ? new SafeAppConnector() : null

export const walletconnect = new WalletConnectConnector({
  supportedChainIds: ALL_SUPPORTED_CHAIN_IDS,
  rpc: NETWORK_URLS,
  qrcode: true,
})
