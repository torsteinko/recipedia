import { client } from "@api/apolloClient";
import { AuthProvider } from "@api/authentication";
import { ApolloProvider } from '@apollo/client';
import { EmotionCache } from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { NextPage } from "next";
import { AppProps } from 'next/app';
import Head from 'next/head';
import * as React from 'react';
import ThemeConfig from "src/theme/";
import { SettingsProvider } from "src/theme/settings";
// Import Swiper styles
import 'swiper/css';
import createEmotionCache from '../src/createEmotionCache';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

type NextPageWithLayout = NextPage & {
  getLayout?: (page: React.ReactElement) => React.ReactNode
}

interface MyAppProps extends AppProps {
  Component: NextPageWithLayout;
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  const getLayout = Component.getLayout || ((page) => page)

  return (
    <CacheProvider value={emotionCache}>
      <ApolloProvider client={client}>
        <AuthProvider>
          <SettingsProvider>
            <Head>
              <meta name="viewport" content="initial-scale=1, width=device-width" />
            </Head>
            <ThemeConfig>
              {getLayout(<Component {...pageProps} />)}
            </ThemeConfig>
          </SettingsProvider>
        </AuthProvider>
      </ApolloProvider>
    </CacheProvider>
  );
}