const accountRequest = (ethereum: any) => {
  return ethereum.request({ method: 'eth_requestAccounts' })
}

const switchRequest = (ethereum: any) => {
  return ethereum.request({
    method: 'wallet_switchEthereumChain',
    // params: [{ chainId: '0x66EED' }],
    params: [{ chainId: '0x7A69' }],
  })
}

const addChainRequest = (ethereum: any) => {
  return ethereum.request({
    method: 'wallet_addEthereumChain',
    params: [
      {
        chainId: '0x7A69',
        chainName: 'Localhost 11845',
        rpcUrls: ['http://170.187.142.12:11845'],
        nativeCurrency: {
          name: 'AGOR',
          symbol: 'AGOR',
          decimals: 18,
        },
      },
    ],
  })
  // return ethereum.request({
  //   method: 'wallet_addEthereumChain',
  //   params: [
  //     {
  //       chainId: '0xa4b1',
  //       chainName: 'Arbitrum One',
  //       rpcUrls: ['https://arb1.arbitrum.io/rpc'],
  //       blockExplorerUrls: ['https://arbiscan.io'],
  //       nativeCurrency: {
  //         name: 'AETH',
  //         symbol: 'AETH',
  //         decimals: 18,
  //       },
  //     },
  //   ],
  // })
}

export const switchNetwork = async () => {
  const { ethereum } = window
  if (ethereum) {
    try {
      await accountRequest(ethereum)
      await switchRequest(ethereum)
    } catch (error) {
      if (error.code === 4902) {
        try {
          await addChainRequest(ethereum)
          await switchRequest(ethereum)
        } catch (addError) {
          console.log(addError)
        }
      }
    }
  }
}
