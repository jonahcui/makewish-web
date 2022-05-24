import '../styles/globals.css'
import type {AppProps} from 'next/app'
import {Provider} from 'react-redux'
import store from "../app/store";
import Head from "../components/layouts/Head";
import dynamic from "next/dynamic";

function MyApp({ Component, pageProps }: AppProps) {

  return<Provider store={store}>
    <div className={"container"} suppressHydrationWarning>
      <Head />
      <Component {...pageProps} />
    </div>
  </Provider>
}

export default MyApp
