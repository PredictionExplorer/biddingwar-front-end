import type { AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { CacheProvider, EmotionCache } from '@emotion/react'
import { Web3ReactProvider } from '@web3-react/core'

const Web3ProviderNetwork = dynamic(
  () => import('../components/Web3ProviderNetwork'),
  { ssr: false },
)

import Web3ReactManager from '../components/Web3ReactManager'
import Header from '../components/Header'
import Footer from '../components/Footer'

import createEmotionCache from '../cache/createEmotionCache'
import getLibrary from '../utils/getLibrary'
import theme from '../config/styles'

import '../styles/global.css'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import * as ga from '../utils/analytics'
import { ApiDataProvider } from '../contexts/ApiDataContext'
import ApiDataFetcher from '../contexts/ApiDataFetcher'
import { CookiesProvider } from 'react-cookie'
import { StakedTokenProvider } from '../contexts/StakedTokenContext'
import { SystemModeProvider } from '../contexts/SystemModeContext'
import { NotificationProvider } from '../contexts/NotificationContext'

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache
}

function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props
  const router = useRouter()
  useEffect(() => {
    const handleRouteChange = (url) => {
      ga.pageview(url)
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])
  const canonicalUrl = (`https://www.randomwalknft.com` + (router.asPath === "/" ? "": router.asPath)).split("?")[0];

  return (
    <>
      <Head>
        <title>Cosmic Signature</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta name="theme-color" content={theme.palette.primary.main} />
        <meta
          name="google-site-verification"
          content="ZUw5gzqw7CFIEZgCJ2pLy-MhDe7Fdotpc31fS75v3dE"
        />
        <meta
          name="description"
          content="Cosmic Signature is a strategy bidding game."
          key="defaultDescription"
        />
        <meta property="og:image" content="https://cosmic-game2.s3.us-east-2.amazonaws.com/logo.png" />
        <link rel="canonical" href={canonicalUrl} />
      </Head>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Web3ProviderNetwork getLibrary={getLibrary}>
          <CacheProvider value={emotionCache}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <Web3ReactManager>
              <CookiesProvider>
                <StakedTokenProvider>
                  <SystemModeProvider>
                    <ApiDataProvider>
                      <NotificationProvider>
                        <Header />
                        <Component {...pageProps} />
                        <Footer />
                        <ApiDataFetcher interval={30000} />
                      </NotificationProvider>
                    </ApiDataProvider>
                  </SystemModeProvider>
                </StakedTokenProvider>
              </CookiesProvider>
              </Web3ReactManager>
            </ThemeProvider>
          </CacheProvider>
        </Web3ProviderNetwork>
      </Web3ReactProvider>
    </>
  )
}

export default MyApp
